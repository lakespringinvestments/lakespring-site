export const metadata = {
  title: "About — Lakespring Investments",
  description:
    "Lakespring Investments is an independent investment research platform built on a first principles approach to portfolio construction.",
};

const sections = [
  {
    number: "01",
    label: "Why this exists",
    body: (
      <>
        <p>
          My family came to Canada with nothing. They worked hard for decades
          and still stayed on the wrong side of the wealth divide — not
          because they lacked intelligence or discipline, but because no one
          ever taught them how modern wealth is actually built.
        </p>
        <p className="italic text-sage-700 my-6">
          They knew how to save. They didn&apos;t know how to own.
        </p>
        <p>
          The economy has split into two tracks — the K-shaped economy — and
          the gap between them is no longer about effort. It&apos;s about asset
          ownership. I&apos;m building Lakespring Investments as the public record
          of how I&apos;m getting my family on the right side of that divide.
        </p>
      </>
    ),
  },
  {
    number: "02",
    label: "The First Principles Portfolio",
    body: (
      <>
        <p>
          A concentrated set of positions built around businesses and assets
          that aren&apos;t competing within an industry, but redefining what the
          industry is. The thesis pages walk through each conviction in
          detail; the dashboard shows how those convictions are performing in
          real numbers.
        </p>
        <p className="italic text-sage-700 mt-6">
          Concentration is the point, not the risk. On top of the core
          holdings, I run a disciplined options income overlay — the thesis
          compounds in the background, the premium pays me to wait.
        </p>
      </>
    ),
  },
  {
    number: "03",
    label: "What you'll find here",
    body: (
      <div className="space-y-4">
        <div className="border-l-2 border-sage-500 pl-5 py-2">
          <p className="text-teal-600 font-semibold mb-1">A live view of the portfolio</p>
          <p className="text-ink-500 text-base">
            Current holdings, sizing, and how the allocation is shifting over time.
          </p>
        </div>
        <div className="border-l-2 border-sage-500 pl-5 py-2">
          <p className="text-teal-600 font-semibold mb-1">Outlook and opinion on each holding</p>
          <p className="text-ink-500 text-base">
            Written for someone who wants the structural argument, not the price target.
          </p>
        </div>
        <div className="border-l-2 border-sage-500 pl-5 py-2">
          <p className="text-teal-600 font-semibold mb-1">Insights around the framework</p>
          <p className="text-ink-500 text-base">
            Deep dives on the First Principles holdings, plus Canadian personal
            finance and wealth-preservation work.
          </p>
        </div>
      </div>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream-50">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero */}
        <header className="mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-500 mb-5">
            About
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-teal-600 tracking-tight leading-[1.1] mb-8 font-semibold max-w-4xl">
            Built on conviction in the transformations rewriting the global economy.
          </h1>
          <p className="text-ink-500 text-lg leading-relaxed max-w-3xl">
            Lakespring Investments is an independent investment research
            platform built on a first principles approach to portfolio
            construction. We hold concentrated positions in the transformative
            technologies reshaping the global economy — artificial intelligence,
            energy, and digital assets — and systematically write options
            premium against those holdings. The portfolio reflects how I
            actively manage my own family&apos;s capital, published in the open.
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-16 md:space-y-20">
          {sections.map((section) => (
            <section
              key={section.number}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12 pt-12 border-t border-cream-200"
            >
              <div>
                <p className="text-xs text-sage-500 mb-2 tracking-[0.2em] uppercase">{section.number}</p>
                <p className="text-sm text-teal-600 font-medium">{section.label}</p>
              </div>
              <div className="text-ink-700 text-base md:text-lg leading-relaxed">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
