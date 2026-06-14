// src/lib/trades.ts
// update-136: Live trade ledger data layer
// Fetches trade data from the Lakespring Google Sheet (Trades tab).
// Sheet ID is permanent regardless of filename changes.
// Requires GOOGLE_SHEETS_API_KEY environment variable set in Vercel.

export type Trade = {
  ticker: string;
  account: string;
  strategyType: string;
  openDate: string;
  closeDate: string;
  status: string;
  description: string;
  strike: number | null;
  premiumPerContract: number | null;
  contracts: number | null;
  totalPremiumUsd: number | null;
  gainLossUsd: number | null;
  returnPct: number | null;
  optionType: string; // CSP, CC, SHARES, etc.
  direction: string;
  rationale: string;
};

const SHEET_ID = "1kMeiB3u-itRqdSXUj7lGWQgpOxwWyEd61spMOHJ07mM";
const TAB_NAME = "Trades";

function parseNum(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[$,()%]/g, "").trim();
  if (!cleaned || cleaned === "-") return null;
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function parseDate(val: string): string {
  if (!val) return "";
  return val.trim();
}

function rowToTrade(row: string[]): Trade {
  return {
    account:            row[0]  ?? "",
    strategyType:       row[1]  ?? "",
    openDate:           parseDate(row[2]),
    closeDate:          parseDate(row[3]),
    status:             row[4]  ?? "",
    ticker:             (row[5] ?? "").trim().toUpperCase(),
    description:        row[7]  ?? "",
    strike:             parseNum(row[8]),
    premiumPerContract: parseNum(row[9]),
    contracts:          parseNum(row[10]),
    totalPremiumUsd:    parseNum(row[12]),
    gainLossUsd:        parseNum(row[12]),   // col M = index 12
    returnPct:          parseNum(row[16]),    // col Q = index 16
    direction:          row[18] ?? "",
    optionType:         row[19] ?? "",
    rationale:          row[32] ?? "",        // col AG = index 32
  };
}

export async function getTradesForTicker(ticker: string): Promise<Trade[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_SHEETS_API_KEY not set — returning empty trades");
    return [];
  }

  try {
    const range = encodeURIComponent(`${TAB_NAME}!A2:AH500`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error("Google Sheets fetch failed:", res.status);
      return [];
    }
    const json = await res.json();
    const rows: string[][] = json.values ?? [];

    return rows
      .filter((row) => (row[5] ?? "").trim().toUpperCase() === ticker.toUpperCase())
      .map(rowToTrade)
      .sort((a, b) => {
        const da = a.closeDate || a.openDate;
        const db = b.closeDate || b.openDate;
        return da < db ? 1 : -1;
      })
      .slice(0, 8);
  } catch (err) {
    console.error("Error fetching trades:", err);
    return [];
  }
}

export async function getAllTrades(): Promise<Trade[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) return [];

  try {
    const range = encodeURIComponent(`${TAB_NAME}!A2:AH500`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    const rows: string[][] = json.values ?? [];

    // No slice limit — return all trades, sorted most recent first
    return rows
      .map(rowToTrade)
      .sort((a, b) => {
        const da = a.closeDate || a.openDate;
        const db = b.closeDate || b.openDate;
        return da < db ? 1 : -1;
      });
  } catch (err) {
    console.error("Error fetching all trades:", err);
    return [];
  }
}
