"use client";

import { useEffect, useRef } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { PortfolioView } from "./types";

const FP_COLORS: Record<string, string> = {
  TSLA: "#CC0000", NVDA: "#76B900", PLTR: "#101113", AMZN: "#FF9900", GOOGL: "#A8B0B6",
};
const SD_COLORS: Record<string, string> = {
  MRVL: "#0057B8", NBIS: "#C8F000", LLY: "#C0392B", ASML: "#1E3A8A", BE: "#00A86B", SMCI: "#8A9BB0",
};
const FP_TICKERS = ["TSLA","NVDA","PLTR","AMZN","GOOGL"];
const SD_TICKERS = ["MRVL","NBIS","LLY","ASML","BE","SMCI"];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildPath(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
  const s  = polarToCartesian(cx, cy, outerR, startAngle);
  const e  = polarToCartesian(cx, cy, outerR, endAngle);
  const si = polarToCartesian(cx, cy, innerR, startAngle);
  const ei = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
  return [
    `M ${s.x} ${s.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${e.x} ${e.y}`,
    `L ${ei.x} ${ei.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${si.x} ${si.y}`,
    "Z",
  ].join(" ");
}

interface Props { portfolio: Portfolio; view: PortfolioView; }

export default function AllocationDonut({ portfolio, view }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number | null>(null);
  const prevView = useRef<PortfolioView | null>(null);

  const VW = 300, VH = 300, cx = 150, cy = 150, outerR = 108, innerR = 66;

  const tickers = view === "first" ? FP_TICKERS : SD_TICKERS;
  const colors  = view === "first" ? FP_COLORS  : SD_COLORS;

  const relevant = portfolio.holdings.filter(h => tickers.includes(h.ticker));
  const totalWeight = relevant.reduce((s, h) => s + h.weight, 0);

  const rawSegs = relevant.length > 0
    ? relevant.map((h, i) => ({
        ticker: h.ticker,
        weight: totalWeight > 0 ? (h.weight / totalWeight) * 100 : 100 / relevant.length,
        color: colors[h.ticker] ?? "#A8B0B6",
      }))
    : tickers.map((t, i) => ({
        ticker: t,
        weight: 100 / tickers.length,
        color: colors[t] ?? "#A8B0B6",
      }));

  const segTotal = rawSegs.reduce((s, seg) => s + seg.weight, 0);
  const segments = rawSegs.map((seg, i) => ({
    ...seg,
    weight: i === rawSegs.length - 1
      ? 100 - rawSegs.slice(0,-1).reduce((s,s2) => s + Math.round((s2.weight/segTotal)*1000)/10, 0)
      : Math.round((seg.weight/segTotal)*1000)/10,
  }));

  const totalDisplay = portfolio.totalValue > 0
    ? "$" + (portfolio.totalValue / 1000).toFixed(0) + "K" : "—";

  // Build full segment data (angles at 100% progress)
  let cumulAngle = 0;
  const sliceData = segments.map(seg => {
    const start = cumulAngle;
    const sweep = (seg.weight / 100) * 360;
    const end = start + sweep;
    const mid = start + sweep / 2;
    const lp = polarToCartesian(cx, cy, outerR + 30, mid);
    const p1 = polarToCartesian(cx, cy, outerR + 5, mid);
    const p2 = polarToCartesian(cx, cy, outerR + 18, mid);
    const anchor = (lp.x < cx - 3 ? "end" : lp.x > cx + 3 ? "start" : "middle") as "end"|"start"|"middle";
    cumulAngle = end;
    return { ...seg, start, end, mid, lp, p1, p2, anchor };
  });

  useEffect(() => {
    // Cancel any running animation
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const DURATION = 700; // ms
    const startTime = performance.now();
    const isFirstRender = prevView.current === null;
    prevView.current = view;

    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

    function frame(now: number) {
      const svg = svgRef.current;
      if (!svg) return;
      const raw = Math.min((now - startTime) / DURATION, 1);
      const progress = easeOutCubic(raw);

      // Clear and redraw paths
      const paths = svg.querySelectorAll(".donut-slice");
      const lines = svg.querySelectorAll(".donut-line");
      const labels = svg.querySelectorAll(".donut-label");

      let cumul = 0;
      sliceData.forEach((seg, i) => {
        const sweep = (seg.weight / 100) * 360 * progress;
        if (sweep <= 0) return;
        const end = cumul + sweep;
        const path = paths[i] as SVGPathElement;
        if (path) {
          path.setAttribute("d", buildPath(cx, cy, outerR, innerR, cumul, end));
        }

        // Show labels only when nearly done
        const line = lines[i] as SVGLineElement;
        const labelGroup = labels[i] as SVGGElement;
        const opacity = progress > 0.85 ? ((progress - 0.85) / 0.15).toString() : "0";
        if (line) line.style.opacity = opacity;
        if (labelGroup) labelGroup.style.opacity = opacity;

        cumul = end;
      });

      if (raw < 1) {
        animRef.current = requestAnimationFrame(frame);
      }
    }

    animRef.current = requestAnimationFrame(frame);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [view, segments.map(s => s.ticker + s.weight).join(",")]);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6">
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-2">Allocation</h2>
      <div className="flex justify-center">
        <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: "320px" }}>
          {/* Slices — drawn by animation */}
          {sliceData.map((seg) => (
            <path key={seg.ticker} className="donut-slice"
              d={buildPath(cx, cy, outerR, innerR, seg.start, seg.start)}
              fill={seg.color} stroke="white" strokeWidth="2" />
          ))}
          {/* Leader lines — faded in at end */}
          {sliceData.map((seg) => (
            <line key={`line-${seg.ticker}`} className="donut-line"
              x1={seg.p1.x} y1={seg.p1.y} x2={seg.p2.x} y2={seg.p2.y}
              stroke={seg.color} strokeWidth="1.2" style={{ opacity: 0 }} />
          ))}
          {/* Labels — faded in at end */}
          {sliceData.map((seg) => (
            <g key={`label-${seg.ticker}`} className="donut-label" style={{ opacity: 0 }}>
              <text x={seg.lp.x} y={seg.lp.y - 6} textAnchor={seg.anchor}
                fontSize="11" fontWeight="700"
                fill={seg.color === "#101113" ? "#444" : seg.color === "#C8F000" ? "#7A9000" : seg.color}
                fontFamily="system-ui, sans-serif">
                {seg.ticker}
              </text>
              <text x={seg.lp.x} y={seg.lp.y + 7} textAnchor={seg.anchor}
                fontSize="10" fill="#999" fontFamily="system-ui, sans-serif">
                {seg.weight.toFixed(0)}%
              </text>
            </g>
          ))}
          {/* Centre */}
          <text x={cx} y={cy - 12} textAnchor="middle" fontSize="11" fill="#bbb" fontFamily="system-ui">total</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="20" fontWeight="700" fill="#034147" fontFamily="system-ui">{totalDisplay}</text>
        </svg>
      </div>
    </section>
  );
}
