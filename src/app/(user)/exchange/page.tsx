"use client";

import * as React from "react";
import { ArrowDownUp, ArrowRight, CheckCircle2, ChevronDown, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const ASSETS = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.8421", priceCAD: 92350, image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { symbol: "ETH", name: "Ethereum", balance: "8.2140", priceCAD: 3395, image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { symbol: "USDT", name: "Tether", balance: "19430.00", priceCAD: 1.0, image: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
  { symbol: "BNB", name: "Binance Coin", balance: "45.20", priceCAD: 840, image: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { symbol: "SOL", name: "Solana", balance: "124.50", priceCAD: 210, image: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { symbol: "XRP", name: "Ripple", balance: "12500.00", priceCAD: 0.65, image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" },
  { symbol: "CAD", name: "Canadian Dollar", balance: "88940.46", priceCAD: 1.0, image: "https://ui-avatars.com/api/?name=CAD&background=004A99&color=fff" },
];

const RATES: Record<string, Record<string, number>> = {
  BTC: { ETH: 27.2, USDT: 92350, BNB: 110, SOL: 440, XRP: 142000, CAD: 92350 },
  ETH: { BTC: 0.0368, USDT: 3395, BNB: 4, SOL: 16, XRP: 5200, CAD: 3395 },
  USDT: { BTC: 0.0000108, ETH: 0.000295, BNB: 0.0012, SOL: 0.0047, XRP: 1.5, CAD: 1.0 },
  CAD: { BTC: 0.0000108, ETH: 0.000295, USDT: 1.0, BNB: 0.0012, SOL: 0.0047, XRP: 1.5 },
};

function AssetSelector({
  value, onChange, exclude,
}: { value: string; onChange: (s: string) => void; exclude: string }) {
  const [open, setOpen] = React.useState(false);
  const asset = ASSETS.find((a) => a.symbol === value)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border-2 border-banking-border bg-white px-4 py-3 font-bold text-banking-text hover:border-banking-blue transition-all min-w-[150px]"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-banking-border">
          <img src={asset.image} alt={asset.symbol} className="h-full w-full object-contain" />
        </div>
        {asset.symbol}
        <ChevronDown className="h-4 w-4 text-banking-muted ml-auto" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-banking-border bg-white shadow-2xl z-20 overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {ASSETS.filter((a) => a.symbol !== exclude).map((a) => {
              return (
                <button
                  key={a.symbol}
                  onClick={() => { onChange(a.symbol); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-banking-text hover:bg-banking-offWhite transition-colors"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-banking-border">
                    <img src={a.image} alt={a.symbol} className="h-full w-full object-contain" />
                  </div>
                  <span>{a.symbol}</span>
                  <span className="text-banking-muted ml-auto text-[10px] uppercase">{a.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExchangePage() {
  const { notify } = useToast();
  const [from, setFrom] = React.useState("USDT");
  const [to, setTo] = React.useState("BTC");
  const [amount, setAmount] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fromAsset = ASSETS.find((a) => a.symbol === from)!;
  const toAsset = ASSETS.find((a) => a.symbol === to)!;
  const rate = RATES[from]?.[to] ?? 1;
  const received = amount && !isNaN(parseFloat(amount)) ? (parseFloat(amount) * rate).toFixed(to === "BTC" ? 8 : to === "ETH" ? 6 : 2) : "—";

  function swap() {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    setAmount("");
  }

  function handleExchange() {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      notify({ title: "Exchange Complete", description: `${amount} ${from} → ${received} ${to}` });
    }, 1800);
  }

  if (done) {
    return (
      <>
        <PageTitle title="Currency Exchange" description="Instantly convert between crypto assets and CAD." />
        <Panel title="Exchange Successful">
          <div className="text-center py-10">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100 mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-banking-text">Exchange Complete!</h3>
            <p className="mt-2 text-banking-muted text-sm">Your assets have been converted instantly.</p>
            <div className="mt-6 inline-flex items-center gap-4 rounded-xl border border-banking-border bg-banking-offWhite px-8 py-4">
              <div className="text-center">
                <p className="text-xs text-banking-muted">You Sent</p>
                <p className="font-bold text-banking-text text-lg">{amount} {from}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-banking-gold" />
              <div className="text-center">
                <p className="text-xs text-banking-muted">You Got</p>
                <p className="font-bold text-banking-blue text-lg">{received} {to}</p>
              </div>
            </div>
            <button
              onClick={() => { setDone(false); setAmount(""); }}
              className="mt-8 rounded-xl bg-banking-blue px-8 py-3 text-sm font-bold text-white hover:bg-banking-navy transition-all"
            >
              New Exchange
            </button>
          </div>
        </Panel>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title="Currency Exchange"
        description="Instantly convert between BTC, ETH, USDT, and CAD at live rates — no hidden fees."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Exchange Form */}
        <Panel title="Instant Converter">
          <div className="space-y-4">
            {/* From */}
            <div className="rounded-xl border-2 border-banking-border bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-banking-muted">From</span>
                <span className="text-xs text-banking-muted">Balance: <span className="font-bold text-banking-text">{fromAsset.balance} {from}</span></span>
              </div>
              <div className="flex items-center gap-4">
                <AssetSelector value={from} onChange={(s) => { setFrom(s); setAmount(""); }} exclude={to} />
                <div className="flex-1">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    className="w-full bg-transparent text-right text-2xl font-bold text-banking-text outline-none placeholder:text-banking-muted/30"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex gap-2">
                  {["25%", "50%", "75%", "MAX"].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => {
                        const bal = parseFloat(fromAsset.balance.replace(",", ""));
                        const mult = pct === "MAX" ? 1 : parseFloat(pct) / 100;
                        setAmount((bal * mult).toFixed(from === "BTC" ? 8 : from === "ETH" ? 6 : 2));
                      }}
                      className="rounded-lg bg-banking-offWhite border border-banking-border px-2 py-1 text-[10px] font-bold text-banking-muted hover:border-banking-blue hover:text-banking-blue transition-all"
                    >
                      {pct}
                    </button>
                  ))}
                </div>
                {amount && <p className="text-xs text-banking-muted">≈ ${(parseFloat(amount || "0") * fromAsset.priceCAD).toLocaleString(undefined, { maximumFractionDigits: 2 })} CAD</p>}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swap}
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-banking-border bg-white text-banking-muted hover:border-banking-blue hover:text-banking-blue hover:rotate-180 transition-all duration-300"
              >
                <ArrowDownUp className="h-4 w-4" />
              </button>
            </div>

            {/* To */}
            <div className="rounded-xl border-2 border-banking-blue/30 bg-blue-50/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-banking-muted">To</span>
                <span className="text-xs text-banking-muted">Balance: <span className="font-bold text-banking-text">{toAsset.balance} {to}</span></span>
              </div>
              <div className="flex items-center gap-4">
                <AssetSelector value={to} onChange={(s) => setTo(s)} exclude={from} />
                <div className="flex-1 text-right">
                  <p className="text-2xl font-bold text-banking-blue">{received}</p>
                  <p className="text-xs text-banking-muted mt-1">{to}</p>
                </div>
              </div>
            </div>

            {/* Rate + Fee */}
            {amount && parseFloat(amount) > 0 && (
              <div className="rounded-xl border border-banking-border bg-banking-offWhite p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-banking-muted font-semibold">Exchange Rate</span>
                  <span className="font-bold text-banking-text">1 {from} = {rate.toLocaleString(undefined, { maximumFractionDigits: 8 })} {to}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-banking-muted font-semibold">Platform Fee</span>
                  <span className="font-bold text-emerald-600">0.00% — Free</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-banking-muted font-semibold">You Receive</span>
                  <span className="font-bold text-banking-blue">{received} {to}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleExchange}
              disabled={!amount || parseFloat(amount) <= 0 || loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all",
                amount && parseFloat(amount) > 0 && !loading
                  ? "bg-banking-gold text-banking-ink hover:bg-amber-400 shadow-lg"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {loading ? "Processing..." : `Convert ${from} → ${to}`}
            </button>
          </div>
        </Panel>

        {/* Right Panel — Live Rates */}
        <div className="space-y-4">
          <Panel title="Live Market Rates">
            <div className="space-y-3">
              {[
                { pair: "BTC / CAD", rate: "$92,350", change: "+2.4%", up: true },
                { pair: "ETH / CAD", rate: "$3,395", change: "+1.1%", up: true },
                { pair: "USDT / CAD", rate: "$1.00", change: "0.0%", up: true },
                { pair: "BTC / ETH", rate: "27.2 ETH", change: "+1.2%", up: true },
              ].map((r) => (
                <div key={r.pair} className="flex items-center justify-between rounded-xl bg-banking-offWhite border border-banking-border px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-banking-text">{r.pair}</p>
                    <p className="text-xs text-banking-muted">{r.rate}</p>
                  </div>
                  <span className={cn("flex items-center gap-1 text-xs font-bold", r.up ? "text-emerald-600" : "text-red-500")}>
                    <TrendingUp className="h-3 w-3" />
                    {r.change}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent Exchanges">
            <div className="space-y-3">
              {[
                { from: "USDT", to: "BTC", amt: "5,000 USDT", got: "0.0541 BTC", time: "2h ago" },
                { from: "ETH", to: "USDT", amt: "2.0 ETH", got: "6,790 USDT", time: "1d ago" },
                { from: "BTC", to: "CAD", amt: "0.1 BTC", got: "$9,235", time: "3d ago" },
              ].map((r) => (
                <div key={r.time} className="flex items-center justify-between text-sm border-b border-banking-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-banking-text">{r.from} → {r.to}</p>
                    <p className="text-xs text-banking-muted">{r.amt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-banking-blue">{r.got}</p>
                    <p className="text-xs text-banking-muted">{r.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
