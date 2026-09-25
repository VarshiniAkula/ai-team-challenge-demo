import { dollars } from '../engine';
import type { Meters, Pop } from './ledger';

const heart = (h: number, i: number) => (h >= (i + 1) * 20 ? 'full' : h >= i * 20 + 10 ? 'half' : 'empty');

/** The only thing at the top of the screen: hearts, clock, coins, trust, and a number pop when a move changes them. */
export function MeterBar({ m, pop, popKey }: { m: Meters; pop: Pop | null; popKey: number }) {
  const P = ({ v, fmt, tone }: { v: number; fmt: (n: number) => string; tone: string }) =>
    v ? <span key={popKey} className={`pop ${tone}`} aria-hidden="true">{v > 0 ? '+' : '−'}{fmt(Math.abs(v))}</span> : null;
  return (
    <div className="meters" role="status" aria-label={`Customer happiness ${m.happiness} of 100, ${m.minutes} game minutes, ${dollars(m.budgetCents)} left, trust ${m.trust} percent`}>
      <span className="meter" title="Customer happiness">
        {[0, 1, 2, 3, 4].map(i => <span key={i} className={`heart ${heart(m.happiness, i)}`} aria-hidden="true">♥</span>)}
        {pop && <P v={pop.happiness} fmt={n => `${n}`} tone={pop.happiness > 0 ? 'up' : 'down'} />}
      </span>
      <span className="meter" title="Time"><span aria-hidden="true">🕒</span> {m.minutes} min{pop && <P v={pop.minutes} fmt={n => `${n} min`} tone="flat" />}</span>
      <span className="meter" title="Budget"><span aria-hidden="true">🪙</span> {dollars(m.budgetCents)}{pop && <P v={pop.cents} fmt={dollars} tone="flat" />}</span>
      <span className="meter" title="Trust"><span aria-hidden="true">🛡</span> {m.trust}%{pop && <P v={pop.trust} fmt={n => `${n}`} tone="down" />}</span>
    </div>
  );
}
