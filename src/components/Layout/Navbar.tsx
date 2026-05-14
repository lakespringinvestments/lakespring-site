import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-cream-200 bg-cream-50/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <svg
            viewBox="0 0 32 32"
            className="w-8 h-8 text-teal-600"
            aria-hidden="true"
          >
            <path
              d="M16 3 L8 14 L11 14 L6 22 L10 22 L4 30 L28 30 L22 22 L26 22 L21 14 L24 14 Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-serif text-xl tracking-tight text-teal-600 group-hover:text-sage-700 transition-colors">
            Lakespring Investments
          </span>
        </Link>
        <nav className="flex items-center gap-7 text-sm">
          <Link href="/" className="text-ink-700 hover:text-teal-600 transition-colors">
            Portfolio Dashboard
          </Link>
          <Link href="/articles" className="text-ink-700 hover:text-teal-600 transition-colors">
            Articles &amp; Reports
          </Link>
          <Link href="/thesis" className="text-ink-700 hover:text-teal-600 transition-colors">
            Thesis
          </Link>
          <Link
            href="/trades"
            className="text-ink-700 hover:text-teal-600 transition-colors"
          >
            Trade Records
          </Link>
          <Link href="/about" className="text-ink-700 hover:text-teal-600 transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
