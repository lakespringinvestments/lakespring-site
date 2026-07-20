"use client";

import { useEffect, useState } from "react";
import BlurOverlay from "./BlurOverlay";
import { FREE_REPORTS, PAID_REPORTS_FOLDER_URL } from "@/lib/reports";

const STRIPE_URL = "https://buy.stripe.com/test_9B66oH1nF9Zpe5Wewxfw400";

function useMember() {
  const [member, setMember] = useState(false);
  useEffect(() => {
    setMember(localStorage.getItem("lakespring_member") === "true");
  }, []);
  return member;
}

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function ReportsSection() {
  const isMember = useMember();
  const [activeKey, setActiveKey] = useState<typeof FREE_REPORTS[number]["key"]>(FREE_REPORTS[0].key);
  const activeReport = FREE_REPORTS.find((r) => r.key === activeKey) ?? FREE_REPORTS[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg text-white font-semibold tracking-tight">Reports</h2>
        <p className="text-white/40 text-xs mt-1">
          Weekly analysis breaks down our game plan and strategy before the trading week begins.
          Trade retrospectives review what happened and why once the week closes. Sample both for
          free below, or subscribe (button at the bottom of this page) to get every week&apos;s
          reports curated for members.
        </p>
      </div>

      {/* Free sneak peek — embedded viewer, two reports via tabs */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600/20 flex items-center justify-center flex-shrink-0">
              <FolderIcon />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-400">
                Free sneak peek
              </span>
              <p className="text-sm text-white font-medium">Sample Reports</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {FREE_REPORTS.map((r) => (
              <button
                key={r.key}
                onClick={() => setActiveKey(r.key)}
                className="text-[11px] px-3 py-1.5 rounded-full border transition-colors"
                style={activeKey === r.key
                  ? { background: "#034147", color: "#fff", borderColor: "#034147" }
                  : { background: "transparent", color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.15)" }
                }
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg overflow-hidden bg-black/20">
          <iframe
            key={activeReport.fileId}
            src={`https://drive.google.com/file/d/${activeReport.fileId}/preview`}
            className="w-full"
            style={{ height: 640, border: "none", display: "block" }}
            allow="autoplay"
            title={activeReport.label}
          />
        </div>
      </div>

      {/* Full archive — members only */}
      {isMember ? (
        <a
          href={PAID_REPORTS_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 rounded-xl p-6 transition-colors"
        >
          <div className="w-11 h-11 rounded-lg bg-teal-600/20 flex items-center justify-center flex-shrink-0">
            <FolderIcon />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-400">
              Members
            </span>
            <p className="text-base text-white font-medium group-hover:text-teal-300 transition-colors">
              Full Report Archive
            </p>
            <p className="text-[12px] text-white/40 leading-relaxed mt-1">
              Curated every single week: a Trading Game Plan &amp; Strategy report and an Active Market Pulse report — members get both, every week, without exception.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-sage-300 group-hover:text-sage-200 flex-shrink-0 whitespace-nowrap">
            Open folder →
          </span>
        </a>
      ) : (
        <a
          href={STRIPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl p-6 transition-colors"
        >
          <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <LockIcon />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
              Members only
            </span>
            <p className="text-base font-medium">
              <BlurOverlay>Full Report Archive</BlurOverlay>
            </p>
            <p className="text-[12px] text-white/30 leading-relaxed mt-1">
              <BlurOverlay>Curated every single week: a Trading Game Plan &amp; Strategy report and an Active Market Pulse report — members get both, every week, without exception.</BlurOverlay>
            </p>
          </div>
          <span className="text-[11px] font-semibold text-sage-300 group-hover:text-sage-200 flex-shrink-0 whitespace-nowrap">
            Subscribe to unlock →
          </span>
        </a>
      )}
    </div>
  );
}
