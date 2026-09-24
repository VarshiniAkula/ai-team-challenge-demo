import { useState } from 'react';
import type { Look, Stations } from '../App';
import { recordedRuns } from '../App';
import { dollars, measures } from '../engine';

export function MakeItYours({ look, setLook, stations }: { look: Look; setLook: (l: Look) => void; stations: Stations }) {
  const now = measures(recordedRuns(stations));
  const [before] = useState(now);
  const [changed, setChanged] = useState<string[]>([]);
  const set = (patch: Partial<Look>) => { setLook({ ...look, ...patch }); setChanged(c => Array.from(new Set([...c, ...Object.keys(patch)]))); };
  const summary = (m: typeof now) => `Correct answers ${m.correct} of ${m.total} · Customer wait ${m.minutes} game minutes · Work cost ${dollars(m.cents)} · Person time ${m.personMinutes} min`;
  return (
    <section>
      <h2>Make it yours</h2>
      <p className="lead">Change the look. The lessons, the rules, and the results stay exactly the same. That is how the student assignment works.</p>
      <div className="card settings">
        <fieldset>
          <legend>Background</legend>
          <label><input type="radio" name="bg" checked={look.background === 'classroom'} onChange={() => set({ background: 'classroom' })} /> Classroom</label>
          <label><input type="radio" name="bg" checked={look.background === 'space'} onChange={() => set({ background: 'space' })} /> Space station</label>
        </fieldset>
        <label className="field">Company name <input value={look.company} placeholder="Maple Market" onChange={e => set({ company: e.target.value })} /></label>
        <label><input type="checkbox" checked={look.reducedMotion} onChange={e => set({ reducedMotion: e.target.checked })} /> Reduced motion (the same information appears as text)</label>
      </div>
      <div className="card check" aria-live="polite">
        <h3>Results check</h3>
        <p><strong>When you opened this screen:</strong> {summary(before)}</p>
        <p><strong>Now, after changing {changed.length} setting{changed.length === 1 ? '' : 's'}:</strong> {summary(now)}</p>
        <p className="muted">The look is not an input to the game's rules, so these two lines always match. Open Results to see the same numbers under the new look.</p>
      </div>
    </section>
  );
}
