import { useState } from 'react';
import type { Freedom, ReviewDecision, RunResult } from './engine';
import { runRefund } from './engine';
import { Welcome, ChooseView } from './screens/Entry';
import { StartScreen } from './screens/StartScreen';
import { LearningMap } from './screens/LearningMap';
import { StationL5, StationL6, StationL8 } from './screens/Stations';
import { ResultsScreen } from './screens/ResultsScreen';
import { InstructorView } from './screens/InstructorView';
import { MakeItYours } from './screens/MakeItYours';

export type Screen = 'welcome' | 'settings' | 'view' | 'map' | 'start' | 'l5' | 'l6' | 'l8' | 'results';
export type StationId = 'l5' | 'l6' | 'l8';
export interface StationState {
  choice: string;
  result: RunResult;
  runs?: Partial<Record<Freedom, RunResult>>; // L5 keeps both settings
  decisions?: ReviewDecision[]; // L6 keeps the review decisions
  explanation: string;
  saved: boolean;
}
export type Stations = Partial<Record<StationId, StationState>>;
export interface Look { background: 'classroom' | 'space'; company: string; reducedMotion: boolean }

const NAV: [Screen, string][] = [['map', 'Lessons'], ['results', 'Results'], ['settings', 'Settings']];

export const statusOf = (s?: StationState) => (!s ? 'not started' : s.saved ? 'demonstrated' : 'practiced');

/** The three requests the Results screen reports on. The $40 request always runs under the guided default. */
export function recordedRuns(stations: Stations): (RunResult | null)[] {
  return [runRefund('C01', 'exception_based'), stations.l6?.result ?? runRefund('C03', 'exception_based', []), stations.l8?.result ?? null];
}

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [name, setName] = useState('');
  const [entered, setEntered] = useState(false); // true once a view has been chosen
  const [instructor, setInstructor] = useState(false);
  const [warmup, setWarmup] = useState(false);
  const [stations, setStations] = useState<Stations>({});
  const [look, setLook] = useState<Look>({ background: 'classroom', company: 'Maple Market', reducedMotion: prefersReduced() });
  const view: Look = { ...look, company: look.company.trim() || 'Maple Market' };
  const go = (s: Screen) => { setInstructor(false); setScreen(s); window.scrollTo({ top: 0 }); };
  // Settings continues the entry flow the first time; afterwards every screen returns to the lesson list.
  const next = () => go(screen === 'settings' && !entered ? 'view' : 'map');
  const station = (id: StationId) => ({ look: view, state: stations[id], next, update: (s: StationState) => setStations(p => ({ ...p, [id]: s })) });

  const body = () => {
    switch (screen) {
      case 'welcome': return <Welcome company={view.company} onContinue={n => { setName(n); go('settings'); }} />;
      case 'settings': return <MakeItYours look={look} setLook={setLook} stations={stations} entered={entered} next={next} />;
      case 'view': return <ChooseView name={name} onPick={v => { setEntered(true); setScreen('map'); setInstructor(v === 'instructor'); }} />;
      case 'map': return <LearningMap stations={stations} warmup={warmup} go={go} />;
      case 'start': return <StartScreen look={view} next={next} onPlayed={() => setWarmup(true)} />;
      case 'l5': return <StationL5 {...station('l5')} />;
      case 'l6': return <StationL6 {...station('l6')} />;
      case 'l8': return <StationL8 {...station('l8')} />;
      case 'results': return <ResultsScreen stations={stations} look={view} name={name} next={next} />;
    }
  };

  return (
    <div className={`app ${look.background} ${look.reducedMotion ? 'reduced' : ''}`}>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <h1>AI Team Challenge <span className="company">· {view.company}</span>{name && <span className="company"> · {name}</span>}</h1>
        {name && (
          <nav aria-label="Screens">
            {NAV.map(([s, label]) => (
              <button key={s} className={`nav ${screen === s && !instructor ? 'current' : ''}`} aria-current={screen === s && !instructor ? 'page' : undefined} onClick={() => go(s)}>{label}</button>
            ))}
            <button className={`nav toggle ${instructor ? 'on' : ''}`} aria-pressed={instructor} onClick={() => setInstructor(v => !v)}>Instructor view</button>
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1}>{instructor ? <InstructorView name={name} stations={stations} runs={recordedRuns(stations)} /> : body()}</main>
    </div>
  );
}
