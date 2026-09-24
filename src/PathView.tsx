import { Fragment, useEffect, useRef, useState } from 'react';
import type { PathNode } from './engine';
import { dollars } from './engine';

const ICON: Record<PathNode['kind'], string> = { request: '✉', ai: '✦', check: '⌕', person: '☺', action: '$', message: '✉', blocked: '⊘', waiting: '…' };
const TICK_MS = 700;

interface Props { nodes: PathNode[]; playKey: number; reducedMotion: boolean; caption: string; onDone?: () => void }

/** A small dot travels node to node. Under Reduced motion the finished path and the step list show at once. */
export function PathView({ nodes, playKey, reducedMotion, caption, onDone }: Props) {
  const [reached, setReached] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reducedMotion) { setReached(nodes.length); doneRef.current?.(); return; }
    setReached(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1; setReached(i);
      if (i >= nodes.length) { window.clearInterval(id); doneRef.current?.(); }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playKey, reducedMotion, nodes.length]);

  const status = (i: number) => (i < reached ? 'done' : i === reached ? 'active' : 'ahead');
  const word = (n: PathNode, s: string) => (s === 'ahead' ? 'not yet' : n.kind === 'blocked' ? 'blocked' : n.kind === 'waiting' ? 'waiting' : s === 'done' ? 'done' : 'now');
  const cost = (n: PathNode) => (n.minutes || n.cents ? ` ${n.minutes} min, ${dollars(n.cents)} of work.` : '');

  return (
    <div className="pathview">
      <p className="caption">{caption}</p>
      <div className="path" role="list" aria-label={caption}>
        {nodes.map((n, i) => (
          <Fragment key={i}>
            {i > 0 && <div className={`conn ${status(i) === 'active' ? 'moving' : ''}`} aria-hidden="true"><span className="dot" /></div>}
            <div role="listitem" className={`node ${n.kind} ${status(i)}`}>
              <span className="icon" aria-hidden="true">{status(i) === 'done' && !['blocked', 'waiting'].includes(n.kind) ? '✓' : ICON[n.kind]}</span>
              <span className="label">{n.label}</span>
              {n.together && <span className="tag">together</span>}
              <span className="sr-only">, {word(n, status(i))}</span>
            </div>
          </Fragment>
        ))}
      </div>
      {!reducedMotion && <button className="link" aria-expanded={showSteps} onClick={() => setShowSteps(v => !v)}>{showSteps ? 'Hide steps' : 'Show steps'}</button>}
      {(showSteps || reducedMotion) && (
        <ol className="steps">
          {nodes.map((n, i) => <li key={i}><strong>{n.label}</strong>{n.together ? ' (at the same time as the step before)' : ''}: {n.detail}{cost(n)}</li>)}
        </ol>
      )}
    </div>
  );
}
