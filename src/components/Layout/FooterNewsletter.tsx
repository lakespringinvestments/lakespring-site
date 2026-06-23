"use client";

import { usePathname } from "next/navigation";
import NewsletterSignup from "@/components/NewsletterSignup";

/** Pages where the footer newsletter section should be hidden */
const HIDDEN_ON = new Set(["/trades"]);

export default function FooterNewsletter() {
  const pathname = usePathname();
  if (HIDDEN_ON.has(pathname)) return null;

  return (
    <div className="bg-teal-600">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-14 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          <h3 className="text-2xl text-white mb-3 tracking-tight font-semibold">
            Join Our Newsletter
          </h3>
          <p className="text-cream-100/70 text-sm leading-relaxed max-w-md">
            Occasional notes on portfolio thinking, market analysis, and wealth
            stories.
          </p>
        </div>
        <div>
          <NewsletterSignup variant="minimal" dark />
        </div>
      </div>
    </div>
  );
}
