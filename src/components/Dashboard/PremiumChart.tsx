"use client";

import { useState, useEffect, useRef } from "react";

type WeeklyPoint = { date: string; amount: number };

interface PremiumChartProps {
  weeklyData: WeeklyPoint[];
  premiumYTD: number;
}

const FILTERS = ["1M", "3M", "YTD", "All"] as const;
type Filter = (typeof FILTERS)[number];

function filterData(data: WeeklyPoint[], filter: Filter): WeeklyPoint[] {
  if (!data.length) return [];
  const now = new Date();
  const cutoff = new Date(now);
  if (filter === "1M") cutoff.setMonth(now.getMonth() - 1);
  else if (filter === "3M") cutoff.setMonth(now.getMonth() - 3);
  else if (filter === "YTD") cutoff.setMonth(0, 1);
  else return data; // All
  return data.filter((d) => new Date(d.date) >= cutoff);
}

function formatWeekLabel(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PremiumChart({ weeklyData, premiumYTD }: PremiumChartProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("1M");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filtered = filterData(weeklyData, activeFilter);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || filtered.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const padL = 48, padR = 12, padT = 12, padB = 28;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    const amounts = filtered.map((d) => d.amount);
    const maxVal = Math.max(...amounts) * 1.1 || 1000;

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + chartW, y);
      ctx.stroke();
      // Y labels
      const val = maxVal - (maxVal / 4) * i;
      ctx.fillStyle = "rgba(100,100,100,0.7)";
      ctx.font = "10px system-ui";
      ctx.textAlign = "right";
      ctx.fillText("$" + Math.round(val / 1000) + "K", padL - 4, y + 3.5);
    }

    // Bars
    const barCount = filtered.length;
    const barGap = Math.max(2, Math.min(6, chartW / barCount * 0.15));
    const barW = (chartW - barGap * (barCount - 1)) / barCount;

    filtered.forEach((d, i) => {
      const x = padL + i * (barW + barGap);
      const barH = (d.amount / maxVal) * chartH;
      const y = padT + chartH - barH;

      // Bar colour — most recent is sage, rest are dark teal
      ctx.fillStyle = i === barCount - 1 ? "#1D9E75" : "#034147";
      const r = Math.min(4, barW / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();

      // X label — show if enough space
      if (barW > 24) {
        ctx.fillStyle = "rgba(100,100,100,0.7)";
        ctx.font = "9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(formatWeekLabel(d.date), x + barW / 2, H - 6);
      }
    });
  }, [filtered]);

  const totalShown = filtered.reduce((s, d) => s + d.amount, 0);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-0.5">
            Weekly premiums collected
          </p>
          {totalShown > 0 && (
            <p className="text-sm font-medium text-teal-600">
              ${totalShown.toLocaleString(undefined, { maximumFractionDigits: 0 })} shown
            </p>
          )}
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                activeFilter === f
                  ? "bg-[#034147] text-white border-[#034147]"
                  : "border-cream-300 text-ink-500 hover:border-teal-600 hover:text-teal-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative min-h-[140px]">
        {filtered.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-ink-400">No premium data for this period</p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: "block", height: "160px" }}
            aria-label={`Weekly premium income bar chart — ${filtered.length} weeks shown`}
          />
        )}
      </div>
    </section>
  );
}
