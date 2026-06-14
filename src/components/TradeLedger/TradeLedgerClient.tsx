// src/components/TradeLedger/TradeLedgerClient.tsx
// update-137: Interactive trade ledger with ticker filter, expandable rationale, member gate
"use client";

import { useState, useMemo } from "react";
import type { Trade } from "@/lib/trades";

/* ── helpers ── */
function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatPct(n: number | null) {
  if (n === null) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function isMember(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("lakespring_member") === "true";
}

function isWithin30Days(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}

/* ── Chevron icon ── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── main component ── */
export default function TradeLedgerClient({ trades }: { trades: Trade[] }) {
  const [ticker, setTicker] = useState<string>("ALL");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [member] = useState<boolean>(isMember);

  /* unique tickers for filter */
  const tickers = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => {
      if (t.ticker) set.add(t.ticker);
    });
    return Array.from(set).sort();
  }, [trades]);

  /* filter + 30-day lag for non-members */
  const visibleTrades = useMemo(() => {
    let filtered = trades;

    // Ticker filter
    if (ticker !== "ALL") {
      filtered = filtered.filter((t) => t.ticker === ticker);
    }

    // Only show closed trades (status contains "Closed", "Expired", "Assigned", "Rolled")
    filtered = filtered.filter((t) => {
      const s = t.status.toLowerCase();
      return (
        s.includes("closed") ||
        s.includes("expired") ||
        s.includes("assigned") ||
        s.includes("rolled")
      );
    });

    // 30-day lag for non-members
    if (!member) {
      filtered = filtered.filter((t) => {
        const dateToCheck = t.closeDate || t.openDate;
        return !isWithin30Days(dateToCheck);
      });
    }

    return filtered;
  }, [trades, ticker, member]);

  /* summary stats */
  const stats = useMemo(() => {
    const totalClosed = visibleTrades.length;
    const premiumCollected = visibleTrades.reduce(
      (sum, t) => sum + (t.totalPremiumUsd ?? 0),
      0
    );
    const realizedPnl = visibleTrades.reduce(
      (sum, t) => sum + (t.gainLossUsd ?? 0),
      0
    );
    const winners = visibleTrades.filter(
      (t) => (t.gainLossUsd ?? 0) > 0
    ).length;
    const winRate = totalClosed > 0 ? Math.round((winners / totalClosed) * 100) : 0;
    return { totalClosed, premiumCollected, realizedPnl, winRate };
  }, [visibleTrades]);

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
        <label className="text-[10px] uppercase tracking-[0.2em] text-sage-300">
          Filter by ticker
        </label>
        <select
          value={ticker}
          onChange={(e) => {
            setTicker(e.target.value);
            setExpandedIdx(null);
          }}
          className="bg-white/[0.06] border border-white/15 text-cream-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sage-400 transition-colors cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            paddingRight: "32px",
          }}
        >
          <option value="ALL">All tickers</option>
          {tickers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {!member && (
          <span className="text-[10px] uppercase tracking-[0.15em] text-amber-400/80 ml-auto">
            30-day public delay active
          </span>
        )}
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-white/15">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-1">
            Total closed
          </p>
          <p className="text-2xl text-white font-semibold">{stats.totalClosed}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-1">
            Premium collected
          </p>
          <p className="text-2xl text-white font-semibold">
            {formatCurrency(stats.premiumCollected)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-1">
            Realized P&L
          </p>
          <p
            className={`text-2xl font-semibold ${
              stats.realizedPnl >= 0 ? "text-sage-300" : "text-red-400"
            }`}
          >
            {stats.realizedPnl >= 0 ? "+" : ""}
            {formatCurrency(stats.realizedPnl)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-1">
            Win rate
          </p>
          <p className="text-2xl text-white font-semibold">{stats.winRate}%</p>
        </div>
      </div>

      {/* Ledger table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] text-sage-300 text-left">
              <th className="pb-4 pr-3 font-medium w-8"></th>
              <th className="pb-4 pr-4 font-medium">Ticker</th>
              <th className="pb-4 pr-4 font-medium">Type</th>
              <th className="pb-4 pr-4 font-medium text-right">Strike</th>
              <th className="pb-4 pr-4 font-medium">Opened</th>
              <th className="pb-4 pr-4 font-medium">Closed</th>
              <th className="pb-4 pr-4 font-medium text-right">Premium</th>
              <th className="pb-4 pr-4 font-medium text-right">P&L</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm">
            {visibleTrades.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sage-300/60">
                  {ticker === "ALL"
                    ? "No closed trades available yet."
                    : `No closed trades for ${ticker}.`}
                </td>
              </tr>
            )}
            {visibleTrades.map((t, i) => {
              const isOpen = expandedIdx === i;
              const hasRationale = !!t.rationale.trim();
              const pnl = t.gainLossUsd;

              return (
                <tbody key={i}>
                  <tr
                    className={`border-t border-white/10 transition-colors ${
                      hasRationale
                        ? "cursor-pointer hover:bg-white/[0.04]"
                        : "hover:bg-white/[0.03]"
                    } ${isOpen ? "bg-white/[0.04]" : ""}`}
                    onClick={() => {
                      if (hasRationale) setExpandedIdx(isOpen ? null : i);
                    }}
                  >
                    <td className="py-4 pr-3 text-sage-300/50">
                      {hasRationale && <ChevronIcon open={isOpen} />}
                    </td>
                    <td className="py-4 pr-4 text-white font-semibold tracking-wide">
                      {t.ticker}
                    </td>
                    <td className="py-4 pr-4 text-cream-100">{t.optionType || t.direction || "—"}</td>
                    <td className="py-4 pr-4 text-cream-100 text-right tabular-nums">
                      {t.strike ? formatCurrency(t.strike) : "—"}
                    </td>
                    <td className="py-4 pr-4 text-cream-100/80 tabular-nums whitespace-nowrap">
                      {formatDate(t.openDate)}
                    </td>
                    <td className="py-4 pr-4 text-cream-100/80 tabular-nums whitespace-nowrap">
                      {formatDate(t.closeDate)}
                    </td>
                    <td className="py-4 pr-4 text-white text-right tabular-nums font-medium">
                      {formatCurrency(t.totalPremiumUsd)}
                    </td>
                    <td
                      className={`py-4 pr-4 text-right tabular-nums font-medium ${
                        pnl !== null && pnl >= 0 ? "text-sage-300" : "text-red-400"
                      }`}
                    >
                      {pnl !== null
                        ? `${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}`
                        : "—"}
                      {t.returnPct !== null && (
                        <span className="text-xs text-cream-100/50 ml-1.5">
                          {formatPct(t.returnPct)}
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          t.status.toLowerCase().includes("expired")
                            ? "bg-sage-500/20 text-sage-300"
                            : t.status.toLowerCase().includes("assigned")
                            ? "bg-amber-500/15 text-amber-300"
                            : t.status.toLowerCase().includes("rolled")
                            ? "bg-blue-500/15 text-blue-300"
                            : t.status.toLowerCase().includes("closed")
                            ? "bg-sage-500/20 text-sage-300"
                            : "bg-cream-100/10 text-cream-100"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                  {/* Expandable rationale row */}
                  {isOpen && hasRationale && (
                    <tr className="bg-white/[0.02]">
                      <td></td>
                      <td colSpan={8} className="pb-5 pt-1 pr-6">
                        <div className="text-cream-100/70 text-sm leading-relaxed pl-0.5">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-sage-300/60 block mb-1.5">
                            Rationale
                          </span>
                          {t.rationale}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
