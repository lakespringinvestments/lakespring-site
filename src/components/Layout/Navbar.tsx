import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="bg-teal-600 border-b border-teal-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
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
        <nav className="font-sans flex items-center gap-7 text-sm">
          <Link href="/" className="text-cream-100 hover:text-sage-200 transition-colors">
            Portfolio Dashboard
          </Link>
          <Link href="/articles" className="text-cream-100 hover:text-sage-200 transition-colors">
            Insights
          </Link>
          <Link href="/thesis" className="text-cream-100 hover:text-sage-200 transition-colors">
            Thesis &amp; Strategy
          </Link>
          <Link href="/trades" className="text-cream-100 hover:text-sage-200 transition-colors">
            Trade Ledger
          </Link>
          <Link href="/about" className="text-cream-100 hover:text-sage-200 transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
