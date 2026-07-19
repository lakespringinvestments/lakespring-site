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
    <section className="bg-[#034147] rounded-2xl p-6 flex flex-col gap-3 h-full">
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 mb-1">
          Portfolio value
        </p>
        <p className="text-2xl font-bold text-white leading-none">
          {formatCurrency(portfolio.totalValue)}
        </p>
      </div>

      <div ref={containerRef} className="relative w-full flex-1 min-h-[220px]">
        {rects.map((r) => {
          const dollarValue = (r.weight / 100) * portfolio.totalValue;
          const showFull = r.w > 60 && r.h > 48;
          const showTickerOnly = !showFull && r.w > 18 && r.h > 14;
          return (
            <div
              key={r.ticker}
              className="absolute flex flex-col items-center justify-center overflow-hidden rounded-md"
              style={{
                left: r.x,
                top: r.y,
                width: Math.max(0, r.w - 2),
                height: Math.max(0, r.h - 2),
                background: colorFor(r.ticker),
              }}
              title={`${r.ticker} · ${formatCurrency(dollarValue)} · ${r.weight.toFixed(1)}% of total · ${r.dayChangePct >= 0 ? "+" : ""}${r.dayChangePct.toFixed(2)}% today`}
            >
              {(showFull || showTickerOnly) && (
                <span
                  className="font-semibold text-white leading-none"
                  style={{ fontSize: showFull ? 11 : 9 }}
                >
                  {r.ticker}
                </span>
              )}
              {showFull && (
                <>
                  <span className="text-[10px] text-white/85 mt-1">
                    {formatCompact(dollarValue)}
                  </span>
                  <span className="text-[9px] text-white/70">
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
