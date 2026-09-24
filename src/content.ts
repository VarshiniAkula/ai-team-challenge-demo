// Screen copy taken from SPEC.md sections 1, 2, 3, 6, 8 and Appendix E.

export const LESSONS = [
  { id: 'L1', name: 'Choose a team layout', term: 'architecture', does: 'Compare five ways to organize the team' },
  { id: 'L2', name: 'Save the work', term: 'state and checkpoints', does: 'Change a route, save progress, and resume' },
  { id: 'L3', name: 'Remember the right thing', term: 'memory', does: 'Check five kinds of memory and fix stale information' },
  { id: 'L4', name: 'Handle a problem', term: 'control flow', does: 'Work through a timeout, retry, fallback, cancellation, and recovery' },
  { id: 'L5', name: 'Choose AI freedom', term: 'autonomy', does: 'Set different levels of AI freedom for different actions', screen: 'l5' },
  { id: 'L6', name: 'Bring in a person', term: 'human-in-the-loop control', does: 'Approve, reject, revise, and escalate cases', screen: 'l6' },
  { id: 'L7', name: 'Give responsibility', term: 'ownership and accountability', does: 'Set roles, inspect the record, and hand off an incident' },
  { id: 'L8', name: 'Set boundaries', term: 'trust and permissions', does: 'Block an unsafe request and set a safe permission', screen: 'l8' },
  { id: 'L9', name: 'Keep helping', term: 'reliability', does: 'Use retries, another source, limits, and a safe backup' },
] as const;

export const START = {
  heading: 'A customer needs help',
  story: "Maya's $150 order arrived late. She wants a refund.",
  question: 'Who should decide this refund?',
  choices: [
    { route: 'ai_first', label: 'Let the AI check the easy parts first.', verdict: '✓ Good call: facts first, then the right person.',
      message: 'The AI can gather the facts, but a $150 refund needs an authorized person.',
      why: 'The AI helper checked the order, the risk, and the current shop rule. $150 is above the $100 routine limit, so the refund waited for the manager, who may approve up to $500.' },
    { route: 'support_first', label: 'Ask a support teammate to review it.', verdict: '✓ Safe, but slower: one extra review.',
      message: 'The manager can approve this amount. The customer will wait a little longer.',
      why: 'A support teammate may approve up to $100. $150 is above that, so the case went on to the manager. One more review means more waiting and more person time.' },
    { route: 'manager_first', label: 'Send it straight to a manager.', verdict: '✓ Safe, but it wastes review time.',
      message: 'You sent it to the manager before checking the order. That is safe, but it may waste review time.',
      why: 'The manager had no order facts to decide on, so the checks ran afterward and a second review followed. Nothing unsafe happened, but the manager spent time twice.' },
  ],
} as const;

export const WORDS = {
  autonomy: { screen: 'What can AI do alone?', term: 'Autonomy', meaning: 'How much decision-making is given to AI' },
  approval: { screen: 'Ask someone to check', term: 'Approval, part of human-in-the-loop control', meaning: 'A person checks one proposed action before it happens' },
  permissions: { screen: 'Who can see or do this?', term: 'Permissions, the trust boundary', meaning: 'Rules for access and actions' },
  accountability: { screen: 'Who takes responsibility?', term: 'Accountability', meaning: 'A named person or team owns the result' },
};

export const RUBRIC = {
  l5: 'AI freedom (LO-05): 10 points',
  l6: 'Bringing in a person (LO-06): 10 points',
  l8: 'Boundaries (LO-08): 10 points',
  sponsor: 'Business interpretation and sponsor discussion: 10 points',
};

export const KNOWLEDGE_CHECK = [
  { objective: 'LO-01', question: 'Which steps can happen together before a refund?', answer: 'Order and risk checks are independent and can run together; the refund waits for both and for approval.' },
  { objective: 'LO-02', question: 'What should return when the browser closes during a review?', answer: 'The facts, current step, pending review, versions, limits used, and links to actions already taken; no second review request.' },
  { objective: 'LO-03', question: "Can an old customer conversation change today's shop rule?", answer: 'No; check the current rule and the right customer scope; old or differently scoped memory cannot authorize anything.' },
  { objective: 'LO-04', question: 'When should a team stop retrying?', answer: 'After the bounded retry and second-source policy is used up, change the plan if allowed, otherwise stop or hand off with progress saved.' },
  { objective: 'LO-05', question: 'Which action should AI handle alone?', answer: 'Fact gathering and low-risk routine actions within the limit; a high-value request stops at the authority boundary.' },
  { objective: 'LO-06', question: 'What does a reviewer need to see?', answer: 'The proposed action, customer and amount, facts, rule, uncertainty, authority, and consequences; a changed proposal needs a fresh review.' },
  { objective: 'LO-07', question: 'Who still owns a failed automated action?', answer: 'The named service owner, until a handoff is accepted and the next step is clear.' },
  { objective: 'LO-08', question: 'Can a customer message grant access?', answer: 'No; permissions and customer scope are enforced by the system; the message is untrusted input.' },
  { objective: 'LO-09', question: 'How do you avoid paying twice after a lost response?', answer: 'Check the transaction record and reuse the same operation key; never make a second payment.' },
];
