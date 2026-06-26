"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Eye,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  useDashboardMetrics,
  useRecentTransactions,
  useClientTransactions,
  type TransactionRow,
} from "@/hooks/useClientQueries";
import { CoinLogo } from "@/components/market/CoinLogo";
import { getCoinBySymbol } from "@/config/coins";
import { cn } from "@/lib/utils";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

type PerformanceTimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "YTD" | "1Y" | "MAX" | "Custom";

const PERFORMANCE_TIME_RANGES: PerformanceTimeRange[] = [
  "1D",
  "1W",
  "1M",
  "3M",
  "6M",
  "YTD",
  "1Y",
  "MAX",
  "Custom",
];

const ASSET_GRADIENTS: Record<
  string,
  { id: string; light: string; dark: string; dot: string; label: string }
> = {
  BTC: { id: "gradBtc", light: "#fb923c", dark: "#ea580c", dot: "#f97316", label: "Bitcoin" },
  ETH: { id: "gradEth", light: "#a78bfa", dark: "#7c3aed", dot: "#8b5cf6", label: "Ethereum" },
  USDT: { id: "gradUsdt", light: "#4ade80", dark: "#16a34a", dot: "#22c55e", label: "USDT" },
  CAD: { id: "gradCad", light: "#60a5fa", dark: "#2563eb", dot: "#3b82f6", label: "CAD" },
};

function txToCad(
  tx: TransactionRow,
  cadRates: { BTC: number; ETH: number; USDT: number },
): number {
  const sym = (tx.asset || "CAD").toUpperCase();
  if (sym === "CAD") return tx.rawAmount;
  if (sym === "BTC") return tx.rawAmount * cadRates.BTC;
  if (sym === "ETH") return tx.rawAmount * cadRates.ETH;
  if (sym === "USDT" || sym === "USDC") return tx.rawAmount * cadRates.USDT;
  return tx.rawAmount * cadRates.USDT;
}

