/*
  proposal-sign

  Receives a signed proposal from /proposal/:slug on jojishiotsuki.com, validates it hard,
  stores it in KV, and (optionally) emails Joji that it happened.

  Two things this worker is deliberately paranoid about:

  1. It is a public URL that accepts an image. Without an allow list of slugs, anyone who
     found the endpoint could use it as free object storage. Every field is bounded, the
     drawing must decode to a real PNG, and unknown slugs are rejected before anything is
     written.
  2. Signing must never fail for a reason the signer cannot fix. Notification is best
     effort: if Resend is not configured, or Resend is down, the signature is still stored
     and the client still gets its reference.
*/

interface Env {
  /** Set in wrangler.toml [vars]. The one production origin allowed to call this. */
  ALLOWED_ORIGIN: string;
  /**
   * Var. Set to the string "false" in wrangler.toml to stop the deployed worker accepting
   * http://localhost and http://127.0.0.1 origins. It is left on by default because the
   * dev page at localhost:5199 posts to this same deployed worker (SIGN_ENDPOINT in
   * lib/proposals/sign.ts is absolute), so closing it by default would silently break the
   * only way Joji can test signing. Turn it off once the proposal has been signed.
   */
  ALLOW_LOCAL_ORIGINS?: string;
  /** Created with `wrangler kv namespace create SIGNATURES`. Holds records and rate counters. */
  SIGNATURES: KVNamespace;
  /* Everything below is optional at runtime. The worker degrades instead of breaking. */
  /** Secret. Required for GET /signatures. If unset, that route refuses rather than running open. */
  ADMIN_TOKEN?: string;
  /** Secret. If set with NOTIFY_EMAIL, a notification is sent through Resend. */
  RESEND_API_KEY?: string;
  /** Var. Where notifications go. */
  NOTIFY_EMAIL?: string;
  /** Var. The from address, which must sit on a domain verified inside Resend. */
  NOTIFY_FROM?: string;
}

/*
  This is a copy of SignaturePayload in lib/proposals/types.ts, plus the optional
  proposalHash the page may send. It is copied rather than imported because the site and
  the worker are separate TypeScript projects with separate tsconfigs and separate builds.
  THE TWO MUST BE KEPT IN STEP BY HAND. If you add a field there, add it here, and vice
  versa, or the field will be silently dropped on the way in.
*/
interface SignaturePayload {
  slug: string;
  /**
   * Data URL of the signature image, PNG. The page sends one either way: when the signer
   * uses the typed fallback it renders their name to the canvas and captions it, so the
   * record always has something to look at. An empty string is accepted too.
   */
  drawing: string;
  typedName: string;
  typedTitle: string;
  email: string;
  optionId: string;
  /** The client's own clock. Display only. The server stamps its own authoritative time. */
  clientTime: string;
  /**
   * True when the image is a rendering of the typed name rather than a drawn stroke. The
   * image cannot be told apart from a drawn one by looking at its bytes, so the page has
   * to say which it was and this is the only place the answer comes from.
   */
  typedSignature: boolean;
  /** Optional hash of the proposal text as rendered, so we can prove what was agreed to. */
  proposalHash?: string;
  /**
   * One id per press of Sign, reused by that press's retry. It is what lets a retry be
   * safe: the same id returns the reference already stored rather than writing a second
   * record. Optional, so a page cached before this existed still signs.
   */
  requestId?: string;
}

/** What actually goes into KV. Never returned to the caller. */
interface StoredSignature extends SignaturePayload {
  reference: string;
  /** Server clock, ISO. This is the authoritative one. */
  serverTime: string;
  /** True when the signer drew on the canvas, false when they used the typed fallback. */
  drawn: boolean;
  ip: string;
  userAgent: string;
}

/** The small summary kept as KV key metadata so listing does not have to read every drawing. */
interface SignatureSummary {
  reference: string;
  slug: string;
  optionId: string;
  typedName: string;
  email: string;
  serverTime: string;
  drawn: boolean;
}

// --- Rate limit config ---
const MAX_PER_IP_PER_HOUR = 5;      // Signatures accepted from one IP per hour
const MAX_GLOBAL_PER_DAY = 40;      // Signatures accepted across all clients per day

