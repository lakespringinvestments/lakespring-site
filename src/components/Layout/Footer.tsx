import EmailSignup from "@/components/EmailSignup";

export default function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-cream-100 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="font-serif text-2xl text-teal-600 mb-3 tracking-tight">
            Join the journal
          </h3>
          <p className="text-ink-500 text-sm leading-relaxed max-w-md">
            Occasional notes on portfolio thinking, conviction, and the slow
            compounding of asymmetric bets. No noise.
          </p>
        </div>
        <div>
          <EmailSignup />
        </div>
      </div>
      <div className="border-t border-cream-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-400">
          <span>© {new Date().getFullYear()} Lakespring Investments. A personal investing journal.</span>
          <span className="italic">Not financial advice.</span>
        </div>
      </div>
    </footer>
  );
}
