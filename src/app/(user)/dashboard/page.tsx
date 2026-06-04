"use client";

import React, { useState } from "react";
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

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const btcLogo = getCoinBySymbol("BTCUSDT")?.logoUrl;
  const ethLogo = getCoinBySymbol("ETHUSDT")?.logoUrl;
  const usdtLogo = "https://cryptologos.cc/logos/tether-usdt-logo.png";

  return (
    <div className="space-y-6">
      
      {/* 1. Main Balance Card */}
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
              {hideBalance ? "$••,•••.••" : "$51,750.00"}
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
              {hideBalance ? "$•,•••.••" : "$8,000.00"}
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

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        
        {/* Line Chart */}
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
                  ticks={[0, 15000, 30000, 45000, 60000]}
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

        {/* Donut Chart */}
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
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Balances Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bitcoin Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <CoinLogo src={btcLogo} symbol="BTC" className="h-10 w-10 p-1.5" />
            <div className="bg-green-50 text-[#10B981] px-2 py-0.5 rounded text-[11px] font-bold border border-green-100">
              +12.3%
            </div>
          </div>
          <h3 className="text-[15px] font-bold text-[#0A0F2C] mb-1">Bitcoin</h3>
          <div className="text-[20px] font-bold text-[#0A0F2C] mb-0.5">${(25000).toLocaleString()}</div>
          <div className="text-[11px] text-[#A0AEC0] font-medium">0.45823 BTC</div>
        </div>

        {/* Ethereum Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <CoinLogo src={ethLogo} symbol="ETH" className="h-10 w-10 p-1.5" />
            <div className="bg-green-50 text-[#10B981] px-2 py-0.5 rounded text-[11px] font-bold border border-green-100">
              +8.37%
            </div>
          </div>
          <h3 className="text-[15px] font-bold text-[#0A0F2C] mb-1">Ethereum</h3>
          <div className="text-[20px] font-bold text-[#0A0F2C] mb-0.5">${(18750).toLocaleString()}</div>
          <div className="text-[11px] text-[#A0AEC0] font-medium">7.8234 ETH</div>
        </div>

        {/* Tether Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <CoinLogo src={usdtLogo} symbol="USDT" className="h-10 w-10 p-1.5" />
            <div className="bg-gray-100 text-[#718096] px-2 py-0.5 rounded text-[11px] font-bold">
              0.0%
            </div>
          </div>
          <h3 className="text-[15px] font-bold text-[#0A0F2C] mb-1">Tether</h3>
          <div className="text-[20px] font-bold text-[#0A0F2C] mb-0.5">${(8000).toLocaleString()}</div>
          <div className="text-[11px] text-[#A0AEC0] font-medium">8,000 USDT</div>
        </div>
      </div>

      {/* 4. Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-[#0A0F2C]">Recent Transactions</h2>
          <button className="text-[12px] font-bold text-[#4A5568] hover:text-[#0A0F2C] transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          
          {/* TX 1 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-[#10B981]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#0A0F2C]">Deposit</div>
                <div className="text-[12px] text-[#718096]">BTC</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-bold text-[#10B981]">+5,000 CAD</div>
              <div className="text-[12px] text-[#A0AEC0]">2 hours ago</div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* TX 2 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-[#113285]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#0A0F2C]">Withdrawal</div>
                <div className="text-[12px] text-[#718096]">ETH</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-bold text-[#0A0F2C]">-1,250 CAD</div>
              <div className="text-[12px] text-[#A0AEC0]">5 hours ago</div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* TX 3 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-[#10B981]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#0A0F2C]">Deposit</div>
                <div className="text-[12px] text-[#718096]">USDT</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-bold text-[#10B981]">+3,000 CAD</div>
              <div className="text-[12px] text-[#A0AEC0]">1 day ago</div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* TX 4 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-[#113285]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#0A0F2C]">Withdrawal</div>
                <div className="text-[12px] text-[#718096]">BTC</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-bold text-[#0A0F2C]">-500 CAD</div>
              <div className="text-[12px] text-[#A0AEC0]">2 days ago</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
