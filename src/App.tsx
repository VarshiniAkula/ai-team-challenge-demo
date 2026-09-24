import { useState } from 'react';
import type { Freedom, ReviewDecision, RunResult } from './engine';
import { runRefund } from './engine';
import { StartScreen } from './screens/StartScreen';
import { LearningMap } from './screens/LearningMap';
import { StationL5, StationL6, StationL8 } from './screens/Stations';
import { ResultsScreen } from './screens/ResultsScreen';
import { InstructorView } from './screens/InstructorView';
import { MakeItYours } from './screens/MakeItYours';

export type Screen = 'start' | 'map' | 'l5' | 'l6' | 'l8' | 'results' | 'yours';
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

const ORDER: Screen[] = ['start', 'map', 'l5', 'l6', 'l8', 'results', 'yours'];
const NAV: [Screen, string][] = [['start', 'Start'], ['map', 'Learning map'], ['results', 'Results'], ['yours', 'Make it yours']];

export const statusOf = (s?: StationState) => (!s ? 'not started' : s.saved ? 'demonstrated' : 'practiced');

/** The three requests the Results screen reports on. The $40 request always runs under the guided default. */
export function recordedRuns(stations: Stations): (RunResult | null)[] {
  return [runRefund('C01', 'exception_based'), stations.l6?.result ?? runRefund('C03', 'exception_based', []), stations.l8?.result ?? null];
}

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [instructor, setInstructor] = useState(false);
  const [stations, setStations] = useState<Stations>({});
  const [look, setLook] = useState<Look>({ background: 'classroom', company: 'Maple Market', reducedMotion: prefersReduced() });
  const view: Look = { ...look, company: look.company.trim() || 'Maple Market' };
  const go = (s: Screen) => { setInstructor(false); setScreen(s); window.scrollTo({ top: 0 }); };
  const next = () => go(ORDER[Math.min(ORDER.indexOf(screen) + 1, ORDER.length - 1)]);
  const station = (id: StationId) => ({ look: view, state: stations[id], next, update: (s: StationState) => setStations(p => ({ ...p, [id]: s })) });

  const body = () => {
    switch (screen) {
      case 'start': return <StartScreen look={view} next={next} />;
      case 'map': return <LearningMap stations={stations} go={go} next={next} />;
      case 'l5': return <StationL5 {...station('l5')} />;
      case 'l6': return <StationL6 {...station('l6')} />;
      case 'l8': return <StationL8 {...station('l8')} />;
      case 'results': return <ResultsScreen stations={stations} look={view} next={next} />;
      case 'yours': return <MakeItYours look={look} setLook={setLook} stations={stations} />;
    }
  };

  return (
    <div className={`app ${look.background} ${look.reducedMotion ? 'reduced' : ''}`}>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <h1>AI Team Challenge <span className="company">· {view.company}</span></h1>
        <nav aria-label="Screens">
          {NAV.map(([s, label]) => (
            <button key={s} className={`nav ${screen === s && !instructor ? 'current' : ''}`} aria-current={screen === s && !instructor ? 'page' : undefined} onClick={() => go(s)}>{label}</button>
          ))}
          <button className={`nav toggle ${instructor ? 'on' : ''}`} aria-pressed={instructor} onClick={() => setInstructor(v => !v)}>Instructor view</button>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>{instructor ? <InstructorView stations={stations} runs={recordedRuns(stations)} /> : body()}</main>
    </div>
  );
}
