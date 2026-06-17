// src/lib/trades.ts
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
  optionType: string; // CSP, CC, SHARES, etc.
  direction: string;
  gainLossUsd: number | null;
  positionGroup: string;
};

const SHEET_ID = "1pSCIgrecbgT7q9kNNHNqQitFnLK94MVWT3xKT25SG0w";
const TAB_NAME = "Trades";

function parseNum(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[$,()]/g, "").trim();
  if (!cleaned || cleaned === "-") return null;
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function parseDate(val: string): string {
  if (!val) return "";
  // Already ISO format or parseable — return as-is
  return val.trim();
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
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) {
      console.error("Google Sheets fetch failed:", res.status);
      return [];
    }
    const json = await res.json();
    const rows: string[][] = json.values ?? [];

    // Column indices (0-based) from your Trades tab header:
    // A=Account, B=Strategy Type, C=Trade Init Date, D=Trade Close Date,
    // E=Position Status, F=Ticker, G=Live Price, H=Trade Description,
    // I=Strike Price, J=Premium/Contract, K=Contracts, L=Cash on Assignment,
    // M=Gain/Loss USD, ...  S=Direction, T=Option Type
    const trades: Trade[] = rows
      .filter((row) => {
        const rowTicker = (row[5] ?? "").trim().toUpperCase();
        return rowTicker === ticker.toUpperCase();
      })
      .map((row) => ({
        account:            row[0]  ?? "",
        strategyType:       row[1]  ?? "",
        openDate:           parseDate(row[2]),
        closeDate:          parseDate(row[3]),
        status:             row[4]  ?? "",
        ticker:             row[5]  ?? "",
        description:        row[7]  ?? "",
        strike:             parseNum(row[8]),
        premiumPerContract: parseNum(row[9]),
        contracts:          parseNum(row[10]),
        totalPremiumUsd:    parseNum(row[12]),
        direction:          row[18] ?? "",
        optionType:         row[19] ?? "",
        gainLossUsd:        parseNum(row[12]),
        positionGroup:      "",
      }))
      // Most recent first
      .sort((a, b) => {
        const da = a.closeDate || a.openDate;
        const db = b.closeDate || b.openDate;
        return da < db ? 1 : -1;
      })
      // Last 8 trades
      .slice(0, 8);

    return trades;
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

    return rows.map((row) => ({
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
      direction:          row[18] ?? "",
      optionType:         row[19] ?? "",
      gainLossUsd:        parseNum(row[12]),
      positionGroup:      "",
    }));
  } catch (err) {
    console.error("Error fetching all trades:", err);
    return [];
  }
}
