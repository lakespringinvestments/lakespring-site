"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Portfolio Dashboard" },
  { href: "/articles", label: "Insights" },
  { href: "/thesis", label: "Thesis & Strategy" },
  { href: "/trades", label: "Trade Ledger" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-teal-600 border-b border-teal-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Lakespring Investments"
            width={36}
            height={36}
            className="rounded-md -mt-1"
            priority
          />
          <span className="font-sans text-lg font-semibold tracking-tight text-white group-hover:text-sage-200 transition-colors leading-none mt-0.5">
            Lakespring Investments
          </span>
        </Link>

        {/* Desktop nav — visible at md+ */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-sans">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream-100 hover:text-sage-200 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button — hidden at md+ */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-cream-100 hover:text-sage-200 transition-colors -mr-2"
        >
          {open ? (
            // X icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            // Hamburger icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown — only shows when open && mobile */}
      {open && (
        <nav className="md:hidden border-t border-teal-700 bg-teal-600">
          <ul className="max-w-6xl mx-auto px-6 py-3 flex flex-col font-sans">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-cream-100 hover:text-sage-200 transition-colors text-base border-b border-teal-700 last:border-b-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
