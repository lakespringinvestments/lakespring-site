import { getPortfolio } from "@/lib/data";
import { getAllTrades } from "@/lib/trades";
import PortfolioHero from "@/components/Dashboard/PortfolioHero";
import PremiumChart from "@/components/Dashboard/PremiumChart";
import MetricCards from "@/components/Dashboard/MetricCards";
import AllocationDonut from "@/components/Dashboard/AllocationDonut";
import CapitalGainsTable from "@/components/Dashboard/CapitalGainsTable";
import HoldingsList from "@/components/Dashboard/HoldingsList";

export const revalidate = 300;

export const metadata = {
  title: "Portfolio — Lakespring Investments",
  description: "First-principles portfolio — concentrated bets, patient compounding.",
};

export default async function DashboardPage() {
  const portfolio = await getPortfolio();
  const allTrades = await getAllTrades();

  // Group trades by ticker, most recent first, cap at 8 per ticker
  const tradesByTicker: Record<string, typeof allTrades> = {};
  for (const trade of allTrades) {
    const ticker = trade.ticker.toUpperCase();
    if (!ticker) continue;
    if (!tradesByTicker[ticker]) tradesByTicker[ticker] = [];
    if (tradesByTicker[ticker].length < 8) {
      tradesByTicker[ticker].push(trade);
    }
  }

  // Build weekly premium data from trades for the chart
  // Group options trades by week, sum premiums
  const weeklyMap: Record<string, number> = {};
  for (const trade of allTrades) {
    if (!["CSP", "CC"].includes(trade.optionType?.toUpperCase() ?? "")) continue;
    const val = trade.totalPremiumUsd ?? 0;
    if (val <= 0) continue;
    const date = trade.closeDate || trade.openDate;
    if (!date) continue;
    // Get week start (Monday)
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    const weekKey = d.toISOString().slice(0, 10);
    weeklyMap[weekKey] = (weeklyMap[weekKey] ?? 0) + val;
  }
  const weeklyPremiums = Object.entries(weeklyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Row 1: Portfolio value card + Weekly premium chart */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5 mb-5">
        <PortfolioHero portfolio={portfolio} />
        <PremiumChart weeklyData={weeklyPremiums} premiumYTD={portfolio.premiumYTD} />
      </div>

      {/* Row 2: Metric cards with portfolio toggle */}
      <MetricCards portfolio={portfolio} allTrades={allTrades} />

      {/* Row 3: Donut + Capital Gains table */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5 mt-5">
        <AllocationDonut portfolio={portfolio} />
        <CapitalGainsTable portfolio={portfolio} />
      </div>

      {/* Row 4: Holdings with trade dropdown */}
      <div className="mt-5">
        <HoldingsList portfolio={portfolio} tradesByTicker={tradesByTicker} />
      </div>

      <p className="text-xs text-ink-400 mt-6 text-right">
        Updated{" "}
        {new Date(portfolio.lastUpdated).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
    </div>
  );
}
