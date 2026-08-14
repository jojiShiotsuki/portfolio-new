import type { SignaturePayload, SignatureResult } from './types';

/*
  The client half of the signing flow.

  Everything in here exists because of one rule: a signature is either recorded or it is
  not, and the page must never tell a client it was recorded when it was not. So an HTTP
  200 is not success on its own. Success is `ok === true` in a parsed JSON body with a
  reference in it. A worker that returns 200 with an HTML error page, a worker that
  returns 200 with `{ ok: false }`, and a worker that is not there at all are all the
  same answer to the person signing: nothing has been recorded, here is what to do.
*/

/*
  Where a signature is posted.

  In production this is a path on THIS site, not the Cloudflare Worker, and that is the
  whole point. The page posted straight to the worker until 15 August, when Joji's
  connection turned out to be unable to open a socket to the two addresses that worker
  answers on: DNS resolved, other Cloudflare hosts connected, his own site connected, and
  those two refused, on and off, for minutes. It lost a signature once and reported a stored
  one as failed once.

  A relative path removes the failure. The document the client is reading was served by this
  host over this exact route, so if they can read it they can reach this. There is no second
  connection to fail, and no CORS, because it is the same origin. api/sign.php forwards to
  the worker from a data centre and falls back to storing the signature itself.

  Development is the exception: Vite serves the app but does not run PHP, so localhost keeps
  posting to the worker directly. That means the local path is NOT the production path, and
  anything about the PHP hop has to be checked against the deployed site rather than here.
*/
const isLocalHost = (): boolean =>
  typeof location !== 'undefined' &&
  ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

export const SIGN_ENDPOINT = isLocalHost()
  ? 'https://proposal-sign.joji-dev.workers.dev/sign'
  : '/api/sign.php';

/*
  What the page actually posts: the shared payload plus one flag types.ts has no room for.

  The typed-name fallback is rendered to the canvas and sent as a PNG like any other
  signature, so the stored image cannot be told apart from a drawn one by its bytes. The
  worker records whether a signature was drawn or typed, and this is the only place that
  answer can come from. Optional, so every plain SignaturePayload is still accepted, and
  the worker reads anything other than `true` as drawn.
*/
export type SignatureRequest = SignaturePayload & { typedSignature?: boolean };

/* The same reasoning as SIGN_ENDPOINT: the deployed page asks its own host, and only
   localhost talks to the worker directly because Vite runs no PHP. */
const STATUS_ENDPOINT = isLocalHost()
  ? 'https://proposal-sign.joji-dev.workers.dev/status'
  : '/api/sign.php';

/** What the page learns about a proposal before it renders the signing form. */
export interface SignedStatus {
  signed: boolean;
  reference?: string;
  optionId?: string;
  serverTime?: string;
}

/*
  Short, and it has to be. This runs while a client is waiting to read the proposal, and
  the answer only changes whether they see a receipt or a signing form. Being slow to say
  "not signed" would be worse than being wrong about it, because the lock catches a second
  signature at signing time regardless.
*/
const STATUS_TIMEOUT_MS = 6000;

/**
 * Has this proposal already been signed?
 *
 * Never throws and never reports uncertainty as "signed". Every failure answers `false`,
 * which shows the normal signing form: the behaviour the page had before this existed, and
 * the only safe direction to be wrong in. Answering "signed" on a failed lookup would show
 * a receipt for a signature that might not exist, and worse, would stop a client signing.
 */
export async function fetchSignedStatus(slug: string): Promise<SignedStatus> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), STATUS_TIMEOUT_MS);
  try {
    const url = `${STATUS_ENDPOINT}?slug=${encodeURIComponent(slug)}`;
    const response = await fetch(url, { method: 'GET', signal: controller.signal });
    if (!response.ok) return { signed: false };

    const parsed: unknown = await response.json();
    if (!isRecord(parsed) || parsed.signed !== true) return { signed: false };

    const reference = typeof parsed.reference === 'string' ? parsed.reference.trim() : '';
    /* A "signed" with no reference is an answer this page cannot render honestly, so it is
       treated as not signed rather than shown as a receipt with an empty field. */
    if (!reference) return { signed: false };

    return {
      signed: true,
      reference,
      optionId: typeof parsed.optionId === 'string' ? parsed.optionId : undefined,
      serverTime: typeof parsed.serverTime === 'string' ? parsed.serverTime : undefined,
    };
  } catch {
    return { signed: false };
  } finally {
    clearTimeout(timer);
  }
}

/* Long enough for a cold worker to wake up, short enough that a dead network shows as an
   error rather than as a button that spins forever.

   This is PER ATTEMPT and there are two, so a total dead network now takes about 21
   seconds to report rather than 20. That is the price of the retry and it is only paid by
   someone who was going to be told it failed anyway. */
