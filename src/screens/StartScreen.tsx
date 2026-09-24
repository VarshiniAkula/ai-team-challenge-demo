import { useState } from 'react';
import type { Look } from '../App';
import type { StartRoute } from '../engine';
import { runStart } from '../engine';
import { PathView } from '../PathView';
import { START } from '../content';

export function StartScreen({ look, next }: { look: Look; next: () => void }) {
  const [route, setRoute] = useState<StartRoute | null>(null);
  const [finished, setFinished] = useState(false);
  const [why, setWhy] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const choice = START.choices.find(c => c.route === route);
  const result = route ? runStart(route) : null;
  const pick = (r: StartRoute) => { setRoute(r); setFinished(false); setWhy(false); setPlayKey(k => k + 1); };

  return (
    <section className="card mission">
      <p className="kicker">A small mission</p>
      <h2>{START.heading}</h2>
      <p className="intro">You run {look.company}'s AI customer-service team. Make a choice, watch the path, read why, and try again.</p>
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
          <PathView nodes={result.nodes} playKey={playKey} reducedMotion={look.reducedMotion} caption="The path this request took" onDone={() => setFinished(true)} />
          {finished && (
            <div className="after" role="status">
              <p className="consequence">{choice.message}</p>
              <div className="actions">
                <button className="primary" onClick={next}>Next step</button>
                <button aria-expanded={why} onClick={() => setWhy(v => !v)}>Why?</button>
                <button onClick={() => { setRoute(null); setFinished(false); setWhy(false); }}>Try another choice</button>
              </div>
              {why && <p className="why">{choice.why} Customer wait: {result.minutes} game minutes. Person time: {result.personMinutes} minutes.</p>}
            </div>
          )}
        </>
      )}
    </section>
  );
}
