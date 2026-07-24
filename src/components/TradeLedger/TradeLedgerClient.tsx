// src/components/TradeLedger/TradeLedgerClient.tsx
// update-160: Restore monthly grouping, thin ticker column, ROI + stacked bar
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Trade } from "@/lib/trades";
import BlurOverlay from "./BlurOverlay";

function useMember() {
  const [member, setMember] = useState(false);
  useEffect(() => {
    setMember(localStorage.getItem("lakespring_member") === "true");
  }, []);
  return member;
}

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

function calcCapitalAtRisk(t: Trade): number | null {
  if (t.strike && t.contracts) return Math.abs(t.strike * t.contracts * 100);
  return null;
}

function calcRoi(t: Trade): string {
  const cap = calcCapitalAtRisk(t);
  const pnl = t.gainLossUsd ?? 0;
  if (!cap || cap === 0) return "—";
  return ((pnl / cap) * 100).toFixed(2) + "%";
}

/* ── Exclusions ── */
const EXCLUDE_STRATEGIES = new Set(["transfer", "fpp accumulation", "stock purchase"]);
const CAPGAINS_STRATEGIES = new Set(["share sale", "assignment income", "swing trade"]);

/* ── Display row types ── */
type SingleRow = { kind: "single"; trade: Trade };
type GroupRow = {
  kind: "group"; groupId: string; legs: Trade[]; ticker: string; optionType: string;
  oldStrike: number | null; newStrike: number | null;
  openDate: string; closeDate: string; netPnl: number;
};
type MonthHeader = { kind: "month"; monthKey: string; label: string; total: number };
type DisplayRow = SingleRow | GroupRow | MonthHeader;

type SortCol = "date" | "ticker" | "pnl" | "capital" | "roi";
type SortDir = "asc" | "desc";

function getRowDate(r: SingleRow | GroupRow) { return r.kind === "single" ? r.trade.openDate : r.openDate; }
function getRowPnl(r: SingleRow | GroupRow) { return r.kind === "single" ? (r.trade.gainLossUsd ?? 0) : r.netPnl; }
function getRowTicker(r: SingleRow | GroupRow) { return r.kind === "single" ? r.trade.ticker : r.ticker; }
function getRowCapital(r: SingleRow | GroupRow) {
  if (r.kind === "single") return calcCapitalAtRisk(r.trade) ?? 0;
  return r.legs.reduce((s, l) => s + (calcCapitalAtRisk(l) ?? 0), 0);
}
function getRowRoi(r: SingleRow | GroupRow) {
  const cap = getRowCapital(r);
  const pnl = getRowPnl(r);
  return cap > 0 ? (pnl / cap) * 100 : 0;
}

