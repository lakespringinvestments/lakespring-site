import EmailSignup from "@/components/EmailSignup";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-teal-600 text-cream-50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
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
            Join the journal
          </h3>
          <p className="text-cream-100/80 text-sm leading-relaxed max-w-md">
            Occasional notes on portfolio thinking, conviction, and the slow
            compounding of asymmetric bets. No noise.
          </p>
        </div>
        <div>
          <EmailSignup />
        </div>
      </div>

      <div className="border-t border-teal-700">
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
