import Papa from "papaparse";
import type { Holding, PerformancePoint } from "../../types/portfolio";

async function fetchCSV(url: string): Promise<string[][]> {
  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);
  const text = await res.text();
  const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
  return parsed.data;
}

export async function fetchHoldingsFromSheet(): Promise<Holding[]> {
  const url = process.env.NEXT_PUBLIC_SHEET_HOLDINGS_URL;
  if (!url || url.includes("PASTE_ID")) {
    // Not configured yet — return empty so the UI can show a graceful state
    return [];
  }
  const rows = await fetchCSV(url);
  // Expected columns: Ticker | Name | Price | Weight | Day_Change_Pct
  // First row is headers
  return rows.slice(1).map((row) => ({
    ticker: row[0]?.trim() ?? "",
    name: row[1]?.trim() ?? "",
    price: parseFloat(row[2]) || 0,
    weight: parseFloat(row[3]) || 0,
    dayChangePct: parseFloat(row[4]) || 0,
  })).filter((h) => h.ticker);
}

export async function fetchPerformanceFromSheet(): Promise<PerformancePoint[]> {
  const url = process.env.NEXT_PUBLIC_SHEET_PERFORMANCE_URL;
  if (!url || url.includes("PASTE_ID")) return [];
  const rows = await fetchCSV(url);
  // Expected columns: Date | Portfolio_Value | Premium_YTD
  return rows.slice(1).map((row) => ({
    date: row[0]?.trim() ?? "",
    value: parseFloat(row[1]) || 0,
  })).filter((p) => p.date && p.value > 0);
}
