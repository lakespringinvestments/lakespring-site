"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Portfolio Dashboard" },
  { href: "/thesis", label: "Strategy & Philosophy" },
  { href: "/articles", label: "News & Perspectives" },
  { href: "/trades", label: "Trade Ledger" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the overlay is open, and close on Escape.
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
      {/* Top bar — logo left, hamburger right, at ALL screen sizes */}
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
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md text-cream-100 hover:text-sage-200 transition-colors -mr-2 relative z-[60]"
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="7" x2="21" y2="7"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="17" x2="21" y2="17"></line>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Deep teal backdrop */}
        <div className="absolute inset-0 bg-teal-800" />

        {/* Soft ambient glows echoing the site wash */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-160px",
            right: "-120px",
            width: "640px",
            height: "640px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,158,117,0.22) 0%, rgba(29,158,117,0) 70%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-160px",
            left: "-120px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(93,202,165,0.14) 0%, rgba(93,202,165,0) 70%)",
          }}
        />

        {/* Explicit close (X) button, top-right — clear way out */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-4 right-6 z-[60] inline-flex items-center justify-center w-11 h-11 rounded-md text-cream-100 hover:text-sage-300 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Menu content — sits in the upper portion of the screen */}
        <nav className="relative h-full max-w-6xl mx-auto px-6 pt-28 md:pt-32">
          <p className="text-xs uppercase tracking-[0.3em] text-sage-300 mb-8">
            Menu
          </p>
          <ul className="flex flex-col gap-1.5 md:gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-3xl md:text-5xl font-medium tracking-tight leading-[1.15] text-cream-50 hover:text-sage-300 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Lakespring Investments"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-sans text-base font-semibold tracking-tight text-cream-50">
              Lakespring Investments
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
