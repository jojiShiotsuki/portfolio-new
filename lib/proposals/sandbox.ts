import type { Proposal } from './types';
import { innerWealth } from './inner-wealth';

/*
  A rehearsal copy of the live Inner Wealth proposal, for Joji to sign as often as he likes
  without touching the real one.

  It SPREADS innerWealth rather than copying its content, and that is the whole point. A
  duplicated 400 line data file would be identical on the day it was made and quietly wrong
  a week later, so the rehearsal would stop rehearsing the thing being sent. This way every
  future edit to the real proposal appears here automatically and there is nothing to keep
  in step.

  What is deliberately NOT changed is the visible content: same cover, same client name,
  same prices, same terms. A test that looks different from the real page is not a test of
  the real page. The only difference is the slug, which is what separates the two
  everywhere it matters:

    - the signing worker records it against this slug, so a rehearsal never lands in the
      Inner Wealth record,
    - the "proposal signed" email names the slug, so an alert from a rehearsal is
      distinguishable from Tony at a glance,
    - and the slug says sandbox in words, so nobody reading a record has to work it out.

  The suffix is random for the same reason the real one is: this page shows a client's
  pricing and terms, and the URL is the only thing keeping it private.

  Adding this to the site is two lines. Making it SIGNABLE is a third, in the worker's
  KNOWN_SLUGS list, or signing returns 400 and the page correctly reports that nothing was
  recorded. All three are done.
*/
export const sandbox: Proposal = {
  ...innerWealth,
  slug: 'sandbox-rehearsal-Ua4p9EqERZt',
};
