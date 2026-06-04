"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, QrCode, TriangleAlert, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { CoinLogo } from "@/components/market/CoinLogo";
import { getCoinBySymbol } from "@/config/coins";

const walletsData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    balance: "0.45823",
    value: "$25,000.00",
    change: "+12.3%",
    changeType: "positive",
    network: "Bitcoin Network",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w1",
    image: getCoinBySymbol("BTCUSDT")?.logoUrl,
    activities: [
      { id: 1, type: "Deposit", time: "2 hours ago", amount: "+0.05 BTC", amountType: "positive", status: "Confirmed" },
      { id: 2, type: "Withdrawal", time: "1 day ago", amount: "-0.02 BTC", amountType: "negative", status: "Confirmed" },
      { id: 3, type: "Deposit", time: "3 days ago", amount: "+0.15 BTC", amountType: "positive", status: "Confirmed" },
    ]
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    balance: "7.8234",
    value: "$18,750.00",
    change: "+8.37%",
    changeType: "positive",
    network: "Ethereum Mainnet",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w1",
    image: getCoinBySymbol("ETHUSDT")?.logoUrl,
    activities: [
      { id: 1, type: "Deposit", time: "2 hours ago", amount: "+0.05 ETH", amountType: "positive", status: "Confirmed" },
      { id: 2, type: "Withdrawal", time: "1 day ago", amount: "-0.02 ETH", amountType: "negative", status: "Confirmed" },
      { id: 3, type: "Deposit", time: "3 days ago", amount: "+0.15 ETH", amountType: "positive", status: "Confirmed" },
    ]
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    balance: "8,000",
    value: "$8,000.00",
    change: "0.0%",
    changeType: "neutral",
    network: "ERC-20",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w1",
    image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    activities: [
      { id: 1, type: "Deposit", time: "2 hours ago", amount: "+0.05 USDT", amountType: "positive", status: "Confirmed" },
      { id: 2, type: "Withdrawal", time: "1 day ago", amount: "-0.02 USDT", amountType: "negative", status: "Confirmed" },
      { id: 3, type: "Deposit", time: "3 days ago", amount: "+0.15 USDT", amountType: "positive", status: "Confirmed" },
    ]
  }
];

export default function WalletsPage() {
  const [selectedWalletId, setSelectedWalletId] = useState("bitcoin");
  const selectedWallet = walletsData.find(w => w.id === selectedWalletId)!;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">My Wallets</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Manage your cryptocurrency wallets and addresses</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {walletsData.map(wallet => {
          const isSelected = wallet.id === selectedWalletId;
          return (
            <div
              key={wallet.id}
              onClick={() => setSelectedWalletId(wallet.id)}
              className={`cursor-pointer bg-white rounded-2xl p-6 transition-all ${
                isSelected 
                  ? "border-[2px] border-primary-blue shadow-sm" 
                  : "border border-gray-200 hover:border-gray-300 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <CoinLogo src={wallet.image} symbol={wallet.symbol} className="h-10 w-10 p-1.5" />
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  wallet.changeType === "positive" 
                    ? "bg-[#DCFCE7] text-[#16A34A]" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {wallet.change}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{wallet.name}</h3>
                <div className="text-[26px] font-bold text-gray-900 mt-0.5">{wallet.value}</div>
                <div className="text-sm text-gray-500 mt-1">{wallet.balance} {wallet.symbol}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Wallet Address Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Wallet Address</h2>
            <div className="px-3 py-1 bg-[#FFF9EE] text-[#E8A020] rounded-full text-xs font-medium">
              {selectedWallet.network}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Your {selectedWallet.name} Address</p>
            <div className="flex gap-3">
              <input 
                type="text" 
                readOnly 
                value={selectedWallet.address} 
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-mono text-gray-600 focus:outline-none"
              />
              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                <Copy className="w-5 h-5" />
              </button>
              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                <QrCode className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 bg-[#FFF9EE] rounded-xl p-5 border border-orange-100/50">
            <div className="flex items-center gap-2 text-[#E8A020] font-semibold text-sm">
              <TriangleAlert className="w-4 h-4" />
              Important Instructions
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 list-disc pl-5">
              <li>Only send {selectedWallet.name} to this address</li>
              <li>Minimum deposit: 0.001 {selectedWallet.symbol}</li>
              <li>Requires 3 network confirmations</li>
              <li>Always verify the address before sending</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              href={`/deposit?asset=${selectedWallet.symbol}`}
              className="flex-1 bg-primary-blue hover:bg-blue-800 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowDownLeft className="w-5 h-5" />
              Deposit {selectedWallet.symbol}
            </Link>
            <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
              Withdraw {selectedWallet.symbol}
            </button>
          </div>
        </div>

        {/* Network Information Section */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Network Information</h2>
          <div className="space-y-5">
            <div>
              <p className="text-xs text-gray-500 mb-1">Network</p>
              <p className="text-sm font-semibold text-gray-900">{selectedWallet.network}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Cryptocurrency</p>
              <p className="text-sm font-semibold text-gray-900">{selectedWallet.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Symbol</p>
              <p className="text-sm font-semibold text-gray-900">{selectedWallet.symbol}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Balance</p>
              <p className="text-sm font-semibold text-gray-900">{selectedWallet.balance} {selectedWallet.symbol}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">CAD Value</p>
              <p className="text-sm font-semibold text-gray-900">{selectedWallet.value}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent {selectedWallet.name} Activity</h2>
        <div className="space-y-6">
          {selectedWallet.activities.map(activity => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === "Deposit" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#E0E7FF] text-primary-blue"
                }`}>
                  {activity.type === "Deposit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{activity.type}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  activity.amountType === "positive" ? "text-[#16A34A]" : "text-gray-900"
                }`}>
                  {activity.amount}
                </p>
                <div className="mt-1">
                  <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] rounded-full text-[10px] font-semibold uppercase tracking-wide">
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
