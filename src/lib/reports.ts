// src/lib/reports.ts
// Fetches the report archive from the "Reports" tab of the Lakespring Google Sheet.
// Sheet ID is the same one trades.ts and sheets.ts already use.
//
// To publish a new report:
// 1. Upload the PDF to Google Drive → Share → Anyone with the link
// 2. Add a new row to the "Reports" tab: Title | Date | Category | Drive Link | Access
//    - Access column: type "Paid" for members-only, anything else (or blank) defaults to Free
// 3. That's it — no code change, no redeploy. It shows up on the next page load
//    (the fetch below is uncached, so it's live immediately).

export type Report = {
  title: string;
  date: string;      // ISO-ish date string, e.g. "2026-07-13"
  category: string;  // e.g. "Weekly Analysis", "Trade Retrospective", "Retrospective"
  driveUrl: string;
  access: "free" | "paid";
};

export type ReportMonthGroup = {
  label: string;   // e.g. "July 2026"
  reports: Report[];
};

const SHEET_ID = "1kMeiB3u-itRqdSXUj7lGWQgpOxwWyEd61spMOHJ07mM";
const TAB_NAME = "Reports";

function rowToReport(row: string[]): Report {
  const accessRaw = (row[4] ?? "").trim().toLowerCase();
  return {
    title: (row[0] ?? "").trim(),
    date: (row[1] ?? "").trim(),
    category: (row[2] ?? "").trim(),
    driveUrl: (row[3] ?? "").trim(),
    access: accessRaw === "paid" ? "paid" : "free",
  };
}

export async function getAllReports(): Promise<Report[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_SHEETS_API_KEY not set — returning empty reports");
    return [];
  }

  try {
    const range = encodeURIComponent(`${TAB_NAME}!A2:E200`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("Google Sheets fetch failed (Reports tab):", res.status);
      return [];
    }
    const json = await res.json();
    const rows: string[][] = json.values ?? [];

    return rows
      .filter((row) => (row[0] ?? "").trim() !== "")
      .map(rowToReport)
      .sort((a, b) => (a.date < b.date ? 1 : -1)); // most recent first
  } catch (err) {
    console.error("Error fetching reports:", err);
    return [];
  }
}

// Groups an already-sorted (most recent first) report list into month buckets,
// preserving order. Reports with an unparseable date land in "Undated" at the end.
export function groupReportsByMonth(reports: Report[]): ReportMonthGroup[] {
  const order: string[] = [];
  const map = new Map<string, Report[]>();

  for (const r of reports) {
    const d = new Date(r.date);
    const label = isNaN(d.getTime())
      ? "Undated"
      : d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(r);
  }

  // Keep "Undated" last regardless of where it first appeared
  const sortedLabels = order.includes("Undated")
    ? [...order.filter((l) => l !== "Undated"), "Undated"]
    : order;

  return sortedLabels.map((label) => ({ label, reports: map.get(label)! }));
}
