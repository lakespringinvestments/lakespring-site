"use client";

import { useState } from "react";
import type { Portfolio } from "../../../types/portfolio";
import type { Trade } from "@/lib/trades";
import MetricCards from "./MetricCards";
import CapitalGainsTable from "./CapitalGainsTable";
import AllocationDonut from "./AllocationDonut";
import HoldingsList from "./HoldingsList";
import type { PortfolioView } from "./types";

interface Props {
  portfolio: Portfolio;
  allTrades: Trade[];
  tradesByTicker: Record<string, Trade[]>;
}

export default function DashboardClient({ portfolio, allTrades, tradesByTicker }: Props) {
  const [view, setView] = useState<PortfolioView>("first");

  return (
    <>
      <MetricCards portfolio={portfolio} allTrades={allTrades} view={view} setView={setView} />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5 mt-5">
        <AllocationDonut portfolio={portfolio} view={view} />
        <CapitalGainsTable portfolio={portfolio} view={view} />
      </div>
      <div className="mt-5">
        <HoldingsList portfolio={portfolio} tradesByTicker={tradesByTicker} view={view} />
      </div>
    </>
  );
}
