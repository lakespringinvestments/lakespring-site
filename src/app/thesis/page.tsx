import Image from "next/image";
import TypewriterQuote from "@/components/TypewriterQuote";
import QuestionCards from "@/components/QuestionCards";

export const metadata = {
  title: "About Us & Our Strategy — Lakespring Investments",
  description:
    "An independent investment research platform built on first principles. Concentrated positions in transformative technology, paired with a disciplined options-income overlay.",
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
    body: "Tesla and SpaceX represent the public-market and private-market sides of one unified thesis — vertical integration across compute, manufacturing, energy storage, autonomy, and orbital infrastructure. The real-world data flywheel and engineering velocity no competitor can replicate from scratch.",
    moat: "Vertical integration across earth and orbit",
  },
  {
    ticker: "NVIDIA",
    logo: "/logos/nvidia.png",
    color: "#76B900",
    title: "AI Infrastructure",
    body: "Picks-and-shovels infrastructure of the AI buildout. An execution cadence and a software ecosystem that competitors have spent a decade failing to close. Their multi-billion-dollar investments across model labs, robotics, sovereign AI, and cloud further entrench Nvidia as the gravitational centre of the entire transformation.",
    moat: "Velocity, scale, and CUDA lock-in",
  },
  {
    ticker: "PALANTIR",
    logo: "/logos/palantir.png",
    color: "#101113",
    title: "AI Operating Layer",
    body: "The deployment fabric for how governments and large enterprises will actually run AI against their own data — entrenched workflows that competitors struggle to dislodge. As AI moves from experimentation to institutional infrastructure, Palantir's position becomes more structural, not less.",
    moat: "Switching costs measured in years",
  },
];

