import { useState } from 'react';

/** Step 1: the student enters their name. */
export function Welcome({ company, onContinue }: { company: string; onContinue: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <section className="card mission entry">
      <p className="kicker">Step 1 of 4 · Your name</p>
      <h2>Welcome to the AI Team Challenge</h2>
      <p className="intro">You will run {company}'s AI customer-service team.</p>
      <form onSubmit={e => { e.preventDefault(); if (name.trim()) onContinue(name.trim()); }}>
        <label htmlFor="student-name">Your name</label>
        <input id="student-name" autoFocus required value={name} onChange={e => setName(e.target.value)} />
        <button type="submit" className="primary">Continue</button>
      </form>
    </section>
  );
}

/** Step 3: choose the student view or the instructor view. */
export function ChooseView({ name, onPick }: { name: string; onPick: (view: 'student' | 'instructor') => void }) {
  return (
    <section className="card mission entry">
      <p className="kicker">Step 3 of 4 · Choose a view</p>
      <h2>Hi {name}. Choose a view.</h2>
      <div className="choices">
        <button className="choice" onClick={() => onPick('student')}>
          <span className="num" aria-hidden="true">1</span>
          <span><strong>Student</strong><br />Play the lessons and explain your choices.</span>
        </button>
        <button className="choice" onClick={() => onPick('instructor')}>
          <span className="num" aria-hidden="true">2</span>
          <span><strong>Instructor</strong><br />See choices, results, explanations, rubric rows, and the knowledge check.</span>
        </button>
      </div>
    </section>
  );
}
