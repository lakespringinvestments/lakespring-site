import { getPortfolio } from "@/lib/data";
import { getAllTrades } from "@/lib/trades";
import PortfolioHero from "@/components/Dashboard/PortfolioHero";
import PremiumChart from "@/components/Dashboard/PremiumChart";
import DashboardClient from "@/components/Dashboard/DashboardClient";
import MemberGate from "@/components/Dashboard/MemberGate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio — Lakespring Investments",
  description: "First-principles portfolio — concentrated bets, patient compounding.",
};

export default async function DashboardPage() {
  let portfolio;
  let allTrades: Awaited<ReturnType<typeof getAllTrades>> = [];

  try { portfolio = await getPortfolio(); }
  catch (e) { console.error("getPortfolio failed:", e); portfolio = null; }

  try { allTrades = await getAllTrades(); }
  catch (e) { console.error("getAllTrades failed:", e); }

  if (!portfolio) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-ink-400 text-sm">Portfolio data unavailable — check back shortly.</p>
      </div>
    );
  }

  const tradesByTicker: Record<string, typeof allTrades> = {};
  for (const trade of allTrades) {
    // Merge GOOG into GOOGL so Alphabet holdings shows both
    let ticker = (trade.ticker ?? "").toUpperCase();
    if (ticker === "GOOG") ticker = "GOOGL";
    if (!ticker) continue;
    if (!tradesByTicker[ticker]) tradesByTicker[ticker] = [];
    if (tradesByTicker[ticker].length < 20) tradesByTicker[ticker].push(trade);
  }

  // Weekly net options income — matches Excel SUMIFS logic
  // Uses openDate, excludes transfers/FPP/stock purchase (3 exclusions only)
  const EXCLUDE_STRATS = new Set([
    "transfer", "fpp accumulation", "stock purchase",
    "share sale", "assignment income", "swing trade",
  ]);

  const weeklyMap: Record<string, number> = {};
  for (const trade of allTrades) {
    const st = (trade.strategyType ?? "").toLowerCase();
    if (EXCLUDE_STRATS.has(st)) continue;
    if ((trade.description ?? "").toUpperCase().includes("TRANSFER IN")) continue;
    const date = trade.openDate;
    if (!date || date < "2026-01-01") continue;
    const val = trade.gainLossUsd ?? 0;
    if (val === 0) continue;
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) continue;
      const day = d.getDay();
      d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
      const weekKey = d.toISOString().slice(0, 10);
      weeklyMap[weekKey] = (weeklyMap[weekKey] ?? 0) + val;
    } catch { continue; }
  }

  const weeklyPremiums = Object.entries(weeklyMap)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }));

  // Total P&L (options + capital gains) for avg weekly in PortfolioHero
  const totalPnl = allTrades
    .filter((t) => {
      if ((t.openDate ?? "") < "2026-01-01") return false;
      const st = (t.strategyType ?? "").toLowerCase();
      // Only exclude transfers/FPP/stock purchase — include capital gains
      if (["transfer", "fpp accumulation", "stock purchase"].includes(st)) return false;
      if ((t.description ?? "").toUpperCase().includes("TRANSFER IN")) return false;
      return true;
    })
    .reduce((sum, t) => sum + (t.gainLossUsd ?? 0), 0);

  return (
    <>
      <MemberGate />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5 mb-5">
          <PortfolioHero portfolio={portfolio} totalPnl={totalPnl} />
          <PremiumChart weeklyData={weeklyPremiums} premiumYTD={portfolio.premiumYTD} />
        </div>
        <DashboardClient
          portfolio={portfolio}
          allTrades={allTrades}
          tradesByTicker={tradesByTicker}
        />
      <p className="text-xs text-ink-400 mt-6 text-right">
        Updated{" "}
        {new Date(portfolio.lastUpdated).toLocaleString("en-US", {
          dateStyle: "medium", timeStyle: "short",
        })}
      </p>
    </div>
    </>
  );
}
