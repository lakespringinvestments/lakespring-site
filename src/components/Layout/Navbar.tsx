"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Portfolio Dashboard" },
  { href: "/thesis", label: "Strategy & Philosophy" },
  { href: "/stories", label: "Stories & Perspectives" },
  { href: "/trades", label: "Trade Ledger" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Top bar */}
      <header className="bg-teal-600 border-b border-teal-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group relative z-[60]"
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

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md text-cream-100 hover:text-sage-200 transition-colors -mr-2 relative z-[60]"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </header>

      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[280px] z-[60] flex flex-col bg-[#022e31] transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="h-[69px] flex items-center justify-end px-5 border-b border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex items-center gap-2 text-cream-100/60 hover:text-cream-100 transition-colors"
          >
            <span className="text-xs tracking-widest uppercase">close</span>
            <span className="w-6 h-6 border border-white/25 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          </button>
        </div>

        <nav className="flex-1 px-0 pt-8 overflow-y-auto">
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/30 px-7 mb-5">
            Menu
          </p>
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block font-serif text-xl font-normal tracking-tight leading-snug text-cream-50/90 hover:text-sage-300 hover:bg-white/[0.03] transition-colors px-7 py-3 border-l-2 border-transparent hover:border-sage-500/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-7 py-5 border-t border-white/10 flex items-center gap-3 flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Lakespring Investments"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-xs font-medium text-white/50">
            Lakespring Investments
          </span>
        </div>
      </aside>
    </>
  );
}
