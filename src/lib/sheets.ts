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
// Finds rows with recognised tickers and extracts price, weight, day change.
const HOLDINGS_TICKERS = new Set(["TSLA", "NVDA", "PLTR", "AMZN", "GOOGL", "BTC", "ASML"]);

export async function fetchHoldingsFromSheet(): Promise<Holding[]> {
  // Fetch the holdings section — columns A:Q, rows 1-25
  const rows = await fetchRange("Current Portfolio Summary", "A1:Q30");
  if (rows.length === 0) return [];

  const holdings: Holding[] = [];

  for (const row of rows) {
    const ticker = (row[2] ?? "").trim().toUpperCase()
      .replace("-USD", "") // BTC-USD → BTC
      .replace("BTC-USD", "BTC");

    if (!HOLDINGS_TICKERS.has(ticker)) continue;

    const price = parseNum(row[3]);   // Column D: Price (USD)
    const qty   = parseNum(row[6]);   // Column G: Qty
    const bookCost = parseNum(row[8]); // Column I: Book Cost (USD)
    const mktValue = parseNum(row[9]); // Column J: Market Value (USD)
    const pct   = parseNum(row[14]);  // Column O: Portfolio %

    if (price <= 0 && mktValue <= 0) continue;

    holdings.push({
      ticker,
      name: nameForTicker(ticker),
      price: price || mktValue / (qty || 1),
      weight: pct,
      dayChangePct: 0, // Not available in this tab — leave 0
    });
  }

  return holdings;
}

function nameForTicker(ticker: string): string {
  const names: Record<string, string> = {
    TSLA: "Tesla",
    NVDA: "Nvidia",
    PLTR: "Palantir",
    AMZN: "Amazon",
    GOOGL: "Alphabet",
    BTC: "Bitcoin",
    ASML: "ASML",
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
