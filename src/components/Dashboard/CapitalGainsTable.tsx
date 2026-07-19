"use client";

import { useState, useEffect } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { PortfolioView } from "./types";

const FP_BOOK_COSTS: Record<string, number> = {
  TSLA: 252866, NVDA: 0, PLTR: 69210, AMZN: 0, GOOGL: 0, LLY: 0, SPCX: 0,
};
const TM_BOOK_COSTS: Record<string, number> = {
  MRVL: 0, NBIS: 0, ASML: 0, BE: 0, TSM: 0, CRWV: 0,
};
const CRYPTO_BOOK_COSTS: Record<string, number> = {
  BTC: 220381, ETH: 2194, SOL: 0, BMNR: 51098, MSTR: 0,
};

const FP_TICKERS = ["TSLA","NVDA","PLTR","AMZN","GOOGL","LLY","SPCX"];
const TM_TICKERS = ["MRVL","NBIS","ASML","BE","TSM","CRWV"];
const CRYPTO_TICKERS = ["BTC","ETH","SOL","BMNR","MSTR"];

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  TSLA:  { bg: "rgba(204,0,0,0.10)",     text: "#CC0000" },
  NVDA:  { bg: "rgba(118,185,0,0.10)",   text: "#5A8E00" },
  PLTR:  { bg: "rgba(16,17,19,0.15)",    text: "#101113" },
  AMZN:  { bg: "rgba(255,153,0,0.10)",   text: "#CC7A00" },
  GOOGL: { bg: "rgba(66,133,244,0.10)",  text: "#3B76DB" },
  LLY:   { bg: "rgba(212,83,126,0.10)",  text: "#B8436A" },
  SPCX:  { bg: "rgba(90,101,120,0.08)",  text: "#5A6578" },
  CRWV:  { bg: "rgba(37,99,235,0.10)",   text: "#2563EB" },
  BTC:   { bg: "rgba(247,147,26,0.10)",  text: "#D97B06" },
  ETH:   { bg: "rgba(98,126,234,0.10)",  text: "#4B5EC9" },
  SOL:   { bg: "rgba(153,69,255,0.10)",  text: "#7B3FCC" },
  BMNR:  { bg: "rgba(232,135,74,0.10)",  text: "#C96830" },
  MSTR:  { bg: "rgba(204,51,0,0.10)",    text: "#CC3300" },
};

const NAMES: Record<string, string> = {
  MRVL: "Marvell", NBIS: "Nebius Group", ASML: "ASML", BE: "Bloom Energy",
  TSM: "TSMC", CRWV: "CoreWeave", BTC: "Bitcoin", ETH: "Ethereum",
  SOL: "Solana", BMNR: "Bitmine", MSTR: "Strategy",
};

