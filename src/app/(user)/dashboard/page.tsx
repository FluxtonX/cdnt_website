"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";
import {
  PageTitle,
  Panel,
  PerformanceChart,
  TransactionTable,
} from "@/components/dashboard/blocks";
import { MarketStrip } from "@/components/dashboard/market-strip";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { portfolioAssets, transactions } from "@/data/mock";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const [activeAsset, setActiveAsset] = useState<string | null>(null);

  // Hardcoded values from user's mockup image
  const totalPortfolioValue = "$51,750.00";
  const cadBalance = "$8,000.00";
  
  const portfolioValueVisible = hideBalance ? "$••,•••.••" : totalPortfolioValue;
  const cadBalanceVisible = hideBalance ? "$••,•••.••" : cadBalance;

  // Let's compute overall assets sum dynamically for the donut center
  const totalAssetsSum = portfolioAssets.reduce((sum, asset) => {
    const val = parseFloat(asset.value.replace(/[$,]/g, ""));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  // Colors mapping for top assets
  const assetColors: Record<string, { stroke: string; bg: string }> = {
    BTC: { stroke: "#F5A623", bg: "bg-[#F5A623]" },
    ETH: { stroke: "#3B82F6", bg: "bg-[#3B82F6]" },
    USDT: { stroke: "#10B981", bg: "bg-[#10B981]" },
    BNB: { stroke: "#F0B90B", bg: "bg-[#F0B90B]" },
    SOL: { stroke: "#14F195", bg: "bg-[#14F195]" },
    XRP: { stroke: "#64748B", bg: "bg-[#64748B]" },
    ADA: { stroke: "#4F46E5", bg: "bg-[#4F46E5]" },
    DOGE: { stroke: "#EC4899", bg: "bg-[#EC4899]" },
  };

  // SVG Donut Calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74
  
  // Let's prepare donut segments based on allocations
  let accumulatedPercent = 0;
  const donutSegments = portfolioAssets.map((asset) => {
    const strokeLength = circumference * (asset.allocation / 100);
    const strokeOffset = -circumference * (accumulatedPercent / 100);
    accumulatedPercent += asset.allocation;
    const colors = assetColors[asset.symbol] || { stroke: "#94A3B8", bg: "bg-[#94A3B8]" };
    return {
      symbol: asset.symbol,
      strokeDasharray: `${strokeLength} ${circumference}`,
      strokeDashoffset: strokeOffset,
      stroke: colors.stroke,
    };
  });

  const activeAssetData = activeAsset 
    ? portfolioAssets.find(a => a.symbol === activeAsset) 
    : null;

  return (
    <>
      {/* 1. Header Greeting Section */}
      <PageTitle
        title="Welcome back, Sarah"
        description="Here's what's happening with your portfolio today"
      />

      {/* 2. Top Blue Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B2F8F] via-[#014EA1] to-[#003B7A] p-6 md:p-8 text-white shadow-xl shadow-banking-blue/20 mb-8 border border-white/10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          {/* Left Block */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                Total Portfolio Value
              </span>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="rounded p-1 hover:bg-white/10 transition-colors"
                title={hideBalance ? "Show balance" : "Hide balance"}
              >
                {hideBalance ? (
                  <EyeOff className="h-4.5 w-4.5 text-white/70 hover:text-white" />
                ) : (
                  <Eye className="h-4.5 w-4.5 text-white/70 hover:text-white" />
                )}
              </button>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-1 tabular-nums text-white">
              {portfolioValueVisible}
            </h2>
            
            <div className="text-emerald-300 text-xs md:text-sm font-bold flex items-center gap-1.5 mt-2 bg-white/5 py-1 px-2.5 rounded-full w-fit">
              <TrendingUp className="h-4 w-4" />
              <span>+$3,250 (6.7%) this month</span>
            </div>
          </div>

          {/* Right Block */}
          <div className="md:text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70 block">
              CAD Balance
            </span>
            <span className="text-xl md:text-3xl font-extrabold mt-1 block tabular-nums text-white">
              {cadBalanceVisible}
            </span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link
            href="/deposit"
            className="flex items-center justify-center gap-2 rounded-xl bg-banking-gold text-banking-ink py-4 px-6 font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-md active:scale-98"
          >
            <ArrowDownLeft className="h-4.5 w-4.5 stroke-[3px]" />
            Deposit
          </Link>
          <Link
            href="/withdraw"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 px-6 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-98"
          >
            <ArrowUpRight className="h-4.5 w-4.5 stroke-[3px]" />
            Withdraw
          </Link>
        </div>
      </div>

      {/* 3. MarketStrip section (Premium tickers) */}
      <MarketStrip />

      {/* 4. Portfolio Performance Spline Graph (Full Width) */}
      <div className="mt-8">
        <Panel title="Portfolio Performance">
          <PerformanceChart />
        </Panel>
      </div>

      {/* 5. Asset Allocation & Distribution (Row Form) */}
      <div className="mt-8">
        <Panel title="Asset Allocation & Distribution">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 items-center">
            {/* Left: SVG Donut Chart */}
            <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-banking-border/50 pb-6 lg:pb-0 lg:pr-8 shrink-0">
              <div className="relative w-36 h-36">
                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full transform -rotate-90 overflow-visible"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                  />
                  {donutSegments.map((segment) => {
                    const isActive = activeAsset === segment.symbol;
                    return (
                      <circle
                        key={segment.symbol}
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={segment.stroke}
                        strokeWidth={isActive ? 14 : 10}
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        strokeLinecap="butt"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveAsset(segment.symbol)}
                        onMouseLeave={() => setActiveAsset(null)}
                        onClick={() => setActiveAsset(activeAsset === segment.symbol ? null : segment.symbol)}
                      />
                    );
                  })}
                </svg>
                {/* Center Text inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 select-none pointer-events-none">
                  {activeAssetData ? (
                    <>
                      <span 
                        className="text-xs font-black uppercase tracking-wider leading-none"
                        style={{ color: assetColors[activeAssetData.symbol]?.stroke || "#000" }}
                      >
                        {activeAssetData.symbol}
                      </span>
                      <span className="text-[10px] font-black text-banking-muted mt-1.5 leading-none">
                        {activeAssetData.allocation}%
                      </span>
                      <span className="text-[9px] font-extrabold text-banking-ink mt-1 leading-none truncate max-w-[80px]">
                        {hideBalance ? "$••••••" : activeAssetData.value.split(".")[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-black tracking-widest text-banking-muted uppercase leading-none">
                        Portfolio
                      </span>
                      <span className="text-sm font-extrabold text-banking-ink mt-1.5 leading-none">
                        ${(totalAssetsSum / 1000).toFixed(1)}k
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Horizontal Grid of Mini Asset Cards */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
              {portfolioAssets.map((asset) => {
                const colors = assetColors[asset.symbol] || { stroke: "#94A3B8", bg: "bg-[#94A3B8]" };
                const isHovered = activeAsset === asset.symbol;
                return (
                  <div
                    key={asset.symbol}
                    onMouseEnter={() => setActiveAsset(asset.symbol)}
                    onMouseLeave={() => setActiveAsset(null)}
                    onClick={() => setActiveAsset(activeAsset === asset.symbol ? null : asset.symbol)}
                    className={cn(
                      "rounded-xl border border-banking-border bg-banking-offWhite/30 p-4 transition-all border-b-2 border-r-2 cursor-pointer select-none",
                      isHovered 
                        ? "bg-white shadow-lg border-b-4 border-r-4 -translate-y-0.5 scale-[1.02]" 
                        : "hover:bg-white hover:border-banking-blue/20"
                    )}
                    style={{
                      borderColor: isHovered ? colors.stroke : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", colors.bg)} />
                        <span className="font-extrabold text-xs text-banking-ink">
                          {asset.symbol}
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-banking-blue bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {asset.allocation}%
                      </span>
                    </div>

                    <div className="mt-3.5">
                      <p className="text-xs font-black text-banking-ink leading-none">
                        {hideBalance ? "$••••••" : asset.value}
                      </p>
                      <p className="text-[10px] font-bold text-banking-muted uppercase tracking-tight mt-1 leading-none">
                        {asset.balance} {asset.symbol}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden border border-banking-border/30 mt-3.5">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", colors.bg)}
                        style={{ width: `${asset.allocation}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      </div>

      {/* 6. Recent Activity (Full Width Row) */}
      <div className="mt-8">
        <Panel
          title="Recent Activity"
          action={
            <Link
              href="/transactions"
              className="text-[10px] font-black uppercase tracking-widest text-banking-blue hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
            >
              Transaction Ledger
            </Link>
          }
        >
          <TransactionTable rows={transactions.slice(0, 5)} />
        </Panel>
      </div>

      {/* 7. Quick Shortcuts Horizontal Block */}
      <div className="mt-8">
        <Panel title="Quick Navigation Shortcuts">
          <QuickActions />
        </Panel>
      </div>
    </>
  );
}
