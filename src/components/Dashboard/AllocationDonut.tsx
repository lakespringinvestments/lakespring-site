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
  BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", BMNR: "#E8874A", MSTR: "#CC3300",
};
const CASH_COLORS: Record<string, string> = {
  CASH: "#54B949",
};

const FP_TICKERS = ["TSLA","NVDA","PLTR","AMZN","GOOGL","LLY","SPCX"];
const TM_TICKERS = ["MRVL","NBIS","ASML","BE","SMCI","CRWV"];
const CRYPTO_TICKERS = ["BTC","ETH","SOL","BMNR","MSTR"];
const CASH_TICKERS = ["CASH"];

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
    case "cash":   return { tickers: CASH_TICKERS, colors: CASH_COLORS };
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
  const midR = (outerR + innerR) / 2;

  const { tickers, colors } = getTickersAndColors(view);

  const held = portfolio.holdings.filter(
    h => tickers.includes(h.ticker) && h.weight > 0
  );
  const totalWeight = held.reduce((s, h) => s + h.weight, 0);
  const hasPositions = held.length > 0 && totalWeight > 0;

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

  // Split-half riffle: sort descending, split into two halves, zip together.
  // This keeps rank-adjacent slices (the most similarly-sized, and so most easily
  // confused) apart from each other — unlike a simple big/small alternation, which
  // can strand the two middle-ranked slices next to each other when one slice dominates.
  const sorted = [...segments].sort((a, b) => b.weight - a.weight);
  const half = Math.ceil(sorted.length / 2);
  const firstHalf = sorted.slice(0, half);
  const secondHalf = sorted.slice(half);
  const interleaved: typeof segments = [];
  for (let k = 0; k < half; k++) {
    interleaved.push(firstHalf[k]);
    if (secondHalf[k]) interleaved.push(secondHalf[k]);
  }

  let cumulAngle = 0;
  let smallSliceIndex = 0;
  const sliceData = interleaved.map(seg => {
    const start = cumulAngle;
    const sweep = Math.min((seg.weight / 100) * 360, 359.9);
    const end = start + sweep;
    const mid = start + sweep / 2;

    // Dynamic ticker label radius — small slices fan out at staggered distances
    const isSmall = sweep < 30;
    const extraOffset = isSmall ? 12 + (smallSliceIndex % 3) * 10 : 0;
    if (isSmall) smallSliceIndex++;
    const dynamicTickerR = tickerR + extraOffset;

    const tp = polarToCartesian(cx, cy, dynamicTickerR, mid);
    const tickerAnchor = (tp.x < cx - 4 ? "end" : tp.x > cx + 4 ? "start" : "middle") as "end"|"start"|"middle";
    const pp = polarToCartesian(cx, cy, pctR, mid);

    cumulAngle = end;
    return { ...seg, start, end, mid, tp, tickerAnchor, pp, sweep };
  });

  // Centre display
  let totalDisplay = "$0";
  let centreLabel = "total";

  if (hasPositions) {
    if (view === "cash") {
      const cashHolding = portfolio.holdings.find(h => h.ticker === "CASH");
      const cashVal = cashHolding ? Math.round((cashHolding.weight / 100) * portfolio.totalValue) : portfolio.cash ?? 0;
      totalDisplay = cashVal > 0 ? "$" + (cashVal / 1000).toFixed(0) + "K" : "$0";
      centreLabel = "cash";
    } else if (view === "crypto") {
      const cryptoVal = held.reduce((sum, h) => sum + (h.weight / 100) * portfolio.totalValue, 0);
      totalDisplay = cryptoVal > 0 ? "$" + (cryptoVal / 1000).toFixed(0) + "K" : "$0";
      centreLabel = "crypto";
    } else {
      const viewVal = held.reduce((sum, h) => sum + (h.weight / 100) * portfolio.totalValue, 0);
      totalDisplay = viewVal > 0 ? "$" + (viewVal / 1000).toFixed(0) + "K" : "$0";
    }
  }

  // Empty state — plain gray ring, no dash calculations needed

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const isTwoPhase = view === "second"; // Thematic Momentum only — everyone else keeps the original simple reveal
    const DURATION = isTwoPhase ? 1100 : 700;
    const startTime = performance.now();
    prevView.current = view;

    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

    if (hasPositions) {
      if (isTwoPhase) {
        // Thematic Momentum: 0–50% colors sweep in clockwise over the white base ·
        // 50–100% a white overlay re-covers the ring, then retracts counterclockwise before settling
        function frameTwoPhase(now: number) {
          const svg = svgRef.current;
          if (!svg) return;
          const raw = Math.min((now - startTime) / DURATION, 1);

          const p1 = Math.min(1, raw / 0.5);
          const easedP1 = easeOutCubic(p1);

          const paths = svg.querySelectorAll(".donut-slice");
          const tickerTexts = svg.querySelectorAll(".donut-ticker");
          const overlay = svg.querySelector(".donut-white-overlay") as SVGPathElement | null;

          let cumul = 0;
          sliceData.forEach((seg, i) => {
            const sweep = Math.min((seg.weight / 100) * 360 * easedP1, 359.9);
            const end = cumul + sweep;
            const path = paths[i] as SVGPathElement;
            if (path) {
              path.setAttribute("d", sweep > 0
                ? buildPath(cx, cy, outerR, innerR, cumul, end)
                : buildPath(cx, cy, outerR, innerR, cumul, cumul));
            }
            cumul = end;
          });

          if (overlay) {
            if (raw < 0.5) {
              overlay.setAttribute("d", "");
              overlay.style.opacity = "0";
            } else {
              const p2 = (raw - 0.5) / 0.5;
              const easedP2 = easeOutCubic(p2);
              const overlaySweep = Math.max(0, 360 * (1 - easedP2));
              if (overlaySweep > 0.05) {
                overlay.setAttribute("d", buildPath(cx, cy, outerR, innerR, 0, Math.min(overlaySweep, 359.99)));
                overlay.style.opacity = "1";
              } else {
                overlay.setAttribute("d", "");
                overlay.style.opacity = "0";
              }
            }
          }

          const textOpacity = raw > 0.92 ? ((raw - 0.92) / 0.08).toString() : "0";
          tickerTexts.forEach((t) => { (t as SVGTextElement).style.opacity = textOpacity; });

          if (raw < 1) animRef.current = requestAnimationFrame(frameTwoPhase);
        }
        animRef.current = requestAnimationFrame(frameTwoPhase);
      } else {
        // Original simple reveal — slices sweep in clockwise once, no white base/overlay
        function frame(now: number) {
          const svg = svgRef.current;
          if (!svg) return;
          const raw = Math.min((now - startTime) / DURATION, 1);
          const progress = easeOutCubic(raw);

          const paths = svg.querySelectorAll(".donut-slice");
          const tickerTexts = svg.querySelectorAll(".donut-ticker");
          const overlay = svg.querySelector(".donut-white-overlay") as SVGPathElement | null;
          if (overlay) { overlay.setAttribute("d", ""); overlay.style.opacity = "0"; }

          let cumul = 0;
          sliceData.forEach((seg, i) => {
            const sweep = Math.min((seg.weight / 100) * 360 * progress, 359.9);
            if (sweep <= 0) return;
            const end = cumul + sweep;
            const path = paths[i] as SVGPathElement;
            if (path) path.setAttribute("d", buildPath(cx, cy, outerR, innerR, cumul, end));

            const opacity = progress > 0.8 ? ((progress - 0.8) / 0.2).toString() : "0";
            const ticker = tickerTexts[i] as SVGTextElement;
            if (ticker) ticker.style.opacity = opacity;

            cumul = end;
          });

          if (raw < 1) animRef.current = requestAnimationFrame(frame);
        }
        animRef.current = requestAnimationFrame(frame);
      }
    } else {
      // Empty state — plain gray ring fading in, no dashed/hatched pattern
      function frameEmpty(now: number) {
        const svg = svgRef.current;
        if (!svg) return;
        const raw = Math.min((now - startTime) / DURATION, 1);
        const progress = easeOutCubic(raw);

        const ring = svg.querySelector(".empty-ring") as SVGCircleElement;
        if (ring) {
          ring.style.opacity = (0.3 * progress).toString();
        }

        if (raw < 1) animRef.current = requestAnimationFrame(frameEmpty);
      }
      animRef.current = requestAnimationFrame(frameEmpty);
    }

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [view, segments.map(s => s.ticker + s.weight).join(",")]);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6">
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-2">
        {view === "cash" ? "Cash Position" : "Allocation"}
      </h2>
      <div className="flex justify-center">
        <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: "340px" }}>

          {hasPositions ? (
            <>
              {/* White base — this is what "complete white" starts as, before any slice grows */}
              <path className="donut-white-base"
                d={buildPath(cx, cy, outerR, innerR, 0, 359.99)}
                fill="#fff" />

              {/* Real slices — reveal clockwise over the white base */}
              {sliceData.map((seg) => (
                <path key={seg.ticker} className="donut-slice"
                  d={buildPath(cx, cy, outerR, innerR, seg.start, seg.start)}
                  fill={seg.color} stroke="white" strokeWidth="2" />
              ))}

              {/* White overlay — re-covers the ring, then retracts counterclockwise before settling */}
              <path className="donut-white-overlay" d="" fill="#fff" style={{ opacity: 0 }} />

              {/* Ticker + % labels — combined into one outer label per slice, always shown */}
              {sliceData.length > 1 && sliceData.map((seg) => (
                <text key={`label-${seg.ticker}`} className="donut-ticker"
                  x={seg.tp.x} y={seg.tp.y}
                  textAnchor={seg.tickerAnchor} dominantBaseline="middle"
                  fontSize="9.5" fontWeight="700"
                  fill={seg.color === "#101113" ? "#333" : seg.color === "#C8F000" ? "#7A9000" : seg.color}
                  fontFamily="system-ui, sans-serif"
                  style={{ opacity: 0 }}>
                  {seg.ticker} {seg.weight.toFixed(0)}%
                </text>
              ))}
            </>
          ) : (
            /* Plain gray ring — fades in, no dashed/hatched pattern */
            <circle className="empty-ring"
              cx={cx} cy={cy} r={midR}
              fill="none" stroke="#C4BFB3" strokeWidth={outerR - innerR}
              style={{ opacity: 0 }}
            />
          )}

          {/* Centre */}
          <text x={cx} y={cy - 12} textAnchor="middle" fontSize="11" fill="#ccc" fontFamily="system-ui">{centreLabel}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="22" fontWeight="700" fill="#034147" fontFamily="system-ui"
            style={{ filter: "none" }}>{totalDisplay}</text>
        </svg>
      </div>
    </section>
  );
}
