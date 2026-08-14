/*
  The shape of a client proposal.

  A proposal is data, not markup. Adding a new one means adding one file under
  lib/proposals/ and registering it in index.ts, which is the whole point: the page,
  the print stylesheet and the signature flow are written once and never again.

  Body copy is stored as a small union of blocks rather than as markdown. A markdown
  string would need a parser at runtime, and a parser is a thing that can be wrong on a
  page a client is about to sign. Blocks cannot be wrong, only verbose.
*/

/** Inline emphasis is the only formatting a block's text carries: **like this**. */
export type RichText = string;

export type Block =
  | { kind: 'p'; text: RichText }
  | { kind: 'h3'; text: string }
  | { kind: 'ul'; items: RichText[] }
  /** A numbered list. Rendered with the same dot-leader treatment as the site's contents list. */
  | { kind: 'ol'; items: RichText[] }
  /** A term/value table. Renders as the Mono Index dot-leader spec rows. */
  | { kind: 'kv'; rows: { term: string; value: RichText }[] }
  /** A single boxed statement. Use sparingly: it loses its force at more than one per section. */
  | { kind: 'callout'; text: RichText };

export interface ProposalSection {
  /** kebab-case, stable, used as the anchor id and in the contents nav. */
  id: string;
  /*
    No number here on purpose. Section numbers used to be written into the data and the
    pricing block worked its own out by adding one to the last section, which meant a
    proposal could number its headings differently from its own contents list, and two
    blocks (the quotes and the acceptance) ended up with no number at all. The numbering
    is derived once from render order in ProposalPage instead, so the rail and the
    headings cannot disagree and inserting a section renumbers everything after it.
  */
  heading: string;
  /** Optional line under the heading, set in the muted colour. */
  subheading?: string;
  blocks: Block[];
}

export interface ProposalOptionLine {
  label: string;
  /** Formatted for display, e.g. "AUD $2,000" or "Included". Never a bare number. */
  amount: string;
  note?: string;
}

export interface ProposalOption {
  id: string;
  name: string;
  /** The headline figure, formatted, e.g. "AUD $1,500". */
  price: string;
  /** What the figure is per, e.g. "per month" or "one off". Empty string for neither. */
  cadence: string;
  summary: string;
  includes: string[];
  lines: ProposalOptionLine[];
  /** Exactly one option in a proposal should carry this. */
  recommended?: boolean;
  /** Shown on the recommended option only, e.g. "Website build included at no charge". */
  highlight?: string;
}

export interface ProposalSignature {
  /** The sentence above the signature pad. This is the thing being agreed to. */
  statement: string;
  /** Shown under the pad in small type. Explains what gets recorded and why. */
  note: string;
}

/*
  A real client quote. Verbatim, always: these are other people's words and they are not
  ours to tidy up. Every one of these is already published on jojishiotsuki.com.
*/
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Proposal {
  /** The URL segment. Unguessable, because the page carries pricing. */
  slug: string;
  /** Cover line: who it is for. */
  client: string;
  /** The person who will read and sign it. */
  contact: string;
  /** One line on what the proposal is for. */
  title: string;
  subtitle: string;
  preparedBy: string;
  preparedByRole: string;
  preparedByEmail: string;
  /** ISO date, e.g. "2026-08-15". Rendered in the reader's format, not parsed. */
  preparedOn: string;
  /** Human date the proposal stops being valid, or null if Joji has not set one. */
  validUntil: string | null;
  /**
   * Shown as its own band directly under the opening letter, which is where the proposal
   * this one is modelled on puts it. Optional: a proposal with no quotes simply omits the band
   * rather than showing an empty one.
   */
  testimonials?: Testimonial[];
  sections: ProposalSection[];
  options: ProposalOption[];
  optionsNote?: string;
  terms: ProposalSection[];
  signature: ProposalSignature;
}

/** What the signature endpoint is sent. Keep in step with worker/src/sign.ts. */
export interface SignaturePayload {
  slug: string;
  /** Data URL of the drawn signature, PNG. */
  drawing: string;
  typedName: string;
  typedTitle: string;
  email: string;
  /** Which option they accepted. */
  optionId: string;
  /** Client clock, for display only. The server stamps its own authoritative time. */
  clientTime: string;
}

export interface SignatureResult {
  ok: boolean;
  /** Present on success. The receipt id the client is shown. */
  reference?: string;
  error?: string;
}
