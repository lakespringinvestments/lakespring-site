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

const OPTIONS_TYPES = new Set(["CSP", "CC"]);
const FP_TICKERS = new Set(["TSLA", "NVDA", "PLTR", "AMZN", "GOOGL"]);

const THEME: Record<PortfolioView, { bg: string; label: string }> = {
  first:  { bg: "#034147", label: "First Principles Portfolio" },
  second: { bg: "#00857A", label: "Second Derivatives Portfolio" },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function MetricCards({ portfolio, allTrades, view, setView }: MetricCardsProps) {
  const theme = THEME[view];

  const relevantTrades = allTrades.filter((t) => {
    const isFP = FP_TICKERS.has(t.ticker.toUpperCase());
    return view === "first" ? isFP : !isFP;
  });

  const optionsTrades = relevantTrades.filter(
    (t) => OPTIONS_TYPES.has(t.optionType?.toUpperCase() ?? "")
  );

  const totalPremiums = optionsTrades.reduce((sum, t) => {
    const val = t.totalPremiumUsd ?? 0;
    return val > 0 ? sum + val : sum;
  }, 0);

  const weeks = new Set(
    optionsTrades.map((t) => {
      const date = t.closeDate || t.openDate;
      if (!date) return null;
      const d = new Date(date);
      const day = d.getDay();
      d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
      return d.toISOString().slice(0, 10);
    }).filter(Boolean)
  );

  const avgWeekly = weeks.size > 0 ? Math.round(totalPremiums / weeks.size) : 0;

  const capitalDeployed = optionsTrades.reduce((sum, t) => {
    if (t.strike && t.contracts) return sum + Math.abs(t.strike * t.contracts * 100);
    return sum;
  }, 0);
  const yieldPct = capitalDeployed > 0
    ? ((totalPremiums / capitalDeployed) * 100).toFixed(1) + "%" : "—";

  const openCount = optionsTrades.filter((t) => t.status?.toLowerCase() === "open").length;

  const cards = [
    { label: "YTD premiums",       value: fmt(totalPremiums || portfolio.premiumYTD), sub: "USD collected" },
    { label: "Avg weekly premium", value: avgWeekly > 0 ? fmt(avgWeekly) : fmt(Math.round(portfolio.premiumYTD / 22)), sub: `Rolling ${weeks.size || 22} weeks` },
    { label: "Yield on premiums",  value: yieldPct, sub: "vs margin / capital used" },
    { label: "Open positions",     value: (openCount || portfolio.openPositions).toString(), sub: "Active contracts" },
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
