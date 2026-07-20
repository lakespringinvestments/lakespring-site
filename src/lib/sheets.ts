import type { Holding, PerformancePoint } from "../../types/portfolio";

const SHEET_ID = "1kMeiB3u-itRqdSXUj7lGWQgpOxwWyEd61spMOHJ07mM";

async function fetchRange(tab: string, range: string): Promise<string[][]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_SHEETS_API_KEY not set");
    return [];
  }
  const encodedRange = encodeURIComponent(`${tab}!${range}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}?key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    console.error(`Sheet fetch failed (${tab}!${range}):`, res.status);
    return [];
  }
  const json = await res.json();
  return json.values ?? [];
}

function parseNum(val: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/[$,%(),"]/g, "").trim();
  if (!cleaned || cleaned === "-" || cleaned === "#N/A" || cleaned === "#VALUE!") return 0;
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

// ─── Holdings ────────────────────────────────────────────────────────────────
// Reads from "Current Portfolio Summary" tab.
// Column layout (0-indexed):
//   A(0): Account  B(1): Ticker  C(2): Holdings/Name  D(3): Qty
//   E(4): Avg Cost  F(5): Book Value  G(6): Live Price  H(7): Market Value
//   I(8): Unreal. P&L  J(9): Unreal. P&L %

const DASHBOARD_TICKERS = new Set([
  // First Principles
  "TSLA", "NVDA", "PLTR", "AMZN", "GOOGL", "GOOG", "LLY", "SPCX",
  // Thematic Momentum
  "MRVL", "NBIS", "ASML", "BE", "SMCI", "CRWV",
  // Crypto
  "BTC", "ETH", "SOL", "BMNR", "MSTR",
  // Cash
  "CASH",
]);

export async function fetchHoldingsFromSheet(): Promise<Holding[]> {
  const rows = await fetchRange("Current Portfolio Summary", "A1:K30");
  if (rows.length === 0) return [];

  // First pass: collect market values per ticker (merge GOOG → GOOGL, sum across accounts)
  const tickerData: Record<string, { price: number; mktValue: number; qty: number; dayChangePct: number }> = {};

  for (const row of rows) {
    let ticker = (row[1] ?? "").trim().toUpperCase();
    // Normalise crypto tickers
    ticker = ticker.replace(/-USD$/, "").replace(/-CAD$/, "");
    // Merge GOOG into GOOGL
    if (ticker === "GOOG") ticker = "GOOGL";

    if (!DASHBOARD_TICKERS.has(ticker)) continue;

    const qty          = parseNum(row[3]);   // Column D
    const price        = parseNum(row[6]);   // Column G: Live Price
    const mktValue      = parseNum(row[7]);   // Column H: Market Value
    const dayChangePct = parseNum(row[10]);  // Column K: Day Change (%)

    if (price <= 0 && mktValue <= 0) continue;

    if (!tickerData[ticker]) {
      tickerData[ticker] = { price: 0, mktValue: 0, qty: 0, dayChangePct: 0 };
    }
    // Sum market values across accounts (e.g. TSLA in TFSA + Margin)
    tickerData[ticker].mktValue += mktValue;
    tickerData[ticker].qty += qty;
    // Keep the latest non-zero price
    if (price > 0) tickerData[ticker].price = price;
    // Same live feed across accounts for a ticker — keep the latest non-zero read
    if (dayChangePct !== 0) tickerData[ticker].dayChangePct = dayChangePct;
  }

  // Calculate total market value for weight calculation
  const totalMktValue = Object.values(tickerData).reduce((sum, d) => sum + d.mktValue, 0);

  // Build holdings array
  const holdings: Holding[] = [];
  for (const [ticker, data] of Object.entries(tickerData)) {
    holdings.push({
      ticker,
      name: nameForTicker(ticker),
      price: data.price || (data.qty > 0 ? data.mktValue / data.qty : 0),
      weight: totalMktValue > 0 ? (data.mktValue / totalMktValue) * 100 : 0,
      dayChangePct: data.dayChangePct,
    });
  }

  return holdings;
}

// ─── Total Portfolio Value ───────────────────────────────────────────────────
// Reads the "ACTIVE HOLDINGS TOTAL" row from Current Portfolio Summary
export async function fetchTotalValue(): Promise<number> {
  const rows = await fetchRange("Current Portfolio Summary", "A1:K30");
  if (rows.length === 0) return 0;

  // "ACTIVE HOLDINGS TOTAL" excludes cash by design (that's what the label says).
  // Prefer an explicit "TOTAL PORTFOLIO VALUE" row (which should include cash);
  // otherwise add the CASH row's market value on top of the active holdings total.
  let activeHoldingsTotal = 0;
  let cashValue = 0;

  for (const row of rows) {
    const label = (row[0] ?? "").trim().toUpperCase();
    if (label.includes("TOTAL PORTFOLIO VALUE")) {
      return parseNum(row[7]); // Column H: Market Value total
    }
    if (label.includes("ACTIVE HOLDINGS TOTAL")) {
      activeHoldingsTotal = parseNum(row[7]);
    }
    const ticker = (row[1] ?? "").trim().toUpperCase();
    if (ticker === "CASH") {
      cashValue += parseNum(row[7]);
    }
  }

  if (activeHoldingsTotal > 0) {
    return activeHoldingsTotal + cashValue;
  }

  // Fallback: sum all market values
  let total = 0;
  for (const row of rows) {
    const mktValue = parseNum(row[7] ?? "");
    if (mktValue > 0) total += mktValue;
  }
  return total;
}

function nameForTicker(ticker: string): string {
  const names: Record<string, string> = {
    TSLA: "Tesla",
    NVDA: "Nvidia",
    PLTR: "Palantir",
    AMZN: "Amazon",
    GOOGL: "Alphabet",
    LLY: "Eli Lilly",
    SPCX: "SpaceX",
    MRVL: "Marvell",
    NBIS: "Nebius Group",
    ASML: "ASML",
    BE: "Bloom Energy",
    SMCI: "Super Micro",
    CRWV: "CoreWeave",
    BTC: "Bitcoin",
    ETH: "Ethereum",
    SOL: "Solana",
    BMNR: "Bitmine Immersion",
    MSTR: "Strategy",
    CASH: "USD Cash",
  };
  return names[ticker] ?? ticker;
}

// ─── Performance ─────────────────────────────────────────────────────────────
// Reads from "Annual Performance" tab — gets the 2025/2026 market values
// as historical data points for the sparkline chart.
export async function fetchPerformanceFromSheet(): Promise<PerformancePoint[]> {
  const rows = await fetchRange("Annual Performance", "A1:H40");
  if (rows.length === 0) return [];

  const points: PerformancePoint[] = [];

  for (const row of rows) {
    const year = row[0]?.trim();
    const account = row[1]?.trim();
    const mktValueStr = row[7]?.trim(); // Column H: Market Value (USD)

    if (!year || !["2025", "2026"].includes(year)) continue;
    if (account !== "Margin" && account !== "TFSA" && account !== "Crypto") continue;

    const val = parseNum(mktValueStr);
    if (val > 0) {
      points.push({
        date: `${year}-12-31`,
        value: val,
      });
    }
  }

  // Aggregate by year
  const byYear: Record<string, number> = {};
  for (const p of points) {
    byYear[p.date] = (byYear[p.date] ?? 0) + p.value;
  }

  return Object.entries(byYear)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Premium YTD ─────────────────────────────────────────────────────────────
// Reads from "Weekly Trade Income" tab — sums 2026 USD income.
export async function fetchPremiumYTD(): Promise<number> {
  const rows = await fetchRange("Weekly Trade Income", "A1:BA10");
  if (rows.length === 0) return 0;

  // Find the 2026 USD row — "2026" in col A, "USD" in col B
  for (const row of rows) {
    if (row[0]?.trim() === "2026" && row[1]?.trim() === "USD") {
      // Last non-empty rolling total column (col BA area)
      // The FY Total is the last column
      const last = [...row].reverse().find(v => v && v !== "$0.00" && v.startsWith("$"));
      if (last) return parseNum(last);
    }
  }
  return 0;
}
