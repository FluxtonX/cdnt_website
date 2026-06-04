"use client";

import * as React from "react";
import {
  ArrowUpRight,
  CircleDollarSign,
  PanelRightClose,
  PanelRightOpen,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { COINS } from "@/config/coins";
import { LiveCryptoChart } from "@/components/market/LiveCryptoChart";
import { CoinLogo } from "@/components/market/CoinLogo";
import { cn } from "@/lib/utils";

type Ticker24h = {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const DEMO_BALANCES: Record<string, number> = {
  BTCUSDT: 0.8421,
  ETHUSDT: 8.214,
  BNBUSDT: 45.2,
  SOLUSDT: 124.5,
  XRPUSDT: 12500,
  ADAUSDT: 8400,
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ExchangePage() {
  const [selectedCoin, setSelectedCoin] = React.useState(COINS[0]);
  const [ticker, setTicker] = React.useState<Ticker24h | null>(null);
  const [latestCandle, setLatestCandle] = React.useState<Candle | null>(null);
  const [tickerError, setTickerError] = React.useState<string | null>(null);
  const [orderPanelOpen, setOrderPanelOpen] = React.useState(true);
  const [side, setSide] = React.useState<"buy" | "sell">("buy");
  const [amount, setAmount] = React.useState("");

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadTicker() {
      setTickerError(null);
      try {
        const response = await fetch(`/api/market/ticker?symbol=${selectedCoin.symbol}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Failed to load 24h market stats");
        }
        const data = (await response.json()) as Ticker24h;
        setTicker(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setTickerError(error instanceof Error ? error.message : "Failed to load ticker");
        }
      }
    }

    loadTicker();
    const timer = window.setInterval(loadTicker, 15000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [selectedCoin]);

  const livePrice = latestCandle?.close ?? ticker?.lastPrice ?? 0;
  const changePercent = ticker?.priceChangePercent ?? 0;
  const amountValue = Number(amount) || 0;
  const assetBalance = DEMO_BALANCES[selectedCoin.symbol] ?? 0;
  const estimatedCrypto = side === "buy" && amountValue > 0 && livePrice > 0 ? amountValue / livePrice : 0;
  const estimatedUsd = side === "sell" && amountValue > 0 ? amountValue * livePrice : 0;
  const fee = side === "buy" ? amountValue * 0.005 : estimatedUsd * 0.004;
  const total = side === "buy" ? amountValue + fee : Math.max(0, estimatedUsd - fee);

  function switchSide(nextSide: "buy" | "sell") {
    setSide(nextSide);
    setAmount("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-normal text-[#0A0F2C]">Buy / Sell</h1>
          <p className="mt-2 text-sm font-medium text-[#718096]">Live Binance market data for crypto charting and market stats</p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-right">
          <div>
            <p className="text-xs font-semibold text-[#718096]">Total Portfolio</p>
            <p className="text-xl font-black text-[#0A0F2C]">$51,750.00</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#718096]">Available USDT</p>
            <p className="text-xl font-black text-[#F5A400]">$12,450.00</p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          orderPanelOpen
            ? "xl:grid-cols-[190px_minmax(0,1fr)_230px] 2xl:grid-cols-[200px_minmax(0,1fr)_240px]"
            : "xl:grid-cols-[190px_minmax(0,1fr)_48px] 2xl:grid-cols-[200px_minmax(0,1fr)_48px]",
        )}
      >
        <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-500" />
            <input className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400" placeholder="Search markets" />
          </div>

          <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-xs font-bold text-slate-500">
            <button type="button" className="rounded-md bg-white py-2 text-[#113285] shadow-sm">Crypto</button>
            <button type="button" className="py-2">Stablecoins</button>
          </div>

          <div className="mt-4 space-y-2">
            {COINS.map((coin) => {
              const active = selectedCoin.symbol === coin.symbol;
              const rowChange = active ? changePercent : 0;
              return (
                <button
                  key={coin.symbol}
                  type="button"
                  onClick={() => {
                    setSelectedCoin(coin);
                    setAmount("");
                    setLatestCandle(null);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl border px-2.5 py-3 text-left transition-all",
                    active ? "border-[#113285] bg-blue-50" : "border-transparent hover:bg-slate-50",
                  )}
                >
                  <CoinLogo src={coin.logoUrl} symbol={coin.baseAsset} className="h-7 w-7 p-1" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-[#0A0F2C]">{coin.pairLabel}</span>
                    <span className="block text-xs font-medium text-[#718096]">{coin.label}</span>
                  </span>
                  {active && (
                    <span className={cn("text-xs font-black", rowChange >= 0 ? "text-emerald-600" : "text-red-500")}>
                      {rowChange >= 0 ? "+" : ""}{rowChange.toFixed(2)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="flex items-center gap-3">
              <CoinLogo src={selectedCoin.logoUrl} symbol={selectedCoin.baseAsset} className="h-10 w-10 p-1.5" />
              <div>
                <h2 className="text-xl font-black text-[#0A0F2C]">{selectedCoin.pairLabel}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Open</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Binance spot market</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-black text-[#0A0F2C]">{livePrice > 0 ? `$${livePrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "--"}</span>
              <span className={cn("flex items-center gap-1 text-sm font-black", changePercent >= 0 ? "text-emerald-600" : "text-red-500")}>
                {changePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%
              </span>
              {tickerError && <span className="text-xs font-bold text-red-500">{tickerError}</span>}
            </div>
            <div className="grid grid-cols-4 gap-3 text-xs font-semibold text-slate-500">
              <span>O <b className="text-[#0A0F2C]">{latestCandle?.open.toFixed(2) ?? "--"}</b></span>
              <span>H <b className="text-emerald-600">{latestCandle?.high.toFixed(2) ?? ticker?.highPrice.toFixed(2) ?? "--"}</b></span>
              <span>L <b className="text-red-500">{latestCandle?.low.toFixed(2) ?? ticker?.lowPrice.toFixed(2) ?? "--"}</b></span>
              <span>C <b className="text-[#0A0F2C]">{latestCandle?.close.toFixed(2) ?? "--"}</b></span>
            </div>
          </div>

          <LiveCryptoChart
            symbol={selectedCoin.symbol}
            defaultInterval="1h"
            onLatestCandleChange={setLatestCandle}
            onOpenPreview={() => window.location.assign(`/exchange/preview?symbol=${selectedCoin.symbol}`)}
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["24h High", ticker ? `$${ticker.highPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "--"],
              ["24h Low", ticker ? `$${ticker.lowPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "--"],
              ["24h Volume", ticker ? ticker.volume.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "--"],
              ["Quote Volume", ticker ? `$${ticker.quoteVolume.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "--"],
              ["Market Status", "Open"],
              ["Network", selectedCoin.label],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-blue-50 px-4 py-3">
                <p className="text-xs font-semibold text-[#718096]">{label}</p>
                <p className="mt-1 text-sm font-black text-[#0A0F2C]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className={cn("relative rounded-xl border border-slate-200 bg-white shadow-sm transition-all", orderPanelOpen ? "p-3" : "p-2")}>
          <button
            type="button"
            title={orderPanelOpen ? "Hide order panel" : "Show order panel"}
            aria-label={orderPanelOpen ? "Hide order panel" : "Show order panel"}
            onClick={() => setOrderPanelOpen((value) => !value)}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-[#113285] shadow-sm transition-colors hover:bg-blue-50",
              orderPanelOpen ? "absolute -left-3 top-3 z-20" : "mx-auto",
            )}
          >
            {orderPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>

          {!orderPanelOpen && (
            <div className="mt-4 flex h-[520px] flex-col items-center justify-center gap-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#113285] text-white">
                <Wallet className="h-4 w-4" />
              </span>
              <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-black uppercase tracking-widest text-[#113285]">
                Buy / Sell
              </span>
            </div>
          )}

          {orderPanelOpen && (
            <>
              <div className="grid grid-cols-2 rounded-xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => switchSide("buy")}
                  className={cn("rounded-lg py-3 text-sm font-black transition-colors", side === "buy" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500")}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => switchSide("sell")}
                  className={cn("rounded-lg py-3 text-sm font-black transition-colors", side === "sell" ? "bg-[#113285] text-white shadow-sm" : "text-slate-500")}
                >
                  Sell
                </button>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#718096]">
                  {side === "buy" ? "Buy mode" : "Sell mode"}
                </p>
                <h3 className="mt-1 text-lg font-black text-[#0A0F2C]">
                  {side === "buy" ? `Buy ${selectedCoin.baseAsset}` : `Sell ${selectedCoin.baseAsset}`}
                </h3>
              </div>

              <div className={cn("mt-4 rounded-xl border p-4", side === "buy" ? "border-blue-200 bg-blue-50" : "border-emerald-200 bg-emerald-50")}>
                <div className="flex items-center gap-2 text-xs font-bold text-[#113285]">
                  <Wallet className="h-4 w-4" />
                  Available Balance
                </div>
                <p className="mt-2 text-lg font-black text-[#113285]">
                  {side === "buy" ? "$12,450.00" : `${assetBalance.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${selectedCoin.baseAsset}`}
                </p>
              </div>

              <label className="mt-5 block text-sm font-black text-[#0A0F2C]">
                {side === "buy" ? "Amount in USDT" : `Amount in ${selectedCoin.baseAsset}`}
              </label>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
                placeholder={side === "buy" ? "0.00" : "0.00000000"}
                className="mt-2 h-14 w-full rounded-xl border border-slate-200 px-4 text-lg font-black text-[#0A0F2C] outline-none transition focus:border-[#113285] focus:ring-4 focus:ring-blue-100"
              />

              <label className="mt-5 block text-sm font-black text-[#0A0F2C]">
                {side === "buy" ? `Estimated ${selectedCoin.baseAsset}` : "Estimated USDT"}
              </label>
              <div className="mt-2 flex h-14 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-lg font-black text-slate-400">
                {side === "buy"
                  ? estimatedCrypto > 0 ? estimatedCrypto.toFixed(selectedCoin.baseAsset === "BTC" ? 8 : 4) : "0.00000000"
                  : estimatedUsd > 0 ? `$${estimatedUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "$0.00"}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {(side === "buy" ? [100, 500, 1000] : [25, 50, 75]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      if (side === "buy") {
                        setAmount(String(value));
                      } else {
                        setAmount(((assetBalance * value) / 100).toFixed(selectedCoin.baseAsset === "BTC" ? 8 : 4));
                      }
                    }}
                    className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold text-[#0A0F2C] hover:border-[#113285]"
                  >
                    {side === "buy" ? `$${value}` : `${value}%`}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount(side === "buy" ? "12450" : assetBalance.toFixed(selectedCoin.baseAsset === "BTC" ? 8 : 4))}
                  className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold text-[#0A0F2C] hover:border-[#113285]"
                >
                  Max
                </button>
              </div>

              <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-[#718096]">Market Price</span>
                  <span className="font-black text-[#0A0F2C]">{livePrice > 0 ? `$${livePrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "--"}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-[#718096]">Fee ({side === "buy" ? "0.50" : "0.40"}%)</span>
                  <span className="font-black text-[#0A0F2C]">{formatCurrency(fee)}</span>
                </div>
                <div className="flex justify-between gap-3 border-t border-slate-200 pt-3">
                  <span className="font-black text-[#0A0F2C]">{side === "buy" ? "Total Cost" : "Net Proceeds"}</span>
                  <span className="font-black text-[#0A0F2C]">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                type="button"
                className={cn(
                  "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black text-white transition-colors",
                  side === "buy" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-[#113285] hover:bg-[#0D266A]",
                )}
              >
                {side === "buy" ? "Buy" : "Sell"} Order
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <p className="mt-4 flex gap-2 text-xs font-medium leading-5 text-[#718096]">
                <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0" />
                Orders are reviewed before confirmation. Live Binance market price may change.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
