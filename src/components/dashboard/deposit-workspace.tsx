"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Info,
  ShieldCheck,
} from "lucide-react";
import { CoinLogo } from "@/components/market/CoinLogo";
import { DepositRequestForm } from "@/components/deposit/DepositRequestForm";
import { FixedDepositQR } from "@/components/deposit/FixedDepositQR";
import {
  type DepositAddressConfig,
  type DepositAsset,
  DEPOSIT_ADDRESSES,
  getDepositConfig,
  getDepositNetworks,
} from "@/config/depositAddresses";
import { cn } from "@/lib/utils";

const steps = ["Details", "Review", "Transfer"];
const assetOptions = Array.from(
  new Map(DEPOSIT_ADDRESSES.map((item) => [item.asset, item])).values(),
);

function formatAmount(value: number, symbol: string) {
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: symbol === "USDT" ? 2 : 8,
  })} ${symbol}`;
}

export function DepositWorkspace({ initialAsset }: { initialAsset?: string }) {
  const initialConfig = getDepositConfig(initialAsset ?? "BTC");
  const [asset, setAsset] = useState<DepositAsset | "fiat">(initialConfig.asset);
  const [network, setNetwork] = useState(initialConfig.network);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(0);
  const [reference] = useState(() => `NUD-${Date.now().toString(36).toUpperCase()}`);

  const [error, setError] = useState<string | null>(null);

  const networks = asset === "fiat" ? [] : getDepositNetworks(asset);
  const config = useMemo<DepositAddressConfig | null>(
    () => asset === "fiat" ? null : getDepositConfig(asset, network),
    [asset, network],
  );
  const numericAmount = Number(amount);
  const amountIsValid = config && Number.isFinite(numericAmount) && numericAmount >= config.minAmount;

  const handleAssetChange = (nextAsset: DepositAsset | "fiat") => {
    if (nextAsset === "fiat") {
      setAsset("fiat");
      setAmount("");
      setStep(0);
      setError(null);
    } else {
      const nextConfig = getDepositConfig(nextAsset);
      setAsset(nextConfig.asset);
      setNetwork(nextConfig.network);
      setAmount("");
      setStep(0);
      setError(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <div className="mb-6 flex items-start sm:items-center gap-3 sm:gap-4">
        <Link
          href="/wallets"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
          title="Back to wallets"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-[24px] font-bold tracking-tight text-[#0A0F2C]">
            Deposit Cryptocurrency
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] mt-0.5">
            Select an asset, review the network, then scan the company deposit QR.
          </p>
        </div>
      </div>

      {asset === "fiat" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <p className="text-base font-semibold text-red-900">
            Canadian regulations absolutely forbid CAD deposits on fraud-refund accounts. The deposit function is permanently disabled.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
            {steps.map((label, index) => (
              <div
                key={label}
                className={cn(
                  "flex flex-col sm:flex-row items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border bg-white p-2.5 sm:px-4 sm:py-3 shadow-sm text-center sm:text-left",
                  index <= step ? "border-[#113285]/20" : "border-gray-100",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full text-xs sm:text-sm font-bold",
                    index < step
                      ? "bg-emerald-100 text-emerald-700"
                      : index === step
                        ? "bg-[#113285] text-white"
                        : "bg-gray-100 text-gray-500",
                  )}
                >
                  {index < step ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                <div>
                  <p className="hidden md:block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Step {index + 1}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#0A0F2C]">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-[112px] lg:self-start">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#718096]">
                Select Crypto Asset
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                {assetOptions.map((item) => {
                  const isActive = asset === item.asset;
                  return (
                    <button
                      key={item.asset}
                      onClick={() => handleAssetChange(item.asset)}
                      className={cn(
                        "flex min-w-[170px] items-center gap-3 rounded-2xl border p-4 text-left transition-all lg:min-w-0",
                        isActive
                          ? "border-[#113285] bg-[#EEF4FF] shadow-sm"
                          : "border-gray-100 bg-[#F8FAFC] hover:border-gray-200 hover:bg-white",
                      )}
                    >
                      <CoinLogo src={item.logoUrl} symbol={item.asset} className="h-10 w-10 p-1.5" />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-[#0A0F2C]">{item.asset}</span>
                        <span className="block truncate text-xs font-medium text-[#718096]">
                          {item.assetName}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <h2 className="mb-4 mt-6 text-sm font-bold uppercase tracking-wide text-[#718096]">
                Fiat (CAD)
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                <button
                  onClick={() => handleAssetChange("fiat")}
                  className={cn(
                    "flex min-w-[170px] items-center gap-3 rounded-2xl border p-4 text-left transition-all lg:min-w-0",
                    asset === "fiat"
                      ? "border-[#113285] bg-[#EEF4FF] shadow-sm"
                      : "border-gray-100 bg-[#F8FAFC] hover:border-gray-200 hover:bg-white",
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#0A0F2C]">CAD</span>
                    <span className="block truncate text-xs font-medium text-[#718096]">
                      Fiat (CAD)
                    </span>
                  </span>
                </button>
              </div>
            </aside>

            <main className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
              {config && (
                <>
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CoinLogo src={config.logoUrl} symbol={config.asset} className="h-10 w-10 p-1.5 sm:h-12 sm:w-12 sm:p-2" />
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-[#0A0F2C]">Deposit {config.assetName}</h2>
                        <p className="text-xs sm:text-sm font-medium text-[#718096]">{config.networkName}</p>
                      </div>
                    </div>
                    <div className="self-start sm:self-auto rounded-full border border-[#FFEDCC] bg-[#FFF9EA] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-[#B7791F]">
                      Network: {config.network}
                    </div>
                  </div>

                  {step === 0 ? (
                    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                      <div className="space-y-5">
                        {networks.length > 1 ? (
                          <div>
                            <p className="mb-2 text-sm font-bold text-[#0A0F2C]">Select network</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {networks.map((item) => (
                                <button
                                  key={item.network}
                                  onClick={() => setNetwork(item.network)}
                                  className={cn(
                                    "rounded-2xl border px-4 py-3 text-left transition-colors",
                                    network === item.network
                                      ? "border-[#113285] bg-[#EEF4FF]"
                                      : "border-gray-200 bg-white hover:bg-gray-50",
                                  )}
                                >
                                  <span className="block text-sm font-bold text-[#0A0F2C]">
                                    {item.network}
                                  </span>
                                  <span className="mt-1 block text-xs font-medium text-[#718096]">
                                    {item.networkName}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <label className="block">
                          <span className="mb-2 block text-sm font-bold text-[#0A0F2C]">
                            Expected deposit amount
                          </span>
                          <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-white focus-within:border-[#113285] focus-within:ring-4 focus-within:ring-[#113285]/10">
                            <input
                              inputMode="decimal"
                              value={amount}
                              onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ""))}
                              placeholder="0.00"
                              className="min-w-0 flex-1 px-4 py-4 text-lg font-bold text-[#0A0F2C] outline-none"
                            />
                            <span className="grid min-w-20 place-items-center border-l border-gray-100 bg-[#F8FAFC] px-4 text-sm font-bold text-[#113285]">
                              {config.asset}
                            </span>
                          </div>
                          <span className="mt-2 block text-xs font-medium text-[#718096]">
                            Minimum deposit is {formatAmount(config.minAmount, config.asset)}.
                          </span>
                        </label>

                        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                          <div className="flex gap-3">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#113285]" />
                            <p className="text-sm leading-6 text-[#4A5568]">
                              The QR contains the fixed company deposit address for this asset and network. The address is intentionally not displayed as plain text on this screen.
                            </p>
                          </div>
                        </div>

                        <button
                          disabled={!amountIsValid}
                          onClick={() => setStep(1)}
                          className="inline-flex w-full items-center justify-center rounded-2xl bg-[#113285] px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-[#0D2768] disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
                        >
                          Continue to review
                        </button>
                      </div>

                      <DepositRules config={config} />
                    </section>
                  ) : null}

                  {step === 1 ? (
                    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                      <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
                        <h3 className="text-base font-bold text-[#0A0F2C]">Review deposit details</h3>
                        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                          <ReviewItem label="Asset" value={`${config.assetName} (${config.asset})`} />
                          <ReviewItem label="Network" value={config.networkName} />
                          <ReviewItem label="Expected amount" value={formatAmount(numericAmount, config.asset)} />
                          <ReviewItem label="Payment Method" value="Direct Crypto Transfer (Manual)" />
                          <ReviewItem label="Deposit reference" value={reference} />
                          <ReviewItem label="Confirmations" value={`${config.confirmations} required`} />
                          <ReviewItem label="Estimated arrival" value={`~${config.arrivalTime}`} />
                        </dl>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-2xl border border-amber-200 bg-[#FFF9EA] p-4">
                          <div className="flex gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#B7791F]" />
                            <p className="text-sm font-semibold leading-6 text-[#7A4B00]">
                              Sending the wrong asset or network can permanently lose funds.
                            </p>
                          </div>
                        </div>

                        {error && (
                          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                            {error}
                          </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                          <button
                            onClick={() => setStep(0)}
                            className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-[#0A0F2C] hover:bg-gray-50 disabled:opacity-50"
                          >
                            Edit details
                          </button>
                          <button
                            onClick={() => setStep(2)}
                            className="flex-1 rounded-2xl bg-[#113285] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#0D2768] flex items-center justify-center gap-2"
                          >
                            Generate QR
                          </button>
                        </div>
                      </div>
                    </section>
                  ) : null}

                  {step === 2 ? (
                    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="space-y-5">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                          <div className="flex gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                            <div>
                              <p className="text-sm font-bold text-emerald-900">Deposit QR ready</p>
                              <p className="mt-1 text-sm leading-6 text-emerald-800">
                                Scan the QR from your external wallet and send only on {config.networkName}.
                              </p>
                            </div>
                          </div>
                        </div>

                        <FixedDepositQR config={config} />
                        <DepositRequestForm config={config} amount={numericAmount} />
                      </div>

                      <div className="space-y-5">
                        <DepositRules config={config} />

                        <div className="rounded-2xl bg-[#F8FAFC] p-5">
                          <h3 className="mb-4 text-sm font-bold text-[#0A0F2C]">Deposit Status</h3>
                          {[
                            ["QR generated", "Complete"],
                            ["Awaiting transfer", "Pending"],
                            ["Network confirmations", `${config.confirmations} required`],
                            ["Admin review", "Manual"],
                          ].map(([label, value], index) => (
                            <div key={label} className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-b-0">
                              <span
                                className={cn(
                                  "h-2.5 w-2.5 rounded-full",
                                  index === 0 ? "bg-emerald-500" : "bg-gray-300",
                                )}
                              />
                              <span className="min-w-0 flex-1 text-sm font-semibold text-[#0A0F2C]">
                                {label}
                              </span>
                              <span className="text-right text-xs font-bold text-[#718096]">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  ) : null}
                </>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#718096]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[#0A0F2C]">{value}</dd>
    </div>
  );
}

function DepositRules({ config }: { config: DepositAddressConfig }) {
  return (
    <div className="rounded-2xl border border-[#FFEDCC] bg-[#FFF9EA] p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#B7791F]">
        <AlertTriangle className="h-4 w-4" />
        Important instructions
      </h3>
      <ul className="space-y-3 text-sm font-medium leading-6 text-[#4A5568]">
        <li>Send only {config.assetName} ({config.asset}) on {config.networkName}.</li>
        <li>The QR uses a fixed company deposit address configured by admin.</li>
        <li>Minimum deposit: {formatAmount(config.minAmount, config.asset)}.</li>
        <li>Requires {config.confirmations} network confirmations.</li>
        <li>Funds are reviewed manually before balance credit.</li>
      </ul>
    </div>
  );
}
