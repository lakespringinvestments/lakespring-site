import { getPortfolio } from "@/lib/data";
import { getAllTrades } from "@/lib/trades";
import PortfolioHero from "@/components/Dashboard/PortfolioHero";
import MetricCards from "@/components/Dashboard/MetricCards";
import AllocationDonut from "@/components/Dashboard/AllocationDonut";
import HoldingsList from "@/components/Dashboard/HoldingsList";

export const revalidate = 300; // revalidate every 5 minutes

export const metadata = {
  title: "Portfolio — Lakespring Investments",
  description:
    "A live look at how a first-principles thesis plays out across AI, energy, and digital assets.",
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-sage-500 mb-3">
          First Principles Portfolio
        </p>
        <h1 className="text-4xl md:text-5xl text-teal-600 tracking-tight leading-tight mb-4 font-semibold">
          Concentrated bets. Patient compounding.
        </h1>
        <p className="text-ink-500 text-lg leading-relaxed">
          A live look at how a first-principles thesis plays out across AI,
          energy, and digital assets — and the premium collected along the way.
        </p>
      </section>

      <div className="space-y-6">
        <PortfolioHero portfolio={portfolio} />
        <MetricCards portfolio={portfolio} />
        <AllocationDonut portfolio={portfolio} />
        <HoldingsList portfolio={portfolio} tradesByTicker={tradesByTicker} />
      </div>

      <p className="text-xs text-ink-400 mt-8 text-right">
        Updated{" "}
        {new Date(portfolio.lastUpdated).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
    </div>
  );
}