function PremiumWheel() {
  const cx = 300;
  const cy = 240;
  const r = 130;
  const strokeWidth = 36;
  const circumference = 2 * Math.PI * r;
  const segmentLength = circumference / 4;
  const outerR = r + strokeWidth / 2;
  const buffer = 18;
  const acquireX = cx - outerR - buffer;
  const calledAwayX = cx + outerR + buffer + 100;

  return (
    <svg
      viewBox="0 0 600 480"
      className="w-full h-auto"
      role="img"
      aria-label="Premium Collection Wheel showing four states: Sell Put, Called Away, Sell Call, Acquire Shares"
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF9F27" strokeWidth={strokeWidth}
        strokeDasharray={`${segmentLength - 6} ${circumference - segmentLength + 6}`}
        strokeDashoffset={-circumference / 8 + 3} transform={`rotate(-90 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#C97F1F" strokeWidth={strokeWidth}
        strokeDasharray={`${segmentLength - 6} ${circumference - segmentLength + 6}`}
        strokeDashoffset={-circumference / 8 + 3 - segmentLength} transform={`rotate(-90 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1D9E75" strokeWidth={strokeWidth}
        strokeDasharray={`${segmentLength - 6} ${circumference - segmentLength + 6}`}
        strokeDashoffset={-circumference / 8 + 3 - 2 * segmentLength} transform={`rotate(-90 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#5DCAA5" strokeWidth={strokeWidth}
        strokeDasharray={`${segmentLength - 6} ${circumference - segmentLength + 6}`}
        strokeDashoffset={-circumference / 8 + 3 - 3 * segmentLength} transform={`rotate(-90 ${cx} ${cy})`}/>

      <circle cx={cx} cy={cy} r={r - strokeWidth / 2 - 6} fill="#FAF8F3" stroke="#E8E1CF" strokeWidth="1"/>

      <text x={cx} y={cy - 24} textAnchor="middle" fontSize="11" fill="#EF9F27" letterSpacing="2" fontWeight="600">PREMIUM COLLECTED</text>
      <line x1={cx - 56} y1={cy - 14} x2={cx + 56} y2={cy - 14} stroke="#EF9F27" strokeWidth="0.5" opacity="0.5"/>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="20" fill="#034147" fontWeight="600">on every leg</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="12" fill="#5A6670">whichever path</text>
      <text x={cx} y={cy + 44} textAnchor="middle" fontSize="12" fill="#5A6670">the cycle takes</text>

      <text x={cx} y={50} textAnchor="middle" fontSize="10" fill="#EF9F27" letterSpacing="2" fontWeight="600">PRIMARY</text>
      <text x={cx} y={72} textAnchor="middle" fontSize="15" fill="#034147" fontWeight="600">Sell Put</text>

      <text x={calledAwayX} y={234} textAnchor="end" fontSize="10" fill="#C97F1F" letterSpacing="2" fontWeight="600">EXIT</text>
      <text x={calledAwayX} y={256} textAnchor="end" fontSize="15" fill="#034147" fontWeight="600">Called Away</text>

      <text x={cx} y={cy + r + strokeWidth + 18} textAnchor="middle" fontSize="10" fill="#1D9E75" letterSpacing="2" fontWeight="600">ASSIGNED</text>
      <text x={cx} y={cy + r + strokeWidth + 40} textAnchor="middle" fontSize="15" fill="#034147" fontWeight="600">Sell Call</text>

      <text x={acquireX} y={234} textAnchor="end" fontSize="10" fill="#1D9E75" letterSpacing="2" fontWeight="600">ASSIGNED</text>
      <text x={acquireX} y={256} textAnchor="end" fontSize="15" fill="#034147" fontWeight="600">Acquire Shares</text>
    </svg>
  );
}

export default function ThesisPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-transparent">
        <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-12 md:pb-14">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#0a0a0a] leading-[1.05] tracking-tight font-medium mb-10 md:mb-14">
            <span className="block">About Us</span>
            <span className="block mt-1">
              <span
                className="inline"
                style={{
                  background: "linear-gradient(to top, rgba(29, 158, 117, 0.22) 45%, transparent 45%)",
                  padding: "0 10px 4px 2px",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                &amp; Our Strategy
              </span>
            </span>
          </h1>
        </div>

        {/* ── Opening — what Lakespring is ── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-7 text-ink-700 text-lg md:text-xl leading-relaxed">
            <p>
              Lakespring Investments is an independent investment research platform built on a
              first-principles approach to portfolio construction. We hold concentrated positions
              in the transformative technologies reshaping the global economy — artificial
              intelligence, energy, and the emerging layer of technologically-native hard money
              and future payment rails — and systematically write options premium against those
              holdings to generate consistent income while the long-term thesis compounds. The
              portfolio reflects how I actively manage my own family&apos;s capital, published in
              the open.
            </p>
          </div>

          {/* Thesis wallpaper — 16/9 banner matching article cover style */}
          <div className="mt-10 mb-2 w-full rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/article-images/thesis_wallpaper.png"
              alt="Lakespring investment themes — AI, autonomous vehicles, energy, compute, digital assets"
              className="w-full object-cover"
              style={{
                aspectRatio: "16/9",
                objectPosition: "center 15%",
              }}
            />
          </div>

          {/* ── Why This Exists ── */}
          <div className="mt-14 mb-6">
            <h2 className="font-sans text-2xl md:text-3xl font-semibold text-teal-600 leading-tight tracking-tight">
              Why this exists
            </h2>
          </div>

          <div className="space-y-7 text-ink-700 text-lg md:text-xl leading-relaxed">
            <p>
              My family came to Canada with nothing. They worked hard for decades — the kind of
              hard that defines an entire generation of immigrant households — and yet they stayed
              on the wrong side of the wealth divide. Not because they lacked intelligence. Not
              because they lacked discipline. But because no one ever taught them how modern
              wealth is actually built. In other words, they knew how to save but not how to own.
            </p>
          </div>

          <div className="space-y-7 text-ink-700 text-lg md:text-xl leading-relaxed mt-7">
            <p>
              That distinction sounds small until you live through what we&apos;re living through
              now. The economy has split into two tracks — what economists call the K-shaped
              economy — and the gap between them is no longer about effort. It&apos;s about asset
              ownership. One cohort compounds wealth through equity in transformative businesses,
              scarce digital assets, and concentrated bets on the future. The other cohort earns
              wages that fail to keep pace with the cost of the things those assets are buying.
            </p>
            <p>
              Same hours worked, different outcomes.
            </p>

          {/* K-shaped economy visual — 16/9 banner */}
          <div className="my-8 w-full rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/article-images/k_shaped_economy.png"
              alt="The K-Shaped Economy — post-2008 divergence showing asset owners vs wage workers"
              className="w-full object-cover"
              style={{ aspectRatio: "16/9", objectPosition: "center center" }}
            />
          </div>
            <p>
              I started Lakespring Investments because the financial philosophy my family held to —
              save, invest in real estate or GICs and index funds, retire at 65 — is calibrated
              for an economy that no longer exists. The next decade isn&apos;t going to reward the
              average. It&apos;s going to reward conviction in the companies and assets actively
              rewriting how the world works. I want my family on the right side of that divide,
              and I&apos;m building Lakespring Investments as the public record of how I&apos;m doing it.
            </p>
          </div>
        </div>

        {/* Transition */}
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-20 md:pb-24">
          <p className="text-ink-700 text-lg md:text-xl leading-relaxed">
            What follows is the framework that turns that conviction into a
            portfolio — and the income engine that runs on top of it.
          </p>
        </div>
      </section>

      {/* ── Section 01 — First Principles ── */}
      <section className="bg-transparent border-t border-cream-200/60">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <span className="inline-block bg-teal-600 text-white text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-md mb-5">
            01 — The first principles approach
          </span>
          <h2 className="text-3xl md:text-4xl text-teal-600 tracking-tight leading-tight mb-8 font-semibold">
            Start with the transformation. Then ask who owns the moat.
          </h2>

          <div className="space-y-6 text-ink-700 text-lg leading-relaxed">
            <p>
              Most portfolio construction starts with the market and works inward — pick a
              benchmark, choose a tracking error budget, slot positions into sectors. The result
              is a portfolio shaped by the index it&apos;s trying to outperform.
            </p>
            <p>
              Lakespring Investments starts somewhere else. The question isn&apos;t which stocks
              will beat the S&amp;P 500 over the next year. It&apos;s:
            </p>
          </div>

          {/* Blockquote — typewriter animation, outside space-y-6 so margins aren't collapsed */}
          <div className="my-12 md:my-16">
            <TypewriterQuote
              text="What structural transformations are actually underway in the global economy today, and where do I see the world in 5–10 years?"
              speed={25}
            />
          </div>

          <div className="space-y-6 text-ink-700 text-lg leading-relaxed">
            <p>
              That reframing changes what gets held. The First Principles Portfolio is a
              concentrated basket built around businesses and assets that aren&apos;t competing
              within an industry — they&apos;re redefining what the industry is.
            </p>
            <p>
              These are not value plays. They&apos;re not yield plays. They&apos;re ownership stakes
              in the transformations themselves.
            </p>
            <p>
              Some of our core convictions include Bitcoin, Tesla, Palantir, Nvidia, Alphabet,
              and Amazon. Each position earns its place against three questions:
            </p>
          </div>

          <QuestionCards />

          <div className="space-y-6 text-ink-700 text-lg leading-relaxed mt-8">
            <p>
              The high-capex, high-volatility nature of this environment is a feature, not a bug.
              Choppy markets and crowded narratives are precisely the conditions in which
              conviction-based, long-horizon positions generate alpha. The positions that feel
              uncomfortable to hold during the buildout years are usually the ones that matter
              most when the buildout is complete.
            </p>
          </div>

          {/* Moat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14">
            {moats.map((m) => (
              <article
                key={m.ticker}
                className="bg-white rounded-2xl p-7 md:p-8 border border-cream-200 border-l-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftColor: m.color }}
              >
                <header className="flex items-center gap-3 mb-6 flex-wrap">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={m.logo}
                      alt={`${m.ticker} logo`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {m.secondaryLogo && (
                    <Image
                      src={m.secondaryLogo}
                      alt="SpaceX logo"
                      width={120}
                      height={50}
                      className="h-7 w-auto"
                    />
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

                <p className="text-ink-700 leading-relaxed text-base flex-1">{m.body}</p>

                <div className="mt-7 pt-5 border-t border-cream-200 flex items-baseline gap-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ink-400">Moat</p>
                  <p className="text-sm text-teal-600 font-medium">{m.moat}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12">
            <p className="text-ink-700 text-lg leading-relaxed">
              <strong className="text-teal-600 font-semibold">
                Concentration is the point, not the risk.
              </strong>{" "}
              Diversification across thirty positions is protection against not knowing the thesis.
              When you know the thesis, you size into it.
            </p>
            <p className="mt-4 text-ink-500 leading-relaxed italic">
              But concentration creates its own operational challenge — one that premium
              collection is built to address.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 02 — The Wheel ── */}
      <section className="bg-transparent border-t border-cream-200/60">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <span className="inline-block bg-[#BA7517] text-white text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-md mb-5">
            02 — The wheel, and what it runs on
          </span>
          <h2 className="text-3xl md:text-4xl text-teal-600 tracking-tight leading-tight mb-8 font-semibold">
            Premium lands on every leg of the cycle.
          </h2>

          <div className="space-y-6 text-ink-700 text-lg leading-relaxed">
            <p>
              A concentrated long-term portfolio has one operational weakness: the thesis takes
              time, and capital sits idle while it plays out. The premium wheel solves for that.
            </p>
            <p>
              Our primary instrument is the cash-secured put.{" "}
              <strong className="text-teal-600 font-semibold">
                We sell puts on positions we already want to own, at strike prices we&apos;d be
                genuinely comfortable buying at.
              </strong>{" "}
              We collect premium for that commitment. Most of the time those puts expire
              worthless and we write another — premium collection without ever touching the
              underlying. When macro conditions or position-specific catalysts warrant it, we
              deploy margin alongside cash to increase premium capacity. This is a thesis-informed
              decision, always sized relative to our conviction and tolerance for assignment.
            </p>
            <p>
              Covered calls are a more difficult instrument with asymmetric bets. When a
              conviction position can move violently to the upside, you don&apos;t want a short call
              capping your participation at the moment that matters most. We sell covered calls
              only when a put gets assigned — we acquire shares at our target price, sell calls
              at levels we&apos;d genuinely be comfortable exiting at, and collect more premium until
              called away. Cash returns to step one. The cycle restarts.
            </p>
            <p>
              When premiums on First Principles names are compressed, we widen the programme
              to the{" "}
              <strong className="text-teal-600 font-semibold">Thematic Momentum Portfolio</strong>
              {" "}— high-conviction names positioned around current market conditions and
              structural tailwinds, selected for outsized capital gain upside and the elevated
              implied volatility that generates fatter premiums. These aren&apos;t decade-long
              holds — when the thesis matures or the tailwind fades, the position rotates.
              On names we wouldn&apos;t accumulate permanently, we run opportunistic swing trades
              to capture the move.
            </p>
            <p className="italic text-ink-500">
              The premium isn&apos;t speculative income. It&apos;s compensation for committing to price
              levels we&apos;d act on anyway.
            </p>
          </div>

          {/* Wheel visual */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center mt-14">
            <div className="w-full">
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
                  Most of the time, puts expire worthless. We collect the premium and write
                  another. The wheel never needs to complete.
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
                  If a put is assigned, we acquire shares at our target price and sell covered
                  calls against them — collecting premium until called away.
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

      {/* ── Section 03 — Income While You Wait ── */}
      <section className="bg-transparent border-t border-cream-200/60">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <span className="inline-block bg-sage-500 text-white text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-md mb-5">
            03 — Income while you wait
          </span>
          <h2 className="text-3xl md:text-4xl text-teal-600 tracking-tight leading-tight mb-8 font-semibold">
            The thesis compounds in the foreground.
            <br />
            The premium lands in the background.
          </h2>

          <div className="space-y-6 text-ink-700 text-lg leading-relaxed">
            <p>
              Premium collection is the supporting act, not the headline.{" "}
              <strong className="text-teal-600 font-bold">
                The real win is holding the right positions long enough for the transformation
                to be obvious to everyone else.
              </strong>{" "}
              The alpha is not generated by options — it is generated by staying in businesses
              that are actively rewriting the global economy through the years that feel
              uncomfortable.
            </p>
            <p>
              This matters operationally. Premium should never become the reason we sell a
              position we believe in. Capping upside with calls during a breakout, or selling
              puts so aggressively that an assignment dilutes capital at the wrong moment —
              these are the failure modes that turn a wealth-building strategy into a
              yield-chasing one. Collecting while holding is the discipline. Collecting instead
              of holding is the mistake.
            </p>
            <p>
              Consistent weekly income is dry powder deployed on our own terms. When a core
              name dips on noise that doesn&apos;t change the thesis, we add. Premium collection
              turns volatility from something to endure into something to act on.
            </p>
            <p className="text-ink-600 text-base leading-relaxed pt-2">
              Holding <em>and</em> collecting builds wealth — but holding comes first.
            </p>
            <p className="text-teal-600 text-lg font-semibold pt-2">
              This is the Lakespring Investments playbook.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
