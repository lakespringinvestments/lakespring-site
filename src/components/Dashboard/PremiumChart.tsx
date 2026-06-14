"use client";

import { useState, useEffect, useRef } from "react";

type WeeklyPoint = { date: string; amount: number };

interface PremiumChartProps {
  weeklyData: WeeklyPoint[];
  premiumYTD: number;
}

const FILTERS = ["1M", "3M", "YTD", "All"] as const;
type Filter = (typeof FILTERS)[number];

// For 1M and 3M: return weekly points filtered by cutoff
function filterWeekly(data: WeeklyPoint[], filter: "1M" | "3M"): WeeklyPoint[] {
  const now = new Date();
  const cutoff = new Date(now);
  if (filter === "1M") cutoff.setMonth(now.getMonth() - 1);
  else cutoff.setMonth(now.getMonth() - 3);
  return data.filter(d => new Date(d.date) >= cutoff);
}

// For YTD: aggregate weekly data into monthly buckets Jan–Dec
function toMonthlyBuckets(data: WeeklyPoint[]): { label: string; amount: number; isFuture: boolean }[] {
  const now = new Date();
  const year = now.getFullYear();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((label, mi) => {
    const isFuture = mi > now.getMonth();
    const amount = data
      .filter(d => {
        const dt = new Date(d.date);
        return dt.getFullYear() === year && dt.getMonth() === mi;
      })
      .reduce((s, d) => s + d.amount, 0);
    return { label, amount: isFuture ? 0 : amount, isFuture };
  });
}

// For All: aggregate into quarterly buckets across all years
function toQuarterlyBuckets(data: WeeklyPoint[]): { label: string; amount: number }[] {
  const map: Record<string, number> = {};
  for (const d of data) {
    const dt = new Date(d.date);
    const year = dt.getFullYear();
    const q = Math.floor(dt.getMonth() / 3) + 1;
    const key = `Q${q} ${year}`;
    map[key] = (map[key] ?? 0) + d.amount;
  }
  return Object.entries(map)
    .sort(([a],[b]) => {
      const [qa, ya] = a.split(" "); const [qb, yb] = b.split(" ");
      return (+ya - +yb) || (qa.localeCompare(qb));
    })
    .map(([label, amount]) => ({ label, amount }));
}

function formatWeekLabel(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PremiumChart({ weeklyData }: PremiumChartProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("3M");
  const canvasRef = useRef<HTMLCanvasElement>(null);


  // Build bar data based on filter
  type BarPoint = { label: string; amount: number; isFuture?: boolean };
  let bars: BarPoint[] = [];
  if (activeFilter === "YTD") {
    bars = toMonthlyBuckets(weeklyData);
  } else if (activeFilter === "All") {
    bars = toQuarterlyBuckets(weeklyData);
  } else {
    bars = filterWeekly(weeklyData, activeFilter).map(d => ({
      label: formatWeekLabel(d.date), amount: d.amount,
    }));
  }

  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width, H = rect.height;
    const padL = 48, padR = 12, padT = 20, padB = 28;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const amounts = bars.map(d => d.amount);
    const maxVal = Math.max(...amounts, 1) * 1.15;
    const barCount = bars.length;
    const barGap = Math.max(2, Math.min(6, chartW / barCount * 0.15));
    const barW = Math.max(8, (chartW - barGap * (barCount - 1)) / barCount);

    const DURATION = 700;
    const startTime = performance.now();

    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

    function drawFrame(now: number) {
      const raw = Math.min((now - startTime) / DURATION, 1);
      const progress = easeOutCubic(raw);

      ctx.clearRect(0, 0, W, H);

      // Grid lines (always full)
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = padT + (chartH / 4) * i;
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
        const val = maxVal - (maxVal / 4) * i;
        ctx.fillStyle = "rgba(100,100,100,0.7)";
        ctx.font = "10px system-ui";
        ctx.textAlign = "right";
        ctx.fillText("$" + (val >= 1000 ? (val/1000).toFixed(0)+"K" : Math.round(val).toString()), padL - 4, y + 3.5);
      }

      // Bars — roll out left to right with staggered height animation
      bars.forEach((d, i) => {
        const x = padL + i * (barW + barGap);

        // Stagger: each bar starts slightly after the previous one
        const barDelay = (i / barCount) * 0.3;
        const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));

        if (d.isFuture || d.amount === 0) {
          if (barProgress > 0) {
            ctx.strokeStyle = "rgba(0,0,0,0.08)";
            ctx.lineWidth = 1;
            ctx.setLineDash([3,3]);
            ctx.strokeRect(x, padT + chartH - 4, barW, 4);
            ctx.setLineDash([]);
          }
        } else {
          const fullBarH = (d.amount / maxVal) * chartH;
          const barH = fullBarH * barProgress;
          const y = padT + chartH - barH;

          if (barH > 0) {
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
          }

          // Data label — fade in during final 20%
          if (barProgress > 0.8) {
            const labelAlpha = (barProgress - 0.8) / 0.2;
            const labelText = "$" + (d.amount >= 1000 ? (d.amount/1000).toFixed(1)+"K" : d.amount.toLocaleString());
            ctx.globalAlpha = labelAlpha;
            ctx.fillStyle = i === barCount - 1 ? "#1D9E75" : "#034147";
            ctx.font = "bold 9px system-ui";
            ctx.textAlign = "center";
            const fullY = padT + chartH - fullBarH;
            ctx.fillText(labelText, x + barW / 2, fullY - 5);
            ctx.globalAlpha = 1;
          }
        }

        // X label
        if (barW > 16 && barProgress > 0) {
          ctx.fillStyle = "rgba(100,100,100,0.7)";
          ctx.font = "9px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(d.label, x + barW / 2, H - 6);
        }
      });

      if (raw < 1) {
        animRef.current = requestAnimationFrame(drawFrame);
      }
    }

    animRef.current = requestAnimationFrame(drawFrame);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [bars]);

  const totalShown = bars.reduce((s, d) => s + d.amount, 0);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-0.5">
            Weekly premiums collected
          </p>
          {totalShown > 0 && (
            <p className="text-sm font-medium text-teal-600"
              style={{}}>
              ${totalShown.toLocaleString(undefined, { maximumFractionDigits: 0 })} shown
            </p>
          )}
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                activeFilter === f
                  ? "bg-[#034147] text-white border-[#034147]"
                  : "border-cream-300 text-ink-500 hover:border-teal-600 hover:text-teal-600"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 relative min-h-[140px]"
        style={{}}>
        {bars.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-ink-400">No premium data for this period</p>
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full"
            style={{ display: "block", height: "160px" }}
            aria-label="Weekly premium income bar chart" />
        )}
      </div>
    </section>
  );
}
