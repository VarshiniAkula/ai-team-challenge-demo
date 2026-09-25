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
import { MeterBar } from './game/MeterBar';
import type { Move, Pop } from './game/ledger';
import { meters, record } from './game/ledger';
import { ShopRules } from './ui';

export type Screen = 'welcome' | 'settings' | 'view' | 'map' | 'start' | 'l5' | 'l6' | 'l8' | 'results' | 'instructor';
export type Role = 'student' | 'instructor';
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
/** What every playable screen gets: the look, a way to record a move, the current streak, and the next screen. */
export interface Play { look: Look; onMove: (m: Move) => void; streak: number; next: () => void }

// Students never see the Instructor view; instructors get it first, plus every student screen.
const NAV: Record<Role, [Screen, string][]> = {
  student: [['map', 'Lessons'], ['results', 'Results'], ['settings', 'Settings']],
  instructor: [['instructor', 'Instructor view'], ['map', 'Lessons'], ['results', 'Results'], ['settings', 'Settings']],
};

export const statusOf = (s?: StationState) => (!s ? 'not started' : s.saved ? 'demonstrated' : 'practiced');

/** The three requests the Results screen reports on. The $40 request always runs under the guided default. */
export function recordedRuns(stations: Stations): (RunResult | null)[] {
  return [runRefund('C01', 'exception_based'), stations.l6?.result ?? runRefund('C03', 'exception_based', []), stations.l8?.result ?? null];
}

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role | null>(null); // chosen at the view step
  const [warmup, setWarmup] = useState(false);
  const [stations, setStations] = useState<Stations>({});
  const [moves, setMoves] = useState<Move[]>([]);
  const [pop, setPop] = useState<Pop | null>(null);
  const [popKey, setPopKey] = useState(0);
  const [look, setLook] = useState<Look>({ background: 'classroom', company: 'Maple Market', reducedMotion: prefersReduced() });
  const view: Look = { ...look, company: look.company.trim() || 'Maple Market' };
  const m = meters(moves);
  const go = (s: Screen) => { setScreen(s); window.scrollTo({ top: 0 }); };
  // Settings continues the entry flow the first time; afterwards every screen returns to the lesson list.
  const next = () => go(screen === 'settings' && !role ? 'view' : 'map');
  const onMove = (move: Move) => {
    const after = meters(record(moves, move));
    const delta = { happiness: after.happiness - m.happiness, minutes: after.minutes - m.minutes, cents: after.budgetCents - m.budgetCents, trust: after.trust - m.trust };
    setMoves(record(moves, move));
    if (Object.values(delta).some(v => v !== 0)) { setPop(delta); setPopKey(k => k + 1); }
  };
  const play: Play = { look: view, onMove, streak: m.streak, next };
  const station = (id: StationId) => ({ ...play, state: stations[id], update: (s: StationState) => setStations(p => ({ ...p, [id]: s })) });

  const body = () => {
    switch (screen) {
      case 'welcome': return <Welcome company={view.company} onContinue={n => { setName(n); go('settings'); }} />;
      case 'settings': return <MakeItYours look={look} setLook={setLook} entered={!!role} next={next} />;
      case 'view': return <ChooseView name={name} onPick={v => { setRole(v); go(v === 'instructor' ? 'instructor' : 'map'); }} />;
      case 'instructor': return <InstructorView name={name} stations={stations} runs={recordedRuns(stations)} />;
      case 'map': return <LearningMap stations={stations} warmup={warmup} go={go} />;
      case 'start': return <StartScreen {...play} onPlayed={() => setWarmup(true)} />;
      case 'l5': return <StationL5 {...station('l5')} />;
      case 'l6': return <StationL6 {...station('l6')} />;
      case 'l8': return <StationL8 {...station('l8')} />;
      case 'results': return <ResultsScreen stations={stations} name={name} next={next} />;
    }
  };

  return (
    <div className={`app ${look.background} ${look.reducedMotion ? 'reduced' : ''}`}>
      <a className="skip" href="#main">Skip to content</a>
      {name && <MeterBar m={m} pop={pop} popKey={popKey} />}
      <main id="main" tabIndex={-1}>{body()}</main>
      {role && (
        <nav className="dock" aria-label="Menu">
          {NAV[role].map(([s, label]) => (
            <button key={s} className={`nav ${screen === s ? 'current' : ''}`} aria-current={screen === s ? 'page' : undefined} onClick={() => go(s)}>{label}</button>
          ))}
          <ShopRules />
        </nav>
      )}
    </div>
  );
}
