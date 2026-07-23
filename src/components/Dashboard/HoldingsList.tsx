"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";

const TICKER_COLORS: Record<string, string> = {
  TSLA:  "#CC0000", NVDA:  "#76B900", PLTR:  "#101113", AMZN:  "#edbb81",
  GOOGL: "#E8EAED", SPCX: "#E8EAED", LLY:  "#FAF8F3",
  MRVL: "transparent", NBIS: "transparent", ASML: "transparent", BE: "transparent",
  SMCI: "#8A9BB0", CRWV: "#2563EB",
  BTC:  "#F7931A", ETH:  "#627EEA", SOL: "#1A1A2E", BMNR: "#1A1A1A", MSTR: "#F7931A",
};

const TICKER_LOGOS: Record<string, string> = {
  TSLA:  "/logos/tesla.png", NVDA:  "/logos/nvidia.png", PLTR:  "/logos/palantir.png",
  AMZN:  "/logos/amazon.png", GOOGL: "/logos/google.png", LLY:  "/logos/lilly.png",
  SPCX: "/logos/space-x.png", SMCI: "/logos/smci.png", CRWV: "/logos/coreweave.png",
  MRVL: "/logos/marvell.png", NBIS: "/logos/nebius.png", ASML: "/logos/asml.png",
  BE:   "/logos/bloom_energy.png",
  BTC:  "/logos/bitcoin.png", ETH:  "/logos/ethereum.png", SOL: "/logos/solana.png",
  BMNR: "/logos/bitmine-immersion-technologies.png", MSTR: "/logos/microstrategy.png",
};

const EXCLUDED = new Set<string>();
const OPTIONS_TYPES = new Set(["CSP", "CC", "PUTS", "CALLS"]);
const FP_TICKERS = new Set(["TSLA","NVDA","PLTR","AMZN","GOOGL","LLY","SPCX"]);
const TM_TICKERS = new Set(["MRVL","NBIS","ASML","BE","SMCI","CRWV"]);
const CRYPTO_TICKERS = new Set(["BTC","ETH","SOL","BMNR","MSTR"]);

const FP_NAMES: Record<string, string> = {
  TSLA: "Tesla", NVDA: "Nvidia", PLTR: "Palantir", AMZN: "Amazon", GOOGL: "Alphabet", LLY: "Eli Lilly", SPCX: "SpaceX",
};
const TM_NAMES: Record<string, string> = {
  MRVL: "Marvell", NBIS: "Nebius Group", ASML: "ASML", BE: "Bloom Energy", SMCI: "Super Micro Computer", CRWV: "CoreWeave",
};
const CRYPTO_NAMES: Record<string, string> = {
  BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana", BMNR: "Bitmine Immersion", MSTR: "Strategy (MicroStrategy)",
};

// Tickers where the logo PNG has its own dark background — use objectFit cover
const LOGO_COVER_TICKERS = new Set(["MRVL","NBIS","ASML","BE","SMCI","CRWV","SOL","BMNR","MSTR"]);

function pickColor(ticker: string) { return TICKER_COLORS[ticker] ?? "#034147"; }
function pickTextColor(bg: string) {
  const lightBgs = ["#76B900", "#E8EAED", "#EFCEAD", "#FAF8F3"];
  return lightBgs.includes(bg) ? "#0a0a0a" : "#ffffff";
}

function logoSize(ticker: string): number {
  if (ticker === "TSLA") return 38;
  if (ticker === "NVDA") return 36;
  if (ticker === "PLTR") return 36;
  if (ticker === "AMZN") return 30;
  if (ticker === "GOOGL") return 28;
  if (["BTC","ETH"].includes(ticker)) return 36;
  return 36;
}

function friendlyType(optionType: string): string {
  const t = optionType?.toUpperCase();
  if (t === "CSP") return "Put";
  if (t === "CC")  return "Covered Call";
  return optionType;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return iso; }
}

function formatDateShort(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
    .reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);
}

function premiumTotal(trade: Trade): number | null {
  if (trade.gainLossUsd != null) return trade.gainLossUsd;
  if (trade.totalPremiumUsd != null) return trade.totalPremiumUsd;
  return null;
}

function premiumDisplay(trade: Trade): string {
  const val = premiumTotal(trade);
  if (val == null) return "—";
  return (val >= 0 ? "" : "-") + "$" + Math.abs(val).toLocaleString();
}

function tradeYield(trade: Trade): string {
  const total = premiumTotal(trade);
  if (total != null && trade.strike && trade.contracts) {
    const cap = Math.abs(trade.strike * trade.contracts * 100);
    if (cap > 0) return ((total / cap) * 100).toFixed(2) + "%";
  }
  return "—";
}

