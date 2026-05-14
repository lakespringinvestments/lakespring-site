import EmailSignup from "@/components/EmailSignup";

export const metadata = {
  title: "Trade Ledger — Lakespring Investments",
  description: "A members-only view of every trade as it's placed.",
};

export default function TradesPage() {
  return (
    <div className="bg-teal-800 -mt-px">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-sage-300 mb-5">
          Members only
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-7 font-semibold">
          Every trade, as it happens.
        </h1>
        <p className="text-cream-100 text-lg leading-relaxed mb-14 max-w-xl mx-auto">
          A paid tier where members see exact strikes, expirations, and the
          thinking behind each position the moment it&apos;s placed. Coming when
          the time is right.
        </p>

        <div className="max-w-md mx-auto bg-teal-700/40 rounded-2xl p-8 text-left border border-teal-600">
          <p className="text-2xl text-white mb-3 tracking-tight font-semibold">
            Get notified at launch
          </p>
          <p className="text-cream-100 text-sm mb-6">
            Join the journal — the first to know when the Trade Ledger opens.
          </p>
          <EmailSignup />
        </div>
      </div>
    </div>
  );
}
