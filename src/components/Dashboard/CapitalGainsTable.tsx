"use client";

import { useState, useEffect } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { PortfolioView } from "./types";

const FP_BOOK_COSTS: Record<string, number> = {
  TSLA: 210675, NVDA: 18028, PLTR: 72500, AMZN: 0, GOOGL: 0, LLY: 0, SPCX: 0,
};
const SD_BOOK_COSTS: Record<string, number> = {
  MRVL: 0, NBIS: 0, ASML: 0, BE: 0, TSM: 0,
};

const FP_TICKERS = ["TSLA","NVDA","PLTR","AMZN","GOOGL","LLY","SPCX"];
const SD_TICKERS = ["MRVL","NBIS","ASML","BE","TSM"];

const SD_NAMES: Record<string, string> = {
  MRVL: "Marvell", NBIS: "Nebius Group",
  ASML: "ASML", BE: "Bloom Energy", TSM: "TSMC",
};

function fmt(n: number) {
  if (n === 0) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

interface Props { portfolio: Portfolio; view: PortfolioView; }

export default function CapitalGainsTable({ portfolio, view }: Props) {
  const tickers = view === "first" ? FP_TICKERS : SD_TICKERS;
  const bookCosts = view === "first" ? FP_BOOK_COSTS : SD_BOOK_COSTS;
  const title = view === "first" ? "First Principles — Capital Gains" : "Second Derivatives — Capital Gains";
  const COLS = ["Ticker", "Book cost", "Mkt value", "Capital gain", "ROI"];
  const [member, setMember] = useState(false);
  useEffect(() => { setMember(localStorage.getItem("lakespring_member") === "true"); }, []);

  const rows = tickers.map((ticker) => {
    const holding = portfolio.holdings.find(h => h.ticker === ticker);
    const bookCost = bookCosts[ticker] ?? 0;
    const mktValue = holding && holding.weight > 0
      ? Math.round((holding.weight / 100) * portfolio.totalValue) : 0;
    const hasPosition = bookCost > 0 && mktValue > 0;
    const capitalGain = hasPosition ? mktValue - bookCost : null;
    const roi = hasPosition ? ((mktValue - bookCost) / bookCost) * 100 : null;
    const name = SD_NAMES[ticker] ?? ticker;
    return { ticker, name, bookCost, mktValue, capitalGain, roi };
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
              style={{ background: "rgba(3,65,71,0.08)", color: "#034147" }}>
              {ticker}
            </span>
            <span className="text-ink-700 tabular-nums"
              style={{ filter: member ? "none" : "blur(5px)" }}>{fmt(bookCost)}</span>
            <span className="tabular-nums" style={{ color: mktValue > 0 ? "#0a0a0a" : "#888", filter: member ? "none" : "blur(5px)" }}>
              {mktValue > 0 ? fmt(mktValue) : "—"}
            </span>
            <span className="tabular-nums font-medium"
              style={{ color: capitalGain === null ? "#888" : capitalGain >= 0 ? "#1D9E75" : "#E24B4A", filter: member ? "none" : "blur(5px)" }}>
              {capitalGain !== null ? (capitalGain >= 0 ? "+" : "") + fmt(Math.abs(capitalGain)) : "No position"}
            </span>
            <span className="tabular-nums font-medium"
              style={{ color: roi === null ? "#888" : roi >= 0 ? "#1D9E75" : "#E24B4A", filter: member ? "none" : "blur(5px)" }}>
              {roi !== null ? (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%" : "—"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
