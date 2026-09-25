import type { Stations } from '../App';
import { recordedRuns } from '../App';
import { dollars, measures } from '../engine';
import { WORDS } from '../content';

const LABELS = ['A $40 order, eligible', "Maya's $150 order", "A message asking for another customer's order"];

export function ResultsScreen({ stations, name, next }: { stations: Stations; name: string; next: () => void }) {
  const runs = recordedRuns(stations);
  const [c01, c03, c11] = runs;
  const m = measures(runs);
  const rows: [string, string, string][] = [
    ['Correct answers', `${m.correct} of ${m.total}`, 'Did the team give the right result?'],
    ['Customer wait', `${m.minutes} game minutes`, 'How long did the business work take?'],
    ['Work cost', dollars(m.cents), 'How much operating work did the team use?'],
    ['Person time', `${m.personMinutes} min, ${m.reviews} review${m.reviews === 1 ? '' : 's'}`, 'How much review time did people spend?'],
    ['Responsibility', m.open ? `Owner named. ${m.open} next step${m.open === 1 ? '' : 's'} open` : 'Owner and next step clear', 'Is the owner and next step clear?'],
  ];
  const hitl = c03?.outcome === 'refunded' ? `The manager approved Maya's refund, and it happened once.`
    : c03?.outcome === 'denied' ? 'The manager rejected the proposal, so no refund happened and Maya got a clear answer.'
    : 'The review request is still waiting for the manager. Nothing happens until a person decides.';
  const trust = !c11 ? 'Not played yet: open the Set boundaries station.'
    : c11.outcome === 'refunded' ? "The message could not open another customer's order. The read was denied before it started, and the customer's own refund still completed."
    : "The AI asked the customer for context. Nothing unsafe happened, but the customer's own request is still waiting.";
  return (
    <section>
      <h2>Results for {name}</h2>
      <p className="verdict">Mission result: {m.correct} of {m.total} requests handled right{m.open ? `, ${m.open} still open` : ''}.</p>
      <dl className="measures">
        {rows.map(([name, value, q]) => <div key={name}><dt>{name}</dt><dd className="value">{value}</dd><dd className="muted">{q}</dd></div>)}
      </dl>
      <h3>One line per request</h3>
      <ul className="lines">
        {runs.map((r, i) => (
          <li key={i}><strong>{LABELS[i]}.</strong> {r ? <>{r.resultLine} <span className="muted">{r.minutes} game minutes, {dollars(r.cents)} of work, {r.personMinutes} person minutes. {r.responsible}</span></> : <span className="muted">Not started yet. Open the Set boundaries station.</span>}</li>
        ))}
      </ul>
      <div className="card words-panel">
        <h3>Words from class</h3>
        <dl>
          <dt>{WORDS.autonomy.screen} → <em>{WORDS.autonomy.term}</em></dt>
          <dd>The AI helper completed the $40 refund alone in {c01?.minutes} minutes. Maya's $150 refund stopped at the $100 routine limit and went to a person. Freedom is set action by action.</dd>
          <dt>{WORDS.approval.screen} → <em>Human-in-the-loop control</em></dt>
          <dd>{hitl} An approval is tied to one proposal, its amount, and its facts.</dd>
          <dt>{WORDS.permissions.screen} → <em>Trust boundary</em></dt>
          <dd>{trust} Text is a request; permission comes from the rules and the customer's scope.</dd>
          <dt>{WORDS.accountability.screen} → <em>{WORDS.accountability.term}</em></dt>
          <dd>You, the service owner, stayed responsible the whole time. Every request names who did each step, under what authority, and what comes next.</dd>
        </dl>
      </div>
      <button className="primary" onClick={next}>Back to lessons</button>
    </section>
  );
}
