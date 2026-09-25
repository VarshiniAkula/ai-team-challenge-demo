import type { RunResult } from '../engine';

// The game layer: every move gets a stamp, and the meters are derived from the moves on record.
export type Stamp = 'Good move' | 'Safe but slow' | 'Wrong call' | 'Not allowed';
export interface Move { slot: string; stamp: Stamp; run: RunResult }
export interface Meters { happiness: number; minutes: number; budgetCents: number; trust: number; streak: number }
export interface Pop { happiness: number; minutes: number; cents: number; trust: number }

export const STAMP_CLS: Record<Stamp, string> = { 'Good move': 'good', 'Safe but slow': 'slow', 'Wrong call': 'wrong', 'Not allowed': 'bad' };
const HAPPY: Record<Stamp, number> = { 'Good move': 20, 'Safe but slow': 10, 'Wrong call': -10, 'Not allowed': 0 };
export const BUDGET_CENTS = 3600; // SPEC.md B.1 episode work budget

/** Hearts start half full, budget starts at $36, trust only drops when a rule is broken. */
export function meters(moves: Move[]): Meters {
  let happiness = 50, trust = 100, minutes = 0, cents = 0, streak = 0;
  for (const m of moves) {
    minutes += m.run.minutes; cents += m.run.cents;
    happiness = Math.max(0, Math.min(100, happiness + HAPPY[m.stamp]));
    if (m.stamp === 'Not allowed') trust = Math.max(0, trust - 25);
    streak = m.stamp === 'Good move' ? streak + 1 : 0;
  }
  return { happiness, minutes, budgetCents: BUDGET_CENTS - cents, trust, streak };
}

/** A retry replaces the move in the same slot, so the meters follow the current record. */
export function record(moves: Move[], move: Move): Move[] {
  const i = moves.findIndex(m => m.slot === move.slot);
  return i < 0 ? [...moves, move] : moves.map((m, j) => (j === i ? move : m));
}
