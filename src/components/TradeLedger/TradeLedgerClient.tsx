// src/components/TradeLedger/TradeLedgerClient.tsx
// update-155: Remove roll grouping, fix win rate definition, show all legs individually
"use client";

import { useState, useMemo } from "react";
import type { Trade } from "@/lib/trades";

/* ── helpers ── */
function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function isPut(t: Trade) {
  const ot = t.optionType.toLowerCase();
  return ot === "puts" || ot === "csp" || ot === "put";
}

function isCall(t: Trade) {
  const ot = t.optionType.toLowerCase();
  return ot === "calls" || ot === "cc" || ot === "call";
}

/* ── Excluded strategies (matches Excel SUMIFS exactly) ── */
const EXCLUDE_STRATEGIES = new Set(["transfer", "fpp accumulation", "stock purchase"]);
const CAPGAINS_STRATEGIES = new Set(["share sale", "assignment income", "swing trade"]);

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── main ── */
export default function TradeLedgerClient({ trades }: { trades: Trade[] }) {
  const [ticker, setTicker] = useState<string>("ALL");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const TICKER_BLOCKLIST = new Set(["TICKER", "N/A", ""]);
  const isValidTicker = (s: string) =>
    s.length > 0 && s.length <= 6 && !TICKER_BLOCKLIST.has(s) && /^[A-Z]{1,6}$/.test(s);

  const tickers = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => { if (isValidTicker(t.ticker)) set.add(t.ticker); });
    return Array.from(set).sort();
  }, [trades]);

  /* Match Excel SUMIFS: openDate in 2026, exclude transfers/FPP/stock purchase */
  const allIncludedTrades = useMemo(() => {
    return trades.filter((t) => {
      if (t.openDate < "2026-01-01") return false;
      if (ticker !== "ALL" && t.ticker !== ticker) return false;
      const st = t.strategyType.toLowerCase();
      if (EXCLUDE_STRATEGIES.has(st)) return false;
      if (t.description.toUpperCase().includes("TRANSFER IN")) return false;
      return true;
    });
  }, [trades, ticker]);

  /* Split: options trades (for table) vs capital gains (for card only) */
  const optionsTrades = useMemo(() => {
    return allIncludedTrades.filter((t) => !CAPGAINS_STRATEGIES.has(t.strategyType.toLowerCase()));
  }, [allIncludedTrades]);

  const capitalGainsTrades = useMemo(() => {
    return allIncludedTrades.filter((t) => CAPGAINS_STRATEGIES.has(t.strategyType.toLowerCase()));
  }, [allIncludedTrades]);

  /* Stats */
  const stats = useMemo(() => {
    const totalLegs = optionsTrades.length;
    const putsCount = optionsTrades.filter(isPut).length;
    const callsCount = optionsTrades.filter(isCall).length;

    const netOptionsIncome = optionsTrades.reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);
    const capitalGainsPnl = capitalGainsTrades.reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);
    const totalPnl = netOptionsIncome + capitalGainsPnl;

    // Win rate: trades where cash was received (P&L > 0)
    const positivePnlCount = optionsTrades.filter((t) => (t.gainLossUsd ?? 0) > 0).length;
    const winRate = totalLegs > 0 ? Math.round((positivePnlCount / totalLegs) * 100) : 0;

    return { totalLegs, putsCount, callsCount, netOptionsIncome, capitalGainsPnl, totalPnl, positivePnlCount, winRate };
  }, [optionsTrades, capitalGainsTrades]);

  return (
    <>
      {/* Filter */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
        <label className="text-[10px] uppercase tracking-[0.2em] text-sage-300">Filter by ticker</label>
        <select value={ticker}
          onChange={(e) => { setTicker(e.target.value); setExpandedIdx(null); }}
          className="bg-[#1a1a1a] border border-white/15 text-cream-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sage-400 transition-colors cursor-pointer appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "32px" }}>
          <option value="ALL" className="bg-[#1a1a1a] text-white">All tickers</option>
          {tickers.map((t) => (<option key={t} value={t} className="bg-[#1a1a1a] text-white">{t}</option>))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">Net Options Income</p>
          <p className={`text-2xl font-semibold ${stats.netOptionsIncome >= 0 ? "text-sage-300" : "text-red-400"}`}>
            {stats.netOptionsIncome >= 0 ? "+" : ""}{formatCurrency(stats.netOptionsIncome)}
          </p>
          <p className="text-[10px] text-cream-100/40 mt-1">STO credits net of BTC debits</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">Realized Capital Gains</p>
          <p className={`text-2xl font-semibold ${stats.capitalGainsPnl >= 0 ? "text-sage-300" : "text-red-400"}`}>
            {stats.capitalGainsPnl >= 0 ? "+" : ""}{formatCurrency(stats.capitalGainsPnl)}
          </p>
          <p className="text-[10px] text-cream-100/40 mt-1">Share sales &amp; assignment equity</p>
        </div>
        <div className="bg-white/[0.06] border border-sage-500/30 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-sage-400/50"></div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">Total P&L</p>
          <p className={`text-2xl font-semibold ${stats.totalPnl >= 0 ? "text-sage-300" : "text-red-400"}`}>
            {stats.totalPnl >= 0 ? "+" : ""}{formatCurrency(stats.totalPnl)}
          </p>
          <p className="text-[10px] text-cream-100/40 mt-1">Options + capital gains</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">Total trades</p>
          <p className="text-2xl text-white font-semibold mb-2">{stats.totalLegs}</p>
          <div className="flex items-center gap-3 text-xs text-cream-100/60">
            <span>{stats.putsCount} puts</span>
            <span className="text-white/20">|</span>
            <span>{stats.callsCount} calls</span>
          </div>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">Win rate</p>
          <p className="text-2xl text-white font-semibold">{stats.winRate}%</p>
          <p className="text-[10px] text-cream-100/40 mt-1">Trades with positive P&L ({stats.positivePnlCount}/{stats.totalLegs})</p>
        </div>
      </div>

      {/* Ledger table — every leg shown individually */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[760px] table-fixed">
          <colgroup><col className="w-[36px]" /><col /><col /><col /><col /><col /><col /><col /></colgroup>
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
          {optionsTrades.length === 0 ? (
            <tbody className="font-sans text-sm">
              <tr><td colSpan={8} className="py-12 text-center text-sage-300/60">
                {ticker === "ALL" ? "No trades available yet." : `No trades for ${ticker}.`}
              </td></tr>
            </tbody>
          ) : (
            optionsTrades.map((t, i) => {
              const isOpen = expandedIdx === i;
              const hasRationale = !!t.rationale.trim();
              const pnl = t.gainLossUsd;
              return (
                <tbody key={i} className="font-sans text-sm">
                  <tr className={`border-t border-white/10 transition-colors ${hasRationale ? "cursor-pointer hover:bg-white/[0.04]" : "hover:bg-white/[0.03]"} ${isOpen ? "bg-white/[0.04]" : ""}`}
                    onClick={() => { if (hasRationale) setExpandedIdx(isOpen ? null : i); }}>
                    <td className="py-4 text-center text-sage-300/50 align-middle">{hasRationale && <ChevronIcon open={isOpen} />}</td>
                    <td className="py-4 text-center text-white font-semibold tracking-wide align-middle">{t.ticker}</td>
                    <td className="py-4 text-center text-cream-100 align-middle">{t.optionType || "—"}</td>
                    <td className="py-4 text-center text-cream-100 tabular-nums align-middle">{t.strike ? formatCurrency(t.strike) : "—"}</td>
                    <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">{formatDate(t.openDate)}</td>
                    <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">{formatDate(t.closeDate)}</td>
                    <td className={`py-4 text-center tabular-nums font-medium align-middle ${pnl !== null && pnl >= 0 ? "text-sage-300" : "text-red-400"}`}>
                      {pnl !== null ? `${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}` : "—"}
                    </td>
                    <td className="py-4 text-center align-middle">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                        t.status.toLowerCase().includes("expired") ? "bg-sage-500/20 text-sage-300"
                        : t.status.toLowerCase().includes("assigned") ? "bg-amber-500/15 text-amber-300"
                        : t.status.toLowerCase().includes("rolled") ? "bg-blue-500/15 text-blue-300"
                        : t.status.toLowerCase().includes("open") ? "bg-white/10 text-cream-100"
                        : "bg-sage-500/20 text-sage-300"
                      }`}>{t.status}</span>
                    </td>
                  </tr>
                  {isOpen && hasRationale && (
                    <tr className="bg-white/[0.02]"><td></td>
                      <td colSpan={7} className="pb-5 pt-1 pr-6">
                        <div className="text-cream-100/70 text-sm leading-relaxed pl-0.5">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-sage-300/60 block mb-1.5">Rationale</span>
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
