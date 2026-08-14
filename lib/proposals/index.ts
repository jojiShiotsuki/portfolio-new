import type { Proposal } from './types';
import { innerWealth } from './inner-wealth';

/*
  Every proposal that exists. Adding one is: write the data file, import it, add it here.

  Slugs carry a random suffix because the page shows that client's pricing. The suffix is
  the only thing keeping the URL private, so it must never be a word, a date, or anything
  guessable from the client's name.
*/
const PROPOSALS: readonly Proposal[] = [innerWealth];

export const getProposal = (slug: string | undefined): Proposal | undefined =>
  slug ? PROPOSALS.find(p => p.slug === slug) : undefined;

export const allProposalSlugs = (): string[] => PROPOSALS.map(p => p.slug);

export type { Proposal } from './types';