// --- Size and shape caps ---
const MAX_BODY_BYTES = 1_200_000;   // Whole request body. A PNG data URL is the bulk of it.
const MAX_DRAWING_BYTES = 400_000;  // Decoded PNG size. A pen stroke on a small canvas is far under this.
const MAX_NAME = 120;
const MAX_TITLE = 120;
const MAX_EMAIL = 254;              // The practical maximum length of an email address
const MAX_OPTION_ID = 64;
const MAX_CLIENT_TIME = 64;
const MAX_HASH = 128;
const MAX_UA = 300;
const MAX_LIST = 100;               // Records returned by one GET /signatures call

const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/*
  Known proposal slugs. This is the allow list that stops the endpoint being used as a
  dumping ground by anyone who finds the URL. Adding a proposal to lib/proposals/index.ts
  means adding its slug here and redeploying the worker, otherwise signing that proposal
  returns 400.
*/
const KNOWN_SLUGS: readonly string[] = [
  'inner-wealth-u3_c-eCtTSpj',
  /* A rehearsal copy of the same proposal, so signing can be tested without writing to the
     real client's record. Its records carry this slug, and so does the alert email, which
     is what makes a test signature tellable from Tony's at a glance. */
  'sandbox-rehearsal-Ua4p9EqERZt',
];

/*
  Reference alphabet: Crockford base32 with I, L, O and U removed. No ambiguous characters,
  so a reference can be read down a phone line without spelling it out.
*/
const REF_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const REF_LENGTH = 10;

// --- Origins ---

/** The only hosts a development origin is ever allowed to be. Exact matches, never prefixes. */
const LOCAL_HOSTNAMES: readonly string[] = ['localhost', '127.0.0.1', '[::1]'];

/*
  This used to be `origin.startsWith('http://localhost')`, which is a prefix match on the
  whole origin string rather than on the host, so http://localhost.evil.com and
  http://127.0.0.1.evil.com both passed. Both are ordinary registrable domains an attacker
  can own and serve a page from, which turned the one check whose entire job is to keep
  writes coming from the real site into no check at all.

  Parsing and comparing the hostname exactly fixes that. Comparing url.origin back to the
  input as well rejects anything carrying a path, credentials or a trailing slash, so only
  a genuine Origin header value gets through, with any port.
*/
function isLocalOrigin(origin: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }

  if (parsed.origin !== origin || parsed.protocol !== 'http:') {
    return false;
  }

  return LOCAL_HOSTNAMES.includes(parsed.hostname);
}

function isAllowedOrigin(origin: string, env: Env): boolean {
  if (origin === env.ALLOWED_ORIGIN) {
    return true;
  }

  // Absent means on, so a missing var cannot lock Joji out of his own dev page. Only the
  // explicit string "false" closes it, which is the one line to add before this is handed on.
  if (env.ALLOW_LOCAL_ORIGINS === 'false') {
    return false;
  }

  return isLocalOrigin(origin);
}

