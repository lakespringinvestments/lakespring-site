"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";

const TICKER_COLORS: Record<string, string> = {
  TSLA:  "#CC0000",
  NVDA:  "#76B900",
  PLTR:  "#101113",
  AMZN:  "#EFCEAD",   // light warm brown
  GOOGL: "#E8EAED",
  // SD tickers — use transparent so each logo PNG's own background shows
  MRVL: "transparent",
  NBIS: "transparent",
  LLY:  "#FAF8F3",   // cream — Lilly logo contained on light bg
  SMCI: "#8A9BB0",   // gray
  ASML: "transparent",
  BE:   "transparent",
};

const TICKER_LOGOS: Record<string, string> = {
  TSLA:  "/logos/tesla.png",
  NVDA:  "/logos/nvidia.png",
  PLTR:  "/logos/palantir.png",
  AMZN:  "/logos/amazon.png",
  GOOGL: "/logos/google.png",
  // Second Derivatives
  MRVL: "/logos/marvell.png",
  NBIS: "/logos/nebius.png",
  LLY:  "/logos/lilly.png",
  ASML: "/logos/asml.png",
  BE:   "/logos/bloom_energy.png",
  SMCI: "/logos/smci.png",
};

const EXCLUDED = new Set(["BTC", "SOL"]);
const OPTIONS_TYPES = new Set(["CSP", "CC"]);
const FP_TICKERS = new Set(["TSLA","NVDA","PLTR","AMZN","GOOGL"]);
const SD_TICKERS  = new Set(["MRVL","NBIS","LLY","ASML","BE","SMCI"]);

// SD tickers that may not be in portfolio.holdings — show as placeholders
const SD_NAMES: Record<string, string> = {
  MRVL: "Marvell", NBIS: "Nebius Group", LLY: "Eli Lilly",
  ASML: "ASML", BE: "Bloom Energy", SMCI: "Super Micro Computer",
};

function pickColor(ticker: string) {
  return TICKER_COLORS[ticker] ?? "#034147";
}

function pickTextColor(bg: string) {
  const lightBgs = ["#76B900", "#E8EAED", "#EFCEAD"];
  return lightBgs.includes(bg) ? "#0a0a0a" : "#ffffff";
}

function logoSize(ticker: string): number {
  if (ticker === "TSLA") return 38;
  if (ticker === "NVDA") return 36;
  if (ticker === "PLTR") return 36;
  if (ticker === "AMZN") return 30;   // transparent bg PNG — slightly smaller
  if (ticker === "GOOGL") return 28;
  return 36;
}

function friendlyType(optionType: string): string {
  const t = optionType?.toUpperCase();
  if (t === "CSP") return "Put";
  if (t === "CC")  return "Covered Call";
  return optionType;
}

function formatDate(iso: string, fullYear = false): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return iso; }
}

function statusColor(status: string): string {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("expired") || s.includes("closed")) return "#1D9E75";
  if (s.includes("assigned")) return "#D97706";
  if (s.includes("open")) return "#034147";
  if (s.includes("rolled")) return "#3B82F6";
  return "#888";
}

function sumPremiums(trades: Trade[]): number {
  return trades
    .filter(t => OPTIONS_TYPES.has(t.optionType?.toUpperCase()))
    .reduce((sum, t) => {
      const val = t.totalPremiumUsd ?? (
        t.premiumPerContract != null && t.contracts != null
          ? t.premiumPerContract * t.contracts : 0
      );
      return val > 0 ? sum + val : sum;
    }, 0);
}