const COLS = ["Date", "Type", "Premium", "Yield", "Expiry", "Status"];
const GRID = "100px 100px 90px 70px 100px 80px";

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

  // Cash view: summary is in CapitalGainsTable position — nothing here
  if (view === "cash") return null;

  const activeTickers = view === "first" ? FP_TICKERS : view === "second" ? TM_TICKERS : CRYPTO_TICKERS;
  const nameMap = view === "first" ? FP_NAMES : view === "second" ? TM_NAMES : CRYPTO_NAMES;
  const liveHoldings = portfolio.holdings.filter(h =>
    activeTickers.has(h.ticker) && !EXCLUDED.has(h.ticker)
  );

  const holdings = [...new Set([...activeTickers])].map(ticker => {
    const live = liveHoldings.find(h => h.ticker === ticker);
    return live ?? { ticker, name: nameMap[ticker] ?? ticker, price: 0, weight: 0, dayChangePct: 0 };
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
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ background: bg }}>
                    {logoSrc ? (
                      h.ticker === "LLY" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoSrc} alt={h.ticker} style={{ width: "90%", height: "90%", objectFit: "contain", display: "block" }} />
                      ) : h.ticker === "SPCX" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoSrc} alt={h.ticker} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", marginLeft: "10px" }} />
                      ) : LOGO_COVER_TICKERS.has(h.ticker) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoSrc} alt={h.ticker} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <Image src={logoSrc} alt={h.ticker} width={logoSize(h.ticker)} height={logoSize(h.ticker)} className="object-contain" />
                      )
                    ) : (
                      <span className="text-[11px] font-medium" style={{ color: fg }}>{h.ticker.slice(0, 4)}</span>
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
                      {totalPremiums !== 0 && (
                        <span className={`text-[11px] font-medium ${totalPremiums >= 0 ? "text-sage-600" : "text-red-500"}`}>
                          {totalPremiums >= 0 ? "+" : "-"}${Math.abs(totalPremiums).toLocaleString(undefined, { maximumFractionDigits: 0 })} net income
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
                <div className="pb-4 pt-1">
                  {optionsTrades.length === 0 ? (
                    <p className="text-xs text-ink-400 py-2">No options trades found for {h.ticker}.</p>
                  ) : (
                    <>
                      {/* Desktop/tablet: grid table */}
                      <div className="hidden md:block rounded-xl border border-cream-200 overflow-hidden text-xs">
                        <div className="grid px-4 py-2.5" style={{ gridTemplateColumns: GRID, gap: "0", background: "#034147" }}>
                          {COLS.map((col, ci) => (
                            <span key={col} className="text-[10px] uppercase tracking-wide font-medium text-white/80"
                              style={{ textAlign: ci === 0 ? "left" : "center" }}>{col}</span>
                          ))}
                        </div>
                        {optionsTrades.slice(0, 5).map((trade, idx) => (
                          <div key={idx} className="grid px-4 py-2.5 border-b border-cream-100 last:border-0 items-center"
                            style={{ gridTemplateColumns: GRID, gap: "0", background: idx % 2 === 1 ? "rgba(250,248,243,0.6)" : "white" }}>
                            <span className="text-ink-500 tabular-nums text-left">{formatDate(trade.openDate)}</span>
                            <span className="text-center font-medium" style={{ color: "#034147" }}>{friendlyType(trade.optionType)}</span>
                            <span className="text-center text-ink-700 tabular-nums">{premiumDisplay(trade)}</span>
                            <span className="text-center tabular-nums font-medium" style={{ color: "#1D9E75" }}>{tradeYield(trade)}</span>
                            <span className="text-center text-ink-500 tabular-nums">{formatDate(trade.closeDate)}</span>
                            <span className="text-center font-medium" style={{ color: statusColor(trade.status) }}>{trade.status || "—"}</span>
                          </div>
                        ))}
                      </div>

                      {/* Mobile: compact single-row table — header stays visible, last 2 trades only */}
                      <div className="md:hidden rounded-xl border border-cream-200 overflow-hidden text-[10px]">
                        <div className="grid px-2.5 py-2" style={{ gridTemplateColumns: "52px 38px 46px 42px 52px 14px", gap: "3px", background: "#034147" }}>
                          <span className="text-[8px] uppercase tracking-wide font-medium text-white/80">Date</span>
                          <span className="text-[8px] uppercase tracking-wide font-medium text-white/80">Type</span>
                          <span className="text-[8px] uppercase tracking-wide font-medium text-white/80 text-right">Prem</span>
                          <span className="text-[8px] uppercase tracking-wide font-medium text-white/80 text-right">Yield</span>
                          <span className="text-[8px] uppercase tracking-wide font-medium text-white/80">Expiry</span>
                          <span className="text-[8px] uppercase tracking-wide font-medium text-white/80"></span>
                        </div>
                        {optionsTrades.slice(0, 2).map((trade, idx) => (
                          <div key={idx} className="grid px-2.5 py-2 border-b border-cream-100 last:border-0 items-center"
                            style={{ gridTemplateColumns: "52px 38px 46px 42px 52px 14px", gap: "3px", background: idx % 2 === 1 ? "rgba(250,248,243,0.6)" : "white" }}>
                            <span className="text-ink-500 tabular-nums">{formatDateShort(trade.openDate)}</span>
                            <span className="font-medium truncate" style={{ color: "#034147" }}>{friendlyType(trade.optionType)}</span>
                            <span className="text-ink-700 tabular-nums text-right">{premiumDisplay(trade)}</span>
                            <span className="tabular-nums font-medium text-right" style={{ color: "#1D9E75" }}>{tradeYield(trade)}</span>
                            <span className="text-ink-500 tabular-nums">{formatDateShort(trade.closeDate)}</span>
                            <span className="flex justify-center" title={trade.status || "—"}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(trade.status) }} />
                            </span>
                          </div>
                        ))}
                      </div>

                      {optionsTrades.length > 2 && (
                        <p className="md:hidden text-center text-[10px] text-ink-400 mt-2">
                          +{optionsTrades.length - 2} more on the Trade Ledger
                        </p>
                      )}

                      {/* Always visible — never trapped in a scrolling container */}
                      <div className="px-4 py-3 text-center border-t border-cream-100 rounded-b-xl md:border md:border-t-0 md:border-cream-200">
                        <a href="/trades" className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
                          View full trade history on the Trade Ledger →
                        </a>
                      </div>
                    </>
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
