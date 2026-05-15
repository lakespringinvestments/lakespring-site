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
      {/* Hero — sage gradient + pill + rule */}
      <section className="bg-gradient-to-b from-sage-100 to-cream-50">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <span className="inline-block bg-sage-500 text-white text-[11px] tracking-[0.2em] uppercase font-semibold px-4 py-1.5 rounded-full mb-6">
            The Ledger
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-teal-600 tracking-tight leading-[1.05] mb-6 font-semibold max-w-4xl">
            Every trade, on the record.
          </h1>
          <p className="text-ink-500 text-lg leading-relaxed max-w-3xl mb-3">
            A complete log of closed options positions across the Lakespring
            portfolio. All entries are personal trades I&apos;ve placed against
            my family&apos;s holdings.
          </p>
          <p className="text-sage-700 text-sm mb-8">
            Publicly delayed by 30 days. Open positions and live reasoning
            will be available in a future members-only tier.
          </p>
          <div className="h-0.5 w-16 bg-sage-500" />
        </div>
      </section>

      {/* Dark ledger table */}
      <section className="bg-teal-800 pb-20 md:pb-24 pt-16 md:pt-20 border-t border-teal-700">
        <div className="max-w-6xl mx-auto px-6">
          {/* Summary strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-teal-600">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-1">Total closed</p>
              <p className="text-2xl text-white font-semibold">{trades.length}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-1">Premium collected</p>
              <p className="text-2xl text-white font-semibold">{formatCurrency(totalPremium)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-1">Realized P&amp;L</p>
              <p className={`text-2xl font-semibold ${totalPnl >= 0 ? "text-sage-300" : "text-red-400"}`}>
                {totalPnl >= 0 ? "+" : ""}{formatCurrency(totalPnl)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-1">Win rate</p>
              <p className="text-2xl text-white font-semibold">
                {Math.round((trades.filter(t => t.pnl > 0).length / trades.length) * 100)}%
              </p>
            </div>
          </div>

          {/* Ledger table */}
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-sage-300 text-left">
                  <th className="pb-4 pr-4 font-medium">Ticker</th>
                  <th className="pb-4 pr-4 font-medium">Type</th>
                  <th className="pb-4 pr-4 font-medium text-right">Strike</th>
                  <th className="pb-4 pr-4 font-medium">Opened</th>
                  <th className="pb-4 pr-4 font-medium">Expiration</th>
                  <th className="pb-4 pr-4 font-medium text-right">Premium</th>
                  <th className="pb-4 pr-4 font-medium text-right">P&amp;L</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm">
                {trades.map((t, i) => (
                  <tr key={i} className="border-t border-teal-700 hover:bg-teal-700/30 transition-colors">
                    <td className="py-4 pr-4 text-white font-semibold tracking-wide">{t.ticker}</td>
                    <td className="py-4 pr-4 text-cream-100">{t.type}</td>
                    <td className="py-4 pr-4 text-cream-100 text-right tabular-nums">
                      {t.strike ? formatCurrency(t.strike) : "—"}
                    </td>
                    <td className="py-4 pr-4 text-cream-100/80 tabular-nums whitespace-nowrap">
                      {formatDate(t.dateOpened)}
                    </td>
                    <td className="py-4 pr-4 text-cream-100/80 tabular-nums whitespace-nowrap">
                      {formatDate(t.expiration)}
                    </td>
                    <td className="py-4 pr-4 text-white text-right tabular-nums font-medium">
                      {formatCurrency(t.premium)}
                    </td>
                    <td className={`py-4 pr-4 text-right tabular-nums font-medium ${t.pnl >= 0 ? "text-sage-300" : "text-red-400"}`}>
                      {t.pnl >= 0 ? "+" : ""}{formatCurrency(t.pnl)}
                    </td>
                    <td className="py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                        t.status === "Expired"
                          ? "bg-sage-500/20 text-sage-300"
                          : t.status === "Assigned"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-cream-100/10 text-cream-100"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Members tier teaser */}
          <div className="mt-16 pt-12 border-t border-teal-600">
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
              <div className="bg-teal-700/40 rounded-2xl p-6 border border-teal-600 max-w-md">
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
