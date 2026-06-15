// src/components/TradeLedger/TradeLedgerClient.tsx
// update-151: Reorder cards, rename Capital Gains, style Total P&L as sum indicator
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

function formatPct(n: number | null) {
  if (n === null) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function isPut(t: Trade) {
  const ot = t.optionType.toLowerCase();
  return ot === "puts" || ot === "csp" || ot === "put";
}

function isCall(t: Trade) {
  const ot = t.optionType.toLowerCase();
  return ot === "calls" || ot === "cc" || ot === "call";
}

function isMember(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("lakespring_member") === "true";
}

/* ── Roll grouping types ── */
type SingleRow = { kind: "single"; trade: Trade };
type RollRow = {
  kind: "roll";
  legs: Trade[];
  ticker: string;
  optionType: string;
  oldStrike: number | null;
  newStrike: number | null;
  openDate: string;
  closeDate: string;
  netPnl: number;
};
type DisplayRow = SingleRow | RollRow;

/** Are two adjacent trades linked as part of a roll? Must be same ticker + same option type + date-linked */
function areLinked(a: Trade, b: Trade): boolean {
  if (a.ticker !== b.ticker) return false;
  // Must be same option type (both calls or both puts)
  if (a.optionType.toLowerCase() !== b.optionType.toLowerCase()) return false;
  // Must have a date connection
  const dateLinked =
    a.closeDate === b.closeDate ||
    a.closeDate === b.openDate ||
    a.openDate === b.closeDate;
  if (!dateLinked) return false;
  // Must have at least one positive and one negative between the pair (BTC + STO)
  const aVal = a.gainLossUsd ?? 0;
  const bVal = b.gainLossUsd ?? 0;
  if ((aVal < 0 && bVal < 0) || (aVal >= 0 && bVal >= 0)) return false;
  return true;
}

/** Group visible trades into display rows — merging BTC+STO roll pairs */
function buildDisplayRows(trades: Trade[]): DisplayRow[] {
  const rows: DisplayRow[] = [];
  let i = 0;
  while (i < trades.length) {
    let j = i + 1;
    // Absorb adjacent linked same-ticker trades
    while (j < trades.length && areLinked(trades[j - 1], trades[j])) {
      j++;
    }
    const group = trades.slice(i, j);
    if (group.length === 1) {
      rows.push({ kind: "single", trade: group[0] });
    } else {
      // Identify BTC (negative P&L) and STO (positive P&L) legs
      const btcLegs = group.filter((t) => (t.gainLossUsd ?? 0) < 0);
      const stoLegs = group.filter((t) => (t.gainLossUsd ?? 0) >= 0);
      const net = group.reduce((s, t) => s + (t.gainLossUsd ?? 0), 0);

      // Strike: BTC strike → STO strike (use first of each for display)
      const oldStrike = btcLegs.length > 0 ? btcLegs[0].strike : null;
      const newStrike = stoLegs.length > 0 ? stoLegs[stoLegs.length - 1].strike : null;

      // Date range: earliest open → latest close
      const dates = group.map((t) => t.closeDate || t.openDate).filter(Boolean);
      const openDates = group.map((t) => t.openDate).filter(Boolean);

      rows.push({
        kind: "roll",
        legs: group,
        ticker: group[0].ticker,
        optionType: group[0].optionType,
        oldStrike,
        newStrike,
        openDate: openDates.length > 0 ? openDates.reduce((a, b) => (a < b ? a : b)) : "",
        closeDate: dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b)) : "",
        netPnl: net,
      });
    }
    i = j;
  }
  return rows;
}

/** Group positions for win rate (same logic as before) */
function groupPositions(trades: Trade[]): number[] {
  const positions: number[] = [];
  let i = 0;
  while (i < trades.length) {
    const ticker = trades[i].ticker;
    let net = trades[i].gainLossUsd ?? 0;
    let j = i + 1;
    while (j < trades.length && trades[j].ticker === ticker) {
      const prev = trades[j - 1];
      const curr = trades[j];
      if (
        prev.closeDate === curr.closeDate ||
        prev.closeDate === curr.openDate ||
        prev.openDate === curr.closeDate
      ) {
        net += curr.gainLossUsd ?? 0;
        j++;
      } else {
        break;
      }
    }
    positions.push(net);
    i = j;
  }
  return positions;
}

