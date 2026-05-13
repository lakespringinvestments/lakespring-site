import type { Portfolio } from "../../../types/portfolio";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function MetricCards({ portfolio }: { portfolio: Portfolio }) {
  const cards = [
    {
      label: "Premium collected",
      value: fmt(portfolio.premiumYTD),
      sub: "Year to date",
    },
    {
      label: "Open positions",
      value: portfolio.openPositions.toString(),
      sub: `${portfolio.shortCalls} short calls`,
    },
    {
      label: "Cash",
      value: fmt(portfolio.cash),
      sub: `${portfolio.cashPct.toFixed(1)}% of NAV`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-cream-100 rounded-xl p-5"
        >
          <p className="text-xs uppercase tracking-wide text-ink-500 mb-2">
            {c.label}
          </p>
          <p className="font-serif text-3xl text-teal-600 tracking-tight">
            {c.value}
          </p>
          <p className="text-xs text-ink-400 mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
