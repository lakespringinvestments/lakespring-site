import type { Portfolio } from "../../types/portfolio";
import { fetchHoldingsFromSheet, fetchPerformanceFromSheet } from "./sheets";

// ============================================================================
// THE DATA LAYER
// ============================================================================
// This is the single function the dashboard reads from.
// To swap data sources later (e.g., Google Sheets → IBKR), change ONLY this
// function. Every component will pick up the new source automatically.
// ============================================================================

const MOCK_PORTFOLIO: Portfolio = {
  totalValue: 487231,
  dayChange: 11420,
  dayChangePct: 2.4,
  premiumYTD: 8420,
  openPositions: 8,
  shortCalls: 3,
  cash: 42108,
  cashPct: 8.6,
  lastUpdated: new Date().toISOString(),
  holdings: [
    { ticker: "TSLA", name: "Tesla", price: 342.18, weight: 26, dayChangePct: 3.42 },
    { ticker: "NVDA", name: "Nvidia", price: 148.92, weight: 20, dayChangePct: 1.88 },
    { ticker: "BTC", name: "Bitcoin", price: 97420, weight: 16, dayChangePct: 2.10 },
    { ticker: "PLTR", name: "Palantir", price: 84.20, weight: 13, dayChangePct: 4.10 },
    { ticker: "ASML", name: "ASML", price: 712.40, weight: 8, dayChangePct: -0.84 },
    { ticker: "AMZN", name: "Amazon", price: 218.60, weight: 7, dayChangePct: 0.92 },
    { ticker: "GOOGL", name: "Alphabet", price: 184.30, weight: 6, dayChangePct: 1.04 },
    { ticker: "SOL", name: "Solana", price: 218.40, weight: 4, dayChangePct: 1.72 },
  ],
  performance: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
    value: 460000 + Math.sin(i / 4) * 8000 + i * 900,
  })),
};

export async function getPortfolio(): Promise<Portfolio> {
  try {
    const [holdings, performance] = await Promise.all([
      fetchHoldingsFromSheet(),
      fetchPerformanceFromSheet(),
    ]);

    // If sheets aren't configured yet, fall back to mock data
    // so the site looks alive while you set up the sheet.
    if (holdings.length === 0) return MOCK_PORTFOLIO;

    // Derive aggregates from the sheet data
    const totalValue = performance.length > 0
      ? performance[performance.length - 1].value
      : MOCK_PORTFOLIO.totalValue;
    const previousValue = performance.length > 1
      ? performance[performance.length - 2].value
      : totalValue;
    const dayChange = totalValue - previousValue;
    const dayChangePct = previousValue ? (dayChange / previousValue) * 100 : 0;

    return {
      totalValue,
      dayChange,
      dayChangePct,
      premiumYTD: MOCK_PORTFOLIO.premiumYTD, // TODO: pull from sheet
      openPositions: holdings.length,
      shortCalls: MOCK_PORTFOLIO.shortCalls, // TODO: pull from sheet
      cash: MOCK_PORTFOLIO.cash, // TODO: pull from sheet
      cashPct: MOCK_PORTFOLIO.cashPct,
      lastUpdated: new Date().toISOString(),
      holdings,
      performance: performance.length > 0 ? performance : MOCK_PORTFOLIO.performance,
    };
  } catch (err) {
    console.error("Portfolio fetch failed, using mock data:", err);
    return MOCK_PORTFOLIO;
  }
}
