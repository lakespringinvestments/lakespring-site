"use client";

import { useState } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";

interface MetricCardsProps {
  portfolio: Portfolio;
  allTrades: Trade[];
}

type PortfolioView = "first" | "second";

const OPTIONS_TYPES = new Set(["CSP", "CC"]);

// First Principles tickers
const FP_TICKERS = new Set(["TSLA", "NVDA", "PLTR", "AMZN", "GOOGL"]);

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function MetricCards({ portfolio, allTrades }: MetricCardsProps) {
  const [view, setView] = useState<PortfolioView>("first");

  // Filter trades by portfolio type
  const relevantTrades = allTrades.filter((t) => {
    const isFP = FP_TICKERS.has(t.ticker.toUpperCase());
    return view === "first" ? isFP : !isFP;
  });

  const optionsTrades = relevantTrades.filter(
    (t) => OPTIONS_TYPES.has(t.optionType?.toUpperCase() ?? "")
  );

  // Total premiums for the selected portfolio
  const totalPremiums = optionsTrades.reduce((sum, t) => {
    const val = t.totalPremiumUsd ?? 0;
    return val > 0 ? sum + val : sum;
  }, 0);

  // Count distinct weeks with activity
  const weeks = new Set(optionsTrades.map((t) => {
    const date = t.closeDate || t.openDate;
    if (!date) return null;
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    return d.toISOString().slice(0, 10);
  }).filter(Boolean));

  const avgWeekly = weeks.size > 0 ? Math.round(totalPremiums / weeks.size) : 0;

  // Yield: total premiums / total capital deployed (sum of cash on assignment for open/assigned trades)
  const capitalDeployed = optionsTrades.reduce((sum, t) => {
    if (t.strike && t.contracts) {
      return sum + Math.abs(t.strike * t.contracts * 100);
    }
    return sum;
  }, 0);
  const yieldPct = capitalDeployed > 0
    ? ((totalPremiums / capitalDeployed) * 100).toFixed(1)
    : "—";

  // Open positions count
  const openCount = optionsTrades.filter(
    (t) => t.status?.toLowerCase() === "open"
  ).length;

  const cards = [
    {
      label: "YTD premiums",
      value: fmt(totalPremiums || portfolio.premiumYTD),
      sub: "USD collected",
    },
    {
      label: "Avg weekly premium",
      value: avgWeekly > 0 ? fmt(avgWeekly) : fmt(Math.round(portfolio.premiumYTD / 22)),
      sub: `Rolling ${weeks.size || 22} weeks`,
    },
    {
      label: "Yield on premiums",
      value: typeof yieldPct === "string" && yieldPct !== "—" ? `${yieldPct}%` : "—",
      sub: "vs margin / capital used",
    },
    {
      label: "Open positions",
      value: (openCount || portfolio.openPositions).toString(),
      sub: "Active contracts",
    },
  ];

  return (
    <div className="mt-5">
      {/* Portfolio toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setView("first")}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            view === "first"
              ? "bg-[#034147] text-white border-[#034147]"
              : "border-cream-300 text-ink-500 hover:border-teal-600"
          }`}
        >
          First Principles Portfolio
        </button>
        <button
          onClick={() => setView("second")}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            view === "second"
              ? "bg-[#034147] text-white border-[#034147]"
              : "border-cream-300 text-ink-500 hover:border-teal-600"
          }`}
        >
          Second Derivatives Portfolio
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-[#034147] rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">
              {c.label}
            </p>
            <p className="text-xl font-semibold text-white leading-none">
              {c.value}
            </p>
            <p className="text-[11px] text-white/40 mt-1.5">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
