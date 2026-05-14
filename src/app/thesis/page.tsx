import Image from "next/image";

export const metadata = {
  title: "Thesis & Strategy — Lakespring Investments",
  description:
    "Concentrated ownership in the moats redefining the next decade. The First Principles Portfolio.",
};

type Moat = {
  ticker: string;
  logo: string;
  color: string;
  title: string;
  body: string;
  moat: string;
};

const moats: Moat[] = [
  {
    ticker: "BITCOIN",
    logo: "/logos/bitcoin.svg",
    color: "#F7931A",
    title: "Digital Scarcity",
    body: "The only credibly neutral monetary asset emerging in a world where every fiat currency is being diluted by political pressure.",
    moat: "Network, energy, and a decade of survival",
  },
  {
    ticker: "TESLA",
    logo: "/logos/tesla.png",
    color: "#CC0000",
    title: "Energy & Autonomy",
    body: "Not a car company. Vertical integration across compute, manufacturing, energy storage, and the real-world AI training data no competitor can replicate from scratch.",
    moat: "Vertical integration nobody can rebuild",
  },
  {
    ticker: "NVIDIA",
    logo: "/logos/nvidia.png",
    color: "#76B900",
    title: "AI Infrastructure",
    body: "Picks-and-shovels infrastructure of the AI buildout. Execution cadence and a software ecosystem competitors have been failing to close for a decade.",
    moat: "Velocity, scale, and CUDA lock-in",
  },
  {
    ticker: "PALANTIR",
    logo: "/logos/palantir.png",
    color: "#101113",
    title: "AI Operating Layer",
    body: "The deployment fabric for how governments and large enterprises will actually run AI against their own data — entrenched workflows competitors can't dislodge.",
    moat: "Switching costs measured in years",
  },
];

export default function ThesisPage() {
  return (
    <>
      {/* Dark hero */}
      <section className="bg-teal-800 -mt-px">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-4xl">
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
          </div>
        </div>
      </section>

      {/* Cream body with moat cards */}
      <section className="bg-cream-50">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {moats.map((m) => (
              <article
                key={m.ticker}
                className="bg-white rounded-2xl p-7 md:p-8 border border-cream-200 border-l-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftColor: m.color }}
              >
                <header className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={m.logo}
                      alt={`${m.ticker} logo`}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p
                    className="text-xs font-semibold tracking-[0.2em]"
                    style={{ color: m.color }}
                  >
                    {m.ticker}
                  </p>
                </header>

                <h2 className="text-2xl md:text-3xl text-teal-600 tracking-tight mb-4 font-semibold">
                  {m.title}
                </h2>

                <p className="text-ink-700 leading-relaxed text-base flex-1">
                  {m.body}
                </p>

                <div className="mt-7 pt-5 border-t border-cream-200 flex items-baseline gap-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ink-400">
                    Moat
                  </p>
                  <p className="text-sm text-teal-600 font-medium">{m.moat}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-14 text-ink-700 max-w-3xl leading-relaxed">
            <strong className="text-teal-600 font-semibold">
              Concentration is the point, not the risk.
            </strong>{" "}
            <em className="text-ink-500">
              An options income overlay sits on top — the thesis compounds in
              the background, the premium pays me to wait.
            </em>
          </p>
        </div>
      </section>
    </>
  );
}