function corsHeaders(origin: string, env: Env): Record<string, string> {
  const allowed = isAllowedOrigin(origin, env);

  return {
    'Access-Control-Allow-Origin': allowed ? origin : env.ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    // Authorization is here for GET /signatures, which is bearer protected.
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

// --- Rate limiting ---

/*
  Same shape as the chat worker: a get, a compare, a put. KV is eventually consistent so
  concurrent requests can undercount and let a couple extra through. That is an accepted
  tradeoff at this volume. Getting it exactly right needs Durable Objects, which is a lot
  of machinery for a handful of signatures a month.

  Counter keys are prefixed rl: so they never collide with the sig: records, which matters
  because GET /signatures lists by prefix.
*/
function ipKey(ip: string): string {
  const hour = Math.floor(Date.now() / 3600000);
  return `rl:ip:${ip}:${hour}`;
}

function dailyKey(): string {
  const day = new Date().toISOString().slice(0, 10);
  return `rl:day:${day}`;
}

/** A counter that has expired, was never set, or holds junk reads as zero rather than NaN. */
async function readCounter(env: Env, key: string): Promise<number> {
  const parsed = parseInt((await env.SIGNATURES.get(key)) || '0', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/*
  How long the IP lockout actually lasts. The key carries the wall clock hour, so the
  allowance is restored when that hour rolls over, not a fixed interval after the last
  attempt. The old copy said "a few minutes" for a wait that can be a full hour, which is
  the kind of promise that turns a signer into an email.
*/
function minutesUntilHourRollover(): number {
  const msRemaining = 3600000 - (Date.now() % 3600000);
  return Math.max(1, Math.ceil(msRemaining / 60000));
}

/*
  Reads the counters. Writes nothing.

  This used to increment on the way past, before the payload had been validated, so every
  rejected attempt spent one of the five. A signer who mistyped their email five times was
  then locked out of the only action on the page for up to an hour, while being told to
  press Sign again. The counters are named "signatures accepted", so they now count exactly
  that: recordAcceptedSignature below is called after a record has been stored, and nowhere
  else. A malformed body costs the sender nothing here because it is already cheap to
  refuse, bounded by MAX_BODY_BYTES before the JSON is even read.
*/
async function checkRateLimit(env: Env, ip: string): Promise<{ allowed: boolean; reason?: string }> {
  const ipCount = await readCounter(env, ipKey(ip));
  if (ipCount >= MAX_PER_IP_PER_HOUR) {
    const wait = minutesUntilHourRollover();
    return {
      allowed: false,
      reason: `Too many signatures from this connection. Please try again in about ${wait} minute${wait === 1 ? '' : 's'}, or email jojishiotsuki0@gmail.com and it will be recorded by hand.`,
    };
  }

  const globalCount = await readCounter(env, dailyKey());
  if (globalCount >= MAX_GLOBAL_PER_DAY) {
    return { allowed: false, reason: 'Signing is temporarily unavailable. Please email jojishiotsuki0@gmail.com and it will be sorted straight away.' };
  }

  return { allowed: true };
}

/**
 * Counts one stored signature against both buckets. Called only after the KV write has
 * succeeded, so the limit can never be spent by a request that produced no record.
 */
async function recordAcceptedSignature(env: Env, ip: string): Promise<void> {
  const ipk = ipKey(ip);
  const dk = dailyKey();
  const [ipCount, globalCount] = await Promise.all([readCounter(env, ipk), readCounter(env, dk)]);

  await Promise.all([
    env.SIGNATURES.put(ipk, String(ipCount + 1), { expirationTtl: 3600 }),
    env.SIGNATURES.put(dk, String(globalCount + 1), { expirationTtl: 86400 }),
  ]);
}

// --- Narrowing untrusted input ---

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Reads a string field off an unknown object. Returns an empty string for anything else. */
function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === 'string' ? value : '';
}

/*
  Deliberately loose. A stricter pattern rejects addresses that are legal and in use, and a
  wrong rejection here costs a signature. This catches typos and junk, which is the job:
  exactly one @, at least one dot after it, and no empty label anywhere, so ordinary slips
  like tony@innerwealth..au and tony@.com.au are refused.

  THIS PATTERN IS THE SOURCE OF TRUTH AND IS THE STRICTER OF THE TWO. EMAIL_SHAPE in
  components/proposal/SignatureBlock.tsx must be kept identical to it, the same way
  SignaturePayload above is kept in step by hand. The client's copy is what disables the
  Sign button, so if the client is the looser of the two, the signer is rejected here,
  after they have already drawn their signature and pressed the only button on the page.
  If this ever has to change, loosen the client first and this second.
*/
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;
const OPTION_ID_RE = /^[a-z0-9][a-z0-9_-]*$/i;
const HASH_RE = /^[A-Za-z0-9_-]+$/;

/* A UUID's alphabet and nothing else, with a hard length bound. This string is concatenated
   into a KV key, so it is checked rather than trusted: no slashes, no prefix characters, no
   way to write outside the req: namespace or to collide with a sig: record. */
const REQUEST_ID_RE = /^[A-Za-z0-9-]{8,64}$/;

/**
 * Confirms the drawing is genuinely a PNG data URL of a sane size, not an arbitrary blob
 * wearing a PNG label. Checks the prefix, the base64 alphabet, the decoded size, and then
 * the eight magic bytes every PNG file starts with.
 */
function validateDrawing(drawing: string): string | null {
  if (!drawing.startsWith(PNG_DATA_URL_PREFIX)) {
    return 'Signature image must be a PNG data URL.';
  }

  const b64 = drawing.slice(PNG_DATA_URL_PREFIX.length);
  if (b64.length === 0) {
    return 'Signature image is empty.';
  }
  if (b64.length % 4 !== 0 || !BASE64_RE.test(b64)) {
    return 'Signature image is not valid base64.';
  }

  // Four base64 characters carry three bytes, minus one byte per padding character.
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  const bytes = (b64.length / 4) * 3 - padding;
  if (bytes > MAX_DRAWING_BYTES) {
    return 'Signature image is too large.';
  }
  if (bytes < PNG_MAGIC.length) {
    return 'Signature image is too small to be a PNG.';
  }

  // Twelve base64 characters decode to nine bytes, one more than the PNG signature needs.
  try {
    const head = atob(b64.slice(0, 12));
    for (let i = 0; i < PNG_MAGIC.length; i++) {
      if (head.charCodeAt(i) !== PNG_MAGIC[i]) {
        return 'Signature image is not a PNG.';
      }
    }
  } catch {
    return 'Signature image could not be read.';
  }

  return null;
}

/**
 * Turns an unknown request body into a payload we are willing to store, or an error string
 * that is safe to show a signer. Every field is checked, nothing is trusted, and nothing is
 * coerced quietly: a wrong type becomes an empty string and then fails its own check.
 */
function validatePayload(raw: unknown): { payload: SignaturePayload } | { error: string } {
  if (!isRecord(raw)) {
    return { error: 'Malformed request.' };
  }

  const slug = readString(raw, 'slug');
  if (!KNOWN_SLUGS.includes(slug)) {
    // Same message whether the slug is missing, malformed or simply unknown. There is no
    // reason to help someone probe for which proposals exist.
    return { error: 'This proposal link is not valid.' };
  }

  const typedName = readString(raw, 'typedName').trim();
  if (typedName.length === 0) {
    return { error: 'Please type your full name.' };
  }
  if (typedName.length > MAX_NAME) {
    return { error: 'That name is too long.' };
  }

  const typedTitle = readString(raw, 'typedTitle').trim();
  if (typedTitle.length > MAX_TITLE) {
    return { error: 'That job title is too long.' };
  }

  const email = readString(raw, 'email').trim();
  if (email.length === 0) {
    return { error: 'Please add an email address.' };
  }
  if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return { error: 'That email address does not look right.' };
  }

  const optionId = readString(raw, 'optionId').trim();
  if (optionId.length === 0 || optionId.length > MAX_OPTION_ID || !OPTION_ID_RE.test(optionId)) {
    return { error: 'Please choose an option before signing.' };
  }

  /*
    An empty drawing is legitimate: the typed name is the accessible fallback for anyone who
    cannot draw with a mouse or a trackpad. A non-empty drawing has to survive the full PNG
    check. Either way the typed name above is required, so a record is never nameless.
  */
  const drawing = readString(raw, 'drawing');
  if (drawing.length > 0) {
    const drawingError = validateDrawing(drawing);
    if (drawingError) {
      return { error: drawingError };
    }
  }

  /*
    Anything that is not the literal boolean true is read as a drawn signature. That is the
    safe way round: a missing or junk flag understates the claim rather than marking a real
    drawn signature as typed.
  */
  const typedSignature = raw.typedSignature === true;

  const clientTime = readString(raw, 'clientTime').slice(0, MAX_CLIENT_TIME);

  const proposalHashRaw = readString(raw, 'proposalHash').trim();
  if (proposalHashRaw.length > MAX_HASH || (proposalHashRaw.length > 0 && !HASH_RE.test(proposalHashRaw))) {
    return { error: 'Malformed request.' };
  }

  /* Validated to a strict shape rather than trusted, because it becomes a KV key. Anything
     that is not a plain id is dropped rather than rejected: a bad id should cost the retry
     protection, not the signature. */
  const requestIdRaw = readString(raw, 'requestId').trim();
  const requestId = REQUEST_ID_RE.test(requestIdRaw) ? requestIdRaw : '';

  const payload: SignaturePayload = {
    slug,
    drawing,
    typedName,
    typedTitle,
    email,
    optionId,
    clientTime,
    typedSignature,
    ...(proposalHashRaw.length > 0 ? { proposalHash: proposalHashRaw } : {}),
    ...(requestId.length > 0 ? { requestId } : {}),
  };

  return { payload };
}

// --- References and keys ---

/**
 * A short receipt id. Random, not sequential, so one reference tells you nothing about how
 * many proposals have been signed or which one yours was.
 */
function makeReference(): string {
  const bytes = new Uint8Array(REF_LENGTH);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < REF_LENGTH; i++) {
    out += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return out;
}

/*
  ISO timestamps sort the same way lexicographically as they do chronologically, so a
  prefix list of sig: comes back oldest first with no sorting on our side. The reference is
  appended so two signatures in the same millisecond cannot overwrite each other.
*/
function recordKey(serverTime: string, reference: string): string {
  return `sig:${serverTime}:${reference}`;
}

/* Its own prefix, so idempotency keys are never listed as signatures and never collide
   with the rl: counters. The id is already validated to a safe shape before it gets here. */
function requestKey(requestId: string): string {
  return `req:${requestId}`;
}

/*
  The one-signature-per-proposal lock.

  Its own prefix again, for the same reason: `sig:` is what a listing walks, so this must
  not sit in that space. The slug is safe as a key because nothing reaches here that is not
  already in KNOWN_SLUGS.
*/
function slugLockKey(slug: string): string {
  return `signed:${slug}`;
}

/** What the lock holds. Enough for a second attempt to be told the truth about the first. */
interface SlugLock {
  reference: string;
  optionId: string;
  serverTime: string;
}

/*
  Rehearsal slugs forget they were signed, after five minutes.

  The lock has to apply to the rehearsal copy or the rehearsal stops being a rehearsal: a
  test that skips the branch it is meant to test proves nothing about the real page. But a
  permanent lock would make the rehearsal single-use, and a test rig you can only fire once
  is a test rig nobody runs. A TTL gives both: the same code path, the same lock, the same
  reply, and the slug is signable again shortly afterwards.

  Five minutes is longer than any single test and shorter than the gap between them.
*/
const REHEARSAL_SLUGS: readonly string[] = ['sandbox-rehearsal-Ua4p9EqERZt'];
const REHEARSAL_LOCK_TTL = 300;

// --- Notification ---

type NotifyStatus = 'sent' | 'skipped' | 'failed';

/**
 * Best effort notification through Resend's HTTP API. Returns a status rather than
 * throwing, because a signature that is already stored must not be reported as a failure
 * just because an email did not go out.
 */
async function notify(env: Env, record: StoredSignature): Promise<NotifyStatus> {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) {
    return 'skipped';
  }

  const from = env.NOTIFY_FROM || 'proposals@jojishiotsuki.com';
  const lines = [
    `Proposal: ${record.slug}`,
    `Option accepted: ${record.optionId}`,
    `Name: ${record.typedName}`,
    `Title: ${record.typedTitle || '(not given)'}`,
    `Email: ${record.email}`,
    `Signed by: ${record.drawn ? 'drawing' : 'typed name'}`,
    `Server time: ${record.serverTime}`,
    `Their clock: ${record.clientTime || '(not sent)'}`,
    `Reference: ${record.reference}`,
  ];

  // A hung request must not hold the signer on a spinner, so the call gets five seconds.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: [env.NOTIFY_EMAIL],
        reply_to: record.email,
        subject: `Proposal signed: ${record.typedName} (${record.slug})`,
        text: lines.join('\n'),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // Status only. The body can echo request details and the header carried the key.
      console.error('Resend notification failed with status', response.status);
      return 'failed';
    }

    return 'sent';
  } catch (err) {
    console.error('Resend notification error:', err instanceof Error ? err.message : 'unknown');
    return 'failed';
  } finally {
    clearTimeout(timer);
  }
}