function getRangeBounds(
  range: PerformanceTimeRange,
  customStart: Date | null,
  customEnd: Date | null,
  allTxs: TransactionRow[],
): { start: Date; end: Date } {
  const end = customEnd ? new Date(customEnd) : new Date();
  end.setHours(23, 59, 59, 999);

  if (range === "Custom" && customStart) {
    const start = new Date(customStart);
    start.setHours(0, 0, 0, 0);
    return { start, end: customEnd ? end : new Date() };
  }

  const start = new Date(end);
  switch (range) {
    case "1D":
      start.setDate(start.getDate() - 1);
      break;
    case "1W":
      start.setDate(start.getDate() - 7);
      break;
    case "1M":
      start.setMonth(start.getMonth() - 1);
      break;
    case "3M":
      start.setMonth(start.getMonth() - 3);
      break;
    case "6M":
      start.setMonth(start.getMonth() - 6);
      break;
    case "YTD":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "1Y":
      start.setFullYear(start.getFullYear() - 1);
      break;
    case "MAX":
    default:
      if (allTxs.length > 0) {
        start.setTime(Math.min(...allTxs.map((t) => t.rawDate.getTime())));
      } else {
        start.setFullYear(start.getFullYear() - 5);
      }
      break;
  }
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function formatBucketLabel(date: Date, range: PerformanceTimeRange): string {
  if (range === "1D") {
    return date.toLocaleTimeString([], { hour: "numeric" });
  }
  if (range === "1W" || range === "1M") {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  if (range === "3M" || range === "6M" || range === "Custom") {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString([], { month: "short" });
}

function buildPerformanceChartData(
  allTxs: TransactionRow[],
  range: PerformanceTimeRange,
  portfolioValue: number,
  cadRates: { BTC: number; ETH: number; USDT: number },
  customStart: Date | null,
  customEnd: Date | null,
): { name: string; value: number }[] {
  const { start, end } = getRangeBounds(range, customStart, customEnd, allTxs);
  const val = portfolioValue || 51750;
  const pointCount = 7;
  const duration = Math.max(end.getTime() - start.getTime(), 1);
  const step = duration / (pointCount - 1);

  const sortedTxs = [...allTxs].sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  const txsInRange = sortedTxs.filter((t) => t.rawDate >= start && t.rawDate <= end);

  const netInPeriod = txsInRange.reduce((sum, tx) => {
    const cad = txToCad(tx, cadRates);
    return sum + (tx.type === "deposit" ? cad : -cad);
  }, 0);

  let baseline = Math.max(0, val - netInPeriod);

  if (txsInRange.length === 0) {
    const multipliers = [0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 1];
    return multipliers.map((m, index) => {
      const bucketDate = new Date(start.getTime() + step * index);
      return {
        name: formatBucketLabel(bucketDate, range),
        value: Math.round(val * m),
      };
    });
  }

  let running = baseline;
  let txIndex = 0;

  return Array.from({ length: pointCount }, (_, index) => {
    const bucketEnd =
      index === pointCount - 1 ? end : new Date(start.getTime() + step * (index + 1));

    while (txIndex < txsInRange.length && txsInRange[txIndex].rawDate <= bucketEnd) {
      const tx = txsInRange[txIndex];
      const cad = txToCad(tx, cadRates);
      running += tx.type === "deposit" ? cad : -cad;
      txIndex += 1;
    }

    const bucketDate = new Date(start.getTime() + step * index);
    const value = index === pointCount - 1 ? val : Math.max(0, Math.round(running));

    return {
      name: formatBucketLabel(bucketDate, range),
      value,
    };
  });
}

function AllocationActiveShape(props: PieSectorDataItem) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = "#888",
  } = props;

  return (
    <g transform={`translate(0, -5)`}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={Number(outerRadius) + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))" }}
      />
    </g>
  );
}

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const [performanceRange, setPerformanceRange] = useState<PerformanceTimeRange>("1W");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [activeAllocationIndex, setActiveAllocationIndex] = useState<number | undefined>(undefined);
  const { data: metrics, isLoading: loadingBalance } = useDashboardMetrics();
  const { data: transactions = [], isLoading: loadingTx } = useRecentTransactions();
  const { data: allTransactions = [] } = useClientTransactions();

  const btcLogo = getCoinBySymbol("BTCUSDT")?.logoUrl;
  const ethLogo = getCoinBySymbol("ETHUSDT")?.logoUrl;
  const usdtLogo = "https://cryptologos.cc/logos/tether-usdt-logo.png";

  const cadRates = metrics?.cadRates ?? { BTC: 95000, ETH: 3500, USDT: 1.36 };
  const btcBalance = metrics?.btcBalance ?? 0;
  const ethBalance = metrics?.ethBalance ?? 0;
  const usdtBalance = metrics?.usdtBalance ?? 0;
  const portfolioValue = metrics?.portfolioValue ?? 0;
  const cadBalance = metrics?.cadBalance ?? 0;
  const thisMonthDeposits = metrics?.thisMonthDeposits ?? 0;
  const percentChange = metrics?.percentChange ?? 0;

  const btcValue = btcBalance * cadRates.BTC;
  const ethValue = ethBalance * cadRates.ETH;
  const usdtValue = usdtBalance * cadRates.USDT;
  const cadOnlyValue = Math.max(0, portfolioValue - btcValue - ethValue - usdtValue);

  const allocationData = useMemo(() => {
    const buildItem = (symbol: string, value: number) => {
      const grad = ASSET_GRADIENTS[symbol];
      return {
        name: grad.label,
        symbol,
        value,
        gradientId: grad.id,
        dotColor: grad.dot,
      };
    };

    if (portfolioValue === 0) {
      return [
        buildItem("BTC", 25000),
        buildItem("ETH", 18750),
        buildItem("USDT", 8000),
      ];
    }

    return [
      buildItem("BTC", btcValue),
      buildItem("ETH", ethValue),
      buildItem("USDT", usdtValue),
      ...(cadOnlyValue > 0 ? [buildItem("CAD", cadOnlyValue)] : []),
    ].filter((item) => item.value > 0);
  }, [btcValue, ethValue, usdtValue, cadOnlyValue, portfolioValue]);

  const allocationTotal = useMemo(
    () => allocationData.reduce((sum, item) => sum + item.value, 0),
    [allocationData],
  );

  const chartPerformanceData = useMemo(
    () =>
      buildPerformanceChartData(
        allTransactions,
        performanceRange,
        portfolioValue,
        cadRates,
        performanceRange === "Custom" ? customStartDate : null,
        performanceRange === "Custom" ? customEndDate : null,
      ),
    [
      allTransactions,
      performanceRange,
      portfolioValue,
      cadRates,
      customStartDate,
      customEndDate,
    ],
  );

  const yAxisDomain = useMemo(() => {
    const values = chartPerformanceData.map((point) => point.value);
    if (values.length === 0) return [0, 100];
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    return [minValue * 0.9, maxValue * 1.1];
  }, [chartPerformanceData]);

  const formatYAxisTick = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
  };

  const formatCadTooltip = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const renderAllocationLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-bold"
        style={{ pointerEvents: "none" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1855C0] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] text-blue-100/90 font-medium">Total Portfolio Value</span>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="hover:text-white text-blue-100/80 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <h1 className="text-4xl md:text-[44px] font-bold tracking-tight mb-2">
              {hideBalance ? (
                "$••,•••.••"
              ) : loadingBalance ? (
                <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
              ) : (
                `$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </h1>
            <div className="flex items-center gap-1.5 text-[14px]">
              <TrendingUp
                className={cn("w-4 h-4", percentChange >= 0 ? "text-[#FFD166]" : "text-red-400")}
              />
              <span
                className={cn(
                  "font-semibold",
                  percentChange >= 0 ? "text-[#FFD166]" : "text-red-400",
                )}
              >
                {percentChange >= 0 ? "+" : "-"}$
                {Math.abs(thisMonthDeposits).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ({percentChange >= 0 ? "+" : ""}
                {percentChange.toFixed(1)}%)
              </span>
              <span className="text-blue-200/80">this month</span>
            </div>
          </div>
          <div className="md:text-right">
            <span className="text-[13px] text-blue-100/90 font-medium">CAD Balance</span>
            <div className="text-xl md:text-2xl font-bold mt-1">
              {hideBalance ? (
                "$•,•••.••"
              ) : loadingBalance ? (
                <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
              ) : (
                `$${cadBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link
            href="/deposit"
            className="flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#FFD166] text-[#0A0F2C] rounded-xl py-3.5 font-bold text-[14px] transition-colors shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4" strokeWidth={2.5} />
            Deposit
          </Link>
          <Link
            href="/withdraw"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl py-3.5 font-bold text-[14px] transition-colors shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            Withdraw
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl p-6 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 bg-gradient-to-br from-[#1e3a8a]/95 to-[#0f172a]/90">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-[15px] font-bold text-white">Portfolio Performance</h2>
            <div className="flex flex-wrap gap-1.5">
              {PERFORMANCE_TIME_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setPerformanceRange(range)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all",
                    performanceRange === range
                      ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/30"
                      : "bg-transparent text-white/80 hover:text-white hover:bg-white/10",
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {performanceRange === "Custom" && (
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <DatePicker
                selected={customStartDate}
                onChange={(date) => setCustomStartDate(date)}
                selectsStart
                startDate={customStartDate}
                endDate={customEndDate}
                maxDate={customEndDate || new Date()}
                placeholderText="From date"
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium outline-none focus:border-[#60a5fa] w-[130px]"
                calendarClassName="!font-sans"
              />
              <span className="text-white/50 text-xs">→</span>
              <DatePicker
                selected={customEndDate}
                onChange={(date) => setCustomEndDate(date)}
                selectsEnd
                startDate={customStartDate}
                endDate={customEndDate}
                minDate={customStartDate || undefined}
                maxDate={new Date()}
                placeholderText="To date"
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium outline-none focus:border-[#60a5fa] w-[130px]"
                calendarClassName="!font-sans"
              />
            </div>
          )}

          <div
            className="h-[260px] w-full"
            style={{ transform: "perspective(1000px) rotateX(2deg)", transformOrigin: "center center" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="performanceAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#60a5fa" floodOpacity="1" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  domain={yAxisDomain}
                  tickFormatter={formatYAxisTick}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backgroundColor: "rgba(15, 23, 42, 0.92)",
                    backdropFilter: "blur(8px)",
                    color: "#f8fafc",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  formatter={(value) => [
                    formatCadTooltip(typeof value === "number" ? value : 0),
                    "CAD Value",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  fill="url(#performanceAreaGradient)"
                  dot={false}
                  isAnimationActive
                  animationDuration={1200}
                  animationEasing="ease-out"
                  style={{ filter: "url(#lineGlow)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-[15px] font-bold text-[#0A0F2C] mb-4">Asset Allocation</h2>
          <div className="flex-1 flex flex-col justify-between">
            <div
              className="h-[200px] w-full relative"
              style={{ transform: "perspective(800px) rotateX(25deg)", transformOrigin: "center 70%" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {Object.values(ASSET_GRADIENTS).map((grad) => (
                      <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={grad.light} />
                        <stop offset="100%" stopColor={grad.dark} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={2}
                    isAnimationActive
                    animationDuration={1000}
                    animationEasing="ease-out"
                    activeIndex={activeAllocationIndex}
                    activeShape={AllocationActiveShape}
                    onMouseEnter={(_, index) => setActiveAllocationIndex(index)}
                    onMouseLeave={() => setActiveAllocationIndex(undefined)}
                    label={renderAllocationLabel}
                    labelLine={false}
                  >
                    {allocationData.map((entry) => (
                      <Cell key={entry.symbol} fill={`url(#${entry.gradientId})`} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              {allocationData.map((item) => {
                const pct =
                  allocationTotal > 0
                    ? ((item.value / allocationTotal) * 100).toFixed(1)
                    : "0.0";
                return (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.dotColor }}
                      />
                      <span className="text-[13px] font-medium text-[#4A5568] truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="text-[13px] font-bold text-[#0A0F2C]">
                        ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-[#718096] font-semibold">{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <CoinLogo src={btcLogo} symbol="BTC" className="h-10 w-10 p-1.5" />
            <div className="bg-green-50 text-[#10B981] px-2 py-0.5 rounded text-[11px] font-bold border border-green-100">
              +12.3%
            </div>
          </div>
          <h3 className="text-[15px] font-bold text-[#0A0F2C] mb-1">Bitcoin</h3>
          <div className="text-[20px] font-bold text-[#0A0F2C] mb-0.5">
            ${btcValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#A0AEC0] font-medium">
            {btcBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <CoinLogo src={ethLogo} symbol="ETH" className="h-10 w-10 p-1.5" />
            <div className="bg-green-50 text-[#10B981] px-2 py-0.5 rounded text-[11px] font-bold border border-green-100">
              +8.37%
            </div>
          </div>
          <h3 className="text-[15px] font-bold text-[#0A0F2C] mb-1">Ethereum</h3>
          <div className="text-[20px] font-bold text-[#0A0F2C] mb-0.5">
            ${ethValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#A0AEC0] font-medium">
            {ethBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })} ETH
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <CoinLogo src={usdtLogo} symbol="USDT" className="h-10 w-10 p-1.5" />
            <div className="bg-gray-100 text-[#718096] px-2 py-0.5 rounded text-[11px] font-bold">
              0.0%
            </div>
          </div>
          <h3 className="text-[15px] font-bold text-[#0A0F2C] mb-1">Tether</h3>
          <div className="text-[20px] font-bold text-[#0A0F2C] mb-0.5">
            ${usdtValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#A0AEC0] font-medium">
            {usdtBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-[#0A0F2C]">Recent Transactions</h2>
          <button className="text-[12px] font-bold text-[#4A5568] hover:text-[#0A0F2C] transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {loadingTx ? (
            <div className="py-6 text-center text-sm text-[#718096]">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="py-6 text-center text-sm text-[#718096]">No recent transactions</div>
          ) : (
            transactions.map((tx, index) => {
              const isDeposit = tx.type === "Deposit";
              const dateStr = formatRelativeTime(tx.date);
              return (
                <React.Fragment key={tx.id}>
                  {index > 0 && <div className="h-px bg-gray-100 w-full" />}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          isDeposit ? "bg-green-50" : "bg-blue-50",
                        )}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="w-5 h-5 text-[#10B981]" strokeWidth={2.5} />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-[#113285]" strokeWidth={2.5} />
                        )}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[#0A0F2C]">
                          {tx.type}{" "}
                          {tx.status !== "approved" && tx.status !== "completed" && (
                            <span className="text-[10px] font-semibold text-[#718096] bg-gray-100 px-1.5 py-0.5 rounded ml-1.5 uppercase">
                              {tx.status}
                            </span>
                          )}
                        </div>
                        <div className="text-[12px] text-[#718096]">{tx.asset}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={cn(
                          "text-[14px] font-bold",
                          isDeposit ? "text-[#10B981]" : "text-[#0A0F2C]",
                        )}
                      >
                        {isDeposit ? "+" : "-"}
                        {tx.amount.toLocaleString()} {tx.asset}
                      </div>
                      <div className="text-[12px] text-[#A0AEC0]">{dateStr}</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
