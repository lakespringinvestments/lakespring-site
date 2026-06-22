import type { Portfolio } from "../../types/portfolio";
import { fetchHoldingsFromSheet, fetchPerformanceFromSheet, fetchPremiumYTD } from "./sheets";

// Base holdings — always shown even when not currently held.
// Live data from the sheet overwrites price/weight when available.
// Weights reflect actual portfolio allocation (% of total ~$875K).
// Tickers with weight 0 appear as placeholder slices in the donut.
const BASE_HOLDINGS = [
  // ── First Principles ──
  { ticker: "TSLA",  name: "Tesla",          price: 399.40, weight: 37, dayChangePct: 0 },
  { ticker: "NVDA",  name: "Nvidia",         price: 213.25, weight: 0,  dayChangePct: 0 },
  { ticker: "PLTR",  name: "Palantir",       price: 127.39, weight: 7,  dayChangePct: 0 },
  { ticker: "AMZN",  name: "Amazon",         price: 239.90, weight: 0,  dayChangePct: 0 },
  { ticker: "GOOGL", name: "Alphabet",       price: 355.54, weight: 0,  dayChangePct: 0 },
  { ticker: "LLY",   name: "Eli Lilly",      price: 1101.55, weight: 0, dayChangePct: 0 },
  { ticker: "SPCX",  name: "SpaceX",         price: 171.20, weight: 0,  dayChangePct: 0 },
  // ── Thematic Momentum ──
  { ticker: "MRVL",  name: "Marvell",        price: 302.79, weight: 0,  dayChangePct: 0 },
  { ticker: "NBIS",  name: "Nebius Group",   price: 282.61, weight: 0,  dayChangePct: 0 },
  { ticker: "ASML",  name: "ASML",           price: 1940.86, weight: 0, dayChangePct: 0 },
  { ticker: "BE",    name: "Bloom Energy",   price: 0,      weight: 0,  dayChangePct: 0 },
  { ticker: "SMCI",  name: "Super Micro",    price: 34.06,  weight: 0,  dayChangePct: 0 },
];

const MOCK_PORTFOLIO: Portfolio = {
  totalValue: 875035,
  dayChange: 11420,
  dayChangePct: 2.4,
  premiumYTD: 57340,
  openPositions: 5,
  shortCalls: 3,
  cash: 42108,
  cashPct: 8.6,
  lastUpdated: new Date().toISOString(),
  holdings: BASE_HOLDINGS,
  performance: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
    value: 850000 + Math.sin(i / 4) * 8000 + i * 900,
  })),
};

export async function getPortfolio(): Promise<Portfolio> {
  try {
    const [sheetHoldings, performance, premiumYTD] = await Promise.all([
      fetchHoldingsFromSheet(),
      fetchPerformanceFromSheet(),
      fetchPremiumYTD(),
    ]);

    // Merge: start with base holdings, overwrite with live sheet data where available
    const liveByTicker = Object.fromEntries(
      sheetHoldings.map((h) => [h.ticker, h])
    );

    const holdings = BASE_HOLDINGS.map((base) => {
      const live = liveByTicker[base.ticker];
      if (live && (live.price > 0 || live.weight > 0)) {
        return {
          ...base,
          price: live.price || base.price,
          weight: live.weight || base.weight,
          dayChangePct: live.dayChangePct ?? 0,
        };
      }
      return base;
    });

    const perfTotal =
      performance.length > 0
        ? performance[performance.length - 1].value
        : MOCK_PORTFOLIO.totalValue;

    const previousValue =
      performance.length > 1
        ? performance[performance.length - 2].value
        : perfTotal;

    const dayChange = perfTotal - previousValue;
    const dayChangePct = previousValue ? (dayChange / previousValue) * 100 : 0;

    return {
      totalValue: perfTotal || MOCK_PORTFOLIO.totalValue,
      dayChange,
      dayChangePct,
      premiumYTD: premiumYTD || MOCK_PORTFOLIO.premiumYTD,
      openPositions: holdings.filter((h) => h.weight > 0).length,
      shortCalls: MOCK_PORTFOLIO.shortCalls,
      cash: MOCK_PORTFOLIO.cash,
      cashPct: MOCK_PORTFOLIO.cashPct,
      lastUpdated: new Date().toISOString(),
      holdings,
      performance:
        performance.length > 0 ? performance : MOCK_PORTFOLIO.performance,
    };
  } catch (err) {
    console.error("Portfolio fetch failed, using mock data:", err);
    return MOCK_PORTFOLIO;
  }
}
