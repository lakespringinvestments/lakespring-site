import Image from "next/image";
import type { Portfolio } from "../../../types/portfolio";

// Brand colours per ticker
const TICKER_COLORS: Record<string, string> = {
  TSLA: "#CC0000",   // Tesla red
  NVDA: "#76B900",   // Nvidia green
  PLTR: "#101113",   // Palantir black
  ASML: "#0071C5",   // ASML blue
  AMZN: "#FF9900",   // Amazon orange
  GOOGL: "#4285F4",  // Google blue
};

// Logo paths — place these in /public/logos/
const TICKER_LOGOS: Record<string, string> = {
  TSLA:  "/logos/tesla.png",
  NVDA:  "/logos/nvidia.png",
  PLTR:  "/logos/palantir.png",
  ASML:  "/logos/asml.jpg",
  AMZN:  "/logos/amazon.jpg",
  GOOGL: "/logos/google.jpg",
};

// Tickers to exclude from this page
const EXCLUDED = new Set(["BTC", "SOL"]);

function pickColor(ticker: string, idx: number) {
  return TICKER_COLORS[ticker] ?? ["#034147", "#1D9E75", "#5DCAA5", "#347278"][idx % 4];
}

function pickTextColor(bg: string) {
  // Light backgrounds need dark text
  const lightBgs = ["#76B900", "#FF9900", "#4285F4"];
  return lightBgs.includes(bg) ? "#0a0a0a" : "#ffffff";
}

export default function HoldingsList({ portfolio }: { portfolio: Portfolio }) {
  const holdings = portfolio.holdings.filter((h) => !EXCLUDED.has(h.ticker));

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-8">
      <h2 className="text-sm uppercase tracking-wide text-ink-500 mb-5">
        Holdings
      </h2>
      <div className="divide-y divide-cream-200">
        {holdings.map((h, i) => {
          const bg = pickColor(h.ticker, i);
          const fg = pickTextColor(bg);
          const logoSrc = TICKER_LOGOS[h.ticker];
          const positive = h.dayChangePct >= 0;

          return (
            <div key={h.ticker} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {/* Logo tile */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ background: bg }}
                >
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={h.ticker}
                      width={36}
                      height={36}
                      className="object-contain p-0.5"
                    />
                  ) : (
                    <span
                      className="text-[11px] font-medium tracking-wide"
                      style={{ color: fg }}
                    >
                      {h.ticker.slice(0, 4)}
                    </span>
                  )}
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
