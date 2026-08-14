import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProposal } from '../../lib/proposals';
import { useTheme } from '../../ThemeContext';
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
  Every date on the sheet, put through one Australian format.

  Two faults lived here. `new Date('2026-08-15')` is midnight UTC, which prints as the
  14th for anyone west of Greenwich, so the time is appended and it parses as local
  midnight instead. And the locale was the reader's own, which set "August 15, 2026"
  three rows above the written out "14 September 2026" on the cover of a document for a
  Sydney firm, and pressed that disagreement into every PDF printed on a machine that is
  not day first. The locale is pinned now: the client is Australian, so the document is.

  It accepts dates written out in words as well as ISO ones, because `validUntil` is
  stored in words and lives in a data file this component does not own. Anything it
  cannot parse comes back untouched, so an unreadable date is still the author's date and
  never a wrong one.
*/
const AU_DATE: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

const formatDate = (value: string): string => {
  const date = new Date(ISO_DATE.test(value) ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-AU', AU_DATE);
};

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

  /* Set once the signature is recorded. From then on the pricing block is a statement of
     what was agreed, not a control, so its radios go dead like every other control does. */
  const [signed, setSigned] = React.useState(false);

  /* The proposal renders its own shell and carries no masthead on purpose, which also
     removed the only way to change theme: a client reading at night got whatever their
     machine was set to, with no say in it. Same control as the rest of the site, same
     class names, so mono.css styles it without a line being added here. */
  const { mode, toggleTheme } = useTheme();
  const themeBtnRef = React.useRef<HTMLButtonElement>(null);
  const isDark = mode === 'dark';

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
      value: (
        <a className="pr-tap" href={`mailto:${proposal.preparedByEmail}`}>
          {proposal.preparedByEmail}
        </a>
      ),
    },
    /* Both dates go through the one formatter. Two code paths is how the cover came to
       carry two formats, so there is only one now. */
    { term: 'Date', value: formatDate(proposal.preparedOn) },
    ...(proposal.validUntil ? [{ term: 'Valid until', value: formatDate(proposal.validUntil) }] : []),
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
          {/* First in the bar, and deliberately not a filled control: it is a reading
              preference sitting beside the two things the page is actually for. The
              reveal is anchored on the button so the new theme grows out of the thing
              that was pressed, which is how the masthead does it. */}
          <button
            className="theme-btn pr-theme"
            type="button"
            ref={themeBtnRef}
            onClick={() => toggleTheme(themeBtnRef.current?.getBoundingClientRect())}
            aria-label={`Switch to the ${isDark ? 'light' : 'dark'} theme`}
            aria-pressed={isDark}
          >
            <span className="theme-orb" aria-hidden="true" />
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

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
              the full height of the viewport instead of starting below the cover.

              The .sheet wrapper is what gives it the document's own gutters while it is
              still in the flow. Without it the list ran edge to edge while every other
              block sat inside the margins, and from 940px up, where .sheet draws the
              side hairlines, the frame of the page visibly broke across it. The wrapper
              rather than the class on the nav itself, because above 1100px the nav goes
              position: fixed and leaves the wrapper behind, so the rail keeps its own
              width, padding and single right hand border and inherits nothing. */}
          <div className="sheet">
            <ProposalToc items={tocItems} />
          </div>

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
                        locked={signed}
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
                onSigned={() => setSigned(true)}
                signature={proposal.signature}
                options={proposal.options}
                selectedOptionId={selectedOptionId}
                onSelectOption={setSelectedOptionId}
              />
            </div>
          </div>

          <footer className="pr-foot sheet">
            <p>{proposal.preparedBy}, {proposal.preparedByRole}</p>
            <p>
              <a className="pr-tap" href={`mailto:${proposal.preparedByEmail}`}>
                {proposal.preparedByEmail}
              </a>
            </p>
            <p>Prepared for {proposal.client} on {formatDate(proposal.preparedOn)}. Confidential.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ProposalPage;
