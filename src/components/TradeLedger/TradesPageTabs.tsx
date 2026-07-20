"use client";

import { useState } from "react";
import type { Trade } from "@/lib/trades";
import TradeLedgerClient from "./TradeLedgerClient";
import ReportsSection from "./ReportsSection";

type Tab = "trades" | "reports";

interface Props {
  trades: Trade[];
}

export default function TradesPageTabs({ trades }: Props) {
  const [tab, setTab] = useState<Tab>("trades");

  return (
    <>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-8">
        {([
          { key: "trades" as Tab, label: "Trades" },
          { key: "reports" as Tab, label: "Reports" },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="text-xs px-4 py-1.5 rounded-full border transition-colors"
            style={tab === key
              ? { background: "#034147", color: "#fff", borderColor: "#034147" }
              : { background: "transparent", color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.15)" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "trades" ? (
        <TradeLedgerClient trades={trades} />
      ) : (
        <ReportsSection />
      )}
    </>
  );
}
