// src/app/trades/page.tsx
import { getAllTrades } from "@/lib/trades";
import TradesPageTabs from "@/components/TradeLedger/TradesPageTabs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trade Ledger — Lakespring Investments",
  description:
    "Every closed options trade, published with a 14-day delay. Full transparency on the Lakespring portfolio.",
};

export default async function TradesPage() {
  const rawTrades = await getAllTrades();

  // Merge GOOG into GOOGL so Alphabet shows as one ticker
  const trades = rawTrades.map(t => {
    if ((t.ticker ?? "").toUpperCase() === "GOOG") {
      return { ...t, ticker: "GOOGL" };
    }
    return t;
  });

  return (
    <>
      {/* Dark ledger */}
      <section className="bg-[#0A0A0A] pb-20 md:pb-24 pt-16 md:pt-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Mobile-only disclaimer — tables and charts here are data-dense */}
          <div className="md:hidden mb-6 flex items-start gap-2.5 bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-[11px] text-white/60 leading-relaxed">
              For the full experience and complete data, this page is best viewed on a desktop browser.
            </p>
          </div>

          <TradesPageTabs trades={trades} />
        </div>
      </section>
    </>
  );
}
