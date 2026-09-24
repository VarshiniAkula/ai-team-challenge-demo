import { useState } from 'react';
import type { Look } from '../App';
import type { StartRoute } from '../engine';
import { runStart } from '../engine';
import { PathView } from '../PathView';
import { Label, ShopRules } from '../ui';
import { START } from '../content';

export function StartScreen({ look, next, onPlayed }: { look: Look; next: () => void; onPlayed: () => void }) {
  const [route, setRoute] = useState<StartRoute | null>(null);
  const [finished, setFinished] = useState(false);
  const [why, setWhy] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const choice = START.choices.find(c => c.route === route);
  const result = route ? runStart(route) : null;
  const pick = (r: StartRoute) => { setRoute(r); setFinished(false); setWhy(false); setPlayKey(k => k + 1); };

  return (
    <section className="card mission">
      <p className="kicker">Warm-up mission</p>
      <h2>{START.heading}</h2>
      <p className="intro">You run {look.company}'s AI customer-service team. Each round: read the situation, pick a move, watch what happens, then read why. Aim for the right answer, little waiting, low cost, and a clear owner.</p>
      <Label n={1} t="The situation" />
      <blockquote className="story">“{START.story}”</blockquote>
      <Label n={2} t="Your move" />
      <p className="question" id="start-q">{START.question}</p>
      <p className="rule-line">Shop rules: the AI helper may complete refunds of $100 or less on its own. A support teammate may approve up to $100, a manager up to $500.</p>
      <div className="choices" role="group" aria-labelledby="start-q">
        {START.choices.map((c, i) => (
          <button key={c.route} className={`choice ${route === c.route ? 'picked' : ''}`} aria-pressed={route === c.route} onClick={() => pick(c.route)}>
            <span className="num" aria-hidden="true">{i + 1}</span>{c.label}
          </button>
        ))}
      </div>
      {result && choice && (
        <>
          <Label n={3} t="What happened" />
          <PathView run={result} playKey={playKey} reducedMotion={look.reducedMotion} caption="Watch the request travel through the team" onDone={() => { setFinished(true); onPlayed(); }} />
          {finished && (
            <div className="after" role="status">
              <p className="verdict">{choice.verdict}</p>
              <p className="consequence">{choice.message}</p>
              <div className="actions">
                <button className="primary" onClick={next}>Next step</button>
                <button aria-expanded={why} onClick={() => setWhy(v => !v)}>Why?</button>
                <button onClick={() => { setRoute(null); setFinished(false); setWhy(false); }}>Try another choice</button>
              </div>
              {why && <><Label n={4} t="Why" /><p className="why">{choice.why}</p></>}
            </div>
          )}
        </>
      )}
      <ShopRules />
    </section>
  );
}
