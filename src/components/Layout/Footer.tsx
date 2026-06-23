import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  return (
    <footer className="mt-20">
      {/* Newsletter section — black */}
      <div className="bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div>
            <h3 className="text-2xl text-white mb-3 tracking-tight font-semibold">
              Join Our Newsletter
            </h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Occasional notes on portfolio thinking, market analysis, and wealth
              stories.
            </p>
          </div>
          <div>
            <NewsletterSignup variant="minimal" dark />
          </div>
        </div>
      </div>

      {/* Disclaimer section — brand teal */}
      <div className="bg-teal-600">
        <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start">
          <span className="text-xs text-cream-100/60 whitespace-nowrap">
            © {new Date().getFullYear()} Lakespring Investments
          </span>
          <p className="text-xs text-cream-100/60 leading-relaxed">
            <span className="font-semibold text-cream-100/80">Disclaimer.</span>{" "}
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
    </footer>
  );
}
