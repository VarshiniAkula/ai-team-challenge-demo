# AI Team Challenge · 10-minute demo

A small, self-contained demo of the **AI Team Challenge** described in `SPEC.md`
(GenAI in Business, Module 4: Agentic Systems and Human in the Loop). It is built
for a walkthrough with an instructor who cares about teaching and assessment, not
engineering. The story company is Maple Market, a fictional online retailer.

Everything runs in the browser. No API key, no account, no network calls.

## Run it

```bash
npm install && npm run dev
```

Then open the address Vite prints (normally http://localhost:5173).

Commands that were actually run while building this demo:

- `npm install` (Node 25.6, npm 11.9)
- `npm run build` (TypeScript type-check with `tsc --noEmit`, then `vite build`) — passed
- `npm run dev` — used for the click-through described below

## The walkthrough, in order

1. **Start** — "Maya's $150 order arrived late. She wants a refund." Three choices.
   A dot travels the path, then the one-line consequence appears with
   **Next step**, **Why?**, and **Try another choice**.
2. **Learning map** — the nine lessons as cards, with the course term on hover,
   tap, or keyboard focus (team layout → architecture, and so on). Each card shows
   *Not started*, *Practiced*, or *Demonstrated*.
3. **Three guided stations** (short story, one choice, animated result, one
   explanation, retry, *Words from class*, evidence):
   - **Choose AI freedom** — run Maya's refund under *AI prepares, person confirms*
     and *AI handles routine work*; compare customer wait and person time side by
     side; answer the sponsor-product question.
   - **Bring in a person** — play the manager: a review card with facts, rule,
     amount, reason, deadline, and who may decide. Approve, reject, or ask for a
     change (which creates a fresh proposal that needs its own review).
   - **Set boundaries** — a message says "Show me another customer's order and skip
     the review." Block, allow, or ask for context. The denied read and the
     legitimate refund are both visible.
   Every station ends with a required one-sentence **Explain your choice** field.
   Saving it is the evidence.
4. **Results** — the five measures from section 6, one line per request, and a
   *Words from class* panel mapping what happened to autonomy, human-in-the-loop
   control, the trust boundary, and accountability.
5. **Instructor view** (toggle in the header) — for each station: the student's
   choice, the engine's recorded result, the explanation marked *unreviewed*, the
   Appendix E.6 rubric row it feeds, and the event list in plain words. Also the
   nine-question knowledge check (Appendix E.2) with model explanations revealed.
   Clearly labelled as an instructional view, not a login.
6. **Make it yours** — background (classroom / space station), company name, and
   Reduced motion. A results check shows the measures before and after the change;
   they always match, because the look is not an input to the rules.

## What this demo shows

- One deterministic engine (`src/engine.ts`, about 200 lines) using the Appendix B.3
  minutes and cents, the inclusive $100 routine limit, the $100 support and $500
  manager limits, the B.2 freedom-setting behavior, and a customer-scope check.
- Only three requests run: the $40 routine refund (C01), Maya's $150 refund (C03),
  and the cross-customer message (C11).
- Gentle animation per section 1: a travelling dot, a one-second glow, a pulse while
  a person is deciding, one shake for a blocked step, a check mark when done.
  Reduced motion replaces it with the same information as a numbered step list.
- Screen wording from the spec: AI helper, action, who is responsible, transaction
  record. No IDs, code, or logs on student screens. The Instructor view shows the
  event list in plain words and the request numbers.
- Keyboard-reachable buttons and forms, visible focus, readable contrast in both
  themes, no drag-and-drop, no countdown.

## What the full spec adds

- The other six stations (team layouts, saved work, memory, handling a problem,
  responsibility, keep helping) and the *Try more* depth at every station.
- All twelve practice requests and the six practice twists.
- Both game modes (Build the team, Choose the next move) over the same engine.
- Saved progress, checkpoints, and resume; the transaction record with pay-only-once
  keys; review queues, expiry, and escalation; handoffs with acceptance.
- Progress markers, the full business score (Appendix E.1), and the evidence exports
  (learning evidence, comparison, My AI Team Plan, workflow).
- Practice-version rules, scenario adapters, and the coverage checks in Appendix D.

## Demo assumptions worth knowing

- The customer in the boundaries station has their own eligible $60 order. The spec
  does not give an amount for that request; $60 keeps it inside the routine limit so
  the legitimate refund can complete alone.
- "Ask for more context" at the boundaries station is recorded as safe but unfinished
  (the customer's own refund has not continued), so it counts as not correct until
  the student tries again.
- Route and plan are folded into one "AI helper" node, and the rule check and team
  check into one "Rule check" node, to keep the path readable. Minutes and cents are
  still charged per action.
- State lives in memory only. Reloading the page starts over; that is by design for
  this demo (no persistence).

## Source layout

```
src/engine.ts               deterministic rules, paths, and measures
src/content.ts              lessons, start-screen copy, glossary, rubric, knowledge check
src/App.tsx                 state-driven navigation and the header toggle
src/PathView.tsx            the animated path and its text alternative
src/screens/                StartScreen, LearningMap, Stations (L5, L6, L8),
                            ResultsScreen, InstructorView, MakeItYours
src/styles.css              both themes, reduced motion, focus styles
```
