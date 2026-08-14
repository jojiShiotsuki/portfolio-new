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

/** The Cloudflare Worker that records signatures. Deployed separately from this bundle. */
export const SIGN_ENDPOINT = 'https://proposal-sign.joji-dev.workers.dev/sign';

/*
  What the page actually posts: the shared payload plus one flag types.ts has no room for.

  The typed-name fallback is rendered to the canvas and sent as a PNG like any other
  signature, so the stored image cannot be told apart from a drawn one by its bytes. The
  worker records whether a signature was drawn or typed, and this is the only place that
  answer can come from. Optional, so every plain SignaturePayload is still accepted, and
  the worker reads anything other than `true` as drawn.
*/
export type SignatureRequest = SignaturePayload & { typedSignature?: boolean };

/* Long enough for a cold worker to wake up, short enough that a dead network shows as an
   error rather than as a button that spins forever. */
const TIMEOUT_MS = 20000;

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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(SIGN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timer);
    return {
      ok: false,
      error: `The signature could not be sent, so nothing has been recorded. Check your connection and press Sign again. ${FALLBACK}`,
    };
  }
  clearTimeout(timer);

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
