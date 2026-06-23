import NewsletterSignup from "@/components/NewsletterSignup";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-cream-50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Image
              src="/logo.png"
              alt="Lakespring Investments"
              width={44}
              height={44}
              className="rounded-md -mt-1"
            />
            <span className="font-sans text-lg font-semibold tracking-tight text-white leading-none mt-0.5">
              Lakespring Investments
            </span>
          </div>
          <h3 className="text-2xl text-white mb-3 tracking-tight font-semibold">
            Join our Newsletter
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

      <div className="border-t border-white/10">
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
