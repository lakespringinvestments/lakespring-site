"use client";

import { WEEKLY_REPORTS } from "@/lib/reports";

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return iso; }
}

export default function ReportsSection() {
  if (WEEKLY_REPORTS.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-white/40 text-sm">Reports will appear here once published.</p>
        <p className="text-white/25 text-xs mt-2">
          Weekly analysis reports are released Sunday evening. Trade retrospectives are released Saturday.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="text-lg text-white font-semibold tracking-tight">Weekly Reports</h2>
          <p className="text-white/40 text-xs mt-1">
            Pre-market analysis and end-of-week trade retrospectives
          </p>
        </div>
      </div>

      {WEEKLY_REPORTS.map((week) => (
        <div
          key={week.weekLabel}
          className="bg-white/[0.03] border border-white/10 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded">
              {week.weekLabel}
            </span>
            <span className="text-sm text-white/70 font-medium">{week.weekOf}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Output A — Weekly Analysis */}
            {week.analysis ? (
              <a
                href={week.analysis.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 rounded-lg p-4 transition-colors"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-600/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium group-hover:text-teal-300 transition-colors">
                    {week.analysis.title}
                  </p>
                  <p className="text-[11px] text-white/35 mt-0.5">
                    Published {formatDate(week.analysis.publishedDate)}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/20 group-hover:text-white/40 flex-shrink-0 transition-colors">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ) : (
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-lg p-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <p className="text-xs text-white/25">Weekly analysis — pending</p>
              </div>
            )}

            {/* Output B — Trade Retrospective */}
            {week.retrospective ? (
              <a
                href={week.retrospective.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 rounded-lg p-4 transition-colors"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-sage-600/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium group-hover:text-teal-300 transition-colors">
                    {week.retrospective.title}
                  </p>
                  <p className="text-[11px] text-white/35 mt-0.5">
                    Published {formatDate(week.retrospective.publishedDate)}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/20 group-hover:text-white/40 flex-shrink-0 transition-colors">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ) : (
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-lg p-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <p className="text-xs text-white/25">Trade retrospective — pending</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