function buildDisplayRows(trades: Trade[], sortCol: SortCol, sortDir: SortDir): DisplayRow[] {
  const groupMap = new Map<string, Trade[]>();
  for (const t of trades) {
    if (t.positionGroup) {
      if (!groupMap.has(t.positionGroup)) groupMap.set(t.positionGroup, []);
      groupMap.get(t.positionGroup)!.push(t);
    }
  }

  const tradeRows: (SingleRow | GroupRow)[] = [];
  const seen = new Set<string>();
  for (const t of trades) {
    if (t.positionGroup && !seen.has(t.positionGroup)) {
      seen.add(t.positionGroup);
      const legs = groupMap.get(t.positionGroup)!;
      const net = legs.reduce((s, l) => s + (l.gainLossUsd ?? 0), 0);
      const btcLegs = legs.filter((l) => (l.gainLossUsd ?? 0) < 0);
      const stoLegs = legs.filter((l) => (l.gainLossUsd ?? 0) >= 0);
      const openDates = legs.map((l) => l.openDate).filter(Boolean);
      const closeDates = legs.map((l) => l.closeDate || l.openDate).filter(Boolean);
      tradeRows.push({
        kind: "group", groupId: t.positionGroup, legs,
        ticker: legs[0].ticker, optionType: legs[0].optionType,
        oldStrike: btcLegs.length ? btcLegs[0].strike : null,
        newStrike: stoLegs.length ? stoLegs[stoLegs.length - 1].strike : null,
        openDate: openDates.length ? openDates.reduce((a, b) => a < b ? a : b) : "",
        closeDate: closeDates.length ? closeDates.reduce((a, b) => a > b ? a : b) : "",
        netPnl: net,
      });
    } else if (!t.positionGroup) {
      tradeRows.push({ kind: "single", trade: t });
    }
  }

  // Sort
  const sorted = [...tradeRows].sort((a, b) => {
    let cmp = 0;
    if (sortCol === "date") cmp = getRowDate(a).localeCompare(getRowDate(b));
    else if (sortCol === "ticker") cmp = getRowTicker(a).localeCompare(getRowTicker(b));
    else if (sortCol === "pnl") cmp = getRowPnl(a) - getRowPnl(b);
    else if (sortCol === "capital") cmp = getRowCapital(a) - getRowCapital(b);
    else if (sortCol === "roi") cmp = getRowRoi(a) - getRowRoi(b);
    return sortDir === "desc" ? -cmp : cmp;
  });

  // Add month headers in date sort (based on openDate)
  if (sortCol === "date") {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const rows: DisplayRow[] = [];
    let currentMonth = "";
    const monthTotals = new Map<string, number>();
    for (const tr of sorted) {
      const mk = getRowDate(tr).slice(0, 7);
      monthTotals.set(mk, (monthTotals.get(mk) ?? 0) + getRowPnl(tr));
    }
    for (const tr of sorted) {
      const mk = getRowDate(tr).slice(0, 7);
      if (mk && mk !== currentMonth) {
        currentMonth = mk;
        const [y, m] = mk.split("-");
        const label = `${months[parseInt(m) - 1]} ${y}`;
        rows.push({ kind: "month", monthKey: mk, label, total: monthTotals.get(mk) ?? 0 });
      }
      rows.push(tr);
    }
    return rows;
  }

  return sorted;
}

