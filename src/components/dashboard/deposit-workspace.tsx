"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, QrCode, ShieldAlert } from "lucide-react";
import { Panel } from "@/components/dashboard/blocks";
import { useToast } from "@/components/ui/toast";
import { portfolioAssets } from "@/data/mock";
import { cn } from "@/lib/utils";

const networks: Record<string, string[]> = {
  BTC: ["Bitcoin"],
  ETH: ["ERC-20"],
  USDT: ["ERC-20", "TRC-20"],
};

const minimums: Record<string, string> = {
  BTC: "0.0005 BTC",
  ETH: "0.01 ETH",
  USDT: "25 USDT",
};

const confirmations: Record<string, string> = {
  BTC: "3 confirmations",
  ETH: "12 confirmations",
  USDT: "12 ERC-20 / 20 TRC-20 confirmations",
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
    setNetwork(networks[symbol][0]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <Panel title="Select deposit asset">
          <div className="space-y-3">
            {portfolioAssets.map((item) => (
              <button
                key={item.symbol}
                onClick={() => selectAsset(item.symbol)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border p-4 text-left transition hover:border-banking-blue hover:bg-blue-50/50",
                  assetSymbol === item.symbol
                    ? "border-banking-blue bg-blue-50"
                    : "border-banking-border bg-white",
                )}
              >
                <span>
                  <span className="block font-semibold">{item.symbol}</span>
                  <span className="text-sm text-banking-muted">{item.name}</span>
                </span>
                <span className="text-sm font-semibold text-banking-blue">
                  {item.value}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Network">
          <div className="grid gap-3">
            {networks[asset.symbol].map((item) => (
              <button
                key={item}
                onClick={() => setNetwork(item)}
                className={cn(
                  "flex items-center justify-between rounded-md border p-4 text-left transition",
                  network === item
                    ? "border-banking-blue bg-blue-50"
                    : "border-banking-border bg-white hover:border-banking-blue",
                )}
              >
                <span>
                  <span className="block font-semibold">{item}</span>
                  <span className="text-sm text-banking-muted">
                    Minimum {minimums[asset.symbol]}
                  </span>
                </span>
                {network === item ? (
                  <CheckCircle2 className="h-5 w-5 text-banking-blue" />
                ) : null}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title={`${asset.symbol} deposit address`}>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            Send only {asset.symbol} using the {network} network. Incorrect
            network transfers may be unrecoverable.
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[190px_1fr]">
          <div className="grid aspect-square place-items-center rounded-md border border-banking-border bg-banking-offWhite">
            <QrCode className="h-28 w-28 text-banking-blue" />
          </div>
          <div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-banking-offWhite p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-banking-muted">
                  Asset
                </p>
                <p className="mt-1 font-semibold">{asset.symbol}</p>
              </div>
              <div className="rounded-md bg-banking-offWhite p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-banking-muted">
                  Network
                </p>
                <p className="mt-1 font-semibold">{network}</p>
              </div>
              <div className="rounded-md bg-banking-offWhite p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-banking-muted">
                  Confirmations
                </p>
                <p className="mt-1 font-semibold">{confirmations[asset.symbol]}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-banking-muted">Assigned address</p>
            <p className="mt-2 break-all rounded-md border border-banking-border bg-white p-3 text-sm">
              {asset.address}
            </p>
            <button
              onClick={() =>
                notify({
                  title: "Address copied",
                  description: `${asset.symbol} ${network} deposit address copied.`,
                })
              }
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-banking-blue px-4 py-2 text-sm font-semibold text-white"
            >
              <Copy className="h-4 w-4" />
              Copy address
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {["address_generated", "waiting_for_deposit", "pending_confirmations"].map(
            (status, index) => (
              <div key={status} className="rounded-md border border-banking-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      index === 0 ? "bg-emerald-500" : "bg-slate-300",
                    )}
                  />
                  <p className="text-sm font-semibold capitalize">
                    {status.replaceAll("_", " ")}
                  </p>
                </div>
                <p className="text-sm text-banking-muted">
                  {index === 0
                    ? "Address assigned and ready."
                    : "Updates after blockchain activity."}
                </p>
              </div>
            ),
          )}
        </div>

        <div className="mt-5 flex gap-2 rounded-md bg-blue-50 p-4 text-sm text-banking-blue">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          Deposits are credited only after the required confirmations and risk
          checks are complete.
        </div>
      </Panel>
    </div>
  );
}