function capitalRequired(trade: Trade): string {
  if (trade.strike && trade.contracts) {
    const cap = Math.abs(trade.strike * trade.contracts * 100);
    return "$" + cap.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  return "—";
}

function premiumTotal(trade: Trade): number | null {
  if (trade.totalPremiumUsd != null && trade.totalPremiumUsd > 0) return trade.totalPremiumUsd;
  if (trade.premiumPerContract != null && trade.contracts != null && trade.premiumPerContract > 0)
    return Math.abs(trade.premiumPerContract * trade.contracts);
  return null;
}

function optionPrice(trade: Trade): string {
  // Option price per share = total premium / (contracts * 100)
  const total = premiumTotal(trade);
  if (total != null && trade.contracts && trade.contracts > 0) {
    const perShare = total / (trade.contracts * 100);
    return "$" + perShare.toFixed(2);
  }
  return "—";
}

function premiumDisplay(trade: Trade): string {
  const val = premiumTotal(trade);
  return val ? "$" + val.toLocaleString() : "—";
}

function tradeYield(trade: Trade): string {
  // Yield = premium / capital required (strike * contracts * 100)
  const total = premiumTotal(trade);
  if (total != null && trade.strike && trade.contracts) {
    const cap = Math.abs(trade.strike * trade.contracts * 100);
    if (cap > 0) return ((total / cap) * 100).toFixed(2) + "%";
  }
  return "—";
}

// Columns: Date | Type | Strike | Contracts | Capital req. | Opt. price | Premium | Yield | Expiry | Status
const COLS = ["Date", "Type", "Strike", "Contracts", "Capital req.", "Opt. price", "Premium", "Yield", "Expiry", "Status"];
const GRID = "85px 90px 65px 65px 100px 70px 70px 60px 95px 75px";

import type { PortfolioView } from "./types";

interface HoldingsListProps {
  portfolio: Portfolio;
  tradesByTicker: Record<string, Trade[]>;
  view: PortfolioView;
}

export default function HoldingsList({ portfolio, tradesByTicker, view }: HoldingsListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [member, setMember] = useState(false);
  useEffect(() => { setMember(localStorage.getItem("lakespring_member") === "true"); }, []);

  // Filter holdings by portfolio view
  const activeTickers = view === "first" ? FP_TICKERS : SD_TICKERS;
  const liveHoldings = portfolio.holdings.filter(h =>
    activeTickers.has(h.ticker) && !EXCLUDED.has(h.ticker)
  );

  // For SD: include placeholder rows for tickers not yet in portfolio
  const holdings = view === "first"
    ? liveHoldings
    : [...new Set([...SD_TICKERS])].map(ticker => {
        const live = liveHoldings.find(h => h.ticker === ticker);
        return live ?? {
          ticker, name: SD_NAMES[ticker] ?? ticker,
          price: 0, weight: 0, dayChangePct: 0,
        };
      });

  const toggle = (ticker: string) => setExpanded(prev => prev === ticker ? null : ticker);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6">
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-4">Holdings</h2>
      <div className="divide-y divide-cream-200">
        {holdings.map((h) => {
          const bg = pickColor(h.ticker);
          const fg = pickTextColor(bg);
          const logoSrc = TICKER_LOGOS[h.ticker];
          const isOpen = expanded === h.ticker;
          const allTrades = tradesByTicker[h.ticker] ?? [];
          const optionsTrades = allTrades.filter(t => OPTIONS_TYPES.has(t.optionType?.toUpperCase()));
          const totalPremiums = sumPremiums(allTrades);

          return (
            <div key={h.ticker}>
              <button onClick={() => toggle(h.ticker)} className="w-full py-3 text-left" aria-expanded={isOpen}>
                <div className="flex items-center gap-3">
                  {/* Logo tile */}
                  <div
                    className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ background: bg }}
                  >
                    {logoSrc ? (
                      h.ticker === "LLY" ? (
                        // Lilly: wide landscape logo — contain on cream bg so full text shows
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoSrc} alt={h.ticker}
                          style={{ width: "90%", height: "90%", objectFit: "contain", display: "block" }}
                        />
                      ) : ["MRVL","NBIS","ASML","BE","SMCI"].includes(h.ticker) ? (
                        // Other SD logos fill tile with their own background
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoSrc} alt={h.ticker}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <Image src={logoSrc} alt={h.ticker}
                          width={logoSize(h.ticker)} height={logoSize(h.ticker)}
                          className="object-contain"
                        />
                      )
                    ) : (
                      <span className="text-[11px] font-medium" style={{ color: fg }}>
                        {h.ticker.slice(0, 4)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-medium text-ink-900">{h.name}</p>
                      <span className="text-xs text-ink-400 tabular-nums">
                        ${h.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-ink-400">
                        <span className="text-ink-600 font-medium">{h.weight.toFixed(0)}%</span> of portfolio
                      </span>
                      {totalPremiums > 0 && (
                        <span className="text-[11px] text-sage-600 font-medium"
                          style={{ filter: member ? "none" : "blur(5px)" }}>
                          +${totalPremiums.toLocaleString(undefined, { maximumFractionDigits: 0 })} premiums
                        </span>
                      )}
                    </div>
                  </div>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className={`text-ink-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="pb-4 pt-1 overflow-x-auto">
                  {optionsTrades.length === 0 ? (
                    <p className="text-xs text-ink-400 py-2">No options trades found for {h.ticker}.</p>
                  ) : (
                    <div className="rounded-xl border border-cream-200 overflow-hidden text-xs min-w-[760px]">
                      {/* Header */}
                      <div
                        className="grid px-4 py-2.5"
                        style={{ gridTemplateColumns: GRID, gap: "0", background: "#034147" }}
                      >
                        {COLS.map((col, ci) => (
                          <span
                            key={col}
                            className="text-[10px] uppercase tracking-wide font-medium text-white/80"
                            style={{ textAlign: ci === 0 ? "left" : "center" }}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                      {/* Rows */}
                      {optionsTrades.map((trade, idx) => (
                        <div
                          key={idx}
                          className="grid px-4 py-2.5 border-b border-cream-100 last:border-0 items-center"
                          style={{
                            gridTemplateColumns: GRID,
                            gap: "0",
                            background: idx % 2 === 1 ? "rgba(250,248,243,0.6)" : "white",
                          }}
                        >
                          <span className="text-ink-500 tabular-nums text-left">
                            {formatDate(trade.openDate)}
                          </span>
                          <span className="text-center font-medium" style={{ color: "#034147" }}>
                            {friendlyType(trade.optionType)}
                          </span>
                          <span className="text-center text-ink-700 tabular-nums"
                            style={{ filter: member ? "none" : "blur(5px)" }}>
                            {trade.strike ? `$${trade.strike.toLocaleString()}` : "—"}
                          </span>
                          <span className="text-center text-ink-700 tabular-nums"
                            style={{ filter: member ? "none" : "blur(5px)" }}>
                            {trade.contracts ? `${trade.contracts} ct` : "—"}
                          </span>
                          <span className="text-center text-ink-700 tabular-nums"
                            style={{ filter: member ? "none" : "blur(5px)" }}>
                            {capitalRequired(trade)}
                          </span>
                          <span className="text-center text-ink-700 tabular-nums"
                            style={{ filter: member ? "none" : "blur(5px)" }}>
                            {optionPrice(trade)}
                          </span>
                          <span className="text-center text-ink-700 tabular-nums"
                            style={{ filter: member ? "none" : "blur(5px)" }}>
                            {premiumDisplay(trade)}
                          </span>
                          <span className="text-center tabular-nums font-medium" style={{ color: "#1D9E75", filter: member ? "none" : "blur(5px)" }}>
                            {tradeYield(trade)}
                          </span>
                          <span className="text-center text-ink-500 tabular-nums">
                            {formatDate(trade.closeDate)}
                          </span>
                          <span
                            className="text-center font-medium"
                            style={{ color: statusColor(trade.status) }}
                          >
                            {trade.status || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
