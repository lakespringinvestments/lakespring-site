"use client";

import { useEffect, useState } from "react";
import BlurOverlay from "./BlurOverlay";
import { FREE_REPORTS, PAID_REPORTS_FOLDER_URL } from "@/lib/reports";

const SUBSTACK_URL = "https://substack.com/@lakespringinvestments";
const SUBSCRIBED_KEY = "lakespring_subscribed";

function useMember() {
  const [member, setMember] = useState(false);
  useEffect(() => {
    setMember(localStorage.getItem("lakespring_member") === "true");
  }, []);
  return member;
}

function useSubscribed() {
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    setSubscribed(localStorage.getItem(SUBSCRIBED_KEY) === "true");
  }, []);
  return [subscribed, setSubscribed] as const;
}

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function ReportsSection() {
  const isMember = useMember();
  const [subscribed, setSubscribed] = useSubscribed();
  const unlocked = isMember || subscribed;

  const [activeKey, setActiveKey] = useState<typeof FREE_REPORTS[number]["key"]>(FREE_REPORTS[0].key);
  const activeReport = FREE_REPORTS.find((r) => r.key === activeKey) ?? FREE_REPORTS[0];

  function handleSubscribed() {
    localStorage.setItem(SUBSCRIBED_KEY, "true");
    setSubscribed(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg text-white font-semibold tracking-tight">Reports</h2>
        <p className="text-white/40 text-xs mt-1">
          Every week we publish two reports: a pre-market analysis laying out our game plan
          before the week starts, and a retrospective breaking down what actually happened once
          it ends. Subscribe below to view the free sample reports — this also follows us on
          Substack for new article alerts (not to be confused with paid membership, which gets
          you live trade alerts and the full repository of reports via the button at the bottom
          of this page).
        </p>
      </div>

      {/* Free sneak peek — embedded viewer, two reports via tabs, blurred behind a signup gate */}
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

        <div className="relative rounded-lg overflow-hidden bg-black/20">
          {unlocked ? (
            <iframe
              key={activeReport.fileId}
              src={`https://drive.google.com/file/d/${activeReport.fileId}/preview`}
              className="w-full"
              style={{ height: 640, border: "none", display: "block" }}
              allow="autoplay"
              title={activeReport.label}
            />
          ) : (
            <>
              <BlurOverlay className="block w-full">
                <iframe
                  key={activeReport.fileId}
                  src={`https://drive.google.com/file/d/${activeReport.fileId}/preview`}
                  className="w-full"
                  style={{ height: 640, border: "none", display: "block" }}
                  tabIndex={-1}
                  title={activeReport.label}
                />
              </BlurOverlay>
              <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-black/50">
                <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-xl p-6 text-center">
                  <p className="text-sm text-white font-medium mb-1">
                    Follow on Substack to unlock
                  </p>
                  <p className="text-xs text-white/50 mb-4 leading-relaxed">
                    Subscribe for free on Substack, then come back and confirm below to view
                    the sample reports.
                  </p>
                  <a
                    href={SUBSTACK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-white text-[#034147] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-cream-50 transition-colors mb-3"
                  >
                    Subscribe on Substack →
                  </a>
                  <button
                    onClick={handleSubscribed}
                    className="w-full text-xs text-white/50 hover:text-white/80 underline underline-offset-2 transition-colors"
                  >
                    I&apos;ve already subscribed — show me the reports
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full archive — members only, shown only once actually a member */}
      {isMember && (
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
      )}
    </div>
  );
}
