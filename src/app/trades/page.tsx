// src/app/trades/page.tsx
// update-143: Force dynamic rendering, no caching
import { getAllTrades } from "@/lib/trades";
import TradeLedgerClient from "@/components/TradeLedger/TradeLedgerClient";
import EmailSignup from "@/components/EmailSignup";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trade Ledger — Lakespring Investments",
  description:
    "Every closed options trade, published with a 30-day delay. Full transparency on the Lakespring portfolio.",
};

export default async function TradesPage() {
  const trades = await getAllTrades();

  return (
    <>
      {/* Dark ledger */}
      <section className="bg-[#0A0A0A] pb-20 md:pb-24 pt-16 md:pt-20">
        <div className="max-w-6xl mx-auto px-6">
          <TradeLedgerClient trades={trades} />

          {/* Members tier teaser */}
          <div className="mt-16 pt-12 border-t border-white/15">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-sage-300 mb-3">
                Coming soon — Members tier
              </p>
              <h2 className="text-2xl md:text-3xl text-white tracking-tight mb-4 font-semibold">
                See the live ledger.
              </h2>
              <p className="text-cream-100 leading-relaxed mb-8">
                Members will see open positions in real time, the reasoning
                behind every fill, and detailed write-ups of how each trade
                fits the underlying thesis.
              </p>
              <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/10 max-w-md">
                <p className="text-sm text-cream-100 mb-4">
                  Join the journal — be first to know when members tier opens.
                </p>
                <EmailSignup />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
