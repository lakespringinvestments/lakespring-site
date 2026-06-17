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

const THEME: Record<PortfolioView, { bg: string; label: string }> = {
  first:  { bg: "#034147", label: "First Principles Portfolio" },
  second: { bg: "#00857A", label: "Second Derivatives Portfolio" },
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
    const isFP = FP_TICKERS.has(t.ticker.toUpperCase());
    return view === "first" ? isFP : !isFP;
  });

  const optionsTrades = relevantTrades.filter(
    (t) => OPTIONS_TYPES.has(t.optionType?.toUpperCase() ?? "")
  );

  // Net options income (matching trade ledger — includes BTC debits)
  const netOptionsIncome = optionsTrades.reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);

  // Calendar weeks elapsed from Jan 1, 2026 to today
  const yearStart = new Date("2026-01-05"); // First Monday of 2026 (W2)
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksElapsed = Math.max(1, Math.floor((now.getTime() - yearStart.getTime()) / msPerWeek) + 2); // +2 for W1

  const avgWeekly = weeksElapsed > 0 ? Math.round(netOptionsIncome / weeksElapsed) : 0;

  // Annualized yield: (avg weekly income × 52) / capital at risk
  // Primary: use open position capital. Fallback: avg weekly capital deployed.
  const openCapital = optionsTrades
    .filter((t) => t.status?.toLowerCase() === "open")
    .reduce((sum, t) => {
      if (t.strike && t.contracts) return sum + Math.abs(t.strike * t.contracts * 100);
      return sum;
    }, 0);

  // Fallback: average capital deployed per active week
  const weekCapMap = new Map<string, number>();
  for (const t of optionsTrades) {
    if (!t.openDate || !t.strike || !t.contracts) continue;
    const d = new Date(t.openDate);
    if (isNaN(d.getTime())) continue;
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    const wk = d.toISOString().slice(0, 10);
    weekCapMap.set(wk, (weekCapMap.get(wk) ?? 0) + Math.abs(t.strike * t.contracts * 100));
  }
  const avgWeeklyCapital = weekCapMap.size > 0
    ? Array.from(weekCapMap.values()).reduce((s, v) => s + v, 0) / weekCapMap.size
    : 0;

  const yieldCapital = openCapital > 0 ? openCapital : avgWeeklyCapital;
  const yieldLabel = openCapital > 0 ? "avg weekly × 52 / open capital" : "avg weekly × 52 / avg capital deployed";

  const annualizedYield = yieldCapital > 0 && avgWeekly > 0
    ? ((avgWeekly * 52) / yieldCapital * 100).toFixed(1) + "%" : "—";

  const openCount = optionsTrades.filter((t) => t.status?.toLowerCase() === "open").length;

  const cards = [
    { label: "Net options income",     value: fmt(netOptionsIncome || portfolio.premiumYTD), sub: "YTD net (STO − BTC)" },
    { label: "Avg weekly premiums",    value: avgWeekly > 0 ? fmt(avgWeekly) : fmt(Math.round(portfolio.premiumYTD / 22)), sub: `W1–W${weeksElapsed} (${weeksElapsed} weeks)` },
    { label: "Annualized yield",       value: annualizedYield, sub: yieldLabel },
    { label: "Open positions",         value: (openCount || portfolio.openPositions).toString(), sub: "Active contracts" },
  ];

  return (
    <div className="mt-5">
      <div className="flex gap-2 mb-3">
        {(["first", "second"] as PortfolioView[]).map((v) => (
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
