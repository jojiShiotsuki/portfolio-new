import React from 'react';

export interface TocItem {
  /** The id of the section this row jumps to. */
  id: string;
  /** Two digit number, or an empty string for the blocks that carry no number. */
  n: string;
  title: string;
  /** The right hand column, e.g. "Pricing". */
  note?: string;
}

interface ProposalTocProps {
  items: TocItem[];
}

/*
  The contents list, same shape as .toc on the home page: number, title, dot leader, note.

  It also says where you are. A proposal is read out of order (people jump to the money
  and back), so the marker is worth the observer: on a long sheet with no visible
  scrollbar position, the contents list is the only thing that answers "how much of this
  is left".
*/
const ProposalToc: React.FC<ProposalTocProps> = ({ items }) => {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id ?? '');

  React.useEffect(() => {
    const ids = items.map(item => item.id);
    const elements = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // A band near the top of the viewport. Whatever is crossing it is what the reader is
    // reading. Kept in the set rather than read from the entry list because the callback
    // only carries the sections that changed, not every section.
    const inBand = new Set<string>();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        // Document order, so a tall section that starts above the band still wins over
        // the one below it.
        const next = ids.find(id => inBand.has(id));
        if (next) setActiveId(next);
      },
      { rootMargin: '-72px 0px -62% 0px', threshold: 0 },
    );

    elements.forEach(el => observer.observe(el));
    return () => {
      observer.disconnect();
      inBand.clear();
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="pr-toc" aria-label="Contents">
      <p className="pr-toc-cap">Contents</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              /* aria-current, not a class alone: the marker is information, not decoration. */
              aria-current={activeId === item.id ? 'true' : undefined}
            >
              <span className="n">{item.n}</span>
              <span className="t">{item.title}</span>
              <span className="leader" aria-hidden="true" />
              {item.note ? <span className="c">{item.note}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ProposalToc;
