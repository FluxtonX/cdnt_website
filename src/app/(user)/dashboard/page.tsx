"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Eye,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp
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
  Cell
} from "recharts";
import { useDashboardMetrics, useRecentTransactions } from "@/hooks/useClientQueries";
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

type PerformanceTimeRange = "1D" | "1W" | "1M" | "3M" | "YTD" | "1Y" | "MAX";

const PERFORMANCE_TIME_RANGES: PerformanceTimeRange[] = ["1D", "1W", "1M", "3M", "YTD", "1Y", "MAX"];

const PERFORMANCE_LABELS: Record<PerformanceTimeRange, string[]> = {
  "1D": ["9a", "11a", "1p", "3p", "5p", "7p", "9p"],
  "1W": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "1M": ["W1", "W2", "W3", "W4", "W5", "W6", "Now"],
  "3M": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Now"],
  "YTD": ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Now"],
  "1Y": ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Now"],
  "MAX": ["Y1", "Y2", "Y3", "Y4", "Y5", "Y6", "Now"],
};

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const [performanceRange, setPerformanceRange] = useState<PerformanceTimeRange>("1W");
  const { data: metrics, isLoading: loadingBalance } = useDashboardMetrics();
  const { data: transactions = [], isLoading: loadingTx } = useRecentTransactions();

  const btcLogo = getCoinBySymbol("BTCUSDT")?.logoUrl;
  const ethLogo = getCoinBySymbol("ETHUSDT")?.logoUrl;
  const usdtLogo = "https://cryptologos.cc/logos/tether-usdt-logo.png";

  const prices = metrics?.prices ?? { BTC: 60000, ETH: 3000, USDT: 1 };
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

  const allocationData = useMemo(() => {
    if (portfolioValue === 0) {
      return [
        { name: "Bitcoin", value: 25000, color: "#1E40AF" },
        { name: "Ethereum", value: 18750, color: "#2563EB" },
        { name: "USDT", value: 8000, color: "#F5A623" },
      ];
    }
    return [
      { name: "Bitcoin", value: btcValue, color: "#1E40AF" },
      { name: "Ethereum", value: ethValue, color: "#2563EB" },
      { name: "USDT", value: usdtValue, color: "#F5A623" },
    ].filter(item => item.value > 0);
  }, [btcValue, ethValue, usdtValue, portfolioValue]);

  const performanceData = useMemo(() => {
    const val = portfolioValue || 51750.00;
    return [
      { name: "Mon", value: Math.round(val * 0.95) },
      { name: "Tue", value: Math.round(val * 0.93) },
      { name: "Wed", value: Math.round(val * 0.95) },
      { name: "Thu", value: Math.round(val * 0.96) },
      { name: "Fri", value: Math.round(val * 0.98) },
      { name: "Sat", value: Math.round(val * 0.97) },
      { name: "Sun", value: Math.round(val) },
    ];
  }, [portfolioValue]);

  const chartPerformanceData = useMemo(() => {
    const labels = PERFORMANCE_LABELS[performanceRange];
    return performanceData.map((point, index) => ({
      ...point,
      name: labels[index] ?? point.name,
    }));
  }, [performanceData, performanceRange]);

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

  return (
    <div className="space-y-6">

      <div className="bg-[#1855C0] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] text-blue-100/90 font-medium">Total Portfolio Value</span>
              <button onClick={() => setHideBalance(!hideBalance)} className="hover:text-white text-blue-100/80 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <h1 className="text-4xl md:text-[44px] font-bold tracking-tight mb-2">
               {hideBalance ? "$••,•••.••" : loadingBalance ? <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div> : `$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h1>
            <div className="flex items-center gap-1.5 text-[14px]">
              <TrendingUp className={cn("w-4 h-4", percentChange >= 0 ? "text-[#FFD166]" : "text-red-400")} />
              <span className={cn("font-semibold", percentChange >= 0 ? "text-[#FFD166]" : "text-red-400")}>
                {percentChange >= 0 ? "+" : "-"}${Math.abs(thisMonthDeposits).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({percentChange >= 0 ? "+" : ""}{percentChange.toFixed(1)}%)
              </span>
              <span className="text-blue-200/80">this month</span>
            </div>
          </div>
          <div className="md:text-right">
            <span className="text-[13px] text-blue-100/90 font-medium">CAD Balance</span>
            <div className="text-xl md:text-2xl font-bold mt-1">
               {hideBalance ? "$•,•••.••" : loadingBalance ? <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div> : `$${cadBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link href="/deposit" className="flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#FFD166] text-[#0A0F2C] rounded-xl py-3.5 font-bold text-[14px] transition-colors shadow-sm">
            <ArrowDownLeft className="w-4 h-4" strokeWidth={2.5} />
            Deposit
          </Link>
          <Link href="/withdraw" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl py-3.5 font-bold text-[14px] transition-colors shadow-sm">
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            Withdraw
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ background: "#0d1b3e", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-[15px] font-bold text-white">Portfolio Performance</h2>
            <div className="flex flex-wrap gap-1.5">
              {PERFORMANCE_TIME_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setPerformanceRange(range)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors",
                    performanceRange === range
                      ? "bg-[#113285] text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
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
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: "#0a1628",
                    color: "#f8fafc",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  formatter={(value: number) => [formatCadTooltip(value), "CAD Value"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-[15px] font-bold text-[#0A0F2C] mb-4">Asset Allocation</h2>
          <div className="flex-1 flex flex-col justify-between">
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-4">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[13px] text-[#4A5568]">{item.name}</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#0A0F2C]">
                    ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
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
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        isDeposit ? "bg-green-50" : "bg-blue-50"
                      )}>
                        {isDeposit ? (
                          <ArrowDownLeft className="w-5 h-5 text-[#10B981]" strokeWidth={2.5} />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-[#113285]" strokeWidth={2.5} />
                        )}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[#0A0F2C]">
                          {tx.type} {tx.status !== "approved" && tx.status !== "completed" && (
                            <span className="text-[10px] font-semibold text-[#718096] bg-gray-100 px-1.5 py-0.5 rounded ml-1.5 uppercase">
                              {tx.status}
                            </span>
                          )}
                        </div>
                        <div className="text-[12px] text-[#718096]">{tx.asset}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-[14px] font-bold",
                        isDeposit ? "text-[#10B981]" : "text-[#0A0F2C]"
                      )}>
                        {isDeposit ? "+" : "-"}{tx.amount.toLocaleString()} {tx.asset}
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
