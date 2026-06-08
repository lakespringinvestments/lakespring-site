"use client";

import type { Portfolio } from "../../../types/portfolio";
import type { PortfolioView } from "./types";

const FP_COLORS: Record<string, string> = {
  TSLA:  "#CC0000",
  NVDA:  "#76B900",
  PLTR:  "#101113",
  AMZN:  "#FF9900",
  GOOGL: "#A8B0B6",
};

const SD_COLORS: Record<string, string> = {
  MRVL:  "#0057B8",
  NBIS:  "#00857A",
  LLY:   "#CC0099",
  MU:    "#0071CE",
  ASML:  "#034147",
  BE:    "#00A86B",
  TSM:   "#E8003D",
};

const FALLBACK_RAMP = ["#034147","#1D9E75","#5DCAA5","#347278","#9FE1CB","#A8B0B6"];

const FP_TICKERS  = ["TSLA","NVDA","PLTR","AMZN","GOOGL"];
const SD_TICKERS  = ["MRVL","NBIS","LLY","MU","ASML","BE","TSM"];

function pickColor(ticker: string, view: PortfolioView, idx: number) {
  const map = view === "first" ? FP_COLORS : SD_COLORS;
  return map[ticker] ?? FALLBACK_RAMP[idx % FALLBACK_RAMP.length];
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

interface Props {
  portfolio: Portfolio;
  view: PortfolioView;
}

export default function AllocationDonut({ portfolio, view }: Props) {
  const VW = 300, VH = 300;
  const cx = VW / 2, cy = VH / 2;
  const outerR = 108, innerR = 66;

  const tickers = view === "first" ? FP_TICKERS : SD_TICKERS;

  // Build segments from holdings that match the current view
  const relevant = portfolio.holdings.filter(h => tickers.includes(h.ticker));
  const totalWeight = relevant.reduce((s, h) => s + h.weight, 0);

  // If no live data for SD tickers, show equal-weight placeholder
  const segments = relevant.length > 0
    ? relevant.map((h, i) => ({
        ticker: h.ticker,
        weight: totalWeight > 0 ? (h.weight / totalWeight) * 100 : 100 / relevant.length,
        color: pickColor(h.ticker, view, i),
      }))
    : tickers.map((t, i) => ({
        ticker: t,
        weight: 100 / tickers.length,
        color: pickColor(t, view, i),
      }));

  // Normalise to 100
  const segTotal = segments.reduce((s, seg) => s + seg.weight, 0);
  const normed = segments.map((seg, i) => ({
    ...seg,
    weight: i === segments.length - 1
      ? 100 - segments.slice(0,-1).reduce((s,s2) => s + Math.round((s2.weight/segTotal)*1000)/10, 0)
      : Math.round((seg.weight/segTotal)*1000)/10,
  }));

  let startAngle = 0;
  const slices = normed.map((seg) => {
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

    const p1 = polarToCartesian(cx, cy, outerR + 5, midAngle);
    const p2 = polarToCartesian(cx, cy, outerR + 18, midAngle);
    const lp = polarToCartesian(cx, cy, outerR + 30, midAngle);
    const anchor = (lp.x < cx - 3 ? "end" : lp.x > cx + 3 ? "start" : "middle") as "end"|"start"|"middle";

    const result = { seg, path, p1, p2, lp, anchor };
    startAngle = endAngle;
    return result;
  });

  const totalDisplay = portfolio.totalValue > 0
    ? "$" + (portfolio.totalValue / 1000).toFixed(0) + "K" : "—";

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6">
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-2">
        Allocation
      </h2>
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: "320px" }}>
          {slices.map(({ seg, path, p1, p2, lp, anchor }) => (
            <g key={seg.ticker}>
              <path d={path} fill={seg.color} stroke="white" strokeWidth="2" />
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={seg.color} strokeWidth="1.2" />
              <text x={lp.x} y={lp.y - 6} textAnchor={anchor} dominantBaseline="auto"
                fontSize="11" fontWeight="700"
                fill={seg.color === "#101113" ? "#444" : seg.color}
                fontFamily="system-ui, sans-serif">
                {seg.ticker}
              </text>
              <text x={lp.x} y={lp.y + 7} textAnchor={anchor} dominantBaseline="auto"
                fontSize="10" fill="#999" fontFamily="system-ui, sans-serif">
                {seg.weight.toFixed(0)}%
              </text>
            </g>
          ))}
          <text x={cx} y={cy - 12} textAnchor="middle" fontSize="11" fill="#bbb" fontFamily="system-ui">total</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="20" fontWeight="700" fill="#034147" fontFamily="system-ui">{totalDisplay}</text>
        </svg>
      </div>
    </section>
  );
}
