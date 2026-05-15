import EmailSignup from "@/components/EmailSignup";

export const metadata = {
  title: "Trade Ledger — Lakespring Investments",
  description: "Every closed options trade, published with a 30-day delay.",
};

type Trade = {
  ticker: string;
  type: "CSP" | "CC" | "Long" | "Long Call" | "Long Put";
  strike: number | null;
  dateOpened: string;
  expiration: string;
  premium: number;
  pnl: number;
  status: "Closed" | "Expired" | "Assigned";
};

const trades: Trade[] = [
  { ticker: "TSLA", type: "CSP", strike: 280, dateOpened: "2026-02-14", expiration: "2026-03-21", premium: 420, pnl: 420, status: "Expired" },
  { ticker: "NVDA", type: "CC", strike: 165, dateOpened: "2026-02-21", expiration: "2026-03-28", premium: 285, pnl: 285, status: "Expired" },
  { ticker: "BTC", type: "CSP", strike: 85000, dateOpened: "2026-01-30", expiration: "2026-03-14", premium: 1200, pnl: -340, status: "Assigned" },
  { ticker: "PLTR", type: "CSP", strike: 70, dateOpened: "2026-02-05", expiration: "2026-03-07", premium: 165, pnl: 165, status: "Expired" },
  { ticker: "TSLA", type: "CC", strike: 340, dateOpened: "2026-01-17", expiration: "2026-02-28", premium: 510, pnl: 510, status: "Expired" },
  { ticker: "AMZN", type: "CSP", strike: 200, dateOpened: "2026-02-10", expiration: "2026-03-21", premium: 240, pnl: 240, status: "Expired" },
  { ticker: "NVDA", type: "CSP", strike: 130, dateOpened: "2026-01-24", expiration: "2026-02-21", premium: 320, pnl: 320, status: "Expired" },
  { ticker: "ASML", type: "CSP", strike: 680, dateOpened: "2026-02-07", expiration: "2026-03-14", premium: 380, pnl: -120, status: "Assigned" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const totalPremium = trades.reduce((sum, t) => sum + t.premium, 0);
const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);

export default function TradesPage() {
  return (
    <>
      {/* Hero — Option B: solid teal-100 at top, soft fade to cream-50 below the rule */}
      <section className="bg-gradient-to-b from-teal-100 from-55% to-cream-50 to-100%">
        <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-28 md:pb-36">
          <span className="inline-block bg-teal-600 text-white text-[11px] tracking-[0.2em] uppercase font-semibold px-4 py-1.5 rounded-full mb-6">
            The Ledger
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-teal-800 tracking-tight leading-[1.05] mb-6 font-semibold max-w-4xl">
            Every trade, on the record.
          </h1>
          <p className="text-teal-700 text-lg leading-relaxed max-w-3xl mb-3">
            A complete log of closed options positions across the Lakespring
            portfolio. All entries are personal trades I&apos;ve placed against
            my family&apos;s holdings.
          </p>
          <p className="text-teal-700 text-sm mb-8 opacity-80">
            Publicly delayed by 30 days. Open positions and live reasoning
            will be available in a future members-only tier.
          </p>
          <div className="h-0.5 w-16 bg-teal-600" />
        </div>
      </section>

      {/* White ledger on cream body */}
      <section className="bg-cream-50 pb-20 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Summary metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 mb-1.5">Total closed</p>
              <p className="text-2xl text-teal-600 font-semibold tabular-nums">{trades.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 mb-1.5">Premium collected</p>
              <p className="text-2xl text-teal-600 font-semibold tabular-nums">{formatCurrency(totalPremium)}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 mb-1.5">Realized P&amp;L</p>
              <p className={`text-2xl font-semibold tabular-nums ${totalPnl >= 0 ? "text-sage-500" : "text-red-600"}`}>
                {totalPnl >= 0 ? "+" : ""}{formatCurrency(totalPnl)}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 mb-1.5">Win rate</p>
              <p className="text-2xl text-teal-600 font-semibold tabular-nums">
                {Math.round((trades.filter(t => t.pnl > 0).length / trades.length) * 100)}%
              </p>
            </div>
          </div>

          {/* White ledger table */}
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead className="bg-cream-100/60">
                  <tr className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    <th className="py-4 px-5 font-semibold text-left">Ticker</th>
                    <th className="py-4 px-5 font-semibold text-left">Type</th>
                    <th className="py-4 px-5 font-semibold text-right">Strike</th>
                    <th className="py-4 px-5 font-semibold text-left">Opened</th>
                    <th className="py-4 px-5 font-semibold text-left">Expiration</th>
                    <th className="py-4 px-5 font-semibold text-right">Premium</th>
                    <th className="py-4 px-5 font-semibold text-right">P&amp;L</th>
                    <th className="py-4 px-5 font-semibold text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {trades.map((t, i) => (
                    <tr
                      key={i}
                      className="border-t border-cream-200 hover:bg-cream-50 transition-colors"
                    >
                      <td className="py-4 px-5 text-teal-600 font-semibold tracking-wide text-left">
                        {t.ticker}
                      </td>
                      <td className="py-4 px-5 text-ink-700 text-left">{t.type}</td>
                      <td className="py-4 px-5 text-ink-700 text-right tabular-nums">
                        {t.strike ? formatCurrency(t.strike) : "—"}
                      </td>
                      <td className="py-4 px-5 text-ink-500 tabular-nums whitespace-nowrap text-left">
                        {formatDate(t.dateOpened)}
                      </td>
                      <td className="py-4 px-5 text-ink-500 tabular-nums whitespace-nowrap text-left">
                        {formatDate(t.expiration)}
                      </td>
                      <td className="py-4 px-5 text-teal-600 text-right tabular-nums font-medium">
                        {formatCurrency(t.premium)}
                      </td>
                      <td
                        className={`py-4 px-5 text-right tabular-nums font-medium ${
                          t.pnl >= 0 ? "text-sage-500" : "text-red-600"
                        }`}
                      >
                        {t.pnl >= 0 ? "+" : ""}{formatCurrency(t.pnl)}
                      </td>
                      <td className="py-4 px-5 text-left">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            t.status === "Expired"
                              ? "bg-sage-100 text-sage-700"
                              : t.status === "Assigned"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-cream-200 text-ink-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Members tier teaser */}
          <div className="mt-16 pt-12 border-t border-cream-200">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-sage-500 mb-3">
                Coming soon — Members tier
              </p>
              <h2 className="text-2xl md:text-3xl text-teal-600 tracking-tight mb-4 font-semibold">
                See the live ledger.
              </h2>
              <p className="text-ink-700 leading-relaxed mb-8">
                Members will see open positions in real time, the reasoning
                behind every fill, and detailed write-ups of how each trade
                fits the underlying thesis.
              </p>
              <div className="bg-white rounded-2xl p-6 border border-cream-200 max-w-md shadow-sm">
                <p className="text-sm text-ink-700 mb-4">
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