// --- Admin auth ---

/**
 * Compares two strings without leaking where they differ. Length is compared first, which
 * does leak the token length, and that is fine: the length of a random token is not the
 * secret, the token is.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// --- Routes ---

async function handleSign(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  const rateCheck = await checkRateLimit(env, ip);
  if (!rateCheck.allowed) {
    return json({ ok: false, error: rateCheck.reason }, 429, headers);
  }

  // Reject an oversized body before reading it, so a large upload cannot be used to burn CPU.
  const declaredLength = parseInt(request.headers.get('Content-Length') || '0', 10);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'That signature is too large to send.' }, 413, headers);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'Malformed request.' }, 400, headers);
  }

  const checked = validatePayload(raw);
  if ('error' in checked) {
    return json({ ok: false, error: checked.error }, 400, headers);
  }

  const payload = checked.payload;

  /*
    Has this exact attempt already been recorded?

    This exists because of a real incident on 15 August, not a hypothetical. A signature was
    written here, the reply never reached the browser, and the client correctly concluded
    that it had no answer and told the person nothing had been recorded. It had. The page and
    the store disagreed, which is the one outcome this whole endpoint is built to prevent.

    The client's retry made it worse rather than better: retrying was justified with "nothing
    reached the worker, so posting again is safe", and that reasoning is wrong. A failed
    fetch means no ANSWER came back. It says nothing about whether the request arrived, and
    an answer can be lost after the write.

    So the client now sends a requestId, generated once per press and reused by its retry.
    The first attempt to arrive writes the record and stores requestId -> reference. Any
    later attempt carrying the same id gets that same reference back instead of a second
    record. A lost reply therefore turns into a correct success on the retry, and pressing
    Sign twice for one signature cannot produce two acceptances.

    A missing id keeps the old behaviour rather than failing, so an older page still signs.
  */
  if (payload.requestId) {
    let seen: string | null = null;
    try {
      seen = await env.SIGNATURES.get(requestKey(payload.requestId));
    } catch (err) {
      // A lookup failure must not block a signature. Worst case is the old behaviour.
      console.error('Idempotency lookup failed:', err instanceof Error ? err.message : 'unknown');
    }
    if (seen) {
      return json({ ok: true, reference: seen, notified: 'duplicate' }, 200, headers);
    }
  }

  /*
    Has this PROPOSAL already been signed by anybody?

    Checked second, and that order is the whole of it. The requestId check above answers
    "is this the same press of the button", and a genuine retry must still succeed. This
    one answers "is this a second acceptance of the same document", which must not.

    The gap it closes: the page's own "already signed" state lived only in React memory, so
    a refresh gave back a blank form with the options live again. Signing twice was two
    presses away, and the second could name a DIFFERENT option. Two stored acceptances of
    one document, disagreeing about the price, with the client holding a PDF of whichever
    they printed. There is no honest way to resolve that afterwards, so it must not be
    reachable.

    A second attempt is answered with the FIRST record's reference, option and time, and
    nothing is written. It is deliberately not an error: the person did sign, their
    signature is held, and telling them it failed would be the lie this endpoint exists to
    prevent. The client renders the recorded option rather than the one on screen, so the
    page cannot claim an acceptance the store does not hold.

    A lookup failure falls through to signing, exactly like the idempotency lookup above.
    Of the two ways to be wrong, a duplicate record is recoverable by hand and a client who
    cannot sign at all is not.
  */
  let existingLock: SlugLock | null = null;
  try {
    const raw = await env.SIGNATURES.get(slugLockKey(payload.slug));
    if (raw) existingLock = JSON.parse(raw) as SlugLock;
  } catch (err) {
    console.error('Slug lock lookup failed:', err instanceof Error ? err.message : 'unknown');
  }
  if (existingLock && existingLock.reference) {
    return json(
      {
        ok: true,
        reference: existingLock.reference,
        alreadySigned: true,
        recordedOptionId: existingLock.optionId,
        recordedAt: existingLock.serverTime,
        notified: 'already-signed',
      },
      200,
      headers,
    );
  }

  const serverTime = new Date().toISOString();
  const reference = makeReference();

  const record: StoredSignature = {
    ...payload,
    reference,
    serverTime,
    /* Drawn means a real stroke. The page sends an image for a typed name too, so the
       presence of an image is not the question: the typedSignature flag is. */
    drawn: payload.drawing.length > 0 && !payload.typedSignature,
    ip,
    userAgent: (request.headers.get('User-Agent') || '').slice(0, MAX_UA),
  };

  const summary: SignatureSummary = {
    reference,
    slug: record.slug,
    optionId: record.optionId,
    typedName: record.typedName,
    email: record.email,
    serverTime,
    drawn: record.drawn,
  };

  try {
    // The drawing makes the record large, so the summary rides along as key metadata and
    // listing never has to read a single image.
    await env.SIGNATURES.put(recordKey(serverTime, reference), JSON.stringify(record), {
      metadata: summary,
    });
  } catch (err) {
    console.error('Signature store failed:', err instanceof Error ? err.message : 'unknown');
    return json({ ok: false, error: 'The signature could not be saved. Please try again, or email jojishiotsuki0@gmail.com.' }, 500, headers);
  }

  /*
    Only now, once the record is safely stored. Written second on purpose: if this write
    fails the signature still exists and a retry simply makes a second record, which is the
    old behaviour and recoverable. Written FIRST, a failure here would leave an id claiming a
    reference that was never stored, and the retry would be told everything was fine while
    nothing had been saved. Of the two ways to be wrong, only one loses a signature.

    A day is long enough: this exists to cover a retry seconds later and a person pressing
    the button again after being told it failed, not to deduplicate across sessions.
  */
  if (payload.requestId) {
    try {
      await env.SIGNATURES.put(requestKey(payload.requestId), reference, { expirationTtl: 86400 });
    } catch (err) {
      console.error('Idempotency write failed:', err instanceof Error ? err.message : 'unknown');
    }
  }

  /*
    The lock, written after the record for the same reason the idempotency key is: a lock
    that exists without its record would refuse the next attempt while pointing at a
    reference nobody stored, which locks the client out of signing at all. Written second,
    a failure here only leaves the old behaviour, and the old behaviour is what this whole
    block is an improvement on rather than a dependency of.

    No TTL for a real proposal: a signed document stays signed. Rehearsal slugs get one so
    the test rig survives its own test.
  */
  const lock: SlugLock = { reference, optionId: record.optionId, serverTime };
  try {
    await env.SIGNATURES.put(
      slugLockKey(payload.slug),
      JSON.stringify(lock),
      REHEARSAL_SLUGS.includes(payload.slug) ? { expirationTtl: REHEARSAL_LOCK_TTL } : {},
    );
  } catch (err) {
    console.error('Slug lock write failed:', err instanceof Error ? err.message : 'unknown');
  }

  /*
    Stored is the point of no return. Whatever happens from here, the answer to the signer
    is success, so the counter write is wrapped: a rate limit that fails to increment is a
    smaller problem than a stored signature reported as an error.
  */
  try {
    await recordAcceptedSignature(env, ip);
  } catch (err) {
    console.error('Rate counter update failed:', err instanceof Error ? err.message : 'unknown');
  }

  const notified = await notify(env, record);

  return json({ ok: true, reference, notified }, 200, headers);
}

