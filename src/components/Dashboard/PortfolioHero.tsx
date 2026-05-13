import type { Portfolio } from "../../../types/portfolio";

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function buildSparklinePath(points: { value: number }[], width: number, height: number) {
  if (points.length === 0) return { line: "", fill: "" };
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (points.length - 1 || 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p.value - min) / range) * (height - 20) - 10;
    return [x, y] as const;
  });
  // Smooth-ish line via simple curve
  const line = coords
    .map(([x, y], i) =>
      i === 0 ? `M${x},${y}` : `L${x},${y}`
    )
    .join(" ");
  const fill = `${line} L${width},${height} L0,${height} Z`;
  return { line, fill };
}

export default function PortfolioHero({ portfolio }: { portfolio: Portfolio }) {
  const isPositive = portfolio.dayChange >= 0;
  const { line, fill } = buildSparklinePath(portfolio.performance, 600, 140);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-8 md:p-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
        <div>
          <p className="text-sm text-ink-500 mb-2 tracking-wide uppercase">
            Portfolio value
          </p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-serif text-5xl md:text-6xl text-teal-600 tracking-tight">
              {formatCurrency(portfolio.totalValue)}
            </span>
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-sage-500" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(portfolio.dayChange)} ({isPositive ? "+" : ""}
              {portfolio.dayChangePct.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex gap-1.5 self-start">
          {["1M", "3M", "YTD", "All"].map((p, i) => (
            <span
              key={p}
              className={`text-xs px-3 py-1.5 rounded-full ${
                i === 0
                  ? "bg-teal-600 text-white font-medium"
                  : "bg-cream-100 text-ink-500"
              }`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 600 140"
          className="w-full h-32"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fill} fill="url(#heroFill)" />
          <path d={line} fill="none" stroke="#1D9E75" strokeWidth="2" />
        </svg>
      </div>
    </section>
  );
}
