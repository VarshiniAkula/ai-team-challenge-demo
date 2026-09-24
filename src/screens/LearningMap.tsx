import { useState } from 'react';
import type { Screen, Stations } from '../App';
import { statusOf } from '../App';
import { LESSONS } from '../content';

const MARK = { 'not started': '○', practiced: '◐', demonstrated: '●' };

export function LearningMap({ stations, go, next }: { stations: Stations; go: (s: Screen) => void; next: () => void }) {
  const [revealed, setRevealed] = useState<string | null>(null);
  return (
    <section>
      <h2>Learning map</h2>
      <p className="lead">Nine lessons cover Module 4. Hover, tap, or focus a card to see the words from class. This demo opens three stations; the full game opens all nine.</p>
      <ul className="lessons">
        {LESSONS.map(l => {
          const screen = 'screen' in l ? l.screen : undefined;
          const st = statusOf(screen ? stations[screen] : undefined);
          return (
            <li key={l.id} className={`lesson ${st.replace(' ', '-')} ${revealed === l.id ? 'revealed' : ''}`}>
              <button className="face" aria-describedby={`${l.id}-term`} onClick={() => setRevealed(r => (r === l.id ? null : l.id))}>
                <span className="name">{l.name}</span>
                <span className="does">{l.does}</span>
                <span className="term" id={`${l.id}-term`}>Words from class: <em>{l.term}</em></span>
              </button>
              <div className="foot">
                <span className={`status s-${st.replace(' ', '-')}`}><span aria-hidden="true">{MARK[st]} </span>{st.charAt(0).toUpperCase() + st.slice(1)}</span>
                {screen ? <button className="small" onClick={() => go(screen)}>Open station</button> : <span className="muted small">Full game</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <button className="primary" onClick={next}>Next step</button>
    </section>
  );
}
