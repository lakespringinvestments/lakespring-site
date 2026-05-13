import type { Portfolio } from "../../../types/portfolio";

const TICKER_COLORS: Record<string, string> = {
  TSLA: "#034147",
  NVDA: "#1D9E75",
  BTC: "#5DCAA5",
  PLTR: "#9FE1CB",
  ASML: "#347278",
  AMZN: "#1B5A60",
  GOOGL: "#5A6670",
  SOL: "#C5DCDE",
};

function pickColor(ticker: string, idx: number) {
  return TICKER_COLORS[ticker] ?? ["#034147", "#1D9E75", "#5DCAA5", "#9FE1CB", "#347278"][idx % 5];
}

function pickTextColor(bg: string) {
  // Dark backgrounds get white text, light get dark teal
  const dark = ["#034147", "#1B5A60", "#347278", "#1D9E75", "#5A6670"];
  return dark.includes(bg) ? "#ffffff" : "#01262A";
}

export default function HoldingsList({ portfolio }: { portfolio: Portfolio }) {
  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-8">
      <h2 className="text-sm uppercase tracking-wide text-ink-500 mb-5">
        Holdings
      </h2>
      <div className="divide-y divide-cream-200">
        {portfolio.holdings.map((h, i) => {
          const bg = pickColor(h.ticker, i);
          const fg = pickTextColor(bg);
          const positive = h.dayChangePct >= 0;
          return (
            <div
              key={h.ticker}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-medium tracking-wide"
                  style={{ background: bg, color: fg }}
                >
                  {h.ticker.slice(0, 4)}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900">{h.name}</p>
                  <p className="text-xs text-ink-500 tabular-nums">
                    ${h.price.toLocaleString()} · {h.weight.toFixed(0)}% of portfolio
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-medium tabular-nums ${
                  positive ? "text-sage-500" : "text-red-600"
                }`}
              >
                {positive ? "+" : ""}
                {h.dayChangePct.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
