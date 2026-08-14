import React from 'react';
import type { ProposalOption } from '../../lib/proposals/types';

interface InvestmentProps {
  options: ProposalOption[];
  optionsNote?: string;
  /** Two digit number, or an empty string when the proposal's own numbering has no room. */
  n?: string;
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
}

/*
  The options, side by side on a desktop and stacked on a phone.

  The selection is a real radio group made of real radio inputs. Written by hand with
  role="radio" and a key handler it would need arrow keys, a roving tabindex, Home and
  End, and a wrapping rule, and it would still not be what a screen reader user has been
  using for twenty years. Native inputs give one tab stop and arrow key movement for
  free, and the whole card is the label, so the click target is the card.

  The number is passed in rather than stored, because whether the pricing gets one at all
  depends on the proposal's own numbering. ProposalPage works it out.
*/
const Investment: React.FC<InvestmentProps> = ({
  options,
  optionsNote,
  n,
  selectedOptionId,
  onSelectOption,
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

          return (
            <label className={classes} key={option.id}>
              {option.recommended ? (
                <span className="pr-opt-flag">{option.highlight ?? 'Recommended'}</span>
              ) : null}

              <span className="pr-opt-name">{option.name}</span>
              <span className="pr-opt-price">{option.price}</span>
              {option.cadence ? <span className="pr-opt-cadence">{option.cadence}</span> : null}
              <span className="pr-opt-summary">{option.summary}</span>

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
                  onChange={() => onSelectOption(option.id)}
                />
                {/* A bare text run, not a span. The flex gap spaces it from the radio
                    either way, and a wrapper would be a class the stylesheet does not
                    know about. The accessible name of the radio is the whole card, which
                    is right: nobody should pick an option without hearing its price. */}
                {isSelected ? 'Selected' : 'Choose this option'}
              </span>
            </label>
          );
        })}
      </div>

      {optionsNote ? <p className="pr-p">{optionsNote}</p> : null}
    </section>
  );
};

export default Investment;