/* ── Chevron icon ── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── main component ── */
export default function TradeLedgerClient({ trades }: { trades: Trade[] }) {
  const [ticker, setTicker] = useState<string>("ALL");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [member] = useState<boolean>(isMember);

  const TICKER_BLOCKLIST = new Set(["TICKER", "N/A", ""]);
  const isValidTicker = (s: string) =>
    s.length > 0 && s.length <= 6 && !TICKER_BLOCKLIST.has(s) && /^[A-Z]{1,6}$/.test(s);

  const tickers = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => { if (isValidTicker(t.ticker)) set.add(t.ticker); });
    return Array.from(set).sort();
  }, [trades]);

  /* base filter — all 2026 settled trades */
  const settledTrades2026 = useMemo(() => {
    return trades.filter((t) => {
      const dateStr = t.closeDate || t.openDate;
      if (dateStr < "2026-01-01") return false;
      if (ticker !== "ALL" && t.ticker !== ticker) return false;
      const s = t.status.toLowerCase();
      return s.includes("closed") || s.includes("expired") || s.includes("assigned") || s.includes("rolled");
    });
  }, [trades, ticker]);

  /* split: options trades vs capital gains */
  const CAPGAINS_STRATEGIES = new Set(["share sale", "assignment income", "swing trade"]);

  const visibleTrades = useMemo(() => {
    return settledTrades2026.filter((t) => {
      const ot = t.optionType.toLowerCase();
      const st = t.strategyType.toLowerCase();
      return ot !== "shares" && ot !== "stock" && ot !== "" && !CAPGAINS_STRATEGIES.has(st);
    });
  }, [settledTrades2026]);

  const capitalGainsTrades = useMemo(() => {
    return settledTrades2026.filter((t) => CAPGAINS_STRATEGIES.has(t.strategyType.toLowerCase()));
  }, [settledTrades2026]);

  /* display rows — group BTC+STO roll pairs */
  const displayRows = useMemo(() => buildDisplayRows(visibleTrades), [visibleTrades]);

  /* summary stats — still counts individual legs */
  const stats = useMemo(() => {
    const totalLegs = visibleTrades.length;
    const putsCount = visibleTrades.filter(isPut).length;
    const callsCount = visibleTrades.filter(isCall).length;
    const putsPct = totalLegs > 0 ? Math.round((putsCount / totalLegs) * 100) : 0;
    const callsPct = totalLegs > 0 ? Math.round((callsCount / totalLegs) * 100) : 0;

    const netOptionsIncome = visibleTrades.reduce((sum, t) => {
      const val = t.gainLossUsd ?? 0;
      const isAssigned = t.status.toLowerCase().includes("assigned");
      return sum + (isAssigned ? Math.max(val, 0) : val);
    }, 0);

    const capitalGainsPnl = capitalGainsTrades.reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);

    const nonAssigned = visibleTrades.filter((t) => !t.status.toLowerCase().includes("assigned"));
    const positions = groupPositions(nonAssigned);
    const assignedCount = visibleTrades.filter((t) => t.status.toLowerCase().includes("assigned")).length;
    const positionCount = positions.length + assignedCount;
    const winners = positions.filter((net) => net > 0).length + assignedCount;
    const winRate = positionCount > 0 ? Math.round((winners / positionCount) * 100) : 0;

    const totalPnl = netOptionsIncome + capitalGainsPnl;

    return { totalLegs, putsCount, callsCount, putsPct, callsPct, netOptionsIncome, capitalGainsPnl, totalPnl, positionCount, winRate };
  }, [visibleTrades, capitalGainsTrades]);

  /* ── render ── */
  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
        <label className="text-[10px] uppercase tracking-[0.2em] text-sage-300">Filter by ticker</label>
        <select
          value={ticker}
          onChange={(e) => { setTicker(e.target.value); setExpandedIdx(null); }}
          className="bg-[#1a1a1a] border border-white/15 text-cream-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sage-400 transition-colors cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            paddingRight: "32px",
          }}
        >
          <option value="ALL" className="bg-[#1a1a1a] text-white">All tickers</option>
          {tickers.map((t) => (
            <option key={t} value={t} className="bg-[#1a1a1a] text-white">{t}</option>
          ))}
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
          <p className="text-[10px] text-cream-100/40 mt-1">{stats.positionCount} positions</p>
        </div>
      </div>

      {/* Ledger table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[760px] table-fixed">
          <colgroup>
            <col className="w-[36px]" />
            <col /><col /><col /><col /><col /><col /><col />
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
          {displayRows.length === 0 ? (
            <tbody className="font-sans text-sm">
              <tr>
                <td colSpan={8} className="py-12 text-center text-sage-300/60">
                  {ticker === "ALL" ? "No closed trades available yet." : `No closed trades for ${ticker}.`}
                </td>
              </tr>
            </tbody>
          ) : (
            displayRows.map((row, i) => {
              const isOpen = expandedIdx === i;

              if (row.kind === "single") {
                const t = row.trade;
                const hasRationale = !!t.rationale.trim();
                const pnl = t.gainLossUsd;
                const canExpand = hasRationale;
                return (
                  <tbody key={i} className="font-sans text-sm">
                    <tr
                      className={`border-t border-white/10 transition-colors ${canExpand ? "cursor-pointer hover:bg-white/[0.04]" : "hover:bg-white/[0.03]"} ${isOpen ? "bg-white/[0.04]" : ""}`}
                      onClick={() => { if (canExpand) setExpandedIdx(isOpen ? null : i); }}
                    >
                      <td className="py-4 text-center text-sage-300/50 align-middle">
                        {canExpand && <ChevronIcon open={isOpen} />}
                      </td>
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
                          : "bg-sage-500/20 text-sage-300"
                        }`}>{t.status}</span>
                      </td>
                    </tr>
                    {isOpen && hasRationale && (
                      <tr className="bg-white/[0.02]">
                        <td></td>
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
              }

              /* ── Roll group row ── */
              const r = row;
              const net = r.netPnl;
              const strikeLabel =
                r.oldStrike && r.newStrike && r.oldStrike !== r.newStrike
                  ? `${formatCurrency(r.oldStrike)} → ${formatCurrency(r.newStrike)}`
                  : formatCurrency(r.newStrike ?? r.oldStrike);

              return (
                <tbody key={i} className="font-sans text-sm">
                  <tr
                    className={`border-t border-white/10 transition-colors cursor-pointer hover:bg-white/[0.04] ${isOpen ? "bg-white/[0.04]" : ""}`}
                    onClick={() => setExpandedIdx(isOpen ? null : i)}
                  >
                    <td className="py-4 text-center text-sage-300/50 align-middle">
                      <ChevronIcon open={isOpen} />
                    </td>
                    <td className="py-4 text-center text-white font-semibold tracking-wide align-middle">{r.ticker}</td>
                    <td className="py-4 text-center text-cream-100 align-middle">{r.optionType || "—"}</td>
                    <td className="py-4 text-center text-cream-100 tabular-nums align-middle text-xs">{strikeLabel}</td>
                    <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">{formatDate(r.openDate)}</td>
                    <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">{formatDate(r.closeDate)}</td>
                    <td className={`py-4 text-center tabular-nums font-medium align-middle ${net >= 0 ? "text-sage-300" : "text-red-400"}`}>
                      {`${net >= 0 ? "+" : ""}${formatCurrency(net)}`}
                    </td>
                    <td className="py-4 text-center align-middle">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300">
                        Roll ({r.legs.length} legs)
                      </span>
                    </td>
                  </tr>
                  {/* Expanded: show individual legs */}
                  {isOpen && (
                    <tr className="bg-white/[0.02]">
                      <td></td>
                      <td colSpan={7} className="pb-4 pt-2 pr-6">
                        <div className="space-y-1.5">
                          {r.legs.map((leg, li) => {
                            const lPnl = leg.gainLossUsd ?? 0;
                            const isBtc = lPnl < 0;
                            return (
                              <div key={li} className="flex items-center gap-4 text-xs text-cream-100/60">
                                <span className={`w-8 text-center font-medium ${isBtc ? "text-red-400/70" : "text-sage-300/70"}`}>
                                  {isBtc ? "BTC" : "STO"}
                                </span>
                                <span className="tabular-nums">${leg.strike?.toLocaleString() ?? "—"}</span>
                                <span className="tabular-nums">{formatDate(leg.openDate)} → {formatDate(leg.closeDate)}</span>
                                <span className={`tabular-nums font-medium ${lPnl >= 0 ? "text-sage-300/80" : "text-red-400/80"}`}>
                                  {lPnl >= 0 ? "+" : ""}{formatCurrency(lPnl)}
                                </span>
                                <span className="text-cream-100/40">{leg.status}</span>
                              </div>
                            );
                          })}
                          <div className="flex items-center gap-4 text-xs pt-1.5 border-t border-white/10 mt-1.5">
                            <span className="w-8 text-center font-medium text-white">NET</span>
                            <span></span>
                            <span></span>
                            <span className={`tabular-nums font-semibold ${net >= 0 ? "text-sage-300" : "text-red-400"}`}>
                              {net >= 0 ? "+" : ""}{formatCurrency(net)}
                            </span>
                          </div>
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
