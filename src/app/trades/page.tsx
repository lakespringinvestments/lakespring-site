// src/app/trades/page.tsx
// update-138: Live trade ledger pulling from Google Sheet
import { getAllTrades } from "@/lib/trades";
import TradeLedgerClient from "@/components/TradeLedger/TradeLedgerClient";
import EmailSignup from "@/components/EmailSignup";

export const metadata = {
  title: "Trade Ledger — Lakespring Investments",
  description:
    "Every closed options trade, published with a 30-day delay. Full transparency on the Lakespring portfolio.",
};

export default async function TradesPage() {
  const trades = await getAllTrades();

  return (
    <>
      {/* Cream hero — matches the rest of the site */}
      <section className="bg-transparent">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-500 mb-5">
            The Ledger
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-teal-600 tracking-tight leading-[1.05] mb-6 font-semibold max-w-4xl">
            Every trade, on the record.
          </h1>
          <p className="text-ink-500 text-lg leading-relaxed max-w-3xl mb-3">
            A complete log of closed options positions across the Lakespring
            portfolio. All entries are personal trades I&apos;ve placed against
            my family&apos;s holdings.
          </p>
          <p className="text-sage-700 text-sm">
            Publicly delayed by 30 days. Open positions and live reasoning
            will be available in a future members-only tier.
          </p>
        </div>
      </section>

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