function fmt(n: number) {
  if (n === 0) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function getConfig(view: PortfolioView) {
  switch (view) {
    case "first":  return { tickers: FP_TICKERS, bookCosts: FP_BOOK_COSTS };
    case "second": return { tickers: TM_TICKERS, bookCosts: TM_BOOK_COSTS };
    case "crypto": return { tickers: CRYPTO_TICKERS, bookCosts: CRYPTO_BOOK_COSTS };
    default:       return { tickers: [], bookCosts: {} };
  }
}

interface Props { portfolio: Portfolio; view: PortfolioView; }

export default function CapitalGainsTable({ portfolio, view }: Props) {
  const [member, setMember] = useState(false);
  useEffect(() => { setMember(localStorage.getItem("lakespring_member") === "true"); }, []);

  // Cash view: render cash summary table (same styling as capital gains)
  if (view === "cash") {
    const cashHolding = portfolio.holdings.find(h => h.ticker === "CASH");
    const cashVal = cashHolding ? Math.round((cashHolding.weight / 100) * portfolio.totalValue) : portfolio.cash ?? 0;

    const CASH_COLS = ["Line Items", "Value"];
    const netCash = cashVal - 2500;
    const cashRows = [
      { label: "USD Cash Balance", value: fmt(cashVal), color: "#0a0a0a" },
      { label: "Monthly Withdrawal", value: "-$2,500", color: "#E24B4A" },
      { label: "Net Cash (Post-Withdrawal)", value: fmt(netCash), color: netCash >= 0 ? "#1D9E75" : "#E24B4A" },
      { label: "Next Withdrawal", value: "1st of next month", color: "#888" },
      { label: "Cash as % of Portfolio", value: portfolio.totalValue > 0 ? ((cashVal / portfolio.totalValue) * 100).toFixed(1) + "%" : "—", color: "#1D9E75" },
    ];

    return (
      <section className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="grid px-5 py-3 items-center"
          style={{ gridTemplateColumns: "1fr 1fr", gap: "8px", background: "#034147" }}>
          {CASH_COLS.map(col => (
            <span key={col} className="text-[10px] uppercase tracking-wide font-medium text-white/80">{col}</span>
          ))}
        </div>
        <div className="divide-y divide-cream-100">
          {cashRows.map(({ label, value, color }) => (
            <div key={label} className="grid px-5 py-3 items-center text-xs"
              style={{ gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <span className="text-ink-700">{label}</span>
              <span className="tabular-nums font-medium" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-cream-100">
          <p className="text-[11px] text-ink-400 leading-relaxed">
            The cash balance will be used strategically to build further positions in the
            First Principles portfolio. Review the{" "}
            <a href="/trades" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
              latest weekly analysis report
            </a>{" "}
            for our gameplan on which tickers we are looking to acquire.
          </p>
        </div>
      </section>
    );
  }

  const { tickers, bookCosts } = getConfig(view);
  const COLS = ["Ticker", "Book cost", "Mkt value", "Capital gain", "ROI"];

  const rows = tickers.map((ticker) => {
    const holding = portfolio.holdings.find(h => h.ticker === ticker);
    const bookCost = bookCosts[ticker] ?? 0;
    const mktValue = holding && holding.weight > 0
      ? Math.round((holding.weight / 100) * portfolio.totalValue) : 0;
    const hasPosition = bookCost > 0 && mktValue > 0;
    const capitalGain = hasPosition ? mktValue - bookCost : null;
    const roi = hasPosition ? ((mktValue - bookCost) / bookCost) * 100 : null;
    return { ticker, bookCost, mktValue, capitalGain, roi };
  });

  return (
    <section className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
      <div className="grid px-5 py-3 items-center"
        style={{ gridTemplateColumns: "90px 1fr 1fr 1fr 70px", gap: "8px", background: "#034147" }}>
        {COLS.map(col => (
          <span key={col} className="text-[10px] uppercase tracking-wide font-medium text-white/80">{col}</span>
        ))}
      </div>
      <div className="divide-y divide-cream-100">
        {rows.map(({ ticker, mktValue, bookCost, capitalGain, roi }) => (
          <div key={ticker} className="grid px-5 py-3 items-center text-xs"
            style={{ gridTemplateColumns: "90px 1fr 1fr 1fr 70px", gap: "8px" }}>
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded w-fit"
              style={{
                background: BADGE_COLORS[ticker]?.bg ?? "rgba(3,65,71,0.08)",
                color: BADGE_COLORS[ticker]?.text ?? "#034147",
              }}>
              {ticker}
            </span>
            <span className="text-ink-700 tabular-nums">{fmt(bookCost)}</span>
            <span className="tabular-nums" style={{ color: mktValue > 0 ? "#0a0a0a" : "#888" }}>
              {mktValue > 0 ? fmt(mktValue) : "—"}
            </span>
            <span className="tabular-nums font-medium"
              style={{ color: capitalGain === null ? "#888" : capitalGain >= 0 ? "#1D9E75" : "#E24B4A" }}>
              {capitalGain !== null ? (capitalGain >= 0 ? "+" : "") + fmt(Math.abs(capitalGain)) : "No position"}
            </span>
            <span className="tabular-nums font-medium"
              style={{ color: roi === null ? "#888" : roi >= 0 ? "#1D9E75" : "#E24B4A" }}>
              {roi !== null ? (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%" : "—"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
