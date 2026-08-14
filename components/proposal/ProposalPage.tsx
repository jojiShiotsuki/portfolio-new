import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProposal } from '../../lib/proposals';
import type { Proposal, ProposalSection } from '../../lib/proposals/types';
import Blocks from './Blocks';
import ProposalToc from './ProposalToc';
import type { TocItem } from './ProposalToc';
import Investment from './Investment';
import Testimonials from './Testimonials';
import SignatureBlock from './SignatureBlock';
/* Imported here, not in index.css, so it ships with the lazy route and never costs the
   home page a byte. */
import './proposal.css';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/*
  Render the stored ISO date in the reader's own format.

  `new Date('2026-08-15')` is midnight UTC, which prints as the 14th for anyone west of
  Greenwich, and a proposal that disagrees with itself about its own date is not a
  document anyone should sign. Appending the time makes it local midnight instead.
*/
const formatDate = (iso: string): string => {
  if (!ISO_DATE.test(iso)) return iso;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

/*
  The number the pricing block shows, or an empty string for none.

  The proposal data numbers its own sections and its terms. When those two runs leave a
  gap (sections end at 04 and the terms are 06), the pricing is what the gap was left for
  and it takes 05. When they run straight on, the pricing carries no number rather than
  pushing the terms out of step with the document the client may already have read.
*/
/*
  Every numbered block in the document, in the order it renders, numbered once.

  This is the only place numbering happens. The contents list and the headings both read
  from it, so they cannot drift apart, and inserting a section renumbers everything below
  it without anyone editing a data file.
*/
type ChapterKind = 'section' | 'quotes' | 'investment' | 'terms' | 'signature';

interface Chapter {
  id: string;
  n: string;
  title: string;
  kind: ChapterKind;
  section?: ProposalSection;
}

const buildChapters = (proposal: Proposal): Chapter[] => {
  const [first, ...rest] = proposal.sections;

  const raw: Omit<Chapter, 'n'>[] = [
    ...(first ? [{ id: first.id, title: first.heading, kind: 'section' as const, section: first }] : []),
    /* The quotes band sits directly under the opening letter, which is where the proposal
       this one is modelled on puts its own. */
    ...((proposal.testimonials?.length ?? 0) > 0
      ? [{ id: 'testimonials', title: 'What clients say', kind: 'quotes' as const }]
      : []),
    ...rest.map(section => ({ id: section.id, title: section.heading, kind: 'section' as const, section })),
    { id: 'investment', title: 'Investment', kind: 'investment' as const },
    ...proposal.terms.map(section => ({ id: section.id, title: section.heading, kind: 'terms' as const, section })),
    { id: 'signature', title: 'Acceptance', kind: 'signature' as const },
  ];

  return raw.map((chapter, i) => ({ ...chapter, n: String(i + 1).padStart(2, '0') }));
};

/* The recommended option is the one preselected. Nobody is signed up to it by that: the
   signature block names what is selected, and the selection is a radio group. */
const defaultOptionId = (proposal: Proposal): string => {
  const recommended = proposal.options.find(option => option.recommended);
  return (recommended ?? proposal.options[0])?.id ?? '';
};

interface SectionProps {
  section: ProposalSection;
  n: string;
}

const Section: React.FC<SectionProps> = ({ section, n }) => (
  <section className="pr-sec" id={section.id} aria-labelledby={`${section.id}-h`}>
    <span className="pr-sec-n" aria-hidden="true">{n}</span>
    <h2 className="pr-sec-h" id={`${section.id}-h`}>{section.heading}</h2>
    {section.subheading ? <p className="pr-sec-sub">{section.subheading}</p> : null}
    <Blocks blocks={section.blocks} />
  </section>
);

/*
  A client proposal, rendered from data. One route serves every proposal there will ever
  be; adding one is a file under lib/proposals and nothing here changes.
*/
const ProposalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const proposal = getProposal(slug);

  const [selectedOptionId, setSelectedOptionId] = React.useState<string>(
    () => (proposal ? defaultOptionId(proposal) : ''),
  );

  /* getProposal hands back the same object every render, so this resets the choice when
     the reader moves to a different proposal and at no other time. */
  React.useEffect(() => {
    if (proposal) setSelectedOptionId(defaultOptionId(proposal));
  }, [proposal]);

  /* The browser names a printed PDF after the document title, so this is what lands in
     the client's downloads folder. */
  React.useEffect(() => {
    if (!proposal) return;
    const previous = document.title;
    document.title = `${proposal.client} Proposal`;
    return () => { document.title = previous; };
  }, [proposal]);

  /* One numbered run over the whole document, used by the contents and the headings
     alike. Every block gets a number, the quotes and the acceptance included: a row in
     the rail with an empty number column reads as a mistake, not as a decision. */
  const chapters: Chapter[] = React.useMemo(
    () => (proposal ? buildChapters(proposal) : []),
    [proposal],
  );

  const tocItems: TocItem[] = React.useMemo(
    () => chapters.map(({ id, n, title }) => ({ id, n, title })),
    [chapters],
  );

  if (!proposal) {
    /* Not a redirect. A link that quietly bounces to the home page looks like the
       proposal was withdrawn; this says what happened and who to ask. */
    return (
      <div className="mono">
        <div className="proposal">
          <main className="pr-head pr-notfound sheet">
            <p className="pr-head-meta"><span>Proposal</span></p>
            <h1 className="pr-title">This proposal link is not valid</h1>
            <p className="pr-p">
              The address may have been copied without its last few characters, or this
              proposal may have been replaced by a newer one.
            </p>
            <p className="pr-p">
              Reply to the email the link arrived in and a working one will be sent
              straight back.
            </p>
            <p className="pr-p"><Link to="/">Back to jojishiotsuki.com</Link></p>
          </main>
        </div>
      </div>
    );
  }

  const specRows: { term: string; value: React.ReactNode }[] = [
    { term: 'Prepared for', value: proposal.client },
    { term: 'Attention', value: proposal.contact },
    { term: 'Prepared by', value: `${proposal.preparedBy}, ${proposal.preparedByRole}` },
    {
      term: 'Email',
      value: <a href={`mailto:${proposal.preparedByEmail}`}>{proposal.preparedByEmail}</a>,
    },
    { term: 'Date', value: formatDate(proposal.preparedOn) },
    ...(proposal.validUntil ? [{ term: 'Valid until', value: proposal.validUntil }] : []),
    { term: 'Reference', value: proposal.slug },
  ];

  return (
    /* .proposal sits inside .mono rather than on the same element: mono.css declares the
       palette tokens on .mono, and proposal.css scopes every rule to `.mono .proposal`. */
    <div className="mono">
      <div className="proposal">
        <a className="skip" href="#signature">Skip to the signature</a>

        {/* Two things a reader of a proposal always wants: a copy of it, and the place to
            say yes. window.print() is the whole PDF story, and the print stylesheet is
            what makes the result worth keeping. */}
        <div className="pr-actions">
          <button type="button" className="pr-dl" onClick={() => window.print()}>
            Download PDF
          </button>
          <a className="pr-accept" href="#signature">Accept and sign</a>
        </div>

        <main>
          <header className="pr-head sheet">
            <p className="pr-head-meta">
              <span>Proposal</span>
              <span>{proposal.client}</span>
            </p>
            <h1 className="pr-title">{proposal.title}</h1>
            <p className="pr-sub">{proposal.subtitle}</p>

            <dl className="pr-spec">
              {specRows.map(row => (
                <div className="r" key={row.term}>
                  <dt>{row.term}</dt>
                  <span className="leader" aria-hidden="true" />
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          {/* The contents list comes after the cover in the source, which is the reading
              order on a phone, where it is a plain block above the text. Above 1100px
              proposal.css lifts it out of the flow entirely and pins it to the left edge
              as a full height rail, and the whole sheet is inset by the rail's width to
              make room. Keeping it here rather than in a grid cell is what lets it run
              the full height of the viewport instead of starting below the cover. */}
          <ProposalToc items={tocItems} />

          <div className="pr-grid sheet">
            <div className="pr-main">
              {/* Rendered straight off the same numbered run the contents list uses, so
                  the order on the page and the order in the rail are the same list read
                  twice rather than two lists kept in step by hand. */}
              {chapters.map(chapter => {
                switch (chapter.kind) {
                  case 'section':
                  case 'terms':
                    return chapter.section
                      ? <Section key={chapter.id} section={chapter.section} n={chapter.n} />
                      : null;
                  case 'quotes':
                    return (
                      <Testimonials
                        key={chapter.id}
                        n={chapter.n}
                        items={proposal.testimonials ?? []}
                      />
                    );
                  case 'investment':
                    return (
                      <Investment
                        key={chapter.id}
                        options={proposal.options}
                        optionsNote={proposal.optionsNote}
                        n={chapter.n}
                        selectedOptionId={selectedOptionId}
                        onSelectOption={setSelectedOptionId}
                      />
                    );
                  case 'signature':
                    return null;
                  default: {
                    /* Exhaustiveness. A new chapter kind must be handled here, not
                       silently dropped out of a document someone is about to sign. */
                    const never: never = chapter.kind;
                    return never;
                  }
                }
              })}

              <SignatureBlock
                n={chapters[chapters.length - 1]?.n ?? ''}
                slug={proposal.slug}
                signature={proposal.signature}
                options={proposal.options}
                selectedOptionId={selectedOptionId}
                onSelectOption={setSelectedOptionId}
              />
            </div>
          </div>

          <footer className="pr-foot sheet">
            <p>{proposal.preparedBy}, {proposal.preparedByRole}</p>
            <p><a href={`mailto:${proposal.preparedByEmail}`}>{proposal.preparedByEmail}</a></p>
            <p>Prepared for {proposal.client} on {formatDate(proposal.preparedOn)}. Confidential.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ProposalPage;
