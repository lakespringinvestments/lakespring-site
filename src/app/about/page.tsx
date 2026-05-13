export const metadata = {
  title: "About — Lakespring Investments",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-sage-500 mb-3">
        About
      </p>
      <h1 className="font-serif text-4xl md:text-5xl text-teal-600 tracking-tight mb-10">
        First-principles investing, one position at a time.
      </h1>

      <div className="prose-lakespring">
        <p>
          Lakespring is a personal investment journal. It exists because I
          wanted a single place to think clearly about a small number of
          conviction bets — to see them, write about them, and watch the thesis
          play out in public.
        </p>

        <p>
          The approach is simple. Concentrate in companies and assets that are
          building something genuinely transformative — AI, energy, digital
          assets. Hold them long enough for the thesis to mature. Collect
          premium along the way to compound patience.
        </p>

        <p>
          This site is not financial advice. It&apos;s a record of how one investor
          is putting capital to work, and the reasoning behind each decision.
          If you find it useful, sign up for the journal below.
        </p>

        <h2>What you&apos;ll find here</h2>
        <ul>
          <li>A live dashboard of the portfolio</li>
          <li>Articles on positioning, thesis, and reasoning</li>
          <li>An honest record of mistakes and lessons</li>
        </ul>

        <p className="italic text-ink-500 mt-12">
          &ldquo;We&apos;re not diversifying for the sake of it. We&apos;re betting on the
          future.&rdquo;
        </p>
      </div>
    </div>
  );
}
