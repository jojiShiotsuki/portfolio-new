import type { Proposal } from './types';
import { innerWealth } from './inner-wealth';
import { sandbox } from './sandbox';

/*
  Every proposal that exists. Adding one is: write the data file, import it, add it here.

  Slugs carry a random suffix because the page shows that client's pricing. The suffix is
  the only thing keeping the URL private, so it must never be a word, a date, or anything
  guessable from the client's name.
*/
/* sandbox is a spread of innerWealth under its own slug, so Joji can rehearse signing
   without writing to the real client's record. It is safe to leave registered: it is only
   reachable by its own random URL, exactly like a real proposal. */
const PROPOSALS: readonly Proposal[] = [innerWealth, sandbox];

export const getProposal = (slug: string | undefined): Proposal | undefined =>
  slug ? PROPOSALS.find(p => p.slug === slug) : undefined;

export const allProposalSlugs = (): string[] => PROPOSALS.map(p => p.slug);

export type { Proposal } from './types';
