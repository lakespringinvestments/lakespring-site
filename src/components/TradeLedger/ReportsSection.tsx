"use client";

import { useEffect, useState } from "react";
import type { Report, ReportMonthGroup } from "@/lib/reports";
import BlurOverlay from "./BlurOverlay";

const STRIPE_URL = "https://buy.stripe.com/test_9B66oH1nF9Zpe5Wewxfw400";

function useMember() {
  const [member, setMember] = useState(false);
  useEffect(() => {
    setMember(localStorage.getItem("lakespring_member") === "true");
  }, []);
  return member;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return iso; }
}

function CategoryIcon({ category }: { category: string }) {
  const isRetrospective = category.toLowerCase().includes("retrospective");
  return isRetrospective ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ReportTile({ report, unlocked }: { report: Report; unlocked: boolean }) {
  if (unlocked) {
    return (
      <a
        href={report.driveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 rounded-lg p-4 transition-colors"
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-600/20 flex items-center justify-center">
          <CategoryIcon category={report.category} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium group-hover:text-teal-300 transition-colors truncate">
            {report.title}
          </p>
          <p className="text-[11px] text-white/35 mt-0.5">
            {report.category} · {formatDate(report.date)}
          </p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/20 group-hover:text-white/40 flex-shrink-0 transition-colors">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    );
  }

  return (
    <a
      href={STRIPE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg p-4 transition-colors"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
        <LockIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          <BlurOverlay>{report.title}</BlurOverlay>
        </p>
        <p className="text-[11px] text-white/35 mt-0.5">
          {report.category} · <BlurOverlay>{formatDate(report.date)}</BlurOverlay>
        </p>
      </div>
      <span className="text-[11px] font-semibold text-sage-300 group-hover:text-sage-200 flex-shrink-0 whitespace-nowrap">
        Subscribe to unlock →
      </span>
    </a>
  );
}

function MonthSection({ group, isOpen, onToggle, isMember }: {
  group: ReportMonthGroup;
  isOpen: boolean;
  onToggle: () => void;
  isMember: boolean;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-white font-semibold tracking-tight">{group.label}</span>
          <span className="text-[11px] text-white/35">
            {group.reports.length} report{group.reports.length === 1 ? "" : "s"}
          </span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          className="text-white/40 transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {group.reports.map((report) => (
            <ReportTile
              key={`${report.title}-${report.date}`}
              report={report}
              unlocked={report.access === "free" || isMember}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  groups: ReportMonthGroup[];
}

export default function ReportsSection({ groups }: Props) {
  const isMember = useMember();
  const [openMonths, setOpenMonths] = useState<Set<string>>(new Set());

  // Default to the most recent month expanded, once we know what it is
  useEffect(() => {
    if (groups.length > 0) {
      setOpenMonths(new Set([groups[0].label]));
    }
  }, [groups]);

  const toggle = (label: string) => {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  if (groups.length === 0) {
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
          <h2 className="text-lg text-white font-semibold tracking-tight">Reports</h2>
          <p className="text-white/40 text-xs mt-1">
            Weekly analysis, trade retrospectives, and one-off reports — grouped by month
          </p>
        </div>
      </div>

      {groups.map((group) => (
        <MonthSection
          key={group.label}
          group={group}
          isOpen={openMonths.has(group.label)}
          onToggle={() => toggle(group.label)}
          isMember={isMember}
        />
      ))}
    </div>
  );
}