/* ── P&L Stacked Bar Chart ── */
// Colors match AllocationDonut in portfolio dashboard
// PLTR adjusted from #101113 (invisible on dark bg) to #4A4A52
const TICKER_COLORS: Record<string, string> = {
  TSLA: "#CC0000", NVDA: "#76B900", PLTR: "#4A4A52", AMZN: "#FF9900",
  GOOGL: "#4285F4", GOOG: "#4285F4", LLY: "#D4537E", SPCX: "#5A6578",
  MRVL: "#0057B8", NBIS: "#C8F000", ASML: "#1E3A8A", BE: "#00A86B", SMCI: "#8A9BB0",
  CRWV: "#2563EB", BMNR: "#06B6D4",
};
const FALLBACK_COLORS = ["#5DCAA5", "#3B82F6", "#D97706", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16", "#F97316"];

function PnlBar({ optionsTrades, capitalGainsTrades, ticker, member }: {
  optionsTrades: Trade[]; capitalGainsTrades: Trade[]; ticker: string; member: boolean;
}) {
  const data = useMemo(() => {
    if (ticker !== "ALL") {
      const optNet = optionsTrades.reduce((s, t) => s + (t.gainLossUsd ?? 0), 0);
      const capNet = capitalGainsTrades.reduce((s, t) => s + (t.gainLossUsd ?? 0), 0);
      const segments = [];
      if (optNet !== 0) segments.push({ label: "Options Income", value: optNet, color: "#5DCAA5" });
      if (capNet !== 0) segments.push({ label: "Capital Gains", value: capNet, color: "#3B82F6" });
      if (segments.length === 0) segments.push({ label: "Options Income", value: 0, color: "#5DCAA5" });
      return segments;
    }
    const map = new Map<string, number>();
    for (const t of [...optionsTrades, ...capitalGainsTrades]) {
      const tk = t.ticker || "Other";
      map.set(tk, (map.get(tk) ?? 0) + (t.gainLossUsd ?? 0));
    }
    let colorIdx = 0;
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([label, value]) => ({
        label, value,
        color: TICKER_COLORS[label] ?? FALLBACK_COLORS[colorIdx++ % FALLBACK_COLORS.length],
      }));
  }, [optionsTrades, capitalGainsTrades, ticker]);

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.value, 0);
  const positiveSegments = data.filter((d) => d.value > 0);
  const negativeSegments = data.filter((d) => d.value < 0);
  const positiveTotal = positiveSegments.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300">
          {ticker === "ALL" ? "P&L by Ticker" : `${ticker} — Income Breakdown`}
        </p>
        <p className={`text-sm font-semibold tabular-nums ${total >= 0 ? "text-sage-300" : "text-red-400"}`}>
          {member
            ? `${total >= 0 ? "+" : ""}${formatCurrency(total)}`
            : <BlurOverlay>{`${total >= 0 ? "+" : ""}${formatCurrency(total)}`}</BlurOverlay>}
        </p>
      </div>

      {/* Stacked bar */}
      <div className="w-full h-6 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.06)" }}>
        {positiveTotal > 0 ? positiveSegments.map((d, i) => {
          const pct = (d.value / positiveTotal) * 100;
          return (
            <div key={i} className="h-full transition-all duration-300"
              style={{
                width: `${pct}%`,
                background: d.color,
                borderRight: i < positiveSegments.length - 1 ? "1px solid rgba(10,10,10,0.4)" : "none",
              }}
              title={`${d.label}: ${formatCurrency(d.value)} (${pct.toFixed(0)}%)`}
            />
          );
        }) : (
          <div className="h-full w-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
            <span className="text-cream-100/60">{d.label}</span>
            <span className={`tabular-nums font-medium ${d.value >= 0 ? "text-sage-300/80" : "text-red-400/80"}`}>
              {member
                ? `${d.value >= 0 ? "+" : ""}${formatCurrency(d.value)}`
                : <BlurOverlay>{`${d.value >= 0 ? "+" : ""}${formatCurrency(d.value)}`}</BlurOverlay>}
            </span>
            {positiveTotal > 0 && d.value > 0 && (
              <span className="text-cream-100/30 tabular-nums">
                {member
                  ? `${((d.value / positiveTotal) * 100).toFixed(0)}%`
                  : <BlurOverlay>{`${((d.value / positiveTotal) * 100).toFixed(0)}%`}</BlurOverlay>}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sort icon ── */
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className={`inline ml-1 ${active ? "opacity-100" : "opacity-30"}`}>
      <path d="M5 1L8 4.5H2Z" fill={active && dir === "asc" ? "#5DCAA5" : "currentColor"} />
      <path d="M5 9L2 5.5H8Z" fill={active && dir === "desc" ? "#5DCAA5" : "currentColor"} />
    </svg>
  );
}

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
  const isMember = useMember();
  const [ticker, setTicker] = useState<string>("ALL");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [sortCol, setSortCol] = useState<SortCol>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
    setExpandedIdx(null);
  };

  const TICKER_BLOCKLIST = new Set(["TICKER", "N/A", ""]);
  const isValidTicker = (s: string) =>
    s.length > 0 && s.length <= 6 && !TICKER_BLOCKLIST.has(s) && /^[A-Z]{1,6}$/.test(s);

  const tickers = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => { if (isValidTicker(t.ticker)) set.add(t.ticker); });
    return Array.from(set).sort();
  }, [trades]);

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

  const optionsTrades = useMemo(() =>
    allIncludedTrades.filter((t) => !CAPGAINS_STRATEGIES.has(t.strategyType.toLowerCase())),
  [allIncludedTrades]);

  const capitalGainsTrades = useMemo(() =>
    allIncludedTrades.filter((t) => CAPGAINS_STRATEGIES.has(t.strategyType.toLowerCase())),
  [allIncludedTrades]);

  const displayRows = useMemo(() => buildDisplayRows(optionsTrades, sortCol, sortDir), [optionsTrades, sortCol, sortDir]);

  const stats = useMemo(() => {
    const totalLegs = optionsTrades.length;
    const putsCount = optionsTrades.filter(isPut).length;
    const callsCount = optionsTrades.filter(isCall).length;
    const netOptionsIncome = optionsTrades.reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);
    const capitalGainsPnl = capitalGainsTrades.reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);
    const totalPnl = netOptionsIncome + capitalGainsPnl;

    const groupNets = new Map<string, number>();
    let ungroupedWins = 0, ungroupedTotal = 0;
    for (const t of optionsTrades) {
      const pnl = t.gainLossUsd ?? 0;
      if (t.positionGroup) {
        groupNets.set(t.positionGroup, (groupNets.get(t.positionGroup) ?? 0) + pnl);
      } else { ungroupedTotal++; if (pnl > 0) ungroupedWins++; }
    }
    const groupWins = Array.from(groupNets.values()).filter((n) => n > 0).length;
    const totalPositions = groupNets.size + ungroupedTotal;
    const totalWins = groupWins + ungroupedWins;
    const winRate = totalPositions > 0 ? Math.round((totalWins / totalPositions) * 100) : 0;

    return { totalLegs, putsCount, callsCount, netOptionsIncome, capitalGainsPnl, totalPnl, totalPositions, totalWins, winRate };
  }, [optionsTrades, capitalGainsTrades]);

  const thClass = "pb-4 font-medium cursor-pointer hover:text-sage-200 transition-colors select-none";

  return (
    <>
      {/* Filter */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
        <label className="text-[10px] uppercase tracking-[0.2em] text-sage-300">Filter by ticker</label>
        <select value={ticker}
          onChange={(e) => { setTicker(e.target.value); setExpandedIdx(null); setSortCol("date"); setSortDir("desc"); }}
          className="bg-[#1a1a1a] border border-white/15 text-cream-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sage-400 transition-colors cursor-pointer appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "32px" }}>
          <option value="ALL" className="bg-[#1a1a1a] text-white">All tickers</option>
          {tickers.map((t) => (<option key={t} value={t} className="bg-[#1a1a1a] text-white">{t}</option>))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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
            <span>{stats.putsCount} puts</span><span className="text-white/20">|</span><span>{stats.callsCount} calls</span>
          </div>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2">Win rate</p>
          <p className="text-2xl text-white font-semibold">{stats.winRate}%</p>
          <p className="text-[10px] text-cream-100/40 mt-1">Profitable positions ({stats.totalWins}/{stats.totalPositions})</p>
        </div>
      </div>

      {/* P&L Donut */}
      <PnlBar optionsTrades={optionsTrades} capitalGainsTrades={capitalGainsTrades} ticker={ticker} member={isMember} />

      {/* Ledger table */}
      <div className="hidden md:block overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[920px] table-fixed">
          <colgroup>
            <col className="w-[32px]" /><col className="w-[80px]" /><col className="w-[70px]" /><col className="w-[80px]" />
            <col className="w-[40px]" /><col className="w-[90px]" /><col className="w-[100px]" /><col className="w-[100px]" />
            <col className="w-[90px]" /><col className="w-[60px]" /><col className="w-[80px]" />
          </colgroup>
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] text-sage-300 text-center">
              <th className="pb-4 font-medium"></th>
              <th className={thClass} onClick={() => toggleSort("ticker")}>Ticker<SortIcon active={sortCol === "ticker"} dir={sortDir} /></th>
              <th className="pb-4 font-medium">Type</th>
              <th className="pb-4 font-medium">Strike</th>
              <th className="pb-4 font-medium">Cts</th>
              <th className={thClass} onClick={() => toggleSort("capital")}>Capital<SortIcon active={sortCol === "capital"} dir={sortDir} /></th>
              <th className={thClass} onClick={() => toggleSort("date")}>Opened<SortIcon active={sortCol === "date"} dir={sortDir} /></th>
              <th className="pb-4 font-medium">Closed</th>
              <th className={thClass} onClick={() => toggleSort("pnl")}>P&L<SortIcon active={sortCol === "pnl"} dir={sortDir} /></th>
              <th className={thClass} onClick={() => toggleSort("roi")}>ROI<SortIcon active={sortCol === "roi"} dir={sortDir} /></th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          {displayRows.length === 0 ? (
            <tbody className="font-sans text-sm">
              <tr><td colSpan={11} className="py-12 text-center text-sage-300/60">
                {ticker === "ALL" ? "No trades available yet." : `No trades for ${ticker}.`}
              </td></tr>
            </tbody>
          ) : (
            displayRows.map((row, i) => {
              const isOpen = expandedIdx === i;

              if (row.kind === "month") {
                return (
                  <tbody key={`m-${row.monthKey}`}>
                    <tr>
                      <td colSpan={11} className="pt-6 pb-2 px-0">
                        <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-[0.15em] text-sage-300 font-semibold">{row.label}</span>
                          <span className={`text-xs font-semibold tabular-nums ${row.total >= 0 ? "text-sage-300" : "text-red-400"}`}>
                            {isMember
                              ? `${row.total >= 0 ? "+" : ""}${formatCurrency(row.total)}`
                              : <BlurOverlay>{`${row.total >= 0 ? "+" : ""}${formatCurrency(row.total)}`}</BlurOverlay>}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              }

              if (row.kind === "single") {
                const t = row.trade;
                const hasRationale = !!t.rationale.trim();
                const pnl = t.gainLossUsd;
                const cap = calcCapitalAtRisk(t);
                const roi = calcRoi(t);
                const roiNum = cap && pnl != null ? (pnl / cap) * 100 : null;
                return (
                  <tbody key={i} className="font-sans text-sm">
                    <tr className={`border-t border-white/10 transition-colors ${hasRationale ? "cursor-pointer hover:bg-white/[0.04]" : "hover:bg-white/[0.03]"} ${isOpen ? "bg-white/[0.04]" : ""}`}
                      onClick={() => { if (hasRationale) setExpandedIdx(isOpen ? null : i); }}>
                      <td className="py-4 text-center text-sage-300/50 align-middle">{hasRationale && <ChevronIcon open={isOpen} />}</td>
                      <td className="py-4 text-center text-white font-semibold tracking-wide align-middle">{t.ticker}</td>
                      <td className="py-4 text-center text-cream-100 align-middle">{t.optionType || "—"}</td>
                      <td className="py-4 text-center text-cream-100 tabular-nums align-middle">
                        {t.strike ? (isMember ? formatCurrency(t.strike) : <BlurOverlay>{formatCurrency(t.strike)}</BlurOverlay>) : "—"}
                      </td>
                      <td className="py-4 text-center text-cream-100/60 tabular-nums align-middle text-xs">{t.contracts ?? "—"}</td>
                      <td className="py-4 text-center text-cream-100/60 tabular-nums align-middle text-xs">
                        {cap ? (isMember ? formatCurrency(cap) : <BlurOverlay>{formatCurrency(cap)}</BlurOverlay>) : "—"}
                      </td>
                      <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">{formatDate(t.openDate)}</td>
                      <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">{formatDate(t.closeDate)}</td>
                      <td className={`py-4 text-center tabular-nums font-medium align-middle ${pnl !== null && pnl >= 0 ? "text-sage-300" : "text-red-400"}`}>
                        {pnl !== null
                          ? (isMember
                              ? `${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}`
                              : <BlurOverlay>{`${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}`}</BlurOverlay>)
                          : "—"}
                      </td>
                      <td className={`py-4 text-center tabular-nums text-xs font-medium align-middle ${roiNum !== null && roiNum >= 0 ? "text-sage-300/70" : "text-red-400/70"}`}>
                        {isMember ? roi : <BlurOverlay>{roi}</BlurOverlay>}
                      </td>
                      <td className="py-4 text-center align-middle">
                        <span className={`text-xs px-2 py-1 rounded-full ${
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
                        <td colSpan={10} className="pb-5 pt-1 pr-6">
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

              /* Group row */
              const g = row;
              const net = g.netPnl;
              const cap = g.legs.reduce((s, l) => s + (calcCapitalAtRisk(l) ?? 0), 0);
              const groupRoi = cap > 0 ? ((net / cap) * 100).toFixed(2) + "%" : "—";
              const groupRoiNum = cap > 0 ? (net / cap) * 100 : null;
              const strikeLabel = g.oldStrike && g.newStrike && g.oldStrike !== g.newStrike
                ? `${formatCurrency(g.oldStrike)} → ${formatCurrency(g.newStrike)}`
                : formatCurrency(g.newStrike ?? g.oldStrike);

              return (
                <tbody key={i} className="font-sans text-sm">
                  <tr className={`border-t border-white/10 transition-colors cursor-pointer hover:bg-white/[0.04] ${isOpen ? "bg-white/[0.04]" : ""}`}
                    onClick={() => setExpandedIdx(isOpen ? null : i)}>
                    <td className="py-4 text-center text-sage-300/50 align-middle"><ChevronIcon open={isOpen} /></td>
                    <td className="py-4 text-center text-white font-semibold tracking-wide align-middle">{g.ticker}</td>
                    <td className="py-4 text-center text-cream-100 align-middle">{g.optionType || "—"}</td>
                    <td className="py-4 text-center text-cream-100 tabular-nums align-middle text-xs">
                      {isMember ? strikeLabel : <BlurOverlay>{strikeLabel}</BlurOverlay>}
                    </td>
                    <td className="py-4 text-center text-cream-100/60 tabular-nums align-middle text-xs">{g.legs[0]?.contracts ?? "—"}</td>
                    <td className="py-4 text-center text-cream-100/60 tabular-nums align-middle text-xs">
                      {cap > 0 ? (isMember ? formatCurrency(cap) : <BlurOverlay>{formatCurrency(cap)}</BlurOverlay>) : "—"}
                    </td>
                    <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">{formatDate(g.openDate)}</td>
                    <td className="py-4 text-center text-cream-100/80 tabular-nums whitespace-nowrap align-middle">{formatDate(g.closeDate)}</td>
                    <td className={`py-4 text-center tabular-nums font-medium align-middle ${net >= 0 ? "text-sage-300" : "text-red-400"}`}>
                      {isMember
                        ? `${net >= 0 ? "+" : ""}${formatCurrency(net)}`
                        : <BlurOverlay>{`${net >= 0 ? "+" : ""}${formatCurrency(net)}`}</BlurOverlay>}
                    </td>
                    <td className={`py-4 text-center tabular-nums text-xs font-medium align-middle ${groupRoiNum !== null && groupRoiNum >= 0 ? "text-sage-300/70" : "text-red-400/70"}`}>
                      {isMember ? groupRoi : <BlurOverlay>{groupRoi}</BlurOverlay>}
                    </td>
                    <td className="py-4 text-center align-middle">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-300">Roll ({g.legs.length})</span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-white/[0.02]"><td></td>
                      <td colSpan={10} className="pb-4 pt-2 pr-6">
                        <div className="space-y-1.5">
                          {g.legs.map((leg, li) => {
                            const lPnl = leg.gainLossUsd ?? 0;
                            const isBtc = lPnl < 0;
                            return (
                              <div key={li} className="flex items-center gap-4 text-xs text-cream-100/60">
                                <span className={`w-8 text-center font-medium ${isBtc ? "text-red-400/70" : "text-sage-300/70"}`}>{isBtc ? "BTC" : "STO"}</span>
                                <span className="tabular-nums">
                                  {leg.strike
                                    ? (isMember ? `$${leg.strike.toLocaleString()}` : <BlurOverlay>{`$${leg.strike.toLocaleString()}`}</BlurOverlay>)
                                    : "—"}
                                </span>
                                <span className="tabular-nums">{formatDate(leg.openDate)} → {formatDate(leg.closeDate)}</span>
                                <span className={`tabular-nums font-medium ${lPnl >= 0 ? "text-sage-300/80" : "text-red-400/80"}`}>
                                  {isMember
                                    ? `${lPnl >= 0 ? "+" : ""}${formatCurrency(lPnl)}`
                                    : <BlurOverlay>{`${lPnl >= 0 ? "+" : ""}${formatCurrency(lPnl)}`}</BlurOverlay>}
                                </span>
                                <span className="text-cream-100/40">{leg.status}</span>
                              </div>
                            );
                          })}
                          <div className="flex items-center gap-4 text-xs pt-1.5 border-t border-white/10 mt-1.5">
                            <span className="w-8 text-center font-medium text-white">NET</span>
                            <span></span><span></span>
                            <span className={`tabular-nums font-semibold ${net >= 0 ? "text-sage-300" : "text-red-400"}`}>
                              {isMember
                                ? `${net >= 0 ? "+" : ""}${formatCurrency(net)}`
                                : <BlurOverlay>{`${net >= 0 ? "+" : ""}${formatCurrency(net)}`}</BlurOverlay>}
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

      {/* Mobile: compact cards — Ticker, Type, Strike, P&L only. Tap to expand rationale/legs. */}
      <div className="md:hidden space-y-2">
        {displayRows.map((row, i) => {
          if (row.kind === "month") {
            return (
              <div key={`m-${row.monthKey}`} className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between mt-4 first:mt-0">
                <span className="text-[11px] uppercase tracking-[0.15em] text-sage-300 font-semibold">{row.label}</span>
                <span className={`text-xs font-semibold tabular-nums ${row.total >= 0 ? "text-sage-300" : "text-red-400"}`}>
                  {isMember
                    ? `${row.total >= 0 ? "+" : ""}${formatCurrency(row.total)}`
                    : <BlurOverlay>{`${row.total >= 0 ? "+" : ""}${formatCurrency(row.total)}`}</BlurOverlay>}
                </span>
              </div>
            );
          }

          const isOpen = expandedIdx === i;

          if (row.kind === "single") {
            const t = row.trade;
            const hasRationale = !!t.rationale.trim();
            const pnl = t.gainLossUsd;
            return (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                  onClick={() => { if (hasRationale) setExpandedIdx(isOpen ? null : i); }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {hasRationale && <ChevronIcon open={isOpen} />}
                    <span className="text-sm font-semibold text-white tracking-wide">{t.ticker}</span>
                    <span className="text-xs text-cream-100/60 truncate">{t.optionType || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-cream-100/70 tabular-nums">
                      {t.strike
                        ? (isMember ? formatCurrency(t.strike) : <BlurOverlay>{formatCurrency(t.strike)}</BlurOverlay>)
                        : "—"}
                    </span>
                    <span className={`text-sm font-medium tabular-nums ${pnl !== null && pnl >= 0 ? "text-sage-300" : "text-red-400"}`}>
                      {pnl !== null
                        ? (isMember
                            ? `${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}`
                            : <BlurOverlay>{`${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}`}</BlurOverlay>)
                        : "—"}
                    </span>
                  </div>
                </button>
                {isOpen && hasRationale && (
                  <div className="px-4 pb-3 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-sage-300/60 mb-1 mt-2">Rationale</p>
                    <p className="text-xs text-cream-100/70 leading-relaxed">{t.rationale}</p>
                  </div>
                )}
              </div>
            );
          }

          // Group / rolled-position row
          const g = row;
          const net = g.netPnl;
          const strikeLabel = g.oldStrike && g.newStrike && g.oldStrike !== g.newStrike
            ? `${formatCurrency(g.oldStrike)} → ${formatCurrency(g.newStrike)}`
            : formatCurrency(g.newStrike ?? g.oldStrike);

          return (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
              <button
                className="w-full px-4 py-3 flex items-center justify-between text-left"
                onClick={() => setExpandedIdx(isOpen ? null : i)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronIcon open={isOpen} />
                  <span className="text-sm font-semibold text-white tracking-wide">{g.ticker}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 flex-shrink-0">
                    Roll ({g.legs.length})
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-cream-100/70 tabular-nums">
                    {isMember ? strikeLabel : <BlurOverlay>{strikeLabel}</BlurOverlay>}
                  </span>
                  <span className={`text-sm font-medium tabular-nums ${net >= 0 ? "text-sage-300" : "text-red-400"}`}>
                    {isMember
                      ? `${net >= 0 ? "+" : ""}${formatCurrency(net)}`
                      : <BlurOverlay>{`${net >= 0 ? "+" : ""}${formatCurrency(net)}`}</BlurOverlay>}
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-3 border-t border-white/10 space-y-1.5">
                  {g.legs.map((leg, li) => {
                    const lPnl = leg.gainLossUsd ?? 0;
                    const isBtc = lPnl < 0;
                    return (
                      <div key={li} className="flex items-center justify-between text-xs text-cream-100/60 pt-1.5">
                        <span className="flex items-center gap-2">
                          <span className={`font-medium ${isBtc ? "text-red-400/70" : "text-sage-300/70"}`}>{isBtc ? "BTC" : "STO"}</span>
                          <span className="tabular-nums">
                            {leg.strike
                              ? (isMember ? `$${leg.strike.toLocaleString()}` : <BlurOverlay>{`$${leg.strike.toLocaleString()}`}</BlurOverlay>)
                              : "—"}
                          </span>
                        </span>
                        <span className={`tabular-nums font-medium ${lPnl >= 0 ? "text-sage-300/80" : "text-red-400/80"}`}>
                          {isMember
                            ? `${lPnl >= 0 ? "+" : ""}${formatCurrency(lPnl)}`
                            : <BlurOverlay>{`${lPnl >= 0 ? "+" : ""}${formatCurrency(lPnl)}`}</BlurOverlay>}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/10 mt-1.5">
                    <span className="font-medium text-white">NET</span>
                    <span className={`tabular-nums font-semibold ${net >= 0 ? "text-sage-300" : "text-red-400"}`}>
                      {isMember
                        ? `${net >= 0 ? "+" : ""}${formatCurrency(net)}`
                        : <BlurOverlay>{`${net >= 0 ? "+" : ""}${formatCurrency(net)}`}</BlurOverlay>}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
