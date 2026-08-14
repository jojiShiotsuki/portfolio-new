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

  /*
    Which section is the reader actually on.

    This was an IntersectionObserver keeping a set of everything crossing a band near the
    top of the viewport, and taking the first of them in document order. It read one
    behind: land on Overview and the contents still said the quotes above it. A band has
    two edges and a tall section can span both, so "first thing touching the band" is not
    the same question as "what am I reading", and tuning the margins only moves where it
    is wrong.

    So it asks the question directly instead. A probe line sits a quarter of the way down
    the viewport, and the active section is the last one whose top has passed it. There is
    no band, no set and no ordering rule to get wrong, and it can be checked by reading two
    numbers off the page. Costs one rect per section per frame, on a page with eight.
  */
  React.useEffect(() => {
    const ids = items.map(item => item.id);
    if (ids.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const probe = window.innerHeight * 0.28;

      // The last section can be too short to ever reach the probe, so it would never
      // light up however far you scrolled. At the bottom of the page it is the answer by
      // definition. 2px of slack because zoom levels make this fractional.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) current = id;
        else break;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
