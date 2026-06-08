"use client";

import { useState } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";
import MetricCards from "./MetricCards";
import CapitalGainsTable from "./CapitalGainsTable";
import AllocationDonut from "./AllocationDonut";

import type { PortfolioView } from "./types";

interface Props {
  portfolio: Portfolio;
  allTrades: Trade[];
}

export default function DashboardClient({ portfolio, allTrades }: Props) {
  const [view, setView] = useState<PortfolioView>("first");

  return (
    <>
      {/* Metric cards + toggle */}
      <MetricCards
        portfolio={portfolio}
        allTrades={allTrades}
        view={view}
        setView={setView}
      />

      {/* Donut + Capital Gains — side by side, both react to toggle */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5 mt-5">
        <AllocationDonut portfolio={portfolio} />
        <CapitalGainsTable portfolio={portfolio} view={view} />
      </div>
    </>
  );
}
