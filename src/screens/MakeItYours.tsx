import type { Look } from '../App';

export function MakeItYours({ look, setLook, entered, next }: { look: Look; setLook: (l: Look) => void; entered: boolean; next: () => void }) {
  const set = (patch: Partial<Look>) => setLook({ ...look, ...patch });
  return (
    <section>
      <p className="kicker">{entered ? 'Settings' : 'Step 2 of 4 · Settings'}</p>
      <h2>Make it yours</h2>
      <div className="card settings">
        <fieldset>
          <legend>Background</legend>
          <label><input type="radio" name="bg" checked={look.background === 'classroom'} onChange={() => set({ background: 'classroom' })} /> Classroom</label>
          <label><input type="radio" name="bg" checked={look.background === 'space'} onChange={() => set({ background: 'space' })} /> Space station</label>
        </fieldset>
        <label className="field">Company name <input value={look.company} placeholder="Maple Market" onChange={e => set({ company: e.target.value })} /></label>
        <label><input type="checkbox" checked={look.reducedMotion} onChange={e => set({ reducedMotion: e.target.checked })} /> Reduced motion (the same information appears as text)</label>
      </div>
      <button className="primary" onClick={next}>{entered ? 'Back to lessons' : 'Continue'}</button>
    </section>
  );
}
