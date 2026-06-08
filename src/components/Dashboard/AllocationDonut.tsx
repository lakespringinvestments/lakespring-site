"use client";

import type { Portfolio } from "../../../types/portfolio";

const TICKER_COLORS: Record<string, string> = {
  TSLA:  "#CC0000",
  NVDA:  "#76B900",
  PLTR:  "#101113",
  AMZN:  "#FF9900",
  GOOGL: "#A8B0B6",
};

const FALLBACK_RAMP = ["#034147", "#1D9E75", "#5DCAA5", "#347278", "#9FE1CB"];
const EXCLUDED = new Set(["BTC", "SOL", "ASML"]);

function pickColor(ticker: string, idx: number) {
  return TICKER_COLORS[ticker] ?? FALLBACK_RAMP[idx % FALLBACK_RAMP.length];
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function AllocationDonut({ portfolio }: { portfolio: Portfolio }) {
  // Generous viewBox so labels never get cut — ring centred inside
  const VW = 300, VH = 300;
  const cx = VW / 2, cy = VH / 2;
  const outerR = 108, innerR = 66;

  const filtered = portfolio.holdings.filter((h) => !EXCLUDED.has(h.ticker));
  const totalWeight = filtered.reduce((sum, h) => sum + h.weight, 0);
  const normalised = filtered.map((h) => ({
    ...h,
    weight: totalWeight > 0 ? (h.weight / totalWeight) * 100 : 0,
  }));

  const sorted = [...normalised].sort((a, b) => b.weight - a.weight);
  const top = sorted.slice(0, 5);
  const otherWeight = sorted.slice(5).reduce((s, h) => s + h.weight, 0);
  const rawSegs = otherWeight > 0
    ? [...top, { ticker: "Other", name: "Other", weight: otherWeight, price: 0, dayChangePct: 0 }]
    : top;

  const segTotal = rawSegs.reduce((s, seg) => s + seg.weight, 0);
  const segments = rawSegs.map((seg, i) => ({
    ...seg,
    weight: i === rawSegs.length - 1
      ? 100 - rawSegs.slice(0, -1).reduce((s, s2) => s + Math.round((s2.weight / segTotal) * 1000) / 10, 0)
      : Math.round((seg.weight / segTotal) * 1000) / 10,
  }));

  let startAngle = 0;
  const slices = segments.map((seg, i) => {
    const angle = (seg.weight / 100) * 360;
    const endAngle = startAngle + angle;
    const midAngle = startAngle + angle / 2;

    const s  = polarToCartesian(cx, cy, outerR, startAngle);
    const e  = polarToCartesian(cx, cy, outerR, endAngle);
    const si = polarToCartesian(cx, cy, innerR, startAngle);
    const ei = polarToCartesian(cx, cy, innerR, endAngle);
    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${s.x} ${s.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${e.x} ${e.y}`,
      `L ${ei.x} ${ei.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${si.x} ${si.y}`,
      "Z",
    ].join(" ");

    // Leader line from ring edge outward
    const p1 = polarToCartesian(cx, cy, outerR + 5, midAngle);
    const p2 = polarToCartesian(cx, cy, outerR + 18, midAngle);
    // Label sits beyond the line end
    const labelR = outerR + 30;
    const lp = polarToCartesian(cx, cy, labelR, midAngle);
    const anchor = (lp.x < cx - 3 ? "end" : lp.x > cx + 3 ? "start" : "middle") as "end" | "start" | "middle";
    const color = pickColor(seg.ticker, i);

    const result = { seg, path, color, p1, p2, lp, anchor };
    startAngle = endAngle;
    return result;
  });

  const totalDisplay = portfolio.totalValue > 0
    ? "$" + (portfolio.totalValue / 1000).toFixed(0) + "K"
    : "—";

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6">
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-2">
        Allocation
      </h2>
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full"
          style={{ maxHeight: "360px" }}
          aria-label="Portfolio allocation donut chart"
        >
          {slices.map(({ seg, path, color, p1, p2, lp, anchor }) => (
            <g key={seg.ticker}>
              <path d={path} fill={color} stroke="white" strokeWidth="2" />
              {/* Leader line */}
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="1.2" />
              {/* Ticker label */}
              <text
                x={lp.x}
                y={lp.y - 6}
                textAnchor={anchor}
                dominantBaseline="auto"
                fontSize="11"
                fontWeight="700"
                fill={color === "#101113" ? "#444" : color}
                fontFamily="system-ui, sans-serif"
              >
                {seg.ticker}
              </text>
              {/* Percentage */}
              <text
                x={lp.x}
                y={lp.y + 7}
                textAnchor={anchor}
                dominantBaseline="auto"
                fontSize="10"
                fill="#888"
                fontFamily="system-ui, sans-serif"
              >
                {seg.weight.toFixed(0)}%
              </text>
            </g>
          ))}
          {/* Centre text */}
          <text x={cx} y={cy - 12} textAnchor="middle" fontSize="11" fill="#bbb" fontFamily="system-ui">total</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="20" fontWeight="700" fill="#034147" fontFamily="system-ui">{totalDisplay}</text>
        </svg>
      </div>
    </section>
  );
}