const TIMEOUT_MS = 20000;

/* The pause between the two attempts. */
const RETRY_DELAY_MS = 600;

/**
 * A fresh id for one press of Sign.
 *
 * randomUUID is only exposed on secure origins, and while this page is always https in
 * production, the fallback is here so a missing id can never be the reason a signature
 * cannot be sent. Uniqueness is what matters, not unguessability: the id is a key on our
 * own store, not a secret, and knowing one buys nothing.
 */
const newRequestId = (): string => {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  if (c && typeof c.getRandomValues === 'function') {
    return Array.from(c.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 14)}`;
};

/* Every error the client sees ends with a way out that does not depend on this page
   working, because if they are reading it, this page is the thing that failed. */
const FALLBACK =
  'If it keeps failing, reply to the email this proposal arrived in and it will be recorded by hand.';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Send a signature to the worker.
 *
 * Never throws. Every failure comes back as `{ ok: false, error }` with a sentence the
 * client can act on, because the caller renders it directly.
 */
export async function submitSignature(payload: SignatureRequest): Promise<SignatureResult> {
  /*
    One post, with one silent retry if the connection itself fails.

    This exists because of a measured fault. Reaching the worker from Joji's network failed
    at the TCP level on the FIRST attempt and then succeeded in about 26ms on the second,
    same URL, seconds apart. Left alone that is a spinner for twenty seconds and then
    "nothing was recorded", when pressing the same button again would have worked. A Worker
    cold start is single digit milliseconds, so a twenty second failure is never the server
    thinking.

    A CORRECTION, from an incident on 15 August. The first version of this retry justified
    itself with "nothing reached the worker, so posting again is safe". That is wrong, and it
    is the dangerous kind of wrong. A rejected fetch means no ANSWER came back. It says
    nothing about whether the request arrived. On that day the worker stored a signature and
    the reply was lost on the way home, so the person was told nothing had been recorded
    while the record existed, and a retry on that shape would have written a second one.

    Hence requestId: generated ONCE here and reused by the retry, so both attempts are the
    same attempt as far as the worker is concerned. The worker returns the reference it
    already stored instead of writing again. That turns a lost reply into a correct success
    rather than a false failure, and makes the retry safe by construction rather than by an
    argument about what a network error implies.

    Still only a connection failure is retried. A response of any status is an answer and is
    returned as it is.
  */
  const requestId = newRequestId();
  const body = JSON.stringify({ ...payload, requestId });

  let response: Response | null = null;

  for (let attempt = 0; attempt < 2 && response === null; attempt += 1) {
    if (attempt > 0) {
      // Long enough for a failed route to be re-resolved, short enough to be unnoticed
      // inside a twenty second budget the person is already waiting out.
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      response = await fetch(SIGN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });
    } catch {
      /* Connection refused, DNS, or the timeout above firing. It is NOT known whether the
         request arrived, which is why the body carries a requestId: if it did arrive, the
         second attempt is recognised as the same one and returns the same reference rather
         than storing a second signature. */
    } finally {
      clearTimeout(timer);
    }
  }

  if (response === null) {
    return {
      ok: false,
      error: `The signature could not be sent, so nothing has been recorded. Check your connection and press Sign again. ${FALLBACK}`,
    };
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    // A gateway page, an empty body, a redirect to HTML. Any of these means the request
    // never reached the code that writes the record.
    return {
      ok: false,
      error: `The signing service answered with something this page could not read (status ${response.status}), so nothing has been recorded. Please press Sign again. ${FALLBACK}`,
    };
  }

  if (!isRecord(parsed)) {
    return {
      ok: false,
      error: `The signing service sent an unexpected answer (status ${response.status}), so nothing has been recorded. Please press Sign again. ${FALLBACK}`,
    };
  }

  const reference = typeof parsed.reference === 'string' ? parsed.reference.trim() : '';
  if (parsed.ok === true && reference) {
    /* A proposal that was already signed comes back as a success carrying the FIRST
       record's details, because the person's signature is genuinely held. Passed through
       rather than flattened to a plain success: the caller has to know it must render the
       recorded option instead of the selected one. */
    if (parsed.alreadySigned === true) {
      return {
        ok: true,
        reference,
        alreadySigned: true,
        recordedOptionId:
          typeof parsed.recordedOptionId === 'string' ? parsed.recordedOptionId : undefined,
        recordedAt: typeof parsed.recordedAt === 'string' ? parsed.recordedAt : undefined,
      };
    }
    return { ok: true, reference };
  }

  const reported = typeof parsed.error === 'string' ? parsed.error.trim() : '';
  return {
    ok: false,
    error: reported
      ? `${reported} ${FALLBACK}`
      : `The signature was not recorded (status ${response.status}). Please press Sign again. ${FALLBACK}`,
  };
}
