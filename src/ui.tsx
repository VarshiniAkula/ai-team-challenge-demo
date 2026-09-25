/** Shop rules as a pinned chip that expands on tap. */
export function ShopRules() {
  return (
    <details className="chip">
      <summary>Shop rules</summary>
      <div className="panel">
        <ul>
          <li>The AI helper may complete a refund of <strong>$100 or less</strong> on its own, when the freedom setting allows it.</li>
          <li>A support teammate may approve up to <strong>$100</strong>, a manager up to <strong>$500</strong>, Finance up to <strong>$2,000</strong>.</li>
          <li>Every refund needs a checked order, no chargeback, a request within 30 days, and the current shop rule.</li>
          <li>A customer message can never open another customer's order or skip a required check.</li>
          <li>Time is counted in game minutes on the story's clock, not real time.</li>
        </ul>
      </div>
    </details>
  );
}
