import React from 'react';
import type { ProposalOption } from '../../lib/proposals/types';

interface InvestmentProps {
  options: ProposalOption[];
  optionsNote?: string;
  /** Two digit number, or an empty string when the proposal's own numbering has no room. */
  n?: string;
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
  /*
    True once the proposal has been signed. Every other control in the flow already takes
    a locked flag; these radios were the one place in the pattern that missed it, and the
    gap was not cosmetic: the receipt could be made to name an option the client never
    signed, and it printed that way.
  */
  locked?: boolean;
}

/*
  The options, side by side on a desktop and stacked on a phone.

  The selection is a real radio group made of real radio inputs. Written by hand with
  role="radio" and a key handler it would need arrow keys, a roving tabindex, Home and
  End, and a wrapping rule, and it would still not be what a screen reader user has been
  using for twenty years. Native inputs give one tab stop and arrow key movement for free.

  The card used to be the <label> itself, which bought the click target at two costs. A
  <label> may only contain phrasing content, and this card carries a <ul> of inclusions
  and a <dl> of payment lines, which is flow content: invalid markup that browsers happen
  to tolerate. And a wrapping label names the control it wraps, so each radio announced
  the entire card, 76 words for Option A, replayed on every arrow press, after a screen
  reader had already read the same content as a list and a definition list.

  So the card is a plain element that forwards its clicks to the radio, and the radio is
  named by the three parts a person needs before choosing: the option name, the price and
  the control's own visible words. Everything else stays where a screen reader reads it
  once, in the document, in order.

  The number is passed in rather than stored, because whether the pricing gets one at all
  depends on the proposal's own numbering. ProposalPage works it out.
*/
const Investment: React.FC<InvestmentProps> = ({
  options,
  optionsNote,
  n,
  selectedOptionId,
  onSelectOption,
  locked = false,
}) => {
  if (options.length === 0) return null;

  return (
    <section className="pr-invest" id="investment" aria-labelledby="investment-h">
      {n ? <span className="pr-sec-n" aria-hidden="true">{n}</span> : null}
      <h2 className="pr-sec-h" id="investment-h">Investment</h2>

      {/* role="radiogroup" over native radios is the pairing the group name needs: the
          inputs keep their own behaviour, the group gets a name read out on entry. */}
      <div className="pr-opts" role="radiogroup" aria-labelledby="investment-h">
        {options.map(option => {
          const isSelected = option.id === selectedOptionId;
          const classes = [
            'pr-opt',
            option.recommended ? 'pr-opt--rec' : '',
            /* A hook for the stylesheet in case :has() is not how it reaches the
               selected card. Never the only signal: the radio itself is visible. */
            isSelected ? 'pr-opt--on' : '',
          ].filter(Boolean).join(' ');

          /* The parts the radio is named by. Ids are built from the option id, which is
             already unique inside a proposal because it is what the signature records. */
          const nameId = `pr-opt-${option.id}-name`;
          const priceId = `pr-opt-${option.id}-price`;
          const cadenceId = `pr-opt-${option.id}-cadence`;
          const summaryId = `pr-opt-${option.id}-summary`;
          const pickId = `pr-opt-${option.id}-pick`;

          /* Name, price, cadence, then the control's own visible words. The visible words
             are in the name on purpose: someone driving by voice says what they can see. */
          const labelledBy = [nameId, priceId, option.cadence ? cadenceId : '', pickId]
            .filter(Boolean)
            .join(' ');

          /* The card is still the click target, which is why it is worth having: the pick
             control is 46px of a 753px card. Focus follows the click, because that is what
             a label did and because the arrow keys only work from inside the group. A click
             that lands on the radio itself selects it twice, once here and once through the
             input's own change, and both times to the same value.

             The selection guard is the one thing a label gave for free. A browser suppresses
             label activation when the pointer was dragging text, and a plain click handler
             does not, so highlighting a line of this card would otherwise change which option
             the client is accepting. A real click collapses the selection on mousedown, so
             this only ever catches a drag or a double click. */
          const handleCardClick = (event: React.MouseEvent<HTMLDivElement>): void => {
            if (locked) return;

            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) return;

            onSelectOption(option.id);
            event.currentTarget.querySelector<HTMLInputElement>('input')?.focus();
          };

          return (
            <div className={classes} key={option.id} onClick={handleCardClick}>
              {option.recommended ? (
                <span className="pr-opt-flag">{option.highlight ?? 'Recommended'}</span>
              ) : null}

              <span className="pr-opt-name" id={nameId}>{option.name}</span>
              <span className="pr-opt-price" id={priceId}>{option.price}</span>
              {option.cadence ? (
                <span className="pr-opt-cadence" id={cadenceId}>{option.cadence}</span>
              ) : null}
              {/* The description, not the name. The summary is the line that carries what
                  the price actually buys and any condition attached to it, so a reader who
                  is arrowing through the group in forms mode has to hear it, but it does not
                  belong in a name that is read on every press. */}
              <span className="pr-opt-summary" id={summaryId}>{option.summary}</span>

              <ul className="pr-opt-includes">
                {option.includes.map(item => <li key={item}>{item}</li>)}
              </ul>

              <dl className="pr-opt-lines">
                {option.lines.map(line => (
                  <div className="pr-opt-line" key={line.label}>
                    <dt>
                      {line.label}
                      {line.note ? <span className="pr-opt-line-note">{line.note}</span> : null}
                    </dt>
                    <dd>{line.amount}</dd>
                  </div>
                ))}
              </dl>

              <span className="pr-opt-pick">
                <input
                  type="radio"
                  name="proposal-option"
                  value={option.id}
                  checked={isSelected}
                  disabled={locked}
                  aria-labelledby={labelledBy}
                  aria-describedby={summaryId}
                  onChange={() => onSelectOption(option.id)}
                />
                {/* A span now, only so the words can be pointed at by the radio's name.
                    It carries no class: the flex gap spaces a span exactly as it spaced
                    the bare text run this replaced. */}
                <span id={pickId}>
                  {locked
                    ? (isSelected ? 'Accepted' : '')
                    : (isSelected ? 'Selected' : 'Choose this option')}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {optionsNote ? <p className="pr-p">{optionsNote}</p> : null}
    </section>
  );
};

export default Investment;
