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

function formatCompact(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

// Squarified treemap — lays out rects proportional to `weight` within a w×h box
function squarify(items: Holding[], x: number, y: number, w: number, h: number): Rect[] {
  const total = items.reduce((s, i) => s + i.weight, 0);
  if (total <= 0 || w <= 0 || h <= 0) return [];

  const rects: Rect[] = [];
  let cx = x, cy = y, remW = w, remH = h;
  let row: Holding[] = [];
  let i = 0;

  const worst = (r: Holding[], rowLen: number): number => {
    if (!r.length) return Infinity;
    const sum = r.reduce((s, it) => s + it.weight, 0);
    const rowArea = (sum / total) * (w * h);
    const side = rowArea / rowLen;
    let max = 0;
    r.forEach((it) => {
      const area = (it.weight / total) * (w * h);
      const ratio = Math.max(side / (area / side), area / side / side);
      if (ratio > max) max = ratio;
    });
    return max;
  };

  const layoutRow = (rowItems: Holding[]) => {
    const sum = rowItems.reduce((s, it) => s + it.weight, 0);
    const rowArea = (sum / total) * (w * h);
    if (remW < remH) {
      // Horizontal strip spanning the full width — items sit side by side (x varies)
      const rowH = rowArea / remW;
      let rx = cx;
      rowItems.forEach((it) => {
        const rw = (it.weight / sum) * remW;
        rects.push({ ...it, x: rx, y: cy, w: rw, h: rowH });
        rx += rw;
      });
      cy += rowH;
      remH -= rowH;
    } else {
      // Vertical strip spanning the full height — items stack top to bottom (y varies)
      const rowW = rowArea / remH;
      let ry = cy;
      rowItems.forEach((it) => {
        const rh = (it.weight / sum) * remH;
        rects.push({ ...it, x: cx, y: ry, w: rowW, h: rh });
        ry += rh;
      });
      cx += rowW;
      remW -= rowW;
    }
  };

  while (i < items.length) {
    const rowLen = remW < remH ? remW : remH;
    const testRow = [...row, items[i]];
    if (worst(row, rowLen) === Infinity || worst(testRow, rowLen) <= worst(row, rowLen)) {
      row = testRow;
      i++;
    } else {
      layoutRow(row);
      row = [];
    }
  }
  if (row.length) layoutRow(row);
  return rects;
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

  const rects = size.w > 0 && size.h > 0 ? squarify(held, 0, 0, size.w, size.h) : [];
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
          const dollarValue = (r.weight / 100) * portfolio.totalValue;
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
          const tickerFontSize = Math.max(8, Math.min(26, minDim * 0.2));
          const showTicker = r.w > 14 && r.h > 10;
          // Small tiles show the ticker only — full detail lives in the hover dialog
          const showSub = showTicker && r.h > tickerFontSize * 2.6 && r.w > 62;

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
                  {r.ticker}
                </span>
              )}
              {showSub && (
                <span
                  className="text-white/85 mt-1"
                  style={{ fontSize: tickerFontSize * 0.65 }}
                >
                  {r.weight.toFixed(1)}% ({formatCompact(dollarValue)})
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
            <p className="text-xs font-bold text-ink-900 leading-none mb-1">{hoveredRect.ticker}</p>
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
}
