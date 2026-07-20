// src/lib/reports.ts
// Free tier: two specific reports, embedded directly via Google Drive's inline
// preview (no folder browsing, no download-first friction). Paid tier: one
// Drive folder containing the full weekly archive, gated behind membership.
//
// To swap which two reports show for free, just update the fileId below —
// grab it from the file's Drive share link (.../file/d/THIS_PART/view).

export const FREE_REPORTS = [
  {
    key: "analysis",
    label: "Pre-Trade Weekly Analysis",
    fileId: "1p4bnsiyt3Cnr49LVx3o_9Y-neQZfCtDj",
  },
  {
    key: "retrospective",
    label: "Weekly Trade Review & Retrospective",
    fileId: "14Fsq-NRRUmCk3NtlQQkFkBxQneBtQbKR",
  },
] as const;

export const PAID_REPORTS_FOLDER_URL =
  "https://drive.google.com/drive/folders/1NriNt19Xlcsd0GHKolp1Wyx1JPYnJPws?usp=drive_link";
