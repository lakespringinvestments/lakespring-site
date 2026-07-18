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
const CRYPTO_TICKERS = new Set(["BTC", "ETH"]);

const THEME: Record<PortfolioView, { bg: string; label: string }> = {
  first:  { bg: "#034147", label: "First Principles" },
  second: { bg: "#00857A", label: "Thematic Momentum" },
  crypto: { bg: "#F7931A", label: "Crypto" },
  cash:   { bg: "#0A0A0A", label: "Cash & Premiums" },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function MetricCards({ portfolio, allTrades, view, setView }: MetricCardsProps) {
  const theme = THEME[view];

  // Match trade ledger logic: 2026+, exclude transfers/FPP/stock purchase
  const relevantTrades = allTrades.filter((t) => {
    if (t.openDate < "2026-01-01") return false;
    const st = (t.strategyType ?? "").toLowerCase();
    if (EXCLUDE_STRATS.has(st)) return false;
    if ((t.description ?? "").toUpperCase().includes("TRANSFER IN")) return false;
    if (CAPGAINS_STRATS.has(st)) return false;
    const ticker = t.ticker.toUpperCase();
    const isFP = FP_TICKERS.has(ticker);
    const isCrypto = CRYPTO_TICKERS.has(ticker);
    if (view === "first") return isFP;
    if (view === "second") return !isFP && !isCrypto;
    if (view === "crypto") return isCrypto;
    // Cash view: show all options trades (premiums)
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

  const openCount = optionsTrades.filter((t) => t.status?.toLowerCase() === "open").length;

  // View-specific metric cards
  const cryptoHoldings = portfolio.holdings.filter(h => CRYPTO_TICKERS.has(h.ticker));
  const cryptoTotal = cryptoHoldings.reduce((sum, h) => {
    const mktVal = (h.weight / 100) * portfolio.totalValue;
    return sum + mktVal;
  }, 0);

  const cashHolding = portfolio.holdings.find(h => h.ticker === "CASH");
  const cashBalance = cashHolding ? Math.round((cashHolding.weight / 100) * portfolio.totalValue) : portfolio.cash ?? 0;

  let cards: { label: string; value: string; sub: string }[];

  if (view === "crypto") {
    const btc = cryptoHoldings.find(h => h.ticker === "BTC");
    const eth = cryptoHoldings.find(h => h.ticker === "ETH");
    cards = [
      { label: "Crypto portfolio", value: cryptoTotal > 0 ? fmt(cryptoTotal) : "—", sub: "Total market value" },
      { label: "Bitcoin", value: btc ? "$" + btc.price.toLocaleString() : "—", sub: btc ? `${((btc.weight / (cryptoHoldings.reduce((s,h) => s + h.weight, 0) || 1)) * 100).toFixed(0)}% of crypto` : "—" },
      { label: "Ethereum", value: eth ? "$" + eth.price.toLocaleString() : "—", sub: eth ? `${((eth.weight / (cryptoHoldings.reduce((s,h) => s + h.weight, 0) || 1)) * 100).toFixed(0)}% of crypto` : "—" },
      { label: "Crypto allocation", value: portfolio.totalValue > 0 ? ((cryptoTotal / portfolio.totalValue) * 100).toFixed(0) + "%" : "—", sub: "% of total portfolio" },
    ];
  } else if (view === "cash") {
    cards = [
      { label: "Cash balance", value: fmt(cashBalance), sub: "USD available" },
      { label: "YTD premiums collected", value: fmt(netOptionsIncome || portfolio.premiumYTD), sub: "All portfolios combined" },
      { label: "Avg weekly premiums", value: avgWeekly > 0 ? fmt(avgWeekly) : fmt(Math.round(portfolio.premiumYTD / 22)), sub: `${weeksElapsed} weeks tracked` },
      { label: "Monthly withdrawal", value: "$2,500", sub: "1st of each month" },
    ];
  } else {
    cards = [
      { label: "Net options income", value: fmt(netOptionsIncome || portfolio.premiumYTD), sub: "YTD net (STO − BTC)" },
      { label: "Avg weekly premiums", value: avgWeekly > 0 ? fmt(avgWeekly) : fmt(Math.round(portfolio.premiumYTD / 22)), sub: `W1–W${weeksElapsed} (${weeksElapsed} weeks)` },
      { label: "Annualized yield", value: annualizedYield, sub: "avg income / avg capital × 52" },
      { label: "Open positions", value: (openCount || portfolio.openPositions).toString(), sub: "Active contracts" },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
