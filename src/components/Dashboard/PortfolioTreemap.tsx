"use client";

import { useEffect, useRef, useState } from "react";
import type { Portfolio, Holding } from "../../../types/portfolio";

interface Props {
  portfolio: Portfolio;
}

type Rect = Holding & { x: number; y: number; w: number; h: number };

// Red (down) → neutral gray (flat) → green (up), clamped at ±3% daily move
function colorFor(pct: number): string {
  const clamped = Math.max(-3, Math.min(3, pct));
  const t = (clamped + 3) / 6;
  const stops: [number, [number, number, number]][] = [
    [0, [239, 83, 80]],
    [0.5, [58, 58, 55]],
    [1, [38, 166, 154]],
  ];
  const [a, b] = t <= 0.5 ? [stops[0], stops[1]] : [stops[1], stops[2]];
  const localT = (t - a[0]) / (b[0] - a[0]);
  const rgb = a[1].map((v, i) => Math.round(v + (b[1][i] - v) * localT));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
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
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
        Portfolio value: {formatCurrency(portfolio.totalValue)}
      </p>

      <div ref={containerRef} className="relative w-full flex-1 min-h-[220px]">
        {rects.map((r) => {
          const dollarValue = (r.weight / 100) * portfolio.totalValue;
          const showFull = r.w > 60 && r.h > 48;
          const showTickerOnly = !showFull && r.w > 36 && r.h > 24;
          return (
            <div
              key={r.ticker}
              className="absolute flex flex-col items-center justify-center overflow-hidden rounded-[2px]"
              style={{
                left: r.x,
                top: r.y,
                width: Math.max(0, r.w - 2),
                height: Math.max(0, r.h - 2),
                background: colorFor(r.dayChangePct),
              }}
              title={`${r.ticker} · ${formatCurrency(dollarValue)} · ${r.weight.toFixed(1)}% of total · ${r.dayChangePct >= 0 ? "+" : ""}${r.dayChangePct.toFixed(2)}% today`}
            >
              {(showFull || showTickerOnly) && (
                <span className="text-[11px] font-semibold text-white leading-none">
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
