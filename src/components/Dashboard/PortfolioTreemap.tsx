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

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
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
      const rowH = rowArea / remW;
      let ry = cy;
      rowItems.forEach((it) => {
        const rw = (it.weight / sum) * remW;
        rects.push({ ...it, x: cx, y: ry, w: rw, h: rowH });
        ry += rowH;
      });
      cy += rowH;
      remH -= rowH;
    } else {
      const rowW = rowArea / remH;
      let rx = cx;
      rowItems.forEach((it) => {
        const rh = (it.weight / sum) * remH;
        rects.push({ ...it, x: rx, y: cy, w: rowW, h: rh });
        rx += rowW;
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

  return (
    <section className="relative w-full flex-1 min-h-[300px] rounded-2xl overflow-hidden">
      <div ref={containerRef} className="relative w-full h-full">
        {rects.map((r) => {
          const dollarValue = (r.weight / 100) * portfolio.totalValue;
          const isHovered = hovered === r.ticker;
          const baseW = Math.max(0, r.w - 2);
          const baseH = Math.max(0, r.h - 2);

          // Enlarge on hover so tiny tiles (e.g. BMNR, ETH) can show their full label
          const scale = isHovered ? 1.6 : 1;
          let tileW = baseW * scale;
          let tileH = baseH * scale;
          let tileX = r.x - (tileW - baseW) / 2;
          let tileY = r.y - (tileH - baseH) / 2;
          if (isHovered && size.w > 0 && size.h > 0) {
            tileX = Math.min(Math.max(0, tileX), Math.max(0, size.w - tileW));
            tileY = Math.min(Math.max(0, tileY), Math.max(0, size.h - tileH));
          }

          const minDim = Math.min(r.w, r.h);
          const tickerFontSize = isHovered
            ? Math.max(14, Math.min(44, minDim * 0.24))
            : Math.max(8, Math.min(44, minDim * 0.24));
          const showTicker = isHovered || (r.w > 14 && r.h > 10);
          const showSub = isHovered || (showTicker && r.h > tickerFontSize * 3.4 && r.w > 50);

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
                boxShadow: isHovered ? "0 6px 20px rgba(0,0,0,0.35)" : undefined,
              }}
              title={`${r.ticker} · ${formatCurrency(dollarValue)} · ${r.weight.toFixed(1)}% of total · ${r.dayChangePct >= 0 ? "+" : ""}${r.dayChangePct.toFixed(2)}% today`}
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
                <>
                  <span
                    className="text-white/85 mt-1"
                    style={{ fontSize: tickerFontSize * 0.75 }}
                  >
                    {formatCompact(dollarValue)}
                  </span>
                  <span
                    className="text-white/70"
                    style={{ fontSize: tickerFontSize * 0.68 }}
                  >
                    {r.weight.toFixed(1)}% of total
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
