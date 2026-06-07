import type { Portfolio } from "../../../types/portfolio";

const BOOK_COSTS: Record<string, number> = {
  TSLA:  210675,
  NVDA:  18028,
  PLTR:  72500,
  AMZN:  0,
  GOOGL: 0,
};

const EXCLUDED = new Set(["BTC", "SOL", "ASML"]);

function fmt(n: number) {
  if (n === 0) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function CapitalGainsTable({ portfolio }: { portfolio: Portfolio }) {
  const holdings = portfolio.holdings.filter((h) => !EXCLUDED.has(h.ticker));

  const COLS = ["Ticker", "Book cost", "Mkt value", "Capital gain", "ROI"];

  return (
    <section className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
      {/* Dark teal header row */}
      <div
        className="grid px-5 py-3"
        style={{
          gridTemplateColumns: "80px 1fr 1fr 1fr 70px",
          gap: "8px",
          background: "#034147",
        }}
      >
        {COLS.map((col) => (
          <span key={col} className="text-[10px] uppercase tracking-wide font-medium text-white/80">
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-cream-100">
        {holdings.map((h) => {
          const bookCost = BOOK_COSTS[h.ticker] ?? 0;
          const mktValue = h.weight > 0
            ? Math.round((h.weight / 100) * portfolio.totalValue)
            : 0;
          const hasPosition = bookCost > 0 && mktValue > 0;
          const capitalGain = hasPosition ? mktValue - bookCost : null;
          const roi = hasPosition && bookCost > 0
            ? ((mktValue - bookCost) / bookCost) * 100
            : null;

          return (
            <div
              key={h.ticker}
              className="grid px-5 py-3 items-center text-xs"
              style={{ gridTemplateColumns: "80px 1fr 1fr 1fr 70px", gap: "8px" }}
            >
              <span
                className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded w-fit"
                style={{ background: "rgba(3,65,71,0.08)", color: "#034147" }}
              >
                {h.ticker}
              </span>
              <span className="text-ink-700 tabular-nums">{fmt(bookCost)}</span>
              <span
                className="tabular-nums font-medium"
                style={{ color: mktValue > 0 ? "#1D9E75" : "#888" }}
              >
                {mktValue > 0 ? fmt(mktValue) : "—"}
              </span>
              <span
                className="tabular-nums font-medium"
                style={{
                  color: capitalGain === null ? "#888"
                    : capitalGain >= 0 ? "#1D9E75"
                    : "#E24B4A",
                }}
              >
                {capitalGain !== null
                  ? (capitalGain >= 0 ? "+" : "") + fmt(Math.abs(capitalGain))
                  : "No position"}
              </span>
              <span
                className="tabular-nums font-medium"
                style={{
                  color: roi === null ? "#888"
                    : roi >= 0 ? "#1D9E75"
                    : "#E24B4A",
                }}
              >
                {roi !== null
                  ? (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%"
                  : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
