"use client";

import { usePathname } from "next/navigation";

const STRIPE_URL = "https://buy.stripe.com/test_9B66oH1nF9Zpe5Wewxfw400";

/** Pages where the footer membership section should be hidden */
const HIDDEN_ON = new Set(["/trades"]);

export default function FooterNewsletter() {
  const pathname = usePathname();
  if (HIDDEN_ON.has(pathname)) return null;

  return (
    <div className="bg-teal-600">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-14 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          <h3 className="text-2xl text-white mb-3 tracking-tight font-semibold">
            Become a Member
          </h3>
          <p className="text-cream-100/70 text-sm leading-relaxed max-w-md">
            Live trade alerts, weekly analysis, and the full report archive —
            start with a free 30-day trial.
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
    </div>
  );
}
