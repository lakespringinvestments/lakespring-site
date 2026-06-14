// src/components/TradeLedger/TradeLedgerClient.tsx
// update-140: Position netting for win rate, drop redundant Premium col, col M for all values
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

function isPut(t: Trade): boolean {
  const ot = t.optionType.toLowerCase();
  return ot === "puts" || ot === "csp" || ot === "put";
}

function isCall(t: Trade): boolean {
  const ot = t.optionType.toLowerCase();
  return ot === "calls" || ot === "cc" || ot === "call";
}

/**
 * Group adjacent same-ticker, same-close-date trades into positions.
 * Returns array of net P&L values per position for win rate calculation.
 * e.g. a roll (BTC at -$3,500 + STO at +$4,830) sharing a close date
 * becomes one position with net P&L of +$1,330.
 */
function groupPositions(trades: Trade[]): number[] {
  const positions: number[] = [];
  let i = 0;
  while (i < trades.length) {
    const ticker = trades[i].ticker;
    const closeDate = trades[i].closeDate;
    let net = trades[i].gainLossUsd ?? 0;
    let j = i + 1;
    // Absorb adjacent trades with same ticker + same close date
    while (
      j < trades.length &&
      trades[j].ticker === ticker &&
      trades[j].closeDate === closeDate
    ) {
      net += trades[j].gainLossUsd ?? 0;
      j++;
    }
    positions.push(net);
    i = j;
  }
  return positions;
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

  /* unique tickers for filter — exclude junk rows from sheet */
  const TICKER_BLOCKLIST = new Set(["TICKER", "N/A", ""]);
  const isValidTicker = (s: string) =>
    s.length > 0 &&
    s.length <= 6 &&
    !TICKER_BLOCKLIST.has(s) &&
    /^[A-Z]{1,6}$/.test(s);

  const tickers = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => {
      if (isValidTicker(t.ticker)) set.add(t.ticker);
    });
    return Array.from(set).sort();
  }, [trades]);

  /* filter + 30-day lag for non-members */
  const visibleTrades = useMemo(() => {
    let filtered = trades;

    if (ticker !== "ALL") {
      filtered = filtered.filter((t) => t.ticker === ticker);
    }

    filtered = filtered.filter((t) => {
      const s = t.status.toLowerCase();
      return (
        s.includes("closed") ||
        s.includes("expired") ||
        s.includes("assigned") ||
        s.includes("rolled")
      );
    });

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
    const totalLegs = visibleTrades.length;
    const putsCount = visibleTrades.filter(isPut).length;
    const callsCount = visibleTrades.filter(isCall).length;
    const putsPct = totalLegs > 0 ? Math.round((putsCount / totalLegs) * 100) : 0;
    const callsPct = totalLegs > 0 ? Math.round((callsCount / totalLegs) * 100) : 0;

    // Premium collected = sum of positive col M values (STO income)
    const premiumCollected = visibleTrades.reduce(
      (sum, t) => {
        const val = t.gainLossUsd ?? 0;
        return val > 0 ? sum + val : sum;
      },
      0
    );

    // Realized P&L = sum of ALL col M (nets BTC + STO legs naturally)
    const realizedPnl = visibleTrades.reduce(
      (sum, t) => sum + (t.gainLossUsd ?? 0),
      0
    );

    // Win rate: group adjacent same-ticker same-close-date legs into positions
    const positions = groupPositions(visibleTrades);
    const positionCount = positions.length;
    const winners = positions.filter((net) => net > 0).length;
    const winRate = positionCount > 0 ? Math.round((winners / positionCount) * 100) : 0;

    return { totalLegs, putsCount, callsCount, putsPct, callsPct, premiumCollected, realizedPnl, positionCount, winRate };
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {/* Total Trades */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">
            Total trades
          </p>
          <p className="text-2xl text-white font-semibold mb-2">{stats.totalLegs}</p>
          <div className="flex items-center gap-3 text-xs text-cream-100/60">
            <span>{stats.putsCount} puts ({stats.putsPct}%)</span>
            <span className="text-white/20">|</span>
            <span>{stats.callsCount} calls ({stats.callsPct}%)</span>
          </div>
        </div>

        {/* Premium Collected */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">
            Premium collected
          </p>
          <p className="text-2xl text-white font-semibold">
            {formatCurrency(stats.premiumCollected)}
          </p>
        </div>

        {/* Realized P&L */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">
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
          <p className="text-[10px] text-cream-100/40 mt-1">Incl. premium &amp; capital gains</p>
        </div>

        {/* Win Rate */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">
            Win rate
          </p>
          <p className="text-2xl text-white font-semibold">{stats.winRate}%</p>
          <p className="text-[10px] text-cream-100/40 mt-1">{stats.positionCount} positions netted</p>
        </div>
      </div>

      {/* Ledger table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[760px] table-fixed">
          <colgroup>
            <col className="w-[36px]" />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] text-sage-300 text-center">
              <th className="pb-4 font-medium"></th>
              <th className="pb-4 font-medium">Ticker</th>
              <th className="pb-4 font-medium">Type</th>
              <th className="pb-4 font-medium">Strike</th>
              <th className="pb-4 font-medium">Opened</th>
              <th className="pb-4 font-medium">Closed</th>
              <th className="pb-4 font-medium">P&L</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          {visibleTrades.length === 0 ? (
            <tbody className="font-sans text-sm">
              <tr>
                <td colSpan={8} className="py-12 text-center text-sage-300/60">
                  {ticker === "ALL"
                    ? "No closed trades available yet."
                    : `No closed trades for ${ticker}.`}
                </td>
              </tr>
            </tbody>
          ) : (
            visibleTrades.map((t, i) => {
              const isOpen = expandedIdx === i;
              const hasRationale = !!t.rationale.trim();
              const pnl = t.gainLossUsd;

              return (
                <tbody key={i} className="font-sans text-sm">
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
                    <td className="py-4 text-center text-sage-300/50 align-middle">
                      {hasRationale && <ChevronIcon open={isOpen} />}
                    </td>
                    <td className="py-4 text-center text-white font-semibold tracking-wide align-middle">
                      {t.ticker}
                    </td>
                    <td className="py-4 text-center text-cream-100 align-middle">
                      {t.optionType || t.direction || "—"}
                    </td>
                    <td className="py-4 text-center text-cream-100 tabular-nums align-middle">
                      {t.strike ? formatCurrency(t.strike) : "—"}
                    </td>
                    <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">
                      {formatDate(t.openDate)}
                    </td>
                    <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">
                      {formatDate(t.closeDate)}
                    </td>
                    <td
                      className={`py-4 text-center tabular-nums font-medium align-middle ${
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
                    <td className="py-4 text-center align-middle">
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
                      <td colSpan={7} className="pb-5 pt-1 pr-6">
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
            })
          )}
        </table>
      </div>
    </>
  );
}
