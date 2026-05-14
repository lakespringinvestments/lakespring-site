import Image from "next/image";

export const metadata = {
  title: "Thesis & Strategy — Lakespring Investments",
  description:
    "Concentrated conviction. Continuous income. The framework behind every position.",
};

type Moat = {
  ticker: string;
  logo: string;
  secondaryLogo?: string;
  color: string;
  title: string;
  body: string;
  moat: string;
};

const moats: Moat[] = [
  {
    ticker: "BITCOIN",
    logo: "/logos/bitcoin.png",
    color: "#F7931A",
    title: "Digital Scarcity",
    body: "The only credibly neutral monetary asset emerging in a world where every fiat currency is being diluted by political pressure. We believe Bitcoin is the defining asset of the digital era — digital gold that will eventually sit in every serious portfolio as a structural hedge against fiat debasement and equity-correlated risk.",
    moat: "Network, energy, and a decade of survival",
  },
  {
    ticker: "TESLA · SPACEX",
    logo: "/logos/tesla.png",
    secondaryLogo: "/logos/spacex.png",
    color: "#CC0000",
    title: "The Musk Industrial Complex",
    body: "Tesla and SpaceX represent the public-market and private-market sides of one unified thesis — vertical integration across compute, manufacturing, energy storage, autonomy, and orbital infrastructure. The real-world data and engineering velocity no competitor can replicate from scratch.",
    moat: "Vertical integration across earth and orbit",
  },
  {
    ticker: "NVIDIA",
    logo: "/logos/nvidia.png",
    color: "#76B900",
    title: "AI Infrastructure",
    body: "Picks-and-shovels infrastructure of the AI buildout. Execution cadence and a software ecosystem competitors have been failing to close for a decade. Their multi-billion-dollar investments across the ecosystem — model labs, robotics, sovereign AI, cloud providers — further entrench Nvidia as the gravitational center of the entire transformation.",
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

function PremiumWheel() {
  const cx = 240;
  const cy = 240;
  const r = 130;
  const strokeWidth = 36;
  const circumference = 2 * Math.PI * r;
  const segmentLength = circumference / 4;

  return (
    <svg
      viewBox="0 0 480 480"
      className="w-full h-auto"
      role="img"
      aria-label="Premium Collection Wheel showing four states: Sell Put, Called Away, Sell Call, Acquire Shares"
    >
      {/* Wheel segments — start from top, go clockwise:
          Top-right quarter: Sell Put (gold) ends at Called Away
          Bottom-right quarter: Called Away (dark gold)
          Bottom-left quarter: Sell Call (sage)
          Top-left quarter: Acquire Shares (sage lighter)
      */}

      {/* Sell Put: top quarter, gold */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#EF9F27" strokeWidth={strokeWidth}
        strokeDasharray={`${segmentLength - 6} ${circumference - segmentLength + 6}`}
        strokeDashoffset={-circumference / 8 + 3}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Called Away: right quarter, dark gold */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#C97F1F" strokeWidth={strokeWidth}
        strokeDasharray={`${segmentLength - 6} ${circumference - segmentLength + 6}`}
        strokeDashoffset={-circumference / 8 + 3 - segmentLength}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Sell Call: bottom quarter, sage */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#1D9E75" strokeWidth={strokeWidth}
        strokeDasharray={`${segmentLength - 6} ${circumference - segmentLength + 6}`}
        strokeDashoffset={-circumference / 8 + 3 - 2 * segmentLength}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Acquire Shares: left quarter, sage lighter */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#5DCAA5" strokeWidth={strokeWidth}
        strokeDasharray={`${segmentLength - 6} ${circumference - segmentLength + 6}`}
        strokeDashoffset={-circumference / 8 + 3 - 3 * segmentLength}
        transform={`rotate(-90 ${cx} ${cy})`}
      />

      {/* Center disc */}
      <circle cx={cx} cy={cy} r={r - strokeWidth / 2 - 6} fill="#FAF8F3" stroke="#E8E1CF" strokeWidth="1"/>

      <text x={cx} y={cy - 24} textAnchor="middle" fontSize="10" fill="#EF9F27" letterSpacing="2" fontWeight="600">
        PREMIUM COLLECTED
      </text>
      <line x1={cx - 50} y1={cy - 14} x2={cx + 50} y2={cy - 14} stroke="#EF9F27" strokeWidth="0.5" opacity="0.5"/>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="20" fill="#034147" fontWeight="600">
        on every leg
      </text>
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="11" fill="#5A6670">
        whichever path
      </text>
      <text x={cx} y={cy + 42} textAnchor="middle" fontSize="11" fill="#5A6670">
        the cycle takes
      </text>

      {/* Top — Sell Put */}
      <text x={cx} y={36} textAnchor="middle" fontSize="9" fill="#EF9F27" letterSpacing="2" fontWeight="600">
        PRIMARY
      </text>
      <text x={cx} y={56} textAnchor="middle" fontSize="14" fill="#034147" fontWeight="600">
        Sell Put
      </text>

      {/* Right — Called Away — RIGHT-ALIGNED, pushed further right */}
      <text x={475} y={234} textAnchor="end" fontSize="9" fill="#C97F1F" letterSpacing="2" fontWeight="600">
        EXIT
      </text>
      <text x={475} y={252} textAnchor="end" fontSize="14" fill="#034147" fontWeight="600">
        Called Away
      </text>

      {/* Bottom — Sell Call */}
      <text x={cx} y={cy + r + strokeWidth + 12} textAnchor="middle" fontSize="9" fill="#1D9E75" letterSpacing="2" fontWeight="600">
        ASSIGNED
      </text>
      <text x={cx} y={cy + r + strokeWidth + 32} textAnchor="middle" fontSize="14" fill="#034147" fontWeight="600">
        Sell Call
      </text>

      {/* Left — Acquire Shares — RIGHT-ALIGNED to its anchor, pushed further left */}
      <text x={5} y={234} textAnchor="start" fontSize="9" fill="#1D9E75" letterSpacing="2" fontWeight="600">
        ASSIGNED
      </text>
      <text x={5} y={252} textAnchor="start" fontSize="14" fill="#034147" fontWeight="600">
        Acquire Shares
      </text>
    </svg>
  );
}

export default function ThesisPage() {
  return (
    <>
      {/* Dark hero */}
      <section className="bg-teal-800 -mt-px">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.25em] text-sage-300 mb-5">
              Thesis &amp; Strategy
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-8 font-semibold">
              Concentrated conviction. <span className="text-sage-300">Continuous income.</span>
            </h1>
            <p className="text-cream-100 text-lg leading-relaxed max-w-3xl">
              Lakespring Investments holds a small basket of high-conviction
              positions in the businesses defining the next decade — and runs
              a disciplined options income overlay on top to generate cash
              flow while those theses compound.
            </p>
          </div>
        </div>
      </section>

      {/* Section 01 — prose */}
      <section className="bg-cream-50">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-500 mb-3">
            01 — The first principles approach
          </p>
          <h2 className="text-3xl md:text-4xl text-teal-600 tracking-tight leading-tight mb-8 font-semibold">
            Start with the transformation. Then ask who owns the moat.
          </h2>

          <div className="space-y-6 text-ink-700 text-lg leading-relaxed">
            <p>
              Most portfolio construction starts with the market and works
              inward — pick a benchmark, choose a tracking error budget, slot
              positions into sectors. The result is a portfolio shaped by the
              index it&apos;s trying to outperform.
            </p>
            <p>
              Lakespring Investments starts somewhere else. The question
              isn&apos;t which stocks will beat the S&amp;P 500 over the next year.
              It&apos;s:
            </p>
            <blockquote className="border-l-4 border-sage-500 pl-6 my-8 text-xl md:text-2xl text-teal-600 font-medium leading-snug">
              What structural transformations are actually underway in the
              global economy, and which businesses own the moats that will
              define the outcome?
            </blockquote>
            <p>
              That reframing changes what gets held. The First Principles
              Portfolio is a concentrated basket built around businesses and
              assets that aren&apos;t competing within an industry, but redefining
              what the industry is.
            </p>
            <p>
              These are not value plays. They&apos;re not yield plays. They&apos;re
              ownership stakes in the transformations themselves.
            </p>
            <p>
              Among the current convictions: digital scarcity, the physical
              and orbital AI economy, the compute engine the AI era runs on,
              and the operating layer for enterprise AI adoption. Four
              positions, each with structural moats — network effects,
              vertical integration, execution velocity, organizational
              lock-in — that reinforce as the underlying transformations
              accelerate.
            </p>
          </div>
        </div>

        {/* Moat cards */}
        <div className="max-w-5xl mx-auto px-6 pb-20 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {moats.map((m) => (
              <article
                key={m.ticker}
                className="bg-white rounded-2xl p-7 md:p-8 border border-cream-200 border-l-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftColor: m.color }}
              >
                <header className="flex items-center gap-3 mb-6 flex-wrap">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={m.logo}
                      alt={`${m.ticker} logo`}
                      width={88}
                      height={88}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {m.secondaryLogo && (
                    <div className="bg-white rounded-md px-2 py-1 flex items-center">
                      <Image
                        src={m.secondaryLogo}
                        alt="SpaceX logo"
                        width={120}
                        height={38}
                        className="h-6 w-auto"
                      />
                    </div>
                  )}
                  <p
                    className="text-xs font-semibold tracking-[0.2em] ml-auto"
                    style={{ color: m.color }}
                  >
                    {m.ticker}
                  </p>
                </header>

                <h3 className="text-2xl md:text-3xl text-teal-600 tracking-tight mb-4 font-semibold">
                  {m.title}
                </h3>

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

          <p className="mt-12 text-ink-700 text-lg leading-relaxed">
            <strong className="text-teal-600 font-semibold">
              Concentration is the point, not the risk.
            </strong>{" "}
            Diversification across thirty positions is protection against not
            knowing the thesis. When you know the thesis, you size into it.
          </p>
          <p className="mt-4 text-ink-500 leading-relaxed italic">
            But concentration creates its own operational challenge — one the
            rest of this page is built to address.
          </p>
        </div>
      </section>

      {/* Section 02 — prose + wheel */}
      <section className="bg-cream-100 border-t border-cream-200">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-500 mb-3">
            02 — The wheel, and what it runs on
          </p>
          <h2 className="text-3xl md:text-4xl text-teal-600 tracking-tight leading-tight mb-8 font-semibold">
            Premium lands on every leg of the cycle.
          </h2>

          <div className="space-y-6 text-ink-700 text-lg leading-relaxed">
            <p>
              A concentrated long-term portfolio has one operational
              weakness: the thesis takes time, and capital sits idle while it
              plays out. The premium wheel solves for that.
            </p>
            <p>
              On positions we already want to own, we sell puts at strike
              prices we&apos;re willing to buy at — collecting premium for the
              obligation. Most of the time, those puts expire worthless and
              we simply collect the premium and write another one.{" "}
              <strong className="text-teal-600 font-semibold">
                That&apos;s the default behavior
              </strong>{" "}
              — premium collection without ever touching the underlying.
            </p>
            <p>
              The full wheel is the safety net beneath that loop. If a put
              gets assigned, we acquire shares at the price we&apos;d already
              targeted — and from there we sell covered calls at strike
              prices we&apos;d be comfortable exiting at, collecting more premium
              until called away. Cash returns to step one. The cycle
              restarts.
            </p>
            <p>
              The reason this structure works on these specific names is that
              every leg of the cycle aligns with a decision we&apos;d already
              make on conviction alone. We&apos;re willing to buy more at lower
              prices. We&apos;re willing to trim into strength. The options
              market simply pays us to formalize those commitments in
              advance.
            </p>
            <p>
              <strong className="text-teal-600 font-semibold">
                This strategy is unusually well-suited to our basket.
              </strong>{" "}
              The transformative tech names we hold carry structurally higher
              volatility than the broader market — exactly because the alpha
              they generate is asymmetric. Higher implied volatility means
              fatter premiums on every option we sell, and our willingness
              to commit to specific entry and exit prices on businesses we
              already understand at depth turns that volatility into a
              persistent income stream rather than a risk to be hedged.
            </p>
            <p>
              The candidate pool extends beyond the core four. When premiums
              on the First Principles holdings are compressed — typically
              during low-volatility stretches when the thesis is uncontested
              — we widen the wheel to a select group of secondary names that
              directly benefit from the same transformations. These are
              companies we&apos;re independently comfortable holding and swing
              trading, kept on a deliberately short list. They&apos;re not
              satellite positions or trade ideas; they&apos;re thesis-aligned
              vehicles for premium collection when the core names aren&apos;t
              paying enough to commit capital.
            </p>
            <p className="italic text-ink-500">
              The premium isn&apos;t speculative income. It&apos;s compensation for
              committing to price levels we&apos;d act on anyway — on a small
              basket of businesses we already understand at depth.
            </p>
          </div>
        </div>

        {/* Wheel visual */}
        <div className="max-w-5xl mx-auto px-6 pb-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
            <div className="max-w-md mx-auto w-full">
              <PremiumWheel />
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-[#EF9F27] pl-5 py-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#EF9F27] mb-2 font-semibold">
                  Primary Path
                </p>
                <h4 className="text-xl text-teal-600 mb-2 font-semibold">
                  Premium collection without assignment
                </h4>
                <p className="text-ink-700 leading-relaxed">
                  Most of the time, puts expire worthless. We collect the
                  premium and write another. The wheel never needs to
                  complete.
                </p>
              </div>
              <div className="border-l-4 border-sage-500 pl-5 py-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-sage-700 mb-2 font-semibold">
                  Safety Net
                </p>
                <h4 className="text-xl text-teal-600 mb-2 font-semibold">
                  Full wheel activates if assigned
                </h4>
                <p className="text-ink-700 leading-relaxed">
                  If a put is assigned, we acquire shares at our target price
                  and sell covered calls against them — collecting premium
                  until called away.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-cream-200">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#EF9F27] mb-2 font-semibold">
                  The Point
                </p>
                <p className="text-ink-700 leading-relaxed">
                  Premium lands on{" "}
                  <strong className="text-teal-600 font-semibold">every leg</strong>.
                  Whichever direction the cycle flows, we&apos;re paid to wait.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03 — prose + Lakespring playbook closer */}
      <section className="bg-cream-50 border-t border-cream-200">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-500 mb-3">
            03 — Income while you wait
          </p>
          <h2 className="text-3xl md:text-4xl text-teal-600 tracking-tight leading-tight mb-8 font-semibold">
            The thesis compounds in the foreground. The premium lands in the background.
          </h2>

          <div className="space-y-6 text-ink-700 text-lg leading-relaxed">
            <p>
              Concentrated thesis investing carries a cost most investors
              underestimate:{" "}
              <strong className="text-teal-600 font-semibold">time</strong>. A
              position can take years to fully reprice as the underlying
              transformation moves from contrarian thesis to consensus. That
              waiting period is where most investors lose conviction — not
              because the thesis broke, but because nothing visible was
              happening.
            </p>
            <p>
              The premium wheel changes the experience of waiting. Income
              lands consistently in the background while the structural
              thesis compounds in the foreground. The thesis doesn&apos;t need
              to be right next quarter for the strategy to be working — and
              that detachment from short-term outcomes is what makes the
              long hold possible.
            </p>
          </div>

          <blockquote className="mt-12 pl-6 border-l-4 border-sage-500 text-2xl md:text-3xl text-teal-600 leading-snug font-medium">
            The goal is to be paid to wait for the thesis to be obvious to
            everyone else.
          </blockquote>

          <p className="mt-8 text-base text-ink-500 italic">
            This is the Lakespring playbook.
          </p>
        </div>
      </section>
    </>
  );
}
