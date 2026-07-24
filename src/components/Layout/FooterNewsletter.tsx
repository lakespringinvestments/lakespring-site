const STRIPE_URL = "https://buy.stripe.com/14AdR8eT3dFAgSAfwf6c000";

export default function FooterNewsletter() {
  return (
    <div style={{ background: "linear-gradient(180deg, #034147 0%, #0a0a0a 100%)" }}>
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-8 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          <h3 className="text-2xl text-white mb-3 tracking-tight font-semibold">
            Become a Member
          </h3>
          <p className="text-cream-100/70 text-sm leading-relaxed max-w-md">
            Live trade alerts, weekly analysis, and the full report archive —
            start with a free 14-day trial.
          </p>
        </div>
        <div>
          <a
            href={STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-teal-600 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-cream-50 transition-colors"
          >
            Start Free Trial →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-8 grid md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start border-t border-white/10">
        <span className="text-xs text-white/40 whitespace-nowrap">
          © {new Date().getFullYear()} Lakespring Investments
        </span>
        <p className="text-xs text-white/40 leading-relaxed">
          <span className="font-semibold text-white/60">Disclaimer.</span>{" "}
          The content on Lakespring Investments reflects my personal
          investment analysis and framework for managing my family&apos;s
          portfolio. It is not financial advice, a recommendation to buy or
          sell any security, or a solicitation of any kind. I am not a
          licensed financial advisor, broker, or fiduciary. Past performance
          shown does not predict future results. Holdings disclosed here may
          change without notice. Readers should conduct their own research
          and consult a qualified advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}
