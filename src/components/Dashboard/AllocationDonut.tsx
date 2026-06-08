"use client";

import { useEffect, useRef } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { PortfolioView } from "./types";

const FP_COLORS: Record<string, string> = {
  TSLA: "#CC0000", NVDA: "#76B900", PLTR: "#101113", AMZN: "#FF9900", GOOGL: "#A8B0B6",
};
const SD_COLORS: Record<string, string> = {
  MRVL: "#0057B8", NBIS: "#C8F000", LLY: "#C0392B", ASML: "#1E3A8A", BE: "#00A86B", TSM: "#E8003D",
};
const FP_TICKERS = ["TSLA","NVDA","PLTR","AMZN","GOOGL"];
const SD_TICKERS = ["MRVL","NBIS","LLY","ASML","BE","TSM"];

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

  // Larger viewBox — ring fills more space since no leader lines needed
  const VW = 320, VH = 320, cx = 160, cy = 160;
  const outerR = 118, innerR = 72;
  // Ticker labels sit just outside the ring
  const tickerR = outerR + 14;
  // Percentages sit in the middle of the ring band
  const pctR = (outerR + innerR) / 2;

  const tickers = view === "first" ? FP_TICKERS : SD_TICKERS;
  const colors  = view === "first" ? FP_COLORS  : SD_COLORS;

  const relevant = portfolio.holdings.filter(h => tickers.includes(h.ticker));
  const totalWeight = relevant.reduce((s, h) => s + h.weight, 0);

  const rawSegs = relevant.length > 0
    ? relevant.map((h) => ({
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

  let cumulAngle = 0;
  const sliceData = segments.map(seg => {
    const start = cumulAngle;
    const sweep = (seg.weight / 100) * 360;
    const end = start + sweep;
    const mid = start + sweep / 2;

    // Ticker label: just outside ring
    const tp = polarToCartesian(cx, cy, tickerR, mid);
    const tickerAnchor = (tp.x < cx - 4 ? "end" : tp.x > cx + 4 ? "start" : "middle") as "end"|"start"|"middle";

    // Percentage: middle of ring band — only show if slice is wide enough
    const pp = polarToCartesian(cx, cy, pctR, mid);

    cumulAngle = end;
    return { ...seg, start, end, mid, tp, tickerAnchor, pp, sweep };
  });

  const totalDisplay = portfolio.totalValue > 0
    ? "$" + (portfolio.totalValue / 1000).toFixed(0) + "K" : "—";

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const DURATION = 700;
    const startTime = performance.now();
    prevView.current = view;

    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

    function frame(now: number) {
      const svg = svgRef.current;
      if (!svg) return;
      const raw = Math.min((now - startTime) / DURATION, 1);
      const progress = easeOutCubic(raw);

      const paths   = svg.querySelectorAll(".donut-slice");
      const pctTexts = svg.querySelectorAll(".donut-pct");
      const tickerTexts = svg.querySelectorAll(".donut-ticker");

      let cumul = 0;
      sliceData.forEach((seg, i) => {
        const sweep = (seg.weight / 100) * 360 * progress;
        if (sweep <= 0) return;
        const end = cumul + sweep;
        const path = paths[i] as SVGPathElement;
        if (path) path.setAttribute("d", buildPath(cx, cy, outerR, innerR, cumul, end));

        // Fade in labels in final 20%
        const opacity = progress > 0.8 ? ((progress - 0.8) / 0.2).toString() : "0";
        const pct = pctTexts[i] as SVGTextElement;
        const ticker = tickerTexts[i] as SVGTextElement;
        if (pct) pct.style.opacity = opacity;
        if (ticker) ticker.style.opacity = opacity;

        cumul = end;
      });

      if (raw < 1) animRef.current = requestAnimationFrame(frame);
    }

    animRef.current = requestAnimationFrame(frame);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [view, segments.map(s => s.ticker + s.weight).join(",")]);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6">
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-2">Allocation</h2>
      <div className="flex justify-center">
        <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: "340px" }}>
          {/* Slices */}
          {sliceData.map((seg) => (
            <path key={seg.ticker} className="donut-slice"
              d={buildPath(cx, cy, outerR, innerR, seg.start, seg.start)}
              fill={seg.color} stroke="white" strokeWidth="2" />
          ))}

          {/* Percentage inside the ring band — only if slice > 8% */}
          {sliceData.map((seg) => (
            seg.sweep >= 25 ? (
              <text key={`pct-${seg.ticker}`} className="donut-pct"
                x={seg.pp.x} y={seg.pp.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="10" fontWeight="600"
                fill={["#101113","#1E3A8A","#034147"].includes(seg.color) ? "#fff" : "#fff"}
                fontFamily="system-ui, sans-serif"
                style={{ opacity: 0 }}>
                {seg.weight.toFixed(0)}%
              </text>
            ) : null
          ))}

          {/* Ticker label just outside the ring */}
          {sliceData.map((seg) => (
            <text key={`ticker-${seg.ticker}`} className="donut-ticker"
              x={seg.tp.x} y={seg.tp.y}
              textAnchor={seg.tickerAnchor} dominantBaseline="middle"
              fontSize="9.5" fontWeight="700"
              fill={seg.color === "#101113" ? "#333" : seg.color === "#C8F000" ? "#7A9000" : seg.color}
              fontFamily="system-ui, sans-serif"
              style={{ opacity: 0 }}>
              {seg.ticker}
            </text>
          ))}

          {/* Centre */}
          <text x={cx} y={cy - 12} textAnchor="middle" fontSize="11" fill="#ccc" fontFamily="system-ui">total</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="22" fontWeight="700" fill="#034147" fontFamily="system-ui">{totalDisplay}</text>
        </svg>
      </div>
    </section>
  );
}
