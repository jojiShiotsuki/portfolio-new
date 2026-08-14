import React from 'react';
import type { Testimonial } from '../../lib/proposals/types';

interface TestimonialsProps {
  items: Testimonial[];
  /** Its number in the document, derived in ProposalPage so this cannot disagree. */
  n: string;
}

/*
  The client quotes band.

  Two rules about this block, both deliberate. The quotes are rendered verbatim: they are
  other people's words, and shortening one to fit a column is editing somebody's opinion.
  And the attribution is never softened to "a client" or "a business owner", because an
  unattributed testimonial reads as an invented one, which is worse than having none.

  The figure is mono.css's own `.quote`, accent rule and small caps caption included,
  rather than a second set of quote classes that would have to be kept in step with it.
  <figure> and <figcaption> so a screen reader announces the words and their source as
  one unit.
*/
const Testimonials: React.FC<TestimonialsProps> = ({ items, n }) => {
  if (items.length === 0) return null;

  return (
    <section className="pr-sec pr-quotes" id="testimonials" aria-labelledby="testimonials-h">
      <span className="pr-sec-n" aria-hidden="true">{n}</span>
      <h2 className="pr-sec-h" id="testimonials-h">What clients say</h2>

      {items.map(item => (
        <figure className="quote" key={`${item.author}-${item.company}`}>
          <p>{item.quote}</p>
          <figcaption>{item.author}, {item.role}, {item.company}</figcaption>
        </figure>
      ))}
    </section>
  );
};

export default Testimonials;
