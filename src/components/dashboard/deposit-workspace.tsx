"use client";

import { useState } from "react";
import { AlertTriangle, Copy, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import QRCode from "react-qr-code";

const assets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    network: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    minDeposit: "0.001 BTC",
    confirmations: "3",
    arrivalTime: "30 mins",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    network: "ETH",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    minDeposit: "0.001 ETH",
    confirmations: "3",
    arrivalTime: "30 mins",
  },
  {
    symbol: "USDT",
    name: "Tether",
    network: "USDT",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    minDeposit: "0.001 USDT",
    confirmations: "3",
    arrivalTime: "30 mins",
  },
];

export function DepositWorkspace() {
  const [assetSymbol, setAssetSymbol] = useState("BTC");

  const asset = assets.find((a) => a.symbol === assetSymbol) || assets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.address);
  };

  return (
    <div className="mx-auto w-full max-w-[1024px]">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/wallets" 
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-[20px] w-[20px]" strokeWidth={2} />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0A0F2C]">Deposit Cryptocurrency</h1>
          <p className="text-[14px] text-[#718096]">Add funds to your wallet</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left Column */}
        <div className="sticky top-[112px] self-start rounded-[20px] border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h2 className="mb-4 lg:mb-5 text-[15px] font-bold text-[#0A0F2C]">Select Cryptocurrency</h2>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-3 lg:gap-2.5 pb-2 lg:pb-0 no-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0">
            {assets.map((item) => {
              const isActive = assetSymbol === item.symbol;
              return (
                <button
                  key={item.symbol}
                  onClick={() => setAssetSymbol(item.symbol)}
                  className={cn(
                    "flex shrink-0 flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-3.5 rounded-[16px] lg:rounded-[14px] p-4 lg:p-3.5 text-left transition-all w-[120px] sm:w-[140px] lg:w-full",
                    isActive
                      ? "bg-[#113285] shadow-[0_4px_12px_rgba(17,50,133,0.2)] border border-transparent"
                      : "bg-[#F8F9FA] lg:bg-[#F1F5F9] border border-gray-100 lg:border-transparent hover:bg-gray-100"
                  )}
                >
                  <div className={cn(
                    "flex h-[28px] w-[28px] lg:h-[24px] lg:w-[24px] shrink-0 items-center justify-center",
                    isActive ? "text-white" : "text-[#0A0F2C]"
                  )}>
                    {item.symbol === "BTC" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                        <path d="M11.767 19.089c4.924.869 6.176-6.07 4.213-7.154 4.04-1.792 3.106-7.925-1.415-8.731V1.19h-2.272v1.944h-1.583V1.19H8.441v1.993H5.321v2.548h1.233c1.47 0 1.62.906 1.579 1.815v7.697c.05.908-.109 1.815-1.58 1.815H5.321v2.548h3.12v2.028h2.269v-2.028h1.583v2.028h2.271v-2.028h-.116z" />
                        <path d="M10.155 5.682h2.272c2.053 0 2.053 3.12 0 3.12h-2.272v-3.12z" />
                        <path d="M10.155 11.237h2.556c2.43 0 2.43 3.497 0 3.497h-2.556v-3.497z" />
                      </svg>
                    )}
                    {item.symbol === "ETH" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                        <path d="M11.999 1.125L5.25 12l6.749 4.125L18.75 12l-6.751-10.875z" />
                        <path d="M11.999 17.625L5.25 13.5l6.749 9 6.751-9-6.751 4.125z" />
                      </svg>
                    )}
                    {item.symbol === "USDT" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                        <path d="M12 13c3.866 0 7-1.343 7-3s-3.134-3-7-3-7 1.343-7 3 3.134 3 7 3z" />
                        <path d="M12 13v9" />
                        <path d="M8 7h8" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-[14px] font-bold leading-tight", isActive ? "text-white" : "text-[#0A0F2C]")}>{item.name}</p>
                    <p className={cn("text-[12px] font-medium mt-[2px] lg:mt-[1px]", isActive ? "text-blue-100" : "text-[#718096]")}>{item.symbol}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[18px] font-bold text-[#0A0F2C]">Deposit {asset.name}</h2>
            <div className="inline-flex rounded-full bg-[#FFF9EA] px-3 py-1 border border-[#FFEDCC]">
              <p className="text-[12px] font-bold tracking-wide text-[#F5A524]">Network: {asset.network}</p>
            </div>
          </div>

          {/* QR Code container */}
          <div className="mb-10 flex justify-center">
            <QRCode 
              value={asset.address}
              size={240}
              style={{ height: "auto", maxWidth: "100%", width: "240px" }}
              viewBox={`0 0 256 256`}
            />
          </div>

          {/* Wallet Address section */}
          <div className="mb-8">
            <p className="mb-3 text-[14px] font-bold text-[#0A0F2C]">Wallet Address</p>
            <div className="flex gap-3">
              <div className="flex-1 rounded-[12px] border border-gray-100 bg-[#F8F9FA] px-4 py-3.5">
                <p className="text-[13px] font-mono font-medium text-[#4A5568] break-all">
                  {asset.address}
                </p>
              </div>
              <button 
                onClick={handleCopy}
                className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                title="Copy Address"
              >
                <Copy className="h-[18px] w-[18px] text-[#4A5568]" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="mb-8 rounded-[16px] bg-[#FFF9EA] p-5 sm:p-6 border border-[#FFEDCC]">
            <h3 className="mb-4 flex items-center gap-2.5 text-[15px] font-bold text-[#F5A524]">
              <AlertTriangle className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Important Instructions
            </h3>
            <ul className="space-y-3.5">
              {[
                `Send only ${asset.name} (${asset.symbol}) to this address`,
                `Minimum deposit: ${asset.minDeposit}`,
                `Requires ${asset.confirmations} network confirmations`,
                `Funds typically arrive within ${asset.arrivalTime}`,
                `Always verify the address before sending`
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] font-medium text-[#718096]">
                  <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#A0AEC0]"></span>
                  <span className="leading-relaxed text-[#4A5568]">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deposit Status */}
          <div className="rounded-[16px] bg-[#F8F9FA] p-5 sm:p-6">
            <h3 className="mb-5 text-[15px] font-bold text-[#0A0F2C]">Deposit Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-[#718096]">Network</p>
                <div className="rounded-full bg-[#E6F8EF] px-3 py-1">
                  <p className="text-[12px] font-bold tracking-wide text-[#22C55E]">Active</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-[#718096]">Confirmations Required</p>
                <p className="text-[15px] font-bold text-[#0A0F2C]">{asset.confirmations}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-[#718096]">Estimated Time</p>
                <p className="text-[15px] font-bold text-[#0A0F2C]">~{asset.arrivalTime}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
