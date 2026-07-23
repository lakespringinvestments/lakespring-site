"use client";

import { usePathname } from "next/navigation";

const SUBSTACK_URL = "https://substack.com/@lakespringinvestments";

/** Pages where the footer newsletter section should be hidden */
const HIDDEN_ON = new Set(["/trades"]);

export default function FooterNewsletter() {
  const pathname = usePathname();
  if (HIDDEN_ON.has(pathname)) return null;

  return (
    <div className="bg-teal-600">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-14 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          <h3 className="text-2xl text-white mb-3 tracking-tight font-semibold inline-flex items-center gap-2">
            Follow on Substack
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
              <path d="M21 5H3V7.2H21V5Z" />
              <path d="M3 9.6H21V19L12 14.2L3 19V9.6Z" />
            </svg>
          </h3>
          <p className="text-cream-100/70 text-sm leading-relaxed max-w-md">
            Get notified the moment a new article publishes — including pieces
            we only post there, not here.
          </p>
        </div>
        <div>
          <a
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-teal-600 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-cream-50 transition-colors"
          >
            Subscribe on Substack →
          </a>
        </div>
      </div>
    </div>
  );
}
