import FooterNewsletter from "./FooterNewsletter";

export default function Footer() {
  return (
    <footer>
      <FooterNewsletter />

      {/* Disclaimer section — black (always visible) */}
      <div className="bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start">
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
    </footer>
  );
}
