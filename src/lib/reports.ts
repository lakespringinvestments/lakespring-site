// Weekly reports archive — add new entries at the top.
// Each week has an analysis report (Output A, Sunday/Monday)
// and a trade retrospective (Output B, Saturday).
//
// To add a new week:
// 1. Upload PDFs to Google Drive → Share → Anyone with the link
// 2. Copy the share links below
// 3. Commit and push

export interface WeeklyReport {
  weekOf: string;           // e.g. "Jul 14–18, 2026"
  weekLabel: string;        // e.g. "W29"
  analysis?: {
    title: string;
    driveUrl: string;       // Google Drive share link
    publishedDate: string;  // e.g. "2026-07-13"
  };
  retrospective?: {
    title: string;
    driveUrl: string;
    publishedDate: string;
  };
}

// Most recent first
export const WEEKLY_REPORTS: WeeklyReport[] = [
  // ── Example entry (replace with real data) ──
  // {
  //   weekOf: "Jul 14–18, 2026",
  //   weekLabel: "W29",
  //   analysis: {
  //     title: "Weekly Analysis — Jul 14–18",
  //     driveUrl: "https://drive.google.com/file/d/xxx/view",
  //     publishedDate: "2026-07-13",
  //   },
  //   retrospective: {
  //     title: "Trade Retrospective — W29",
  //     driveUrl: "https://drive.google.com/file/d/yyy/view",
  //     publishedDate: "2026-07-19",
  //   },
  // },
];
