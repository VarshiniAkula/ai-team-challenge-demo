import type { Screen, Stations } from '../App';
import { statusOf } from '../App';
import { LESSONS } from '../content';

const MARK = { 'not started': '○', practiced: '◐', demonstrated: '●' };
const STATION: Record<string, number> = { l5: 1, l6: 2, l8: 3 };
const SUGGEST: Record<string, string> = { start: 'Play the warm-up mission', l5: 'Start station 1: Choose AI freedom', l6: 'Start station 2: Bring in a person', l8: 'Start station 3: Set boundaries', results: 'See your results' };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function LearningMap({ stations, warmup, go }: { stations: Stations; warmup: boolean; go: (s: Screen) => void }) {
  const order: Screen[] = ['start', 'l5', 'l6', 'l8'];
  const suggested = order.find(s => (s === 'start' ? !warmup : !stations[s as 'l5' | 'l6' | 'l8']?.saved)) ?? 'results';
  return (
    <section>
      <p className="kicker">Step 4 of 4 · Choose a lesson</p>
      <h2>Choose a lesson</h2>
      <ul className="lessons">
        <li className={`lesson warm ${warmup ? 'demonstrated' : ''}`}>
          <span className="ltag">Warm-up</span>
          <button className="face" onClick={() => go('start')}>
            <span className="name">A customer needs help</span>
            <span className="term">Maya's $150 refund</span>
          </button>
          <div className="foot">
            <span className={`status ${warmup ? 's-demonstrated' : ''}`}><span aria-hidden="true">{warmup ? '● ' : '○ '}</span>{warmup ? 'Played' : 'Not started'}</span>
            <button className="small" onClick={() => go('start')}>Open warm-up</button>
          </div>
        </li>
        {LESSONS.map(l => {
          const screen = 'screen' in l ? l.screen : undefined;
          const st = statusOf(screen ? stations[screen] : undefined);
          const face = <><span className="name">{l.name}</span><span className="term">{cap(l.term)}</span></>;
          return (
            <li key={l.id} className={`lesson ${st.replace(' ', '-')} ${screen ? '' : 'locked'}`}>
              {screen && <span className="ltag">Station {STATION[screen]}</span>}
              {screen ? <button className="face" onClick={() => go(screen)}>{face}</button> : <div className="face">{face}</div>}
              <div className="foot">
                <span className={`status s-${st.replace(' ', '-')}`}><span aria-hidden="true">{MARK[st]} </span>{cap(st)}</span>
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
