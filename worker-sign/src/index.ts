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
];

/*
  Reference alphabet: Crockford base32 with I, L, O and U removed. No ambiguous characters,
  so a reference can be read down a phone line without spelling it out.
*/
const REF_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const REF_LENGTH = 10;

// --- Origins ---

function isLocalOrigin(origin: string): boolean {
  return origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
}

function isAllowedOrigin(origin: string, allowedOrigin: string): boolean {
  return origin === allowedOrigin || isLocalOrigin(origin);
}

function corsHeaders(origin: string, allowedOrigin: string): Record<string, string> {
  const allowed = isAllowedOrigin(origin, allowedOrigin);

  return {
    'Access-Control-Allow-Origin': allowed ? origin : allowedOrigin,
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

async function checkRateLimit(env: Env, ip: string): Promise<{ allowed: boolean; reason?: string }> {
  const ipk = ipKey(ip);
  const ipCount = parseInt((await env.SIGNATURES.get(ipk)) || '0', 10);
  if (ipCount >= MAX_PER_IP_PER_HOUR) {
    return { allowed: false, reason: 'Too many attempts from this connection. Please wait a few minutes and try again.' };
  }

  const dk = dailyKey();
  const globalCount = parseInt((await env.SIGNATURES.get(dk)) || '0', 10);
  if (globalCount >= MAX_GLOBAL_PER_DAY) {
    return { allowed: false, reason: 'Signing is temporarily unavailable. Please email jojishiotsuki0@gmail.com and it will be sorted straight away.' };
  }

  await Promise.all([
    env.SIGNATURES.put(ipk, String(ipCount + 1), { expirationTtl: 3600 }),
    env.SIGNATURES.put(dk, String(globalCount + 1), { expirationTtl: 86400 }),
  ]);

  return { allowed: true };
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
  wrong rejection here costs a signature. This catches typos and junk, which is the job.
*/
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;
const OPTION_ID_RE = /^[a-z0-9][a-z0-9_-]*$/i;
const HASH_RE = /^[A-Za-z0-9_-]+$/;

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

  // Stored is the point of no return. Whatever the notification does from here, the answer
  // to the signer is success.
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);
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
        if (!isAllowedOrigin(origin, env.ALLOWED_ORIGIN)) {
          return json({ ok: false, error: 'Forbidden.' }, 403, headers);
        }
        return await handleSign(request, env, headers);
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
