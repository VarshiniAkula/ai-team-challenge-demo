import type { StationId, Stations } from '../App';
import type { RunResult } from '../engine';
import { FREEDOM_LABEL, FREEDOMS, dollars } from '../engine';
import { KNOWLEDGE_CHECK, RUBRIC } from '../content';

const ROWS: { id: StationId; title: string; rubric: string[] }[] = [
  { id: 'l5', title: 'L5 · Choose AI freedom', rubric: [RUBRIC.l5, RUBRIC.sponsor] },
  { id: 'l6', title: 'L6 · Bring in a person', rubric: [RUBRIC.l6] },
  { id: 'l8', title: 'L8 · Set boundaries', rubric: [RUBRIC.l8] },
];
const line = (r: RunResult) => `${r.resultLine} Customer wait ${r.minutes} game minutes, work cost ${dollars(r.cents)}, person time ${r.personMinutes} minutes. Outcome recorded: ${r.outcome}.`;

export function InstructorView({ name, stations, runs }: { name: string; stations: Stations; runs: (RunResult | null)[] }) {
  return (
    <section className="instructor">
      <h2>Instructor view · student: {name || 'no name entered'}</h2>
      <p className="notice">Instructional view, not a login. Anyone using this copy can open it. Explanations stay marked <em>unreviewed</em> until an instructor reads them. Nothing here is proof of identity.</p>
      {ROWS.map(row => {
        const s = stations[row.id];
        const results = row.id === 'l5' && s?.runs ? FREEDOMS.filter(f => s.runs![f]).map(f => `Under "${FREEDOM_LABEL[f]}": ${line(s.runs![f]!)}`) : s ? [line(s.result)] : [];
        return (
          <article className="card" key={row.id}>
            <h3>{row.title}</h3>
            {!s ? <p className="muted">Not played yet.</p> : (
              <dl className="facts">
                <dt>Student's choice</dt><dd>{s.choice}</dd>
                <dt>Engine's recorded result</dt><dd>{results.map((t, i) => <p key={i}>{t}</p>)}</dd>
                <dt>Student's explanation</dt>
                <dd>{s.explanation ? <q>{s.explanation}</q> : <span className="muted">Not written yet.</span>} <span className="badge">{s.saved ? 'unreviewed' : 'not saved'}</span></dd>
                <dt>Feeds rubric row</dt><dd>{row.rubric.join(' · ')}</dd>
                <dt>Events, in plain words</dt><dd><ol className="events">{s.result.events.map((e, i) => <li key={i}>{e}</li>)}</ol></dd>
              </dl>
            )}
          </article>
        );
      })}
      <article className="card">
        <h3>Recorded requests this session</h3>
        <ul className="lines">{runs.map((r, i) => <li key={i}>{r ? <><strong>{r.caseId}</strong> · {r.request} {line(r)}</> : <><strong>C11</strong> · not started.</>}</li>)}</ul>
      </article>
      <article className="card">
        <h3>Knowledge check: nine questions with the model explanations revealed</h3>
        <ol className="kc">
          {KNOWLEDGE_CHECK.map(q => <li key={q.objective}><strong>{q.question}</strong> <span className="badge">{q.objective}</span><br /><span className="muted">Model explanation:</span> {q.answer}</li>)}
        </ol>
        <p className="muted">Show the model explanation only after the student answers. Never grade by keywords alone.</p>
      </article>
    </section>
  );
}
