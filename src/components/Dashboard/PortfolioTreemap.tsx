"use client";

import { useEffect, useRef, useState } from "react";
import type { Portfolio, Holding } from "../../../types/portfolio";

interface Props {
  portfolio: Portfolio;
}

type Rect = Holding & { x: number; y: number; w: number; h: number };

// Same ticker colors as AllocationDonut, for a consistent brand identity across the dashboard
const TICKER_COLORS: Record<string, string> = {
  TSLA: "#CC0000", NVDA: "#76B900", PLTR: "#101113", AMZN: "#FF9900", GOOGL: "#4285F4", LLY: "#D4537E", SPCX: "#5A6578",
  MRVL: "#0057B8", NBIS: "#C8F000", ASML: "#1E3A8A", BE: "#00A86B", SMCI: "#8A9BB0", CRWV: "#2563EB",
  BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", BMNR: "#E8874A", MSTR: "#CC3300",
  CASH: "#54B949",
};

function colorFor(ticker: string): string {
  return TICKER_COLORS[ticker] ?? "#5A6578";
}

function displayTicker(ticker: string): string {
  return ticker === "CASH" ? "USD" : ticker;
}

function formatCompact(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

// Slice-and-dice treemap — alternates the cut direction (vertical/horizontal) for each
// successive item. Still 100% size-accurate, but produces a staircase/pinwheel layout
// instead of squarify's tidy near-square grid, which reads as more "hand-placed."
function sliceDice(items: Holding[], x: number, y: number, w: number, h: number, depth = 0): Rect[] {
  if (items.length === 0 || w <= 0 || h <= 0) return [];
  const total = items.reduce((s, it) => s + it.weight, 0);
  if (total <= 0) return [];
  if (items.length === 1) return [{ ...items[0], x, y, w, h }];

  const [first, ...rest] = items;
  const frac = first.weight / total;
  const vertical = depth % 2 === 0;

  if (vertical) {
    const w1 = w * frac;
    return [
      { ...first, x, y, w: w1, h },
      ...sliceDice(rest, x + w1, y, w - w1, h, depth + 1),
    ];
  }
  const h1 = h * frac;
  return [
    { ...first, x, y, w, h: h1 },
    ...sliceDice(rest, x, y + h1, w, h - h1, depth + 1),
  ];
}

export default function PortfolioTreemap({ portfolio }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const held = portfolio.holdings
    .filter((h) => h.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  const rects = size.w > 0 && size.h > 0 ? sliceDice(held, 0, 0, size.w, size.h) : [];
  const hoveredRect = rects.find((r) => r.ticker === hovered) ?? null;

  // Dialog is a fixed size, positioned above (or below, if too close to the top)
  // the hovered tile, clamped so it never runs outside the treemap's bounds.
  const DIALOG_W = 148;
  const DIALOG_H = 76;
  let dialogX = 0, dialogY = 0, dialogBelow = false;
  if (hoveredRect) {
    dialogX = hoveredRect.x + hoveredRect.w / 2 - DIALOG_W / 2;
    dialogX = Math.min(Math.max(4, dialogX), Math.max(4, size.w - DIALOG_W - 4));
    dialogY = hoveredRect.y - DIALOG_H - 8;
    if (dialogY < 4) {
      dialogY = hoveredRect.y + hoveredRect.h + 8;
      dialogBelow = true;
    }
    dialogY = Math.min(dialogY, Math.max(4, size.h - DIALOG_H - 4));
  }

  return (
    <section className="relative w-full flex-1 min-h-[300px] rounded-2xl overflow-hidden">
      <div ref={containerRef} className="relative w-full h-full">
        {rects.map((r) => {
          const isHovered = hovered === r.ticker;
          const baseW = Math.max(0, r.w - 2);
          const baseH = Math.max(0, r.h - 2);

          // Small pop on hover — just enough to signal interactivity, not a big expansion
          const scale = isHovered ? 1.04 : 1;
          const tileW = baseW * scale;
          const tileH = baseH * scale;
          const tileX = r.x - (tileW - baseW) / 2;
          const tileY = r.y - (tileH - baseH) / 2;

          const minDim = Math.min(r.w, r.h);
          const tickerFontSize = Math.max(9, Math.min(32, minDim * 0.26));
          const showTicker = r.w > 14 && r.h > 10;
          // Hard rule: under 5% allocation shows ticker only — everything else lives in the hover dialog
          const showSub = showTicker && r.weight >= 5 && r.h > tickerFontSize * 2.2 && r.w > 50;

          return (
            <div
              key={r.ticker}
              onMouseEnter={() => setHovered(r.ticker)}
              onMouseLeave={() => setHovered((cur) => (cur === r.ticker ? null : cur))}
              className="absolute flex flex-col items-center justify-center overflow-hidden rounded-md transition-all duration-150 ease-out"
              style={{
                left: tileX,
                top: tileY,
                width: tileW,
                height: tileH,
                background: colorFor(r.ticker),
                zIndex: isHovered ? 20 : 1,
                boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.3)" : undefined,
              }}
            >
              {showTicker && (
                <span
                  className="font-semibold text-white leading-none"
                  style={{ fontSize: tickerFontSize }}
                >
                  {displayTicker(r.ticker)}
                </span>
              )}
              {showSub && (
                <span
                  className="text-white/85 mt-1"
                  style={{ fontSize: tickerFontSize * 0.55 }}
                >
                  {r.weight.toFixed(1)}%
                </span>
              )}
            </div>
          );
        })}

        {hoveredRect && (
          <div
            className="absolute rounded-lg bg-white shadow-lg px-3 py-2 pointer-events-none"
            style={{ left: dialogX, top: dialogY, width: DIALOG_W, zIndex: 30 }}
          >
            <p className="text-xs font-bold text-ink-900 leading-none mb-1">{displayTicker(hoveredRect.ticker)}</p>
            <p className="text-[11px] text-ink-700 leading-tight">
              {hoveredRect.weight.toFixed(1)}% ({formatCompact((hoveredRect.weight / 100) * portfolio.totalValue)})
            </p>
            <p
              className="text-[11px] font-medium leading-tight mt-0.5"
              style={{ color: hoveredRect.dayChangePct >= 0 ? "#1D9E75" : "#E24B4A" }}
            >
              {hoveredRect.dayChangePct >= 0 ? "+" : ""}
              {hoveredRect.dayChangePct.toFixed(2)}% today
            </p>
            {/* Little pointer triangle toward the tile */}
            <div
              className="absolute w-2.5 h-2.5 bg-white"
              style={{
                left: "50%",
                marginLeft: -5,
                ...(dialogBelow
                  ? { top: -5, transform: "rotate(45deg)" }
                  : { bottom: -5, transform: "rotate(45deg)" }),
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
