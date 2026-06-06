import type { Portfolio } from "../../types/portfolio";
import { fetchHoldingsFromSheet, fetchPerformanceFromSheet, fetchPremiumYTD } from "./sheets";

const MOCK_PORTFOLIO: Portfolio = {
  totalValue: 487231,
  dayChange: 11420,
  dayChangePct: 2.4,
  premiumYTD: 45628,
  openPositions: 8,
  shortCalls: 3,
  cash: 42108,
  cashPct: 8.6,
  lastUpdated: new Date().toISOString(),
  holdings: [
    { ticker: "TSLA",  name: "Tesla",    price: 391.00, weight: 26, dayChangePct: 0 },
    { ticker: "NVDA",  name: "Nvidia",   price: 205.10, weight: 20, dayChangePct: 0 },
    { ticker: "PLTR",  name: "Palantir", price: 135.53, weight: 13, dayChangePct: 0 },
    { ticker: "AMZN",  name: "Amazon",   price: 218.60, weight: 7,  dayChangePct: 0 },
    { ticker: "GOOGL", name: "Alphabet", price: 184.30, weight: 6,  dayChangePct: 0 },
    { ticker: "BTC",   name: "Bitcoin",  price: 60782,  weight: 16, dayChangePct: 0 },
  ],
  performance: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
    value: 460000 + Math.sin(i / 4) * 8000 + i * 900,
  })),
};

export async function getPortfolio(): Promise<Portfolio> {
  try {
    const [holdings, performance, premiumYTD] = await Promise.all([
      fetchHoldingsFromSheet(),
      fetchPerformanceFromSheet(),
      fetchPremiumYTD(),
    ]);

    if (holdings.length === 0) return MOCK_PORTFOLIO;

    const totalValue = holdings.reduce((sum, h) => {
      // Reconstruct approximate total from weight + price
      // weight is portfolio % → totalValue = price / (weight/100) for each holding
      // Average across holdings for a stable estimate
      if (h.weight > 0 && h.price > 0) return sum; // handled below
      return sum;
    }, 0);

    // Derive total from the most recent performance point, or sum holdings
    const perfTotal = performance.length > 0
      ? performance[performance.length - 1].value
      : MOCK_PORTFOLIO.totalValue;

    const previousValue = performance.length > 1
      ? performance[performance.length - 2].value
      : perfTotal;
    const dayChange = perfTotal - previousValue;
    const dayChangePct = previousValue ? (dayChange / previousValue) * 100 : 0;

    return {
      totalValue: perfTotal || MOCK_PORTFOLIO.totalValue,
      dayChange,
      dayChangePct,
      premiumYTD: premiumYTD || MOCK_PORTFOLIO.premiumYTD,
      openPositions: holdings.length,
      shortCalls: MOCK_PORTFOLIO.shortCalls,
      cash: MOCK_PORTFOLIO.cash,
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
