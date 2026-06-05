import type { Portfolio } from "../../../types/portfolio";

// Brand colours per ticker
const TICKER_COLORS: Record<string, string> = {
  TSLA:  "#CC0000",   // Tesla red
  NVDA:  "#76B900",   // Nvidia green
  PLTR:  "#101113",   // Palantir black
  ASML:  "#0071C5",   // ASML blue
  AMZN:  "#FF9900",   // Amazon orange
  GOOGL: "#A8B0B6",   // Google — neutral grey on donut (logo is multicolour)
};

const FALLBACK_RAMP = [
  "#034147", "#1D9E75", "#5DCAA5", "#347278", "#9FE1CB", "#A8B0B6",
];

// Tickers to exclude from this page
const EXCLUDED = new Set(["BTC", "SOL"]);

function pickColor(ticker: string, idx: number) {
  return TICKER_COLORS[ticker] ?? FALLBACK_RAMP[idx % FALLBACK_RAMP.length];
}

export default function AllocationDonut({ portfolio }: { portfolio: Portfolio }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // Filter out excluded tickers, then re-normalise weights
  const filtered = portfolio.holdings.filter((h) => !EXCLUDED.has(h.ticker));
  const totalWeight = filtered.reduce((sum, h) => sum + h.weight, 0);
  const normalised = filtered.map((h) => ({
    ...h,
    weight: totalWeight > 0 ? (h.weight / totalWeight) * 100 : 0,
  }));

  // Top 5 + Other — clamp weights so segments sum to exactly 100
  const sorted = [...normalised].sort((a, b) => b.weight - a.weight);
  const top = sorted.slice(0, 5);
  const otherWeight = sorted.slice(5).reduce((sum, h) => sum + h.weight, 0);
  const rawSegments = otherWeight > 0
    ? [...top, { ticker: "Other", name: "Other", weight: otherWeight, price: 0, dayChangePct: 0 }]
    : top;
  // Normalise so segments sum to exactly 100 — prevents gap from float rounding
  const segTotal = rawSegments.reduce((s, seg) => s + seg.weight, 0);
  const segments = rawSegments.map((seg, i) => ({
    ...seg,
    weight: i === rawSegments.length - 1
      ? 100 - rawSegments.slice(0, -1).reduce((s, s2) => s + Math.round((s2.weight / segTotal) * 100 * 10) / 10, 0)
      : Math.round((seg.weight / segTotal) * 100 * 10) / 10,
  }));

  let offset = 0;

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-8">
      <h2 className="text-sm uppercase tracking-wide text-ink-500 mb-6">
        Allocation
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <svg viewBox="0 0 160 160" className="w-40 h-40 flex-shrink-0">
          {segments.map((seg, i) => {
            const color = pickColor(seg.ticker, i);
            const length = (seg.weight / 100) * circumference;
            const circle = (
              <circle
                key={seg.ticker}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={color}
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
                style={{ background: pickColor(seg.ticker, i) }}
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
