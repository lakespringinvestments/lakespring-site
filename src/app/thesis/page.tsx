export const metadata = {
  title: "Thesis & Strategy — Lakespring Investments",
  description:
    "Concentrated ownership in the moats redefining the next decade. The First Principles Portfolio.",
};

type Moat = {
  ticker: string;
  letter: string;
  color: string;
  title: string;
  body: string;
  moat: string;
};

const moats: Moat[] = [
  {
    ticker: "BITCOIN",
    letter: "₿",
    color: "#EF9F27",
    title: "Digital Scarcity",
    body: "The only credibly neutral monetary asset emerging in a world where every fiat currency is being diluted by political pressure.",
    moat: "Network, energy, and a decade of survival",
  },
  {
    ticker: "TESLA",
    letter: "T",
    color: "#E24B4A",
    title: "Energy & Autonomy",
    body: "Not a car company. Vertical integration across compute, manufacturing, energy storage, and the real-world AI training data no competitor can replicate from scratch.",
    moat: "Vertical integration nobody can rebuild",
  },
  {
    ticker: "NVIDIA",
    letter: "N",
    color: "#5DCAA5",
    title: "AI Infrastructure",
    body: "Picks-and-shovels infrastructure of the AI buildout. Execution cadence and a software ecosystem competitors have been failing to close for a decade.",
    moat: "Velocity, scale, and CUDA lock-in",
  },
  {
    ticker: "PALANTIR",
    letter: "P",
    color: "#6B9FE3",
    title: "AI Operating Layer",
    body: "The deployment fabric for how governments and large enterprises will actually run AI against their own data — entrenched workflows competitors can't dislodge.",
    moat: "Switching costs measured in years",
  },
];

export default function ThesisPage() {
  return (
    <div className="bg-teal-800 -mt-px">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <header className="mb-16 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-300 mb-5">
            The First Principles Portfolio
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-8 font-semibold">
            Concentrated ownership in the moats <span className="text-sage-300">redefining</span> the next decade.
          </h1>
          <p className="text-cream-100 text-lg leading-relaxed max-w-2xl">
            Lakespring Investments holds positions in the businesses and
            assets that aren&apos;t competing within an industry — they&apos;re
            rewriting what the industry is.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {moats.map((m) => (
            <article
              key={m.ticker}
              className="bg-teal-700/40 rounded-2xl p-7 md:p-8 border-l-4 flex flex-col"
              style={{ borderLeftColor: m.color }}
            >
              <header className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base text-white"
                  style={{ background: m.color }}
                >
                  {m.letter}
                </div>
                <p
                  className="text-xs font-semibold tracking-[0.2em]"
                  style={{ color: m.color }}
                >
                  {m.ticker}
                </p>
              </header>

              <h2 className="text-2xl md:text-3xl text-white tracking-tight mb-4 font-semibold">
                {m.title}
              </h2>

              <p className="text-cream-100 leading-relaxed text-base flex-1">
                {m.body}
              </p>

              <div className="mt-7 pt-5 border-t border-teal-600 flex items-baseline gap-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-sage-300">
                  Moat
                </p>
                <p className="text-sm text-white">{m.moat}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-14 text-cream-100 max-w-3xl leading-relaxed">
          <strong className="text-white font-semibold">
            Concentration is the point, not the risk.
          </strong>{" "}
          <em className="text-sage-200">
            An options income overlay sits on top — the thesis compounds in
            the background, the premium pays me to wait.
          </em>
        </p>
      </div>
    </div>
  );
}
