"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Eye, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { CoinLogo } from "@/components/market/CoinLogo";
import { getCoinBySymbol } from "@/config/coins";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const performanceData = [
  { name: "Mon", value: 49000 },
  { name: "Tue", value: 15500 },
  { name: "Wed", value: 49000 },
  { name: "Thu", value: 29000 },
  { name: "Fri", value: 52000 },
  { name: "Sat", value: 5000 },
  { name: "Sun", value: 52000 },
];

const allocationData = [
  { name: "Bitcoin", value: 25000, color: "#1E40AF" },
  { name: "Ethereum", value: 18750, color: "#2563EB" },
  { name: "USDT", value: 8000, color: "#F5A623" },
];

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

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const btcLogo = getCoinBySymbol("BTCUSDT")?.logoUrl;
  const ethLogo = getCoinBySymbol("ETHUSDT")?.logoUrl;
  const usdtLogo = "https://cryptologos.cc/logos/tether-usdt-logo.png";

  const supabase = createClient();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  const [btcBalance, setBtcBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  
  const [prices, setPrices] = useState<Record<string, number>>({
    BTC: 60000,
    ETH: 3000,
    USDT: 1,
  });

  const [portfolioValue, setPortfolioValue] = useState(0);
  const [cadBalance, setCadBalance] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoadingTx(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch live crypto prices in USD from Binance ticker
        let btcPrice = 60000;
        let ethPrice = 3000;
        try {
          const btcRes = await fetch("/api/market/ticker?symbol=BTCUSDT");
          if (btcRes.ok) {
            const btcData = await btcRes.json();
            btcPrice = Number(btcData.lastPrice) || 60000;
          }
          const ethRes = await fetch("/api/market/ticker?symbol=ETHUSDT");
          if (ethRes.ok) {
            const ethData = await ethRes.json();
            ethPrice = Number(ethData.lastPrice) || 3000;
          }
        } catch (err) {
          console.error("Failed to fetch live prices:", err);
        }
        setPrices({ BTC: btcPrice, ETH: ethPrice, USDT: 1 });

        // 2. Fetch user wallet balances from Supabase
        const { data: userWallets, error: walletsErr } = await supabase
          .from("user_wallets")
          .select("*")
          .eq("user_id", user.id);

        if (!walletsErr && userWallets) {
          const btcBal = Number(userWallets.find((w: any) => w.currency === "BTC")?.balance || 0);
          const ethBal = Number(userWallets.find((w: any) => w.currency === "ETH")?.balance || 0);
          const usdtBal = Number(userWallets.find((w: any) => w.currency === "USDT")?.balance || 0);

          setBtcBalance(btcBal);
          setEthBalance(ethBal);
          setUsdtBalance(usdtBal);

          const btcVal = btcBal * btcPrice;
          const ethVal = ethBal * ethPrice;
          const usdtVal = usdtBal;

          const total = btcVal + ethVal + usdtVal;
          setPortfolioValue(total);
          setCadBalance(usdtVal); 
        }

        // 3. Fetch deposits
        const { data: deposits, error: depErr } = await supabase
          .from("deposit_requests")
          .select("id, asset, expected_amount, status, created_at, tx_hash")
          .eq("user_id", user.id);

        // 4. Fetch withdrawals
        const { data: withdrawals, error: wdrErr } = await supabase
          .from("withdrawal_requests")
          .select("id, amount, status, created_at, interac_email")
          .eq("user_id", user.id);

        const dbError = (depErr && depErr.code === "PGRST205") || (wdrErr && wdrErr.code === "PGRST205");

        if (dbError) {
          setTransactions([
            { id: "1", type: "Deposit", asset: "BTC", amount: 5000, status: "approved", date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
            { id: "2", type: "Withdrawal", asset: "ETH", amount: 1250, status: "completed", date: new Date(Date.now() - 5 * 60 * 60 * 1000) },
            { id: "3", type: "Deposit", asset: "USDT", amount: 3000, status: "approved", date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            { id: "4", type: "Withdrawal", asset: "BTC", amount: 500, status: "completed", date: new Date(Date.now() - 48 * 60 * 60 * 1000) },
          ]);
          return;
        }

        const list: any[] = [];
        if (deposits) {
          deposits.forEach((d) => {
            list.push({
              id: d.id,
              type: "Deposit",
              asset: d.asset,
              amount: d.expected_amount,
              status: d.status,
              date: new Date(d.created_at),
              ref: d.tx_hash,
            });
          });
        }
        if (withdrawals) {
          withdrawals.forEach((w) => {
            list.push({
              id: w.id,
              type: "Withdrawal",
              asset: "CAD",
              amount: w.amount,
              status: w.status,
              date: new Date(w.created_at),
              ref: w.interac_email,
            });
          });
        }

        list.sort((a, b) => b.date.getTime() - a.date.getTime());
        setTransactions(list.slice(0, 4));
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoadingTx(false);
      }
    }
    loadDashboardData();
  }, [supabase]);

  const btcValue = btcBalance * prices.BTC;
  const ethValue = ethBalance * prices.ETH;
  const usdtValue = usdtBalance;

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
              {hideBalance ? "$••,•••.••" : `$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h1>
            <div className="flex items-center gap-1.5 text-[14px]">
              <TrendingUp className="w-4 h-4 text-[#FFD166]" />
              <span className="text-[#FFD166] font-semibold">+$3,250 (6.7%)</span>
              <span className="text-blue-200/80">this month</span>
            </div>
          </div>
          <div className="md:text-right">
            <span className="text-[13px] text-blue-100/90 font-medium">CAD Balance</span>
            <div className="text-xl md:text-2xl font-bold mt-1">
              {hideBalance ? "$•,•••.••" : `$${cadBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0A0F2C] mb-6">Portfolio Performance</h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={true} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#A0AEC0' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={true} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#A0AEC0' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#113285" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#113285", strokeWidth: 0 }} 
                  activeDot={{ r: 6, fill: "#113285" }} 
                />
              </LineChart>
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
