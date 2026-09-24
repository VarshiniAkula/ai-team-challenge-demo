import { useState } from 'react';
import type { Screen, Stations } from '../App';
import { statusOf } from '../App';
import { LESSONS } from '../content';

const MARK = { 'not started': '○', practiced: '◐', demonstrated: '●' };
const STATION: Record<string, number> = { l5: 1, l6: 2, l8: 3 };
const SUGGEST: Record<string, string> = { start: 'Play the warm-up mission', l5: 'Start station 1: Choose AI freedom', l6: 'Start station 2: Bring in a person', l8: 'Start station 3: Set boundaries', results: 'See your results' };

export function LearningMap({ stations, warmup, go }: { stations: Stations; warmup: boolean; go: (s: Screen) => void }) {
  const [revealed, setRevealed] = useState<string | null>(null);
  const order: Screen[] = ['start', 'l5', 'l6', 'l8'];
  const suggested = order.find(s => (s === 'start' ? !warmup : !stations[s as 'l5' | 'l6' | 'l8']?.saved)) ?? 'results';
  return (
    <section>
      <p className="kicker">Step 3 of 3 · Choose a lesson</p>
      <h2>Choose a lesson</h2>
      <p className="lead">Start with the warm-up, then play the three open stations in order, about two minutes each. A finished lesson brings you back here with its dot filled in. The other six lessons are in the full game. Hover, tap, or focus a card for the words from class.</p>
      <ul className="lessons">
        <li className={`lesson warm ${warmup ? 'demonstrated' : ''}`}>
          <span className="chip">Warm-up</span>
          <button className="face" onClick={() => go('start')}>
            <span className="name">A customer needs help</span>
            <span className="does">Maya's $150 refund: one choice, one path, one explanation.</span>
          </button>
          <div className="foot">
            <span className={`status ${warmup ? 's-demonstrated' : ''}`}><span aria-hidden="true">{warmup ? '● ' : '○ '}</span>{warmup ? 'Played' : 'Not started'}</span>
            <button className="small" onClick={() => go('start')}>Open warm-up</button>
          </div>
        </li>
        {LESSONS.map(l => {
          const screen = 'screen' in l ? l.screen : undefined;
          const st = statusOf(screen ? stations[screen] : undefined);
          return (
            <li key={l.id} className={`lesson ${st.replace(' ', '-')} ${screen ? '' : 'locked'} ${revealed === l.id ? 'revealed' : ''}`}>
              {screen && <span className="chip">Station {STATION[screen]}</span>}
              <button className="face" aria-describedby={`${l.id}-term`} onClick={() => (screen ? go(screen) : setRevealed(r => (r === l.id ? null : l.id)))}>
                <span className="name">{l.name}</span>
                <span className="does">{l.does}</span>
                <span className="term" id={`${l.id}-term`}>Words from class: <em>{l.term}</em></span>
              </button>
              <div className="foot">
                <span className={`status s-${st.replace(' ', '-')}`}><span aria-hidden="true">{MARK[st]} </span>{st.charAt(0).toUpperCase() + st.slice(1)}</span>
                {screen ? <button className="small" onClick={() => go(screen)}>Open station {STATION[screen]}</button> : <span className="muted small">Full game only</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <button className="primary" onClick={() => go(suggested)}>{SUGGEST[suggested]}</button>
    </section>
  );
}
