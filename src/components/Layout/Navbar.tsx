import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="border-b border-cream-200 bg-cream-50/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Lakespring Investments"
            width={36}
            height={36}
            className="rounded-md"
            priority
          />
          <span className="font-sans text-lg font-semibold tracking-tight text-teal-600 group-hover:text-sage-700 transition-colors">
            Lakespring Investments
          </span>
        </Link>
        <nav className="font-sans flex items-center gap-7 text-sm">
          <Link href="/" className="text-ink-700 hover:text-teal-600 transition-colors">
            Portfolio Dashboard
          </Link>
          <Link href="/articles" className="text-ink-700 hover:text-teal-600 transition-colors">
            Articles &amp; Reports
          </Link>
          <Link href="/thesis" className="text-ink-700 hover:text-teal-600 transition-colors">
            Thesis
          </Link>
          <Link href="/trades" className="text-ink-700 hover:text-teal-600 transition-colors">
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
