"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, ShieldAlert } from "lucide-react";
import { Panel } from "@/components/dashboard/blocks";
import { useToast } from "@/components/ui/toast";
import { portfolioAssets } from "@/data/mock";
import { cn } from "@/lib/utils";

const networks: Record<string, string[]> = {
  BTC: ["Bitcoin"],
  ETH: ["ERC-20"],
  USDT: ["ERC-20", "TRC-20"],
  BNB: ["BEP-20", "BEP-2"],
  SOL: ["Solana"],
  XRP: ["Ripple"],
  ADA: ["Cardano"],
  DOGE: ["Dogecoin"],
};

const minimums: Record<string, string> = {
  BTC: "0.0005 BTC",
  ETH: "0.01 ETH",
  USDT: "10 USDT",
  BNB: "0.01 BNB",
  SOL: "0.1 SOL",
  XRP: "1 XRP",
  ADA: "10 ADA",
  DOGE: "100 DOGE",
};

const confirmations: Record<string, string> = {
  BTC: "2 confirmations",
  ETH: "12 confirmations",
  USDT: "12 / 20 confirmations",
  BNB: "15 confirmations",
  SOL: "1 confirmation",
  XRP: "1 confirmation",
  ADA: "10 confirmations",
  DOGE: "50 confirmations",
};

const arrivalTime: Record<string, string> = {
  BTC: "~30–60 min",
  ETH: "~5–10 min",
  USDT: "~3–10 min",
  BNB: "~1–3 min",
  SOL: "< 1 min",
  XRP: "< 1 min",
  ADA: "~5–10 min",
  DOGE: "~5–10 min",
};

export function DepositWorkspace() {
  const [assetSymbol, setAssetSymbol] = useState("BTC");
  const [network, setNetwork] = useState("Bitcoin");
  const { notify } = useToast();

  const asset = useMemo(
    () => portfolioAssets.find((item) => item.symbol === assetSymbol) ?? portfolioAssets[0],
    [assetSymbol],
  );

  function selectAsset(symbol: string) {
    setAssetSymbol(symbol);
    const nets = networks[symbol] || ["Mainnet"];
    setNetwork(nets[0]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Asset Select */}
        <Panel title="Select Asset">
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {portfolioAssets.map((item) => {
              return (
                <button
                  key={item.symbol}
                  onClick={() => selectAsset(item.symbol)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all hover:shadow-md",
                    assetSymbol === item.symbol
                      ? "border-banking-blue bg-blue-50"
                      : "border-banking-border bg-white hover:border-banking-blue/40",
                  )}
                >
                  {/* Coin Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-banking-border">
                    <img src={item.image} alt={item.symbol} className="h-full w-full object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-banking-text">{item.symbol}</p>
                    <p className="text-[11px] text-banking-muted truncate">{item.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {assetSymbol === item.symbol && (
                      <CheckCircle2 className="h-4 w-4 text-banking-blue ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* Network Select */}
        <Panel title="Select Network">
          <div className="space-y-2">
            {networks[assetSymbol].map((net) => (
              <button
                key={net}
                onClick={() => setNetwork(net)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition-all",
                  network === net
                    ? "border-banking-blue bg-blue-50"
                    : "border-banking-border bg-white hover:border-banking-blue/40",
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-banking-text">{net}</p>
                  <p className="text-xs text-banking-muted">Min: {minimums[assetSymbol]}</p>
                </div>
                {network === net && <CheckCircle2 className="h-4 w-4 text-banking-blue shrink-0" />}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {/* Right Column — Address Panel */}
      <Panel title={`${asset.symbol} Deposit Address`}>
        {/* Warning */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-amber-800 leading-relaxed">
            Only send <strong>{asset.symbol}</strong> using the <strong>{network}</strong> network.
            Wrong network transfers may be <strong>unrecoverable</strong>.
          </p>
        </div>

        {/* QR + Address */}
        <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
          {/* QR Placeholder */}
          <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-banking-border bg-white shadow-inner">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-banking-border bg-white p-2 mb-3 shadow-sm">
                <img src={asset.image} alt={asset.symbol} className="h-full w-full object-contain" />
              </div>
              <p className="text-[10px] font-bold text-banking-muted">Scan QR Code</p>
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0">
            {/* Info chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: "Asset", value: asset.symbol },
                { label: "Network", value: network },
                { label: "Confirms", value: confirmations[assetSymbol] },
                { label: "Arrival", value: arrivalTime[assetSymbol] },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-banking-offWhite border border-banking-border px-3 py-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-banking-muted">{label}</p>
                  <p className="text-xs font-bold text-banking-text mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Address */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-banking-muted mb-1">Your deposit address</p>
            <div className="flex items-center gap-2 rounded-xl border border-banking-border bg-white p-3">
              <p className="flex-1 break-all text-xs font-mono text-banking-text leading-relaxed">
                {asset.address}
              </p>
            </div>

            <button
              onClick={() => notify({
                title: "Address copied",
                description: `${asset.symbol} ${network} deposit address copied.`,
              })}
              className="mt-3 flex items-center gap-2 rounded-lg bg-banking-blue px-4 py-2 text-xs font-bold text-white hover:bg-banking-navy transition-all"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Address
            </button>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: "Address Generated", active: true },
            { label: "Awaiting Deposit", active: false },
            { label: "Confirming", active: false },
          ].map(({ label, active }) => (
            <div
              key={label}
              className={cn(
                "rounded-xl border p-3 text-center transition-all",
                active ? "border-emerald-200 bg-emerald-50" : "border-banking-border bg-white",
              )}
            >
              <span className={cn("inline-block h-2 w-2 rounded-full mb-2", active ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-slate-200")} />
              <p className={cn("text-[10px] font-bold leading-tight", active ? "text-emerald-700" : "text-banking-muted")}>{label}</p>
            </div>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 p-3">
          <ShieldAlert className="h-4 w-4 text-banking-blue shrink-0 mt-0.5" />
          <p className="text-xs text-banking-blue font-medium leading-relaxed">
            Deposits are credited only after required confirmations and risk checks complete.
          </p>
        </div>
      </Panel>
    </div>
  );
}
