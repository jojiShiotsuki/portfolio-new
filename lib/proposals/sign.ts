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
   error rather than as a button that spins forever.

   This is PER ATTEMPT and there are two, so a total dead network now takes about 21
   seconds to report rather than 20. That is the price of the retry and it is only paid by
   someone who was going to be told it failed anyway. */
const TIMEOUT_MS = 20000;

/* The pause between the two attempts. */
const RETRY_DELAY_MS = 600;

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

    This exists because of a measured fault rather than a theoretical one. Reaching the
    worker from Joji's network repeatedly failed at the TCP level on the FIRST attempt and
    then succeeded in about 26ms on the second, on the same URL, seconds apart. Left alone
    that is a client staring at a spinner for twenty seconds and then being told nothing was
    recorded, when pressing the same button again would have worked. A worker cold start is
    single digit milliseconds, so a twenty second failure is never the server thinking.

    Only a CONNECTION failure is retried. A response, of any status, is an answer from the
    worker and is returned as it is. Retrying a real response is how a signature gets
    recorded twice: the record is written before the reply is sent, so a 500 read as
    "try again" would store two acceptances for one signature.

    The retry is silent on purpose. The client is told what happened only once both attempts
    have failed, because a message that appears and then resolves itself teaches a person to
    distrust the next one.
  */
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
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch {
      /* Connection refused, DNS, or the timeout above firing. Nothing reached the worker,
         so nothing was written and posting the identical body again is safe. */
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
