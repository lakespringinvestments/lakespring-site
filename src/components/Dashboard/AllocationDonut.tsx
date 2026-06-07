import type { Portfolio } from "../../../types/portfolio";

const TICKER_COLORS: Record<string, string> = {
  TSLA:  "#CC0000",
  NVDA:  "#76B900",
  PLTR:  "#101113",
  AMZN:  "#FF9900",
  GOOGL: "#A8B0B6",
};

const FALLBACK_RAMP = ["#034147", "#1D9E75", "#5DCAA5", "#347278", "#9FE1CB", "#A8B0B6"];
const EXCLUDED = new Set(["BTC", "SOL", "ASML"]);

function pickColor(ticker: string, idx: number) {
  return TICKER_COLORS[ticker] ?? FALLBACK_RAMP[idx % FALLBACK_RAMP.length];
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function AllocationDonut({ portfolio }: { portfolio: Portfolio }) {
  const cx = 110, cy = 110, outerR = 95, innerR = 58;

  const filtered = portfolio.holdings.filter((h) => !EXCLUDED.has(h.ticker));
  const totalWeight = filtered.reduce((sum, h) => sum + h.weight, 0);
  const normalised = filtered.map((h) => ({
    ...h,
    weight: totalWeight > 0 ? (h.weight / totalWeight) * 100 : 0,
  }));

  const sorted = [...normalised].sort((a, b) => b.weight - a.weight);
  const top = sorted.slice(0, 5);
  const otherWeight = sorted.slice(5).reduce((s, h) => s + h.weight, 0);
  const rawSegments = otherWeight > 0
    ? [...top, { ticker: "Other", name: "Other", weight: otherWeight, price: 0, dayChangePct: 0 }]
    : top;

  const segTotal = rawSegments.reduce((s, seg) => s + seg.weight, 0);
  const segments = rawSegments.map((seg, i) => ({
    ...seg,
    weight: i === rawSegments.length - 1
      ? 100 - rawSegments.slice(0, -1).reduce((s, s2) => s + Math.round((s2.weight / segTotal) * 1000) / 10, 0)
      : Math.round((seg.weight / segTotal) * 1000) / 10,
  }));

  // Build SVG paths
  let startAngle = 0;
  const slices = segments.map((seg, i) => {
    const angle = (seg.weight / 100) * 360;
    const endAngle = startAngle + angle;
    const midAngle = startAngle + angle / 2;

    const s = polarToCartesian(cx, cy, outerR, startAngle);
    const e = polarToCartesian(cx, cy, outerR, endAngle);
    const si = polarToCartesian(cx, cy, innerR, startAngle);
    const ei = polarToCartesian(cx, cy, innerR, endAngle);
    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${s.x} ${s.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${e.x} ${e.y}`,
      `L ${ei.x} ${ei.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${si.x} ${si.y}`,
      "Z",
    ].join(" ");

    // Label position — midpoint at label radius
    const labelR = outerR + 18;
    const labelPos = polarToCartesian(cx, cy, labelR, midAngle);

    const color = pickColor(seg.ticker, i);
    const result = { seg, path, color, labelPos, midAngle, startAngle, endAngle };
    startAngle = endAngle;
    return result;
  });

  const totalValue = portfolio.totalValue > 0
    ? `$${(portfolio.totalValue / 1000).toFixed(0)}K`
    : "—";

  return (
    <section className="bg-white rounded-2xl border border-cream-200 p-6">
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium mb-4">
        Allocation
      </h2>
      <div className="flex justify-center">
        <svg viewBox="0 0 220 220" className="w-full h-full" style={{maxHeight: '240px'}}>
          {slices.map(({ seg, path, color, labelPos, midAngle }) => {
            const showLabel = seg.weight >= 8;
            // Anchor based on position
            const anchor = labelPos.x < cx - 5 ? "end" : labelPos.x > cx + 5 ? "start" : "middle";
            return (
              <g key={seg.ticker}>
                <path d={path} fill={color} stroke="white" strokeWidth="1.5" />
                {showLabel && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill={color === "#101113" ? "#101113" : color}
                    fontFamily="system-ui"
                  >
                    {seg.ticker} {seg.weight.toFixed(0)}%
                  </text>
                )}
              </g>
            );
          })}
          {/* Center label */}
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="9" fill="#888" fontFamily="system-ui">total</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="15" fontWeight="600" fill="#034147" fontFamily="system-ui">{totalValue}</text>
        </svg>
      </div>
    </section>
  );
}
