"use client";

import type { Portfolio } from "../../../types/portfolio";
import type { PortfolioView } from "./DashboardClient";

const BOOK_COSTS: Record<string, number> = {
  TSLA:  210675,
  NVDA:  18028,
  PLTR:  72500,
  AMZN:  0,
  GOOGL: 0,
};

const EXCLUDED = new Set(["BTC", "SOL", "ASML"]);
const FP_TICKERS = ["TSLA", "NVDA", "PLTR", "AMZN", "GOOGL"];
// Second derivatives — shown when that view is active
const SD_TICKERS = ["BTC", "SOL", "ASML"];

function fmt(n: number) {
  if (n === 0) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

interface Props {
  portfolio: Portfolio;
  view: PortfolioView;
}

export default function CapitalGainsTable({ portfolio, view }: Props) {
  const tickers = view === "first" ? FP_TICKERS : SD_TICKERS;
  const title = view === "first"
    ? "First Principles — Capital Gains"
    : "Second Derivatives — Capital Gains";

  // For SD tickers, use holdings data for market value
  const holdings = portfolio.holdings.filter((h) =>
    tickers.includes(h.ticker) && !EXCLUDED.has(h.ticker) || (view === "second" && tickers.includes(h.ticker))
  );

  // Build rows from tickers list so order is consistent
  const rows = tickers.map((ticker) => {
    const holding = portfolio.holdings.find((h) => h.ticker === ticker);
    const bookCost = BOOK_COSTS[ticker] ?? 0;
    const mktValue = holding && holding.weight > 0
      ? Math.round((holding.weight / 100) * portfolio.totalValue)
      : 0;
    const hasPosition = bookCost > 0 && mktValue > 0;
    const capitalGain = hasPosition ? mktValue - bookCost : null;
    const roi = hasPosition ? ((mktValue - bookCost) / bookCost) * 100 : null;

    return { ticker, bookCost, mktValue, capitalGain, roi };
  });

  const COLS = ["Ticker", "Book cost", "Mkt value", "Capital gain", "ROI"];

  return (
    <section className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
      {/* Dark teal header */}
      <div
        className="grid px-5 py-3 items-center"
        style={{ gridTemplateColumns: "80px 1fr 1fr 1fr 70px", gap: "8px", background: "#034147" }}
      >
        {COLS.map((col) => (
          <span key={col} className="text-[10px] uppercase tracking-wide font-medium text-white/80">
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-cream-100">
        {rows.map(({ ticker, bookCost, mktValue, capitalGain, roi }) => (
          <div
            key={ticker}
            className="grid px-5 py-3 items-center text-xs"
            style={{ gridTemplateColumns: "80px 1fr 1fr 1fr 70px", gap: "8px" }}
          >
            <span
              className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded w-fit"
              style={{ background: "rgba(3,65,71,0.08)", color: "#034147" }}
            >
              {ticker}
            </span>
            <span className="text-ink-700 tabular-nums">{fmt(bookCost)}</span>
            <span className="tabular-nums font-medium" style={{ color: mktValue > 0 ? "#1D9E75" : "#888" }}>
              {mktValue > 0 ? fmt(mktValue) : "—"}
            </span>
            <span
              className="tabular-nums font-medium"
              style={{ color: capitalGain === null ? "#888" : capitalGain >= 0 ? "#1D9E75" : "#E24B4A" }}
            >
              {capitalGain !== null
                ? (capitalGain >= 0 ? "+" : "") + fmt(Math.abs(capitalGain))
                : "No position"}
            </span>
            <span
              className="tabular-nums font-medium"
              style={{ color: roi === null ? "#888" : roi >= 0 ? "#1D9E75" : "#E24B4A" }}
            >
              {roi !== null ? (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%" : "—"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