async function handleList(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  /*
    If the secret was never set, this route refuses. It does not fall back to open, and it
    does not fall back to a default token, because both of those publish every client's
    pricing and contact details to anyone who guesses the path.
  */
  if (!env.ADMIN_TOKEN) {
    return json({ ok: false, error: 'Not configured.' }, 503, headers);
  }

  const auth = request.headers.get('Authorization') || '';
  const presented = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!presented || !safeEqual(presented, env.ADMIN_TOKEN)) {
    return json({ ok: false, error: 'Unauthorized.' }, 401, headers);
  }

  const url = new URL(request.url);

  // ?reference=XXXX returns one full record, drawing included. The list never carries images.
  const wanted = (url.searchParams.get('reference') || '').trim().toUpperCase();
  if (wanted) {
    const found = await env.SIGNATURES.list<SignatureSummary>({ prefix: 'sig:', limit: 1000 });
    const hit = found.keys.find(k => k.metadata?.reference === wanted);
    if (!hit) {
      return json({ ok: false, error: 'Not found.' }, 404, headers);
    }
    const value = await env.SIGNATURES.get(hit.name);
    if (!value) {
      return json({ ok: false, error: 'Not found.' }, 404, headers);
    }
    return new Response(value, { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  const requested = parseInt(url.searchParams.get('limit') || '', 10);
  const limit = Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_LIST) : MAX_LIST;

  const listed = await env.SIGNATURES.list<SignatureSummary>({ prefix: 'sig:', limit });
  // KV lists ascending and the keys start with an ISO timestamp, so reversing the page puts
  // the newest signature at the top, which is the one Joji actually wants to see.
  const records = listed.keys
    .map(k => k.metadata)
    .filter((m): m is SignatureSummary => Boolean(m))
    .reverse();

  return json({ ok: true, count: records.length, records }, 200, headers);
}

/*
  Has this proposal been signed? Asked by the page as it loads.

  It exists because the lock alone was not enough. Stopping a second record being written
  fixed what the store holds, and did nothing for what the client SEES: a refresh still
  gave back a blank form with the pad empty, so a person who had just signed was looking at
  a page that behaved as though they had not. The signature was safe and the page said
  nothing, which is the same disagreement between page and store that this endpoint exists
  to prevent, just pointing the other way.

  Deliberately thin. It answers whether, which option, when and the reference, and nothing
  else. Name and email are in the record and stay there: this route is reachable by anyone
  holding the link, and while such a person could learn the same by attempting to sign,
  that is a reason to keep the answer small rather than an excuse to widen it.

  Unknown slugs get `signed: false` rather than an error, so it cannot be used to find out
  which proposals exist.
*/
async function handleStatus(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  const slug = (url.searchParams.get('slug') || '').trim();

  if (!KNOWN_SLUGS.includes(slug)) {
    return json({ ok: true, signed: false }, 200, headers);
  }

  let lock: SlugLock | null = null;
  try {
    const raw = await env.SIGNATURES.get(slugLockKey(slug));
    if (raw) lock = JSON.parse(raw) as SlugLock;
  } catch (err) {
    /*
      A lookup failure answers "not signed", which makes the page show its normal signing
      form. That is the safe direction: the worst case is the behaviour we had before this
      route existed, and a second attempt is still refused by the lock at signing time. The
      opposite default would show a receipt on a guess, or block signing outright.
    */
    console.error('Status lookup failed:', err instanceof Error ? err.message : 'unknown');
  }

  if (!lock || !lock.reference) {
    return json({ ok: true, signed: false }, 200, headers);
  }

  return json(
    { ok: true, signed: true, reference: lock.reference, optionId: lock.optionId, serverTime: lock.serverTime },
    200,
    headers,
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    try {
      if (url.pathname === '/sign') {
        if (request.method !== 'POST') {
          return json({ ok: false, error: 'Method not allowed.' }, 405, headers);
        }
        /*
          The browser sends an Origin on cross origin POSTs, so this holds for the real
          signing path. It is a first gate, not the only one: the slug allow list and the
          field validation stand behind it for anything that arrives without a browser.
        */
        if (!isAllowedOrigin(origin, env)) {
          return json({ ok: false, error: 'Forbidden.' }, 403, headers);
        }
        return await handleSign(request, env, headers);
      }

      /*
        No origin gate, unlike /sign. It is reached through api/sign.php on the site, and a
        server to server call carries no Origin of its own; sign.php states one for the POST
        because the worker demands it there, and adding a second place that has to remember
        to do that is a way to break the page's load. The route is safe to leave open
        because it writes nothing, reveals nothing personal, and answers identically for an
        unknown slug and an unsigned one.
      */
      if (url.pathname === '/status') {
        if (request.method !== 'GET') {
          return json({ ok: false, error: 'Method not allowed.' }, 405, headers);
        }
        return await handleStatus(request, env, headers);
      }

      if (url.pathname === '/signatures') {
        if (request.method !== 'GET') {
          return json({ ok: false, error: 'Method not allowed.' }, 405, headers);
        }
        // No origin check here on purpose: Joji reads this with curl or Invoke-RestMethod,
        // which send no Origin. The bearer token is what protects it.
        return await handleList(request, env, headers);
      }

      return json({ ok: false, error: 'Not found.' }, 404, headers);
    } catch (err) {
      console.error('Worker error:', err instanceof Error ? err.message : 'unknown');
      return json({ ok: false, error: 'Internal error.' }, 500, headers);
    }
  },
};
