const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/** Render the year's monthly model totals without requiring client-side JavaScript. */
export default function paintslamChart(entries) {
  const totals = Array(12).fill(0);
  for (const entry of entries) {
    // Snapshot dates are UTC; keep month boundaries independent of the build timezone.
    const month = new Date(entry.completedDate).getUTCMonth();
    totals[month] += entry.modelCount;
  }

  const maximum = Math.max(1, ...totals);
  const bars = MONTHS.map((month, index) => {
    const count = totals[index];
    return `<li class="paintslam-chart__month" aria-label="${month}: ${count} miniatures">
      <div class="paintslam-chart__track" aria-hidden="true">
        <div class="paintslam-chart__bar" style="height: ${(count / maximum) * 100}%">
          <span class="paintslam-chart__count">${count}</span>
        </div>
      </div>
      <span class="paintslam-chart__label" aria-hidden="true">${month.slice(0, 3)}</span>
    </li>`;
  }).join('');

  return `<figure class="paintslam-chart" aria-labelledby="paintslam-chart-title">
    <figcaption id="paintslam-chart-title">Miniatures painted per month</figcaption>
    <ol class="paintslam-chart__months" role="list">${bars}</ol>
  </figure>`;
}
