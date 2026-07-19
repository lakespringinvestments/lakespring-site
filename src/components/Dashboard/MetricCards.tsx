"use client";

import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";
import type { PortfolioView } from "./types";

interface MetricCardsProps {
  portfolio: Portfolio;
  allTrades: Trade[];
  view: PortfolioView;
  setView: (v: PortfolioView) => void;
}

const OPTIONS_TYPES = new Set(["CSP", "CC", "PUTS", "CALLS"]);
const EXCLUDE_STRATS = new Set(["transfer", "fpp accumulation", "stock purchase"]);
const CAPGAINS_STRATS = new Set(["share sale", "assignment income", "swing trade"]);
const FP_TICKERS = new Set(["TSLA", "NVDA", "PLTR", "AMZN", "GOOGL", "GOOG", "LLY", "SPCX"]);
const CRYPTO_TICKERS = new Set(["BTC", "ETH", "SOL", "BMNR", "MSTR"]);
const CASH_TICKERS = new Set(["CASH"]);

const THEME: Record<PortfolioView, { bg: string; label: string }> = {
  first:  { bg: "#034147", label: "First Principles" },
  second: { bg: "#00857A", label: "Thematic Momentum" },
  crypto: { bg: "#F7931A", label: "Crypto" },
  cash:   { bg: "#54B949", label: "Cash & Premiums" },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function getViewTickers(view: PortfolioView) {
  switch (view) {
    case "first": return FP_TICKERS;
    case "second": return { has: (t: string) => !FP_TICKERS.has(t) && !CRYPTO_TICKERS.has(t) && !CASH_TICKERS.has(t) };
    case "crypto": return CRYPTO_TICKERS;
    case "cash": return CASH_TICKERS;
  }
}

export default function MetricCards({ portfolio, allTrades, view, setView }: MetricCardsProps) {
  const theme = THEME[view];

  // Calculate view's market value and allocation %
  const viewTickers = getViewTickers(view);
  const viewHoldings = portfolio.holdings.filter(h => viewTickers.has(h.ticker) && h.weight > 0);
  const viewMktValue = viewHoldings.reduce((sum, h) => sum + (h.weight / 100) * portfolio.totalValue, 0);
  const viewAllocation = portfolio.totalValue > 0 ? (viewMktValue / portfolio.totalValue) * 100 : 0;

  // Options income calculation
  const relevantTrades = allTrades.filter((t) => {
    if (t.openDate < "2026-01-01") return false;
    const st = (t.strategyType ?? "").toLowerCase();
    if (EXCLUDE_STRATS.has(st)) return false;
    if ((t.description ?? "").toUpperCase().includes("TRANSFER IN")) return false;
    if (CAPGAINS_STRATS.has(st)) return false;
    const ticker = t.ticker.toUpperCase();
    if (view === "cash") return true; // Cash view: all premiums
    const isFP = FP_TICKERS.has(ticker);
    const isCrypto = CRYPTO_TICKERS.has(ticker);
    if (view === "first") return isFP;
    if (view === "second") return !isFP && !isCrypto;
    if (view === "crypto") return isCrypto;
    return true;
  });

  const optionsTrades = relevantTrades.filter(
    (t) => OPTIONS_TYPES.has(t.optionType?.toUpperCase() ?? "")
  );

  const netOptionsIncome = optionsTrades.reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);

  const yearStart = new Date("2026-01-05");
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksElapsed = Math.max(1, Math.floor((now.getTime() - yearStart.getTime()) / msPerWeek) + 2);

  const avgWeekly = weeksElapsed > 0 ? Math.round(netOptionsIncome / weeksElapsed) : 0;

  const totalCapitalDeployed = optionsTrades.reduce((sum, t) => {
    if (t.strike && t.contracts) return sum + Math.abs(t.strike * t.contracts * 100);
    return sum;
  }, 0);
  const avgWeeklyCapital = weeksElapsed > 0 ? totalCapitalDeployed / weeksElapsed : 0;

  const annualizedYield = avgWeeklyCapital > 0 && avgWeekly > 0
    ? ((avgWeekly / avgWeeklyCapital) * 52 * 100).toFixed(1) + "%" : "—";

  // First card: allocation — same pattern for all views (cash uses "Cash balance" label)
  const allocationCard = {
    label: view === "cash" ? "Cash balance" : "Portfolio allocation",
    value: fmt(Math.round(viewMktValue)),
    sub: viewAllocation > 0 ? `${viewAllocation.toFixed(1)}% of total portfolio` : "No positions held",
  };

  let cards: { label: string; value: string; sub: string }[];

  if (view === "cash") {
    cards = [
      allocationCard,
      { label: "YTD premiums collected", value: fmt(netOptionsIncome || portfolio.premiumYTD), sub: "All portfolios combined" },
      { label: "Avg weekly premiums", value: avgWeekly > 0 ? fmt(avgWeekly) : fmt(Math.round(portfolio.premiumYTD / 22)), sub: `${weeksElapsed} weeks tracked` },
    ];
  } else {
    cards = [
      allocationCard,
      { label: "Net options income", value: fmt(netOptionsIncome || (view === "first" ? portfolio.premiumYTD : 0)), sub: "YTD net (STO − BTC)" },
      { label: "Avg weekly premiums", value: avgWeekly > 0 ? fmt(avgWeekly) : "—", sub: `W1–W${weeksElapsed} (${weeksElapsed} weeks)` },
      { label: "Annualized yield", value: annualizedYield, sub: "avg income / avg capital × 52" },
    ];
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2 mb-3">
        {(["first", "second", "crypto", "cash"] as PortfolioView[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={view === v
              ? { background: THEME[v].bg, color: "#fff", borderColor: THEME[v].bg }
              : { background: "transparent", color: "#666", borderColor: "#e0d8cc" }
            }
          >
            {THEME[v].label}
          </button>
        ))}
      </div>
      <div className={`grid gap-3 ${cards.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl p-4" style={{ background: theme.bg }}>
            <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              {c.label}
            </p>
            <p className="text-xl font-semibold text-white leading-none">{c.value}</p>
            <p className="text-[11px] mt-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
