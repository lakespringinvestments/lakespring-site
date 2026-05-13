import type { Portfolio } from "../../../types/portfolio";

const RAMP = [
  "#034147", // teal-600
  "#1B5A60",
  "#347278",
  "#1D9E75", // sage-500
  "#5DCAA5",
  "#9FE1CB",
  "#C5DCDE",
  "#E1F5EE",
  "#A8B0B6", // overflow
];

export default function AllocationDonut({ portfolio }: { portfolio: Portfolio }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // Build segments: top 5 holdings + "Other"
  const sorted = [...portfolio.holdings].sort((a, b) => b.weight - a.weight);
  const top = sorted.slice(0, 5);
  const otherWeight = sorted.slice(5).reduce((sum, h) => sum + h.weight, 0);
  const segments = otherWeight > 0
    ? [...top, { ticker: "Other", name: "Other", weight: otherWeight, price: 0, dayChangePct: 0 }]
    : top;

  let offset = 0;
  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-8">
      <h2 className="text-sm uppercase tracking-wide text-ink-500 mb-6">
        Allocation
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <svg viewBox="0 0 160 160" className="w-40 h-40 flex-shrink-0">
          {segments.map((seg, i) => {
            const length = (seg.weight / 100) * circumference;
            const circle = (
              <circle
                key={seg.ticker}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={RAMP[i] ?? "#A8B0B6"}
                strokeWidth="22"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 80 80)"
              />
            );
            offset += length;
            return circle;
          })}
        </svg>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm w-full">
          {segments.map((seg, i) => (
            <div key={seg.ticker} className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: RAMP[i] ?? "#A8B0B6" }}
              />
              <span className="text-ink-700 font-medium">{seg.ticker}</span>
              <span className="ml-auto text-ink-500 tabular-nums">
                {seg.weight.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
