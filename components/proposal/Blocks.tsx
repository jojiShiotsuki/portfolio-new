import React from 'react';
import type { Block } from '../../lib/proposals/types';

/*
  The block renderer.

  There is no dangerouslySetInnerHTML on this page and there never will be. The text
  rendered here is copy about a client, written for a client, on a sheet that is about to
  carry their signature. The only formatting a block carries is **bold**, and a four line
  splitter is a smaller risk than a markdown parser.
*/

/**
 * Turn a RichText string into nodes, treating a matched pair of double asterisks as bold.
 *
 * An unmatched trailing marker renders as plain text rather than bolding the rest of the
 * sentence: a stray asterisk in client copy should look like a typo, not like a decision.
 */
export const renderRich = (text: string): React.ReactNode => {
  const parts = text.split('**');
  if (parts.length === 1) return text;

  // An even number of parts means an odd number of markers, so the last one never closed.
  const hasUnclosedMarker = parts.length % 2 === 0;

  return parts.map((part, index) => {
    if (part === '') return null;
    const isBold = index % 2 === 1 && !(hasUnclosedMarker && index === parts.length - 1);
    return isBold
      ? <strong key={index}>{part}</strong>
      : <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

interface BlockViewProps {
  block: Block;
}

const BlockView: React.FC<BlockViewProps> = ({ block }) => {
  switch (block.kind) {
    case 'p':
      return <p className="pr-p">{renderRich(block.text)}</p>;

    case 'h3':
      return <h3 className="pr-h3">{block.text}</h3>;

    case 'ul':
      return (
        <ul className="pr-ul">
          {block.items.map((item, index) => <li key={index}>{renderRich(item)}</li>)}
        </ul>
      );

    // Numbers come from the stylesheet's counter, not from markup. mono.css sets
    // list-style: none on every list under .mono, so a hand written number here would
    // either be the only number or a second one.
    case 'ol':
      return (
        <ol className="pr-ol">
          {block.items.map((item, index) => <li key={index}>{renderRich(item)}</li>)}
        </ol>
      );

    // Same row shape as .spec in mono.css: term, dot leader, value.
    case 'kv':
      return (
        <dl className="pr-kv">
          {block.rows.map(row => (
            <div className="r" key={row.term}>
              <dt>{row.term}</dt>
              <span className="leader" aria-hidden="true" />
              <dd>{renderRich(row.value)}</dd>
            </div>
          ))}
        </dl>
      );

    case 'callout':
      return <p className="pr-callout">{renderRich(block.text)}</p>;

    default: {
      // Exhaustiveness. Add a kind to the Block union in types.ts and this line stops
      // compiling, which is the point: a block that renders as nothing is a block a
      // client never reads.
      const unhandled: never = block;
      void unhandled;
      return null;
    }
  }
};

interface BlocksProps {
  blocks: Block[];
}

/* Blocks owns .pr-body so the wrapper exists exactly once, whoever calls it. */
const Blocks: React.FC<BlocksProps> = ({ blocks }) => (
  <div className="pr-body">
    {blocks.map((block, index) => <BlockView key={index} block={block} />)}
  </div>
);

export default Blocks;
