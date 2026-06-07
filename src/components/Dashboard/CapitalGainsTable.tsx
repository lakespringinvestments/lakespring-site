import type { Portfolio } from "../../../types/portfolio";

// Hardcoded book costs from your Current Portfolio Summary tab
// These will be updated when the sheets integration is expanded
const BOOK_COSTS: Record<string, number> = {
  TSLA:  210675,  // 300sh @ $325.05 + 38sh @ $293.92 + 341sh TFSA @ $298.52
  NVDA:  18028,   // Original 100sh TFSA @ $138.67 (sold Mar 20; shown for reference)
  PLTR:  72500,   // 500sh @ $145 ACB
  AMZN:  0,
  GOOGL: 0,
};

const EXCLUDED = new Set(["BTC", "SOL", "ASML"]);

function fmt(n: number) {
  if (n === 0) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function CapitalGainsTable({ portfolio }: { portfolio: Portfolio }) {
  const holdings = portfolio.holdings.filter(
    (h) => !EXCLUDED.has(h.ticker)
  );

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6">
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-4">
        First Principles — Capital Gains
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cream-200">
              {["Ticker", "Book cost", "Mkt value", "ROI"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-400 font-medium pb-2 pr-4 last:pr-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {holdings.map((h) => {
              const bookCost = BOOK_COSTS[h.ticker] ?? 0;
              // Approximate market value from weight + total portfolio value
              const mktValue = h.weight > 0
                ? Math.round((h.weight / 100) * portfolio.totalValue)
                : 0;
              const hasPosition = bookCost > 0 && mktValue > 0;
              const roi = hasPosition
                ? ((mktValue - bookCost) / bookCost) * 100
                : null;

              return (
                <tr key={h.ticker} className="group">
                  <td className="py-3 pr-4">
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-600/10 text-teal-700">
                      {h.ticker}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-ink-700 tabular-nums text-xs">
                    {fmt(bookCost)}
                  </td>
                  <td className="py-3 pr-4 text-ink-700 tabular-nums text-xs">
                    {mktValue > 0 ? fmt(mktValue) : "—"}
                  </td>
                  <td className="py-3 text-xs font-medium tabular-nums">
                    {roi !== null ? (
                      <span className={roi >= 0 ? "text-sage-600" : "text-red-600"}>
                        {roi >= 0 ? "+" : ""}
                        {roi.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-ink-400">No position</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
