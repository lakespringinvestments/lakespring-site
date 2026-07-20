import type { Portfolio } from "../../../types/portfolio";

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function buildSparklinePath(points: { value: number }[], width: number, height: number) {
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
}

export default function PortfolioValueCard({ portfolio }: Props) {
  const { line, fill } = buildSparklinePath(portfolio.performance, 160, 48);

  return (
    <section className="bg-[#034147] rounded-2xl p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 mb-1">
          Portfolio value
        </p>
        <p className="text-2xl font-bold text-white leading-none">
          {formatCurrency(portfolio.totalValue)}
        </p>
        <p className="text-xs text-white/40 mt-1">
          USD ·{" "}
          {new Date(portfolio.lastUpdated).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="w-32 sm:w-40 flex-shrink-0">
        <svg viewBox="0 0 160 48" className="w-full h-12" preserveAspectRatio="none">
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
    </section>
  );
}
