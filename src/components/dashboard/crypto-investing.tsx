"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Copy, QrCode, Check, TriangleAlert, Bitcoin, Coins } from "lucide-react";
import { CoinLogo } from "@/components/market/CoinLogo";
import { useClientWallets } from "@/hooks/useClientQueries";
import { QRCodeSVG } from "qrcode.react";

export function CryptoInvesting() {
  const { data: wallets = [], isLoading: loading } = useClientWallets();
  // Filter out CAD wallets - CAD is fiat and belongs in Accounts Summary, not Crypto
  const cryptoWallets = wallets.filter(w => w.symbol !== "CAD");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);

  const selectedWallet = cryptoWallets.find(w => w.id === selectedWalletId) || cryptoWallets[0];

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-1">
              <Bitcoin className="w-4 h-4 text-amber-400" /> Digital Assets & Crypto
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Crypto Investing</h1>
            <p className="text-slate-300 text-sm mt-1">Manage cryptocurrency wallets, deposit funds, and execute Buy/Sell trades</p>
          </div>
          <div className="hidden sm:flex gap-3">
            <Link
              href="/deposit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition-colors inline-flex items-center gap-2"
            >
              <ArrowDownLeft className="w-4 h-4" /> Deposit Crypto
            </Link>
            <Link
              href="/exchange"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors inline-flex items-center gap-2"
            >
              <Coins className="w-4 h-4" /> Buy / Sell
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-[148px] animate-pulse" />
          ))}
        </div>
      ) : cryptoWallets.length > 0 ? (
        <>
          {/* Wallets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cryptoWallets.map((wallet) => {
              const isSelected = wallet.id === (selectedWalletId || cryptoWallets[0]?.id);
              return (
                <div
                  key={wallet.id}
                  onClick={() => setSelectedWalletId(wallet.id)}
                  className={`cursor-pointer bg-white rounded-2xl p-6 transition-all ${
                    isSelected
                      ? "border-[2px] border-indigo-600 shadow-md scale-[1.01]"
                      : "border border-gray-200 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    {wallet.symbol === "CAD" ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-bold text-lg">$</span>
                      </div>
                    ) : (
                      <CoinLogo src={wallet.image} symbol={wallet.symbol} className="h-10 w-10 p-1.5" />
                    )}
                    <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                      {wallet.change || "Crypto"}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{wallet.name}</h3>
                    <div className="text-2xl font-bold text-gray-900 mt-0.5">
                      {wallet.symbol === "CAD"
                        ? `$${Number(wallet.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`
                        : `${Number(wallet.balance).toLocaleString(undefined, {
                            minimumFractionDigits: wallet.symbol === "USDT" || wallet.symbol === "USDC" ? 2 : 0,
                            maximumFractionDigits: wallet.symbol === "USDT" || wallet.symbol === "USDC" ? 2 : 8,
                          })} ${wallet.symbol}`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {wallet.symbol === "CAD" ? "Canadian Dollar" : `≈ ${wallet.value} CAD`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Wallet Detail Workspace */}
          {selectedWallet && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedWallet.name} Deposit Address</h2>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                    {selectedWallet.network}
                  </span>
                </div>

                {selectedWallet.addresses && selectedWallet.addresses.length > 1 && (
                  <div className="flex gap-2 mb-4">
                    {selectedWallet.addresses.map((net, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedNetworkIndex(idx); setShowQr(false); setCopied(false); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          selectedNetworkIndex === idx
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {net.network}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    readOnly
                    value={selectedWallet.addresses?.[selectedNetworkIndex]?.address || selectedWallet.address || ""}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono text-gray-700 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(selectedWallet.addresses?.[selectedNetworkIndex]?.address || selectedWallet.address || "")}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setShowQr(!showQr)}
                    className={`p-3 border rounded-xl ${showQr ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>

                {showQr && (
                  <div className="mt-5 flex flex-col items-center justify-center p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <QRCodeSVG value={selectedWallet.addresses?.[selectedNetworkIndex]?.address || selectedWallet.address || ""} size={160} />
                    <p className="mt-3 text-xs font-mono font-bold text-gray-600">{selectedWallet.addresses?.[selectedNetworkIndex]?.address || selectedWallet.address}</p>
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <Link
                    href={`/deposit?asset=${selectedWallet.symbol}`}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm shadow transition-colors"
                  >
                    <ArrowDownLeft className="w-4 h-4" /> Deposit {selectedWallet.symbol}
                  </Link>
                  <Link
                    href="/withdraw"
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Withdraw {selectedWallet.symbol}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Info</h2>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-gray-500">Asset:</span>
                    <p className="font-bold text-gray-900 text-sm">{selectedWallet.name} ({selectedWallet.symbol})</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Network:</span>
                    <p className="font-bold text-gray-900 text-sm">{selectedWallet.network}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Balance:</span>
                    <p className="font-bold text-gray-900 text-sm">{selectedWallet.balance} {selectedWallet.symbol}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">CAD Value:</span>
                    <p className="font-bold text-indigo-600 text-sm">{selectedWallet.value}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
