"use client";

import Image from "next/image";
import { useState } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";

// Brand colours per ticker
const TICKER_COLORS: Record<string, string> = {
  TSLA:  "#CC0000",
  NVDA:  "#76B900",
  PLTR:  "#101113",
  ASML:  "#1B28C5",
  AMZN:  "#FF9900",
  GOOGL: "#E8EAED",
};

const TICKER_LOGOS: Record<string, string> = {
  TSLA:  "/logos/tesla.png",
  NVDA:  "/logos/nvidia.png",
  PLTR:  "/logos/palantir.png",
  ASML:  "/logos/ASML.png",
  AMZN:  "/logos/amazon.png",
  GOOGL: "/logos/google.png",
};

const EXCLUDED = new Set(["BTC", "SOL"]);

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
  } catch {
    return iso;
  }
}

function statusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("expired") || s.includes("closed")) return "text-sage-500";
  if (s.includes("assigned")) return "text-amber-600";
  if (s.includes("open")) return "text-teal-600";
  if (s.includes("rolled")) return "text-blue-500";
  return "text-ink-500";
}

function tradeTypeLabel(trade: Trade): string {
  if (trade.optionType) return trade.optionType;
  if (trade.strategyType) {
    const s = trade.strategyType.toLowerCase();
    if (s.includes("swing")) return "Swing";
    if (s.includes("accumulation")) return "Accum.";
    if (s.includes("transfer")) return "Transfer";
    if (s.includes("share sale")) return "Share Sale";
    if (s.includes("leap")) return "LEAP";
  }
  return trade.strategyType ?? "—";
}

// Truncate long descriptions to keep the UI tight
function shortDesc(desc: string): string {
  if (!desc) return "—";
  // Use just the first sentence or up to 80 chars
  const first = desc.split(/[.|POST-MORTEM|MONDAY]/)[0].trim();
  return first.length > 90 ? first.slice(0, 87) + "…" : first;
}

interface HoldingsListProps {
  portfolio: Portfolio;
  tradesByTicker: Record<string, Trade[]>;
}

export default function HoldingsList({ portfolio, tradesByTicker }: HoldingsListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const holdings = portfolio.holdings.filter((h) => !EXCLUDED.has(h.ticker));

  const toggle = (ticker: string) =>
    setExpanded((prev) => (prev === ticker ? null : ticker));

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-8">
      <h2 className="text-sm uppercase tracking-wide text-ink-500 mb-5">
        Holdings
      </h2>
      <div className="divide-y divide-cream-200">
        {holdings.map((h, i) => {
          const bg = pickColor(h.ticker, i);
          const fg = pickTextColor(bg);
          const logoSrc = TICKER_LOGOS[h.ticker];
          const positive = h.dayChangePct >= 0;
          const isOpen = expanded === h.ticker;
          const trades = tradesByTicker[h.ticker] ?? [];

          return (
            <div key={h.ticker}>
              {/* Holding row — clickable */}
              <button
                onClick={() => toggle(h.ticker)}
                className="w-full flex items-center justify-between py-3 group text-left"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  {/* Logo tile */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ background: bg }}
                  >
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={h.ticker}
                        width={logoSize(h.ticker)}
                        height={logoSize(h.ticker)}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-[11px] font-medium tracking-wide" style={{ color: fg }}>
                        {h.ticker.slice(0, 4)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{h.name}</p>
                    <p className="text-xs text-ink-500 tabular-nums">
                      ${h.price.toLocaleString()} · {h.weight.toFixed(0)}% of portfolio
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium tabular-nums ${positive ? "text-sage-500" : "text-red-600"}`}>
                    {positive ? "+" : ""}{h.dayChangePct.toFixed(2)}%
                  </span>
                  {/* Chevron */}
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className={`text-ink-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {/* Trade dropdown */}
              {isOpen && (
                <div className="pb-4 pt-1">
                  {trades.length === 0 ? (
                    <p className="text-xs text-ink-400 px-1 py-2">No trades found for {h.ticker}.</p>
                  ) : (
                    <div className="rounded-xl border border-cream-200 overflow-hidden">
                      {/* Header */}
                      <div className="grid grid-cols-[90px_60px_70px_1fr_80px_90px] gap-2 px-4 py-2 bg-cream-50 border-b border-cream-200">
                        <span className="text-[10px] uppercase tracking-wide text-ink-400">Date</span>
                        <span className="text-[10px] uppercase tracking-wide text-ink-400">Type</span>
                        <span className="text-[10px] uppercase tracking-wide text-ink-400">Strike</span>
                        <span className="text-[10px] uppercase tracking-wide text-ink-400">Description</span>
                        <span className="text-[10px] uppercase tracking-wide text-ink-400 text-right">Premium</span>
                        <span className="text-[10px] uppercase tracking-wide text-ink-400 text-right">Status</span>
                      </div>
                      {trades.map((trade, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[90px_60px_70px_1fr_80px_90px] gap-2 px-4 py-2.5 border-b border-cream-100 last:border-0 items-start"
                        >
                          <span className="text-xs text-ink-500 tabular-nums">
                            {formatDate(trade.closeDate || trade.openDate)}
                          </span>
                          <span className="text-xs font-medium text-teal-600">
                            {tradeTypeLabel(trade)}
                          </span>
                          <span className="text-xs text-ink-700 tabular-nums">
                            {trade.strike ? `$${trade.strike.toLocaleString()}` : "—"}
                          </span>
                          <span className="text-xs text-ink-500 leading-relaxed">
                            {shortDesc(trade.description)}
                          </span>
                          <span className="text-xs text-ink-700 tabular-nums text-right">
                            {trade.totalPremiumUsd != null
                              ? `$${Math.abs(trade.totalPremiumUsd).toLocaleString()}`
                              : trade.premiumPerContract != null && trade.contracts != null
                              ? `$${Math.abs(trade.premiumPerContract * trade.contracts).toLocaleString()}`
                              : "—"}
                          </span>
                          <span className={`text-xs font-medium text-right ${statusColor(trade.status)}`}>
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
