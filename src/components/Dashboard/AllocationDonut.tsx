"use client";

import { useEffect, useRef, useState } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { PortfolioView } from "./types";

function useMember() {
  const [member, setMember] = useState(false);
  useEffect(() => {
    setMember(localStorage.getItem("lakespring_member") === "true");
  }, []);
  return member;
}

const FP_COLORS: Record<string, string> = {
  TSLA: "#CC0000", NVDA: "#76B900", PLTR: "#101113", AMZN: "#FF9900", GOOGL: "#4285F4", LLY: "#D4537E", SPCX: "#5A6578",
};
const TM_COLORS: Record<string, string> = {
  MRVL: "#0057B8", NBIS: "#C8F000", ASML: "#1E3A8A", BE: "#00A86B", SMCI: "#8A9BB0", CRWV: "#2563EB",
};
const CRYPTO_COLORS: Record<string, string> = {
  BTC: "#F7931A", ETH: "#627EEA",
};

const FP_TICKERS = ["TSLA","NVDA","PLTR","AMZN","GOOGL","LLY","SPCX"];
const TM_TICKERS = ["MRVL","NBIS","ASML","BE","SMCI","CRWV"];
const CRYPTO_TICKERS = ["BTC","ETH"];

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

function getTickersAndColors(view: PortfolioView) {
  switch (view) {
    case "first":  return { tickers: FP_TICKERS, colors: FP_COLORS };
    case "second": return { tickers: TM_TICKERS, colors: TM_COLORS };
    case "crypto": return { tickers: CRYPTO_TICKERS, colors: CRYPTO_COLORS };
    default:       return { tickers: [] as string[], colors: {} as Record<string, string> };
  }
}

interface Props { portfolio: Portfolio; view: PortfolioView; }

export default function AllocationDonut({ portfolio, view }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number | null>(null);
  const prevView = useRef<PortfolioView | null>(null);
  const member = useMember();

  const VW = 320, VH = 320, cx = 160, cy = 160;
  const outerR = 118, innerR = 72;
  const tickerR = outerR + 14;
  const pctR = (outerR + innerR) / 2;

  const { tickers, colors } = getTickersAndColors(view);

  // Cash view shows neutral ring — no donut
  const isCashView = view === "cash";

  // Only include tickers with actual holdings (weight > 0)
  const held = portfolio.holdings.filter(
    h => tickers.includes(h.ticker) && h.weight > 0
  );
  const totalWeight = held.reduce((s, h) => s + h.weight, 0);
  const hasPositions = held.length > 0 && totalWeight > 0 && !isCashView;

  // Build segments only for held positions
  const rawSegs = hasPositions
    ? held.map((h) => ({
        ticker: h.ticker,
        weight: (h.weight / totalWeight) * 100,
        color: colors[h.ticker] ?? "#A8B0B6",
      }))
    : [];

  const segTotal = rawSegs.reduce((s, seg) => s + seg.weight, 0);
  const segments = rawSegs.map((seg, i) => ({
    ...seg,
    weight: i === rawSegs.length - 1
      ? 100 - rawSegs.slice(0,-1).reduce((s,s2) => s + Math.round((s2.weight/segTotal)*1000)/10, 0)
      : Math.round((seg.weight/segTotal)*1000)/10,
  }));

  // Interleave large and small slices to prevent label overlap
  const sorted = [...segments].sort((a, b) => b.weight - a.weight);
  const interleaved: typeof segments = [];
  let lo = 0, hi = sorted.length - 1;
  let pickLarge = true;
  while (lo <= hi) {
    if (pickLarge) { interleaved.push(sorted[lo++]); }
    else { interleaved.push(sorted[hi--]); }
    pickLarge = !pickLarge;
  }

  let cumulAngle = 0;
  const sliceData = interleaved.map(seg => {
    const start = cumulAngle;
    const sweep = (seg.weight / 100) * 360;
    const end = start + sweep;
    const mid = start + sweep / 2;

    const tp = polarToCartesian(cx, cy, tickerR, mid);
    const tickerAnchor = (tp.x < cx - 4 ? "end" : tp.x > cx + 4 ? "start" : "middle") as "end"|"start"|"middle";
    const pp = polarToCartesian(cx, cy, pctR, mid);

    cumulAngle = end;
    return { ...seg, start, end, mid, tp, tickerAnchor, pp, sweep };
  });

  // Centre display
  let totalDisplay = "—";
  if (isCashView) {
    const cashHolding = portfolio.holdings.find(h => h.ticker === "CASH");
    const cashVal = cashHolding ? Math.round((cashHolding.weight / 100) * portfolio.totalValue) : portfolio.cash ?? 0;
    totalDisplay = cashVal > 0 ? "$" + (cashVal / 1000).toFixed(0) + "K" : "—";
  } else if (view === "crypto") {
    const cryptoVal = held.reduce((sum, h) => sum + (h.weight / 100) * portfolio.totalValue, 0);
    totalDisplay = cryptoVal > 0 ? "$" + (cryptoVal / 1000).toFixed(0) + "K" : "—";
  } else {
    totalDisplay = portfolio.totalValue > 0 ? "$" + (portfolio.totalValue / 1000).toFixed(0) + "K" : "—";
  }

  const centreLabel = isCashView ? "cash" : view === "crypto" ? "crypto" : "total";

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (!hasPositions) return;
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
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-2">
        {isCashView ? "Cash Position" : "Allocation"}
      </h2>
      <div className="flex justify-center">
        <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: "340px" }}>

          {hasPositions ? (
            <>
              {sliceData.map((seg) => (
                <path key={seg.ticker} className="donut-slice"
                  d={buildPath(cx, cy, outerR, innerR, seg.start, seg.start)}
                  fill={seg.color} stroke="white" strokeWidth="2" />
              ))}
              {sliceData.map((seg) => (
                seg.sweep >= 25 ? (
                  <text key={`pct-${seg.ticker}`} className="donut-pct"
                    x={seg.pp.x} y={seg.pp.y}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="10" fontWeight="600"
                    fill="#fff"
                    fontFamily="system-ui, sans-serif"
                    style={{ opacity: 0, filter: "none" }}>
                    {seg.weight.toFixed(0)}%
                  </text>
                ) : null
              ))}
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
            </>
          ) : (
            <circle cx={cx} cy={cy} r={(outerR + innerR) / 2}
              fill="none" stroke={isCashView ? "#1D9E75" : "#E8E1CF"} strokeWidth={outerR - innerR}
              opacity={isCashView ? 0.25 : 0.5} />
          )}

          <text x={cx} y={cy - 12} textAnchor="middle" fontSize="11" fill="#ccc" fontFamily="system-ui">{centreLabel}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="22" fontWeight="700" fill="#034147" fontFamily="system-ui"
            style={{ filter: "none" }}>{totalDisplay}</text>
        </svg>
      </div>
    </section>
  );
}
