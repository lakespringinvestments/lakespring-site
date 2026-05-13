export type Holding = {
  ticker: string;
  name: string;
  price: number;
  weight: number; // 0-100
  dayChangePct: number; // -100 to 100
};

export type PerformancePoint = {
  date: string; // ISO date
  value: number;
};

export type Portfolio = {
  totalValue: number;
  dayChange: number;
  dayChangePct: number;
  premiumYTD: number;
  openPositions: number;
  shortCalls: number;
  cash: number;
  cashPct: number;
  holdings: Holding[];
  performance: PerformancePoint[];
  lastUpdated: string;
};
