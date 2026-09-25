import { useState } from 'react';
import type { Play } from '../App';
import type { StartRoute } from '../engine';
import { runStart } from '../engine';
import { PathView } from '../PathView';
import { StampBox } from '../game/StampBox';
import type { Stamp } from '../game/ledger';
import { START } from '../content';

export function StartScreen({ look, next, onMove, streak, onPlayed }: Play & { onPlayed: () => void }) {
  const [route, setRoute] = useState<StartRoute | null>(null);
  const [finished, setFinished] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const choice = START.choices.find(c => c.route === route);
  const result = route ? runStart(route) : null;
  const stamp: Stamp = route === 'ai_first' ? 'Good move' : 'Safe but slow';
  const pick = (r: StartRoute) => { setRoute(r); setFinished(false); setPlayKey(k => k + 1); };

  return (
    <section className="card mission">
      <p className="kicker">Warm-up · {START.heading}</p>
      <blockquote className="story">“{START.story}”</blockquote>
      <p className="question" id="start-q">{START.question}</p>
      <div className="choices" role="group" aria-labelledby="start-q">
        {START.choices.map((c, i) => (
          <button key={c.route} className={`choice ${route === c.route ? 'picked' : ''}`} aria-pressed={route === c.route} onClick={() => pick(c.route)}>
            <span className="num" aria-hidden="true">{i + 1}</span>{c.label}
          </button>
        ))}
      </div>
      {result && choice && (
        <>
          <PathView run={result} playKey={playKey} reducedMotion={look.reducedMotion} onDone={() => { setFinished(true); onPlayed(); onMove({ slot: 'start', stamp, run: result }); }} />
          {finished && (
            <StampBox stamp={stamp} verdict={choice.message} streak={streak}
              why={`${choice.why} Customer wait ${result.minutes} game minutes, person time ${result.personMinutes} minutes. Words from class: autonomy, approval.`}>
              <button className="primary" onClick={next}>Next step</button>
              <button onClick={() => { setRoute(null); setFinished(false); }}>Try another choice</button>
            </StampBox>
          )}
        </>
      )}
    </section>
  );
}
