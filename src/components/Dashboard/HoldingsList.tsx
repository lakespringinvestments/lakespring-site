"use client";

import Image from "next/image";
import { useState } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";

const TICKER_COLORS: Record<string, string> = {
  TSLA:  "#CC0000",
  NVDA:  "#76B900",
  PLTR:  "#101113",
  AMZN:  "#FF9900",
  GOOGL: "#E8EAED",
};

const TICKER_LOGOS: Record<string, string> = {
  TSLA:  "/logos/tesla.png",
  NVDA:  "/logos/nvidia.png",
  PLTR:  "/logos/palantir.png",
  AMZN:  "/logos/amazon.png",
  GOOGL: "/logos/google.png",
};

// Tickers excluded from this page
const EXCLUDED = new Set(["BTC", "SOL", "ASML"]);

// Options-only trade types
const OPTIONS_TYPES = new Set(["CSP", "CC"]);

function pickColor(ticker: string, idx: number) {
  return TICKER_COLORS[ticker] ?? ["#034147", "#1D9E75", "#5DCAA5", "#347278"][idx % 4];
}

function pickTextColor(bg: string) {
  const lightBgs = ["#76B900", "#FF9900", "#E8EAED"];
  return lightBgs.includes(bg) ? "#0a0a0a" : "#ffffff";
}

function logoSize(ticker: string): number {
  if (["TSLA", "NVDA", "PLTR"].includes(ticker)) return 40;
  if (ticker === "GOOGL") return 30;
  return 38;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "2-digit",
    });
  } catch { return iso; }
}

function statusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("expired") || s.includes("closed")) return "text-sage-500";
  if (s.includes("assigned")) return "text-amber-600";
  if (s.includes("open")) return "text-teal-600";
  if (s.includes("rolled")) return "text-blue-500";
  return "text-ink-500";
}

function shortDesc(desc: string): string {
  if (!desc) return "—";
  const first = desc.split(/\. |POST-MORTEM|MONDAY/)[0].trim();
  return first.length > 90 ? first.slice(0, 87) + "…" : first;
}

function sumPremiums(trades: Trade[]): number {
  return trades
    .filter(t => OPTIONS_TYPES.has(t.optionType?.toUpperCase()))
    .reduce((sum, t) => {
      const val = t.totalPremiumUsd ?? (
        t.premiumPerContract != null && t.contracts != null
          ? t.premiumPerContract * t.contracts
          : 0
      );
      // Only count positive premiums (income), not BTC debits
      return val > 0 ? sum + val : sum;
    }, 0);
}

interface HoldingsListProps {
  portfolio: Portfolio;
  tradesByTicker: Record<string, Trade[]>;
}

export default function HoldingsList({ portfolio, tradesByTicker }: HoldingsListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const holdings = portfolio.holdings.filter(h => !EXCLUDED.has(h.ticker));

  // Totals for % calculations
  const totalMarketValue = holdings.reduce((sum, h) => sum + h.price * (h.weight / 100) * portfolio.totalValue / h.price, 0);
  // We'll use weight directly as market value %
  // Book cost % — use weight as proxy since we don't have book cost per holding yet
  const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);

  const toggle = (ticker: string) =>
    setExpanded(prev => prev === ticker ? null : ticker);

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-8">
      <h2 className="text-sm uppercase tracking-wide text-ink-500 mb-5">Holdings</h2>
      <div className="divide-y divide-cream-200">
        {holdings.map((h, i) => {
          const bg = pickColor(h.ticker, i);
          const fg = pickTextColor(bg);
          const logoSrc = TICKER_LOGOS[h.ticker];
          const isOpen = expanded === h.ticker;
          const allTrades = tradesByTicker[h.ticker] ?? [];
          const optionsTrades = allTrades.filter(t => OPTIONS_TYPES.has(t.optionType?.toUpperCase()));
          const totalPremiums = sumPremiums(allTrades);
          const mvPct = h.weight.toFixed(0);

          return (
            <div key={h.ticker}>
              {/* Holding row */}
              <button
                onClick={() => toggle(h.ticker)}
                className="w-full py-3 text-left group"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  {/* Logo tile */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ background: bg }}
                  >
                    {logoSrc ? (
                      <Image src={logoSrc} alt={h.ticker}
                        width={logoSize(h.ticker)} height={logoSize(h.ticker)}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-[11px] font-medium tracking-wide" style={{ color: fg }}>
                        {h.ticker.slice(0, 4)}
                      </span>
                    )}
                  </div>

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-medium text-ink-900">{h.name}</p>
                      <span className="text-xs text-ink-400 tabular-nums">
                        ${h.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-ink-400">
                        <span className="text-ink-600 font-medium">{mvPct}%</span> of portfolio
                      </span>
                      {totalPremiums > 0 && (
                        <span className="text-[11px] text-ink-400">
                          <span className="text-sage-600 font-medium">
                            +${totalPremiums.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span> premiums
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className={`text-ink-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="pb-4 pt-1">
                  {optionsTrades.length === 0 ? (
                    <p className="text-xs text-ink-400 px-1 py-2">No options trades found for {h.ticker}.</p>
                  ) : (
                    <div className="rounded-xl border border-cream-200 overflow-hidden text-xs">
                      {/* Dark teal header */}
                      <div
                        className="grid gap-2 px-4 py-2.5"
                        style={{
                          gridTemplateColumns: "80px 50px 70px 1fr 80px 80px",
                          background: "#034147",
                        }}
                      >
                        {["Date", "Type", "Strike", "Description", "Premium", "Status"].map(h => (
                          <span key={h} className="text-[10px] uppercase tracking-wide font-medium text-white/80">
                            {h}
                          </span>
                        ))}
                      </div>
                      {optionsTrades.map((trade, idx) => (
                        <div
                          key={idx}
                          className="grid gap-2 px-4 py-2.5 border-b border-cream-100 last:border-0 items-start odd:bg-cream-50/50"
                          style={{ gridTemplateColumns: "80px 50px 70px 1fr 80px 80px" }}
                        >
                          <span className="text-ink-500 tabular-nums">
                            {formatDate(trade.closeDate || trade.openDate)}
                          </span>
                          <span className="font-medium text-teal-600">
                            {trade.optionType}
                          </span>
                          <span className="text-ink-700 tabular-nums">
                            {trade.strike ? `$${trade.strike.toLocaleString()}` : "—"}
                          </span>
                          <span className="text-ink-500 leading-relaxed">
                            {shortDesc(trade.description)}
                          </span>
                          <span className="text-ink-700 tabular-nums text-right">
                            {trade.totalPremiumUsd != null && trade.totalPremiumUsd > 0
                              ? `$${trade.totalPremiumUsd.toLocaleString()}`
                              : trade.premiumPerContract != null && trade.contracts != null && trade.premiumPerContract > 0
                              ? `$${Math.abs(trade.premiumPerContract * trade.contracts).toLocaleString()}`
                              : "—"}
                          </span>
                          <span className={`font-medium text-right ${statusColor(trade.status)}`}>
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
