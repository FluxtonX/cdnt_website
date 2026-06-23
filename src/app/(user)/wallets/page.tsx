"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, QrCode, TriangleAlert, ArrowDownLeft, ArrowUpRight, Loader2, Check } from "lucide-react";
import { CoinLogo } from "@/components/market/CoinLogo";
import { getCoinBySymbol } from "@/config/coins";
import { createClient } from "@/lib/supabase/client";
import { QRCodeSVG } from "qrcode.react";

const supabase = createClient();

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState("bitcoin");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const [prices, setPrices] = useState<Record<string, number>>({
    BTC: 0,
    ETH: 0,
    USDT: 1,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Run fetches in parallel to reduce loading time
        const [
          userWalletsRes,
          platformWalletsRes,
          ledgerRes,
          depositsRes,
          withdrawalsRes,
          btcRes,
          ethRes
        ] = await Promise.all([
          supabase.from("user_wallets").select("*").eq("user_id", user.id),
          supabase.from("platform_wallets").select("*").eq("type", "Hot"),
          supabase.from("wallet_ledger").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("deposit_requests").select("*").eq("user_id", user.id).eq("status", "pending").order("created_at", { ascending: false }),
          supabase.from("withdrawal_requests").select("*").eq("user_id", user.id).eq("status", "pending").order("created_at", { ascending: false }),
          fetch("/api/market/ticker?symbol=BTCUSDT").catch(() => null),
          fetch("/api/market/ticker?symbol=ETHUSDT").catch(() => null),
        ]);

        if (userWalletsRes.error) throw userWalletsRes.error;
        if (platformWalletsRes.error) throw platformWalletsRes.error;
        if (ledgerRes.error) throw ledgerRes.error;
        if (depositsRes.error) throw depositsRes.error;
        if (withdrawalsRes.error) throw withdrawalsRes.error;

        const userWallets = userWalletsRes.data;
        const platformWallets = platformWalletsRes.data;
        const ledger = ledgerRes.data;
        const deposits = depositsRes.data;
        const withdrawals = withdrawalsRes.data;

        let btcPrice = 60000;
        let ethPrice = 3000;
        if (btcRes && btcRes.ok) {
          const btcData = await btcRes.json();
          btcPrice = Number(btcData.lastPrice);
        }
        if (ethRes && ethRes.ok) {
          const ethData = await ethRes.json();
          ethPrice = Number(ethData.lastPrice);
        }

        setPrices({ BTC: btcPrice, ETH: ethPrice, USDT: 1 });

        const platformAddressMap = (platformWallets || []).reduce((acc: any, w: any) => {
          acc[w.crypto] = w.address;
          return acc;
        }, {});

        // Combine ledger and pending deposits into a single activity list per coin
        const allActivities = [
          ...(ledger || []).map((l: any) => ({
            id: l.id,
            type: l.type === "DEPOSIT" ? "Deposit" : "Withdrawal",
            time: new Date(l.created_at).toLocaleDateString() + " " + new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: `${l.type === "DEPOSIT" ? "+" : "-"}${Number(l.amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${l.currency}`,
            amountType: l.type === "DEPOSIT" ? "positive" : "negative",
            status: l.status || "Confirmed",
            currency: l.currency,
            createdAt: new Date(l.created_at),
          })),
          ...(deposits || []).map((d: any) => ({
            id: d.id,
            type: "Deposit",
            time: new Date(d.created_at).toLocaleDateString() + " " + new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: `+${Number(d.expected_amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${d.asset}`,
            amountType: "positive",
            status: "Pending Approval",
            currency: d.asset,
            createdAt: new Date(d.created_at),
          })),
          ...(withdrawals || []).map((w: any) => ({
            id: w.id,
            type: "Withdrawal",
            time: new Date(w.created_at).toLocaleDateString() + " " + new Date(w.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: `-${Number(w.amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${w.asset || "CAD"}`,
            amountType: "negative",
            status: "Pending Approval",
            currency: w.asset || "CAD",
            createdAt: new Date(w.created_at),
          })),
        ].sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

        // Map balance values
        const btcBalance = Number(userWallets?.find((w: any) => w.currency === "BTC")?.balance || 0);
        const ethBalance = Number(userWallets?.find((w: any) => w.currency === "ETH")?.balance || 0);
        const usdtBalance = Number(userWallets?.find((w: any) => w.currency === "USDT")?.balance || 0);

        const mappedWallets = [
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            balance: btcBalance.toFixed(8),
            rawBalance: btcBalance,
            value: `$${(btcBalance * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: "Live",
            changeType: "positive",
            network: "Bitcoin Network",
            address: platformAddressMap["BTC"] || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            image: getCoinBySymbol("BTCUSDT")?.logoUrl,
            activities: allActivities.filter((act: any) => act.currency === "BTC").slice(0, 5),
          },
          {
            id: "ethereum",
            name: "Ethereum",
            symbol: "ETH",
            balance: ethBalance.toFixed(8),
            rawBalance: ethBalance,
            value: `$${(ethBalance * ethPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: "Live",
            changeType: "positive",
            network: "Ethereum Mainnet",
            address: platformAddressMap["ETH"] || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            image: getCoinBySymbol("ETHUSDT")?.logoUrl,
            activities: allActivities.filter((act: any) => act.currency === "ETH").slice(0, 5),
          },
          {
            id: "tether",
            name: "Tether",
            symbol: "USDT",
            balance: usdtBalance.toFixed(2),
            rawBalance: usdtBalance,
            value: `$${usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: "Stable",
            changeType: "neutral",
            network: "ERC-20",
            address: platformAddressMap["USDT"] || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
            activities: allActivities.filter((act: any) => act.currency === "USDT").slice(0, 5),
          },
        ];

        setWallets(mappedWallets);
      } catch (err) {
        console.error("Failed to load wallets data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedWalletId]);

  const selectedWallet = wallets.find(w => w.id === selectedWalletId);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">My Wallets</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Manage your cryptocurrency wallets and addresses</p>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-[148px]">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200" />
                  <div className="w-16 h-6 rounded-full animate-pulse bg-gray-200" />
                </div>
                <div>
                  <div className="w-24 h-5 rounded animate-pulse bg-gray-200 mb-2" />
                  <div className="w-32 h-7 rounded animate-pulse bg-gray-200 mb-1" />
                  <div className="w-20 h-4 rounded animate-pulse bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-[400px] animate-pulse">
              <div className="w-48 h-6 bg-gray-200 rounded mb-6" />
              <div className="w-full h-12 bg-gray-200 rounded-xl mb-6" />
              <div className="w-full h-32 bg-gray-200 rounded-xl mb-6" />
              <div className="w-full h-12 bg-gray-200 rounded-xl" />
            </div>
            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-[400px] animate-pulse">
               <div className="w-48 h-6 bg-gray-200 rounded mb-6" />
               <div className="space-y-6">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-full h-10 bg-gray-200 rounded" />)}
               </div>
            </div>
          </div>
        </>
      ) : selectedWallet ? (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {wallets.map(wallet => {
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
                    <div className="text-sm text-gray-500 mt-1">{Number(wallet.balance).toLocaleString(undefined, { maximumFractionDigits: 8 })} {wallet.symbol}</div>
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
                <p className="text-sm font-semibold text-gray-900 mb-2">Your Platform {selectedWallet.name} Deposit Address</p>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    readOnly 
                    value={selectedWallet.address} 
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-mono text-gray-600 focus:outline-none"
                  />
                  <button 
                    onClick={() => handleCopy(selectedWallet.address)}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setShowQr(!showQr)}
                    className={`p-3 border rounded-xl transition-colors ${showQr ? "bg-blue-50 border-primary-blue text-primary-blue" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                    title="Show QR Code"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showQr && (
                <div className="mt-5 flex flex-col items-center justify-center p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <QRCodeSVG value={selectedWallet.address} size={160} />
                  <p className="mt-3 text-xs text-gray-500 font-mono font-bold">{selectedWallet.address}</p>
                </div>
              )}

              <div className="mt-6 bg-[#FFF9EE] rounded-xl p-5 border border-orange-100/50">
                <div className="flex items-center gap-2 text-[#E8A020] font-semibold text-sm">
                  <TriangleAlert className="w-4 h-4" />
                  Important Instructions
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-500 list-disc pl-5">
                  <li>Only send {selectedWallet.name} to this address</li>
                  <li>Minimum deposit: {selectedWallet.symbol === "BTC" ? "0.0005" : selectedWallet.symbol === "ETH" ? "0.01" : "5.0"} {selectedWallet.symbol}</li>
                  <li>Requires 3 network confirmations</li>
                  <li>Submit transaction hash on deposit request page after sending</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-4">
                <Link
                  href={`/deposit?asset=${selectedWallet.symbol}`}
                  className="flex-1 bg-primary-blue hover:bg-blue-800 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <ArrowDownLeft className="w-5 h-5" />
                  Deposit {selectedWallet.symbol}
                </Link>
                <Link
                  href="/withdraw"
                  className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  Withdraw {selectedWallet.symbol}
                </Link>
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
                  <p className="text-sm font-semibold text-gray-900">{Number(selectedWallet.balance).toLocaleString(undefined, { maximumFractionDigits: 8 })} {selectedWallet.symbol}</p>
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
              {selectedWallet.activities.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">
                  No recent transactions found for {selectedWallet.symbol}.
                </div>
              ) : (
                selectedWallet.activities.map((activity: any) => (
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
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                          activity.status === "Confirmed" || activity.status === "COMPLETED" || activity.status === "PAID"
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : activity.status === "Pending Approval"
                            ? "bg-[#FFF9EE] text-[#E8A020]"
                            : "bg-red-50 text-red-650"
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
