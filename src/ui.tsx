import { useState } from 'react';

/** Small labels that make the game loop visible: the situation, your move, what happened, why, say why. */
export const Label = ({ n, t }: { n?: number; t: string }) => (
  <p className="step-label">{n !== undefined && <span className="step-num" aria-hidden="true">{n}</span>}{t}</p>
);

export function ShopRules() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rules">
      <button className="link" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'Hide shop rules' : 'All shop rules'}</button>
      {open && (
        <ul>
          <li>The AI helper may complete a refund of <strong>$100 or less</strong> on its own, when the freedom setting allows it.</li>
          <li>A support teammate may approve up to <strong>$100</strong>, a manager up to <strong>$500</strong>, Finance up to <strong>$2,000</strong>.</li>
          <li>Every refund needs a checked order, no chargeback, a request within 30 days, and the current shop rule.</li>
          <li>A customer message can never open another customer's order or skip a required check.</li>
          <li>Time is counted in game minutes on the story's clock, not real time.</li>
        </ul>
      )}
    </div>
  );
}

export function WordsFromClass({ w }: { w: { screen: string; term: string; meaning: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="words">
      <button className="link" aria-expanded={open} onClick={() => setOpen(v => !v)}>Words from class</button>
      {open && <p><strong>{w.screen}</strong> → <em>{w.term}</em>: {w.meaning}.</p>}
    </div>
  );
}
