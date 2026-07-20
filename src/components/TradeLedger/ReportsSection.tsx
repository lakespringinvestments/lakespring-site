"use client";

import { useEffect, useState } from "react";
import BlurOverlay from "./BlurOverlay";
import { FREE_REPORTS_FOLDER_URL, PAID_REPORTS_FOLDER_URL } from "@/lib/reports";

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

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-lg text-white font-semibold tracking-tight">Reports</h2>
        <p className="text-white/40 text-xs mt-1">
          Weekly analysis and trade retrospectives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free sneak peek — always open to everyone */}
        <a
          href={FREE_REPORTS_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 rounded-xl p-6 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600/20 flex items-center justify-center">
              <FolderIcon />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-400">
              Free sneak peek
            </span>
          </div>
          <p className="text-base text-white font-medium group-hover:text-teal-300 transition-colors">
            Sample Reports
          </p>
          <p className="text-[12px] text-white/40 leading-relaxed">
            A couple of full weekly analysis and retrospective reports, on us — no subscription required.
          </p>
          <span className="text-[11px] font-semibold text-sage-300 group-hover:text-sage-200 mt-1">
            Open folder →
          </span>
        </a>

        {/* Full archive — members only */}
        {isMember ? (
          <a
            href={PAID_REPORTS_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 rounded-xl p-6 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600/20 flex items-center justify-center">
                <FolderIcon />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-400">
                Members
              </span>
            </div>
            <p className="text-base text-white font-medium group-hover:text-teal-300 transition-colors">
              Full Report Archive
            </p>
            <p className="text-[12px] text-white/40 leading-relaxed">
              Every weekly analysis and trade retrospective report, updated as they&apos;re published.
            </p>
            <span className="text-[11px] font-semibold text-sage-300 group-hover:text-sage-200 mt-1">
              Open folder →
            </span>
          </a>
        ) : (
          <a
            href={STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl p-6 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <LockIcon />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                Members only
              </span>
            </div>
            <p className="text-base font-medium">
              <BlurOverlay>Full Report Archive</BlurOverlay>
            </p>
            <p className="text-[12px] text-white/30 leading-relaxed">
              <BlurOverlay>Every weekly analysis and trade retrospective report, updated as they&apos;re published.</BlurOverlay>
            </p>
            <span className="text-[11px] font-semibold text-sage-300 group-hover:text-sage-200 mt-1">
              Subscribe to unlock →
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
