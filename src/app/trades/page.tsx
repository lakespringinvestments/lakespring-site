import EmailSignup from "@/components/EmailSignup";

export const metadata = {
  title: "Trades — Lakespring Investments",
  description: "A members-only view of every trade as it's placed.",
};

export default function TradesPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-sage-500 mb-3">
        Members only
      </p>
      <h1 className="font-serif text-4xl md:text-5xl text-teal-600 tracking-tight mb-6">
        Every trade, as it happens.
      </h1>
      <p className="text-ink-500 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
        A paid tier where members see exact strikes, expirations, and the
        thinking behind each position the moment it&apos;s placed. Coming when the
        time is right.
      </p>
      <div className="max-w-md mx-auto bg-cream-100 rounded-2xl p-8 text-left">
        <p className="font-serif text-xl text-teal-600 mb-3 tracking-tight">
          Get notified at launch
        </p>
        <p className="text-ink-500 text-sm mb-5">
          Join the journal — the first to know when Trades opens.
        </p>
        <EmailSignup />
      </div>
    </div>
  );
}
