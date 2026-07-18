"use client";

import { useState } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";
import type { PortfolioView } from "./types";
import MetricCards from "./MetricCards";
import CapitalGainsTable from "./CapitalGainsTable";

interface Props {
  portfolio: Portfolio;
  allTrades: Trade[];
}

export default function PortfolioToggleClient({ portfolio, allTrades }: Props) {
  const [view, setView] = useState<PortfolioView>("first");

  return (
    <>
      <MetricCards
        portfolio={portfolio}
        allTrades={allTrades}
        view={view}
        setView={setView}
      />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5 mt-5">
        {/* AllocationDonut is imported in page.tsx and rendered separately */}
        <div id="donut-placeholder" />
        <CapitalGainsTable portfolio={portfolio} view={view} />
      </div>
    </>
  );
}
