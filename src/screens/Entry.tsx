import { useState } from 'react';

/** Step 1: the student enters their name. It labels their evidence; it is not a login. */
export function Welcome({ company, onContinue }: { company: string; onContinue: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <section className="card mission entry">
      <p className="kicker">Step 1 of 4 · Your name</p>
      <h2>Welcome to the AI Team Challenge</h2>
      <p className="intro">You will run {company}'s AI customer-service team: decide what the AI may do alone, when a person steps in, and where the boundaries are. First, tell us who you are.</p>
      <form onSubmit={e => { e.preventDefault(); if (name.trim()) onContinue(name.trim()); }}>
        <label htmlFor="student-name">Your name</label>
        <input id="student-name" autoFocus required value={name} onChange={e => setName(e.target.value)} placeholder="For example, Priya" />
        <p className="hint">Your name labels your choices and explanations for the instructor. This is not a login.</p>
        <button type="submit" className="primary">Continue</button>
      </form>
    </section>
  );
}

/** Step 2: choose the student view or the instructor view. */
export function ChooseView({ name, onPick }: { name: string; onPick: (view: 'student' | 'instructor') => void }) {
  return (
    <section className="card mission entry">
      <p className="kicker">Step 3 of 4 · Choose a view</p>
      <h2>Hi {name}. How do you want to use this?</h2>
      <div className="choices">
        <button className="choice" onClick={() => onPick('student')}>
          <span className="num" aria-hidden="true">1</span>
          <span><strong>Student view</strong><br />Play the lessons: make a choice, watch what happens, and explain why.</span>
        </button>
        <button className="choice" onClick={() => onPick('instructor')}>
          <span className="num" aria-hidden="true">2</span>
          <span><strong>Instructor view</strong><br />See the student's choices, recorded results, explanations, rubric rows, and the knowledge check. An instructional view, not a login.</span>
        </button>
      </div>
      <p className="hint">You can switch views any time with the Instructor view button in the header.</p>
    </section>
  );
}
