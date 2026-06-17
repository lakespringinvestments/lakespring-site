import type { Portfolio } from "../../../types/portfolio";

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function buildSparklinePath(
  points: { value: number }[],
  width: number,
  height: number
) {
  if (points.length < 2) return { line: "", fill: "" };
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p.value - min) / range) * (height - 8) - 4;
    return [x, y] as const;
  });
  const line = coords
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const fill = `${line} L${width},${height} L0,${height} Z`;
  return { line, fill };
}

interface Props {
  portfolio: Portfolio;
  totalPnl: number;
}

export default function PortfolioHero({ portfolio, totalPnl }: Props) {
  const { line, fill } = buildSparklinePath(portfolio.performance, 400, 60);

  // Calendar weeks elapsed
  const yearStart = new Date("2026-01-05");
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksElapsed = Math.max(1, Math.floor((now.getTime() - yearStart.getTime()) / msPerWeek) + 2);

  // Avg weekly = total P&L (options + capital gains) / weeks
  const avgWeekly = weeksElapsed > 0 ? totalPnl / weeksElapsed : 0;
  const avgFormatted = avgWeekly.toLocaleString("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

  return (
    <section className="bg-[#034147] rounded-2xl p-6 flex flex-col gap-4">
      {/* Portfolio value */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mb-1">
          Portfolio value
        </p>
        <p className="text-3xl font-semibold text-white tracking-tight leading-none">
          {formatCurrency(portfolio.totalValue)}
        </p>
        <p className="text-xs text-white/40 mt-1">
          USD · {new Date(portfolio.lastUpdated).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        </p>
      </div>

      {/* Sparkline */}
      <div className="w-full">
        <svg
          viewBox="0 0 400 60"
          className="w-full h-14"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5DCAA5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#5DCAA5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {fill && <path d={fill} fill="url(#sparkFill)" />}
          {line && <path d={line} fill="none" stroke="#5DCAA5" strokeWidth="1.5" />}
        </svg>
      </div>

      {/* Avg weekly income */}
      <div className="border-t border-white/10 pt-4">
        <p className="text-xs text-white/40">
          Avg <span className="text-[#5DCAA5] font-semibold">{avgFormatted}</span> / week ({weeksElapsed} weeks)
        </p>
      </div>
    </section>
  );
}
