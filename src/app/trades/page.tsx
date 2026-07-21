// src/app/trades/page.tsx
import { getAllTrades } from "@/lib/trades";
import TradesPageTabs from "@/components/TradeLedger/TradesPageTabs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trade Ledger — Lakespring Investments",
  description:
    "Every closed options trade, published with a 30-day delay. Full transparency on the Lakespring portfolio.",
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
          <TradesPageTabs trades={trades} />

          {/* Members tier teaser */}
          <div className="mt-16 pt-12 border-t border-white/15">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-sage-300 mb-3">
                Paid Membership Tier
              </p>
              <h2 className="text-2xl md:text-3xl text-white tracking-tight mb-4 font-semibold">
                Enjoyed the sample reports?
              </h2>
              <p className="text-cream-100 leading-relaxed mb-8">
                Get them every week, along with live trade alerts, as a paid member.
              </p>
              <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/10 max-w-lg">
                <a
                  href="https://buy.stripe.com/test_9B66oH1nF9Zpe5Wewxfw400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-white text-[#034147] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  Subscribe →
                </a>
                <p className="text-[11px] text-white/40 mt-3 text-center">
                  Secure checkout via Stripe. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
