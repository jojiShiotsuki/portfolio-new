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
const investmentNumber = (proposal: Proposal): string => {
  const last = proposal.sections[proposal.sections.length - 1]?.n;
  const parsed = last ? Number.parseInt(last, 10) : Number.NaN;
  if (Number.isNaN(parsed)) return '';
  const next = String(parsed + 1).padStart(2, '0');
  const taken = new Set([...proposal.sections, ...proposal.terms].map(section => section.n));
  return taken.has(next) ? '' : next;
};

/* The recommended option is the one preselected. Nobody is signed up to it by that: the
   signature block names what is selected, and the selection is a radio group. */
const defaultOptionId = (proposal: Proposal): string => {
  const recommended = proposal.options.find(option => option.recommended);
  return (recommended ?? proposal.options[0])?.id ?? '';
};

interface SectionProps {
  section: ProposalSection;
}

const Section: React.FC<SectionProps> = ({ section }) => (
  <section className="pr-sec" id={section.id} aria-labelledby={`${section.id}-h`}>
    <span className="pr-sec-n" aria-hidden="true">{section.n}</span>
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

  /*
    Contents. The quotes, the pricing and the acceptance carry no number: the proposal
    data numbers its own sections and its terms in one run, which leaves nothing free
    between them, and none of those three reads as another chapter of the argument.

    The quotes row sits second because the band itself does, directly under the opening
    letter. Slicing rather than unshifting so a proposal with no sections at all still
    produces a list in the right order instead of throwing.
  */
  const tocItems: TocItem[] = React.useMemo(() => {
    if (!proposal) return [];
    const sections = proposal.sections.map(section => ({
      id: section.id,
      n: section.n,
      title: section.heading,
    }));
    const quotesRow: TocItem[] = (proposal.testimonials?.length ?? 0) > 0
      /* No note on this row. The rail is narrow, and "What clients say" plus a dot leader
         plus a right hand word wraps into itself and reads as two broken lines. */
      ? [{ id: 'testimonials', n: '', title: 'What clients say' }]
      : [];
    return [
      ...sections.slice(0, 1),
      ...quotesRow,
      ...sections.slice(1),
      { id: 'investment', n: investmentNumber(proposal), title: 'Investment', note: 'Pricing' },
      ...proposal.terms.map(section => ({ id: section.id, n: section.n, title: section.heading })),
      { id: 'signature', n: '', title: 'Acceptance', note: 'Sign here' },
    ];
  }, [proposal]);

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
              {proposal.sections.map((section, index) => (
                <React.Fragment key={section.id}>
                  <Section section={section} />
                  {/* The quotes band goes directly under the opening letter, which is
                      where types.ts puts it and where the proposal this one is modelled
                      on puts its own. Testimonials renders nothing when there are none,
                      so this needs no second condition. */}
                  {index === 0 ? <Testimonials items={proposal.testimonials ?? []} /> : null}
                </React.Fragment>
              ))}
              {/* A proposal with no sections at all would otherwise put a row in the
                  contents pointing at a band that was never rendered. */}
              {proposal.sections.length === 0 ? (
                <Testimonials items={proposal.testimonials ?? []} />
              ) : null}

              <Investment
                options={proposal.options}
                optionsNote={proposal.optionsNote}
                n={investmentNumber(proposal)}
                selectedOptionId={selectedOptionId}
                onSelectOption={setSelectedOptionId}
              />

              {proposal.terms.map(section => (
                <Section key={section.id} section={section} />
              ))}

              <SignatureBlock
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
