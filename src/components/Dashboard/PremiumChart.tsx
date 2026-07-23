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
  const selectedRef = useRef<number | null>(null);
  const geomRef = useRef<{ x: number; w: number }[]>([]);

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
    selectedRef.current = null; // reset selection when the filter/data changes

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

    // Store geometry for tap hit-testing
    geomRef.current = bars.map((_, i) => ({ x: padL + i * (barW + barGap), w: barW }));

    function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4); }

    // Shared draw routine — used both by the entrance animation and by a static
    // redraw whenever the user taps a bar (progress=1, selectedIdx set).
    function draw(progress: number, selectedIdx: number | null) {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

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

      // Bars — wavy roll-out left to right with 80% overlap
      const overlapFrac = 0.8;
      const windowPerBar = 1 / (barCount * (1 - overlapFrac) + overlapFrac);

      let selectedLabelInfo: { x: number; y: number; text: string } | null = null;

      bars.forEach((d, i) => {
        const x = padL + i * (barW + barGap);

        const barStart = i * windowPerBar * (1 - overlapFrac);
        const barEnd = barStart + windowPerBar;
        const localT = Math.max(0, Math.min(1, (progress - barStart) / (barEnd - barStart)));
        const easedT = easeOutQuart(localT);
        const isSelected = i === selectedIdx;

        if (d.isFuture || d.amount === 0) {
          if (localT > 0) {
            ctx.strokeStyle = "rgba(0,0,0,0.08)";
            ctx.lineWidth = 1;
            ctx.setLineDash([3,3]);
            ctx.strokeRect(x, padT + chartH - 4, barW, 4);
            ctx.setLineDash([]);
          }
        } else {
          const fullBarH = (d.amount / maxVal) * chartH;
          const barH = fullBarH * easedT;
          const y = padT + chartH - barH;

          if (barH > 0) {
            // Selected bar gets a highlight halo behind it
            if (isSelected) {
              ctx.fillStyle = "rgba(29,158,117,0.15)";
              ctx.fillRect(x - 2, padT, barW + 4, chartH);
            }

            ctx.fillStyle = isSelected ? "#1D9E75" : (i === barCount - 1 ? "#1D9E75" : "#034147");
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

          // Count-up data label — skip if it would overlap its slot, UNLESS this bar is selected
          if (localT > 0.1) {
            const alpha = Math.min(1, (localT - 0.1) / 0.3);
            const countVal = Math.round(d.amount * easedT);
            const labelText = "$" + (countVal >= 1000 ? (countVal/1000).toFixed(1)+"K" : countVal.toLocaleString());
            ctx.font = "bold 9px system-ui";
            const labelWidth = ctx.measureText(labelText).width;

            if (isSelected) {
              // Defer drawing — rendered last, on top of everything, with a pill background
              selectedLabelInfo = { x: x + barW / 2, y: y - 8, text: labelText };
            } else if (labelWidth < barW + barGap * 0.9) {
              ctx.globalAlpha = alpha;
              ctx.fillStyle = i === barCount - 1 ? "#1D9E75" : "#034147";
              ctx.textAlign = "center";
              ctx.fillText(labelText, x + barW / 2, y - 5);
              ctx.globalAlpha = 1;
            }
          }
        }

        // X label — appears with bar, skipped if it wouldn't fit its own slot
        if (localT > 0) {
          ctx.font = "9px system-ui";
          const dateLabelWidth = ctx.measureText(d.label).width;
          if (isSelected || dateLabelWidth < barW + barGap * 0.9) {
            ctx.fillStyle = isSelected ? "#034147" : "rgba(100,100,100,0.7)";
            ctx.font = isSelected ? "bold 9px system-ui" : "9px system-ui";
            ctx.textAlign = "center";
            ctx.fillText(d.label, x + barW / 2, H - 6);
          }
        }
      });

      // Draw the selected bar's label last, on top, with a readable pill background
      if (selectedLabelInfo) {
        const info: { x: number; y: number; text: string } = selectedLabelInfo;
        ctx.font = "bold 10px system-ui";
        const textW = ctx.measureText(info.text).width;
        const padX = 6, padY = 4;
        const boxW = textW + padX * 2, boxH = 16;
        const boxX = info.x - boxW / 2, boxY = info.y - boxH + 2;

        ctx.fillStyle = "#1D9E75";
        const rr = 4;
        ctx.beginPath();
        ctx.moveTo(boxX + rr, boxY);
        ctx.arcTo(boxX + boxW, boxY, boxX + boxW, boxY + boxH, rr);
        ctx.arcTo(boxX + boxW, boxY + boxH, boxX, boxY + boxH, rr);
        ctx.arcTo(boxX, boxY + boxH, boxX, boxY, rr);
        ctx.arcTo(boxX, boxY, boxX + boxW, boxY, rr);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(info.text, info.x, boxY + boxH - padY + 1);
      }
    }

    const DURATION = 1900;
    const startTime = performance.now();

    function drawFrame(now: number) {
      const raw = Math.min((now - startTime) / DURATION, 1);
      draw(raw, selectedRef.current);
      if (raw < 1) {
        animRef.current = requestAnimationFrame(drawFrame);
      }
    }

    animRef.current = requestAnimationFrame(drawFrame);

    // Tap/click a bar to pin its label — useful on mobile where narrow bars
    // hide their label by default to avoid overlap
    function handleTap(clientX: number) {
      const c = canvasRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      const localX = clientX - r.left;
      const idx = geomRef.current.findIndex(g => localX >= g.x && localX <= g.x + g.w);
      if (idx === -1) return;
      selectedRef.current = selectedRef.current === idx ? null : idx;
      draw(1, selectedRef.current);
    }

    const clickHandler = (e: MouseEvent) => handleTap(e.clientX);
    canvas.addEventListener("click", clickHandler);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("click", clickHandler);
    };
  }, [bars]);

  const totalShown = bars.reduce((s, d) => s + d.amount, 0);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-ink-500 mb-1">
            Weekly net options income
          </p>
          {totalShown > 0 && (
            <p className="text-2xl font-bold text-[#034147] leading-none">
              {"$" + totalShown.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
              <span className="text-xs font-medium text-ink-400 align-middle">shown</span>
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
          <canvas ref={canvasRef} className="w-full h-full cursor-pointer"
            style={{ display: "block" }}
            aria-label="Weekly premium income bar chart. Tap a bar to see its value." />
        )}
      </div>
    </section>
  );
}
