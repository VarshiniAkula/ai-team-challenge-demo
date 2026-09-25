import { useState, type ReactNode } from 'react';
import type { Stamp } from './ledger';
import { STAMP_CLS } from './ledger';

/** The result of a move: a stamp with a burst, the streak, one verdict line, and Why? folded away. */
export function StampBox({ stamp, verdict, streak, why, children }: { stamp?: Stamp; verdict: string; streak: number; why: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="result" role="status">
      {stamp && <div className={`stamp ${STAMP_CLS[stamp]}`}>{stamp}</div>}
      {stamp === 'Good move' && streak > 1 && <p className="streak">🔥 {streak} good moves in a row</p>}
      <p className="verdict">{verdict}</p>
      <div className="actions">
        <button className="link" aria-expanded={open} onClick={() => setOpen(v => !v)}>Why?</button>
        {children}
      </div>
      {open && <p className="why">{why}</p>}
    </div>
  );
}
