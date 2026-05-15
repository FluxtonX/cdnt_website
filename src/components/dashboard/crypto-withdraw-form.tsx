"use client";

import * as React from "react";
import {
  AlertTriangle, ArrowRight, CheckCircle2, ChevronRight,
  Clock, Copy, Lock, ShieldCheck, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const ASSETS = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.8421", cad: "$77,812.40", networks: ["Bitcoin"], image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { symbol: "ETH", name: "Ethereum", balance: "8.2140", cad: "$27,890.12", networks: ["ERC-20"], image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { symbol: "USDT", name: "Tether", balance: "19,430.00", cad: "$19,430.00", networks: ["ERC-20", "TRC-20"], image: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
  { symbol: "BNB", name: "Binance Coin", balance: "45.20", cad: "$28,120.40", networks: ["BEP-20"], image: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { symbol: "SOL", name: "Solana", balance: "124.50", cad: "$18,432.10", networks: ["Solana"], image: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { symbol: "XRP", name: "Ripple", balance: "12,500.00", cad: "$7,500.00", networks: ["Ripple"], image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" },
];

const FEES: Record<string, Record<string, { economy: string; standard: string; priority: string }>> = {
  BTC: { Bitcoin: { economy: "0.00003 BTC", standard: "0.00005 BTC", priority: "0.0001 BTC" } },
  ETH: { "ERC-20": { economy: "0.001 ETH", standard: "0.002 ETH", priority: "0.004 ETH" } },
  USDT: {
    "ERC-20": { economy: "2 USDT", standard: "4 USDT", priority: "8 USDT" },
    "TRC-20": { economy: "1 USDT", standard: "1 USDT", priority: "1 USDT" },
  },
  BNB: { "BEP-20": { economy: "0.0001 BNB", standard: "0.0002 BNB", priority: "0.0005 BNB" } },
  SOL: { Solana: { economy: "0.0001 SOL", standard: "0.0005 SOL", priority: "0.001 SOL" } },
  XRP: { Ripple: { economy: "0.1 XRP", standard: "0.25 XRP", priority: "0.5 XRP" } },
};

const LIMITS = { daily: 50000, used: 46200 };

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export function CryptoWithdrawForm() {
  const { notify } = useToast();
  const [step, setStep] = React.useState<Step>(1);
  const [asset, setAsset] = React.useState(ASSETS[0]);
  const [network, setNetwork] = React.useState("Bitcoin");
  const [address, setAddress] = React.useState("");
  const [saveAddress, setSaveAddress] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [feeTier, setFeeTier] = React.useState<"economy" | "standard" | "priority">("standard");
  const [twoFA, setTwoFA] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [txnId] = React.useState(`WD-${Math.floor(90000 + Math.random() * 9999)}`);

  const feeInfo = FEES[asset.symbol]?.[network] ?? { economy: "0", standard: "0", priority: "0" };
  const remaining = LIMITS.daily - LIMITS.used;
  const usedPct = Math.round((LIMITS.used / LIMITS.daily) * 100);

  const isValidAddress = address.length >= 26;

  const steps = ["Asset", "Network", "Address", "Amount", "Confirm", "Done"];

  function next() { setStep((s) => Math.min(s + 1, 6) as Step); }
  function back() { setStep((s) => Math.max(s - 1, 1) as Step); }

  return (
    <div className="mx-auto max-w-xl">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex gap-1 mb-3">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={cn("h-1 rounded-full transition-all", i < step ? "bg-banking-blue" : "bg-banking-border")} />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {steps.map((s, i) => (
            <span key={s} className={cn("text-[9px] font-bold uppercase tracking-widest", i + 1 === step ? "text-banking-blue" : "text-banking-muted")}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Step 1 — Asset */}
      {step === 1 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-banking-text mb-4">Select Asset to Withdraw</h3>
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {ASSETS.map((a) => {
              return (
                <button
                  key={a.symbol}
                  onClick={() => { setAsset(a); setNetwork(a.networks[0]); next(); }}
                  className="w-full flex items-center justify-between rounded-xl border-2 border-banking-border bg-white p-4 text-left hover:border-banking-blue hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-banking-border p-1.5 transition-transform group-hover:scale-110">
                      <img src={a.image} alt={a.symbol} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-banking-text">{a.symbol}</p>
                      <p className="text-[11px] text-banking-muted">{a.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-banking-text">{a.balance} {a.symbol}</p>
                    <p className="text-[11px] text-banking-muted">{a.cad}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2 — Network */}
      {step === 2 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-banking-text mb-1">Select Network</h3>
          <p className="text-sm text-banking-muted mb-4">Asset: <span className="font-bold text-banking-blue">{asset.symbol} — {asset.name}</span></p>
          {asset.networks.map((net) => {
            const fee = FEES[asset.symbol]?.[net]?.standard ?? "";
            return (
              <button
                key={net}
                onClick={() => { setNetwork(net); next(); }}
                className="w-full flex items-center justify-between rounded-xl border-2 border-banking-border bg-white p-4 text-left hover:border-banking-blue hover:shadow-lg transition-all"
              >
                <div>
                  <p className="font-bold text-banking-text">{net}</p>
                  <p className="text-xs text-banking-muted mt-0.5">Standard fee: {fee.split("(")[0].trim()}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-banking-muted">
                  <Clock className="h-3 w-3" />
                  {fee.match(/\(([^)]+)\)/)?.[1] ?? ""}
                </div>
              </button>
            );
          })}
          <button onClick={back} className="mt-2 text-sm text-banking-muted hover:text-banking-blue font-bold">← Back</button>
        </div>
      )}

      {/* Step 3 — Address */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-banking-text mb-1">Destination Wallet Address</h3>
          <p className="text-sm text-banking-muted">Network: <span className="font-bold text-banking-blue">{network}</span></p>

          <div className={cn("rounded-xl border-2 p-4 transition-all", isValidAddress ? "border-emerald-400 bg-emerald-50/30" : "border-banking-border bg-white")}>
            <label className="text-[10px] font-bold uppercase tracking-widest text-banking-muted">Wallet Address</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={network === "Bitcoin" ? "bc1q... or 1... or 3..." : "0x..."}
                className="flex-1 bg-transparent text-sm font-mono text-banking-text outline-none placeholder:text-banking-muted/50"
              />
              {isValidAddress && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
            </div>
          </div>

          {!isValidAddress && address.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-xs font-semibold text-red-600">Invalid address format — verify before continuing</p>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 font-semibold">Wrong network = permanent loss. Triple-check your address.</p>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-banking-border bg-white p-3 cursor-pointer hover:border-banking-blue transition-all">
            <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4 accent-banking-blue" />
            <div>
              <p className="text-sm font-bold text-banking-text">Save to Whitelist</p>
              <p className="text-xs text-banking-muted">Faster withdrawals to trusted addresses (24h hold on new addresses)</p>
            </div>
            <ShieldCheck className="h-4 w-4 text-banking-blue ml-auto shrink-0" />
          </label>

          <div className="flex gap-3 pt-2">
            <button onClick={back} className="flex-1 rounded-xl border border-banking-border py-3 text-sm font-bold text-banking-muted hover:bg-banking-offWhite transition-all">Back</button>
            <button
              onClick={next}
              disabled={!isValidAddress}
              className={cn("flex-1 rounded-xl py-3 text-sm font-bold transition-all", isValidAddress ? "bg-banking-blue text-white hover:bg-banking-navy" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Amount */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-banking-text mb-1">Enter Amount</h3>

          <div className="rounded-xl border-2 border-banking-border bg-white p-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-banking-muted">Amount ({asset.symbol})</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000000"
                type="number"
                className="flex-1 bg-transparent text-2xl font-bold text-banking-text outline-none placeholder:text-banking-muted/30"
              />
              <button
                onClick={() => setAmount(asset.balance.replace(",", ""))}
                className="rounded-lg bg-banking-gold/20 border border-banking-gold/30 px-3 py-1.5 text-[10px] font-bold text-banking-ink hover:bg-banking-gold transition-all"
              >
                MAX
              </button>
            </div>
            <p className="mt-1 text-xs text-banking-muted">≈ {asset.cad} CAD equivalent</p>
          </div>

          {/* Fee Tier */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-banking-muted">Transaction Speed</p>
            {(["economy", "standard", "priority"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setFeeTier(tier)}
                className={cn("w-full flex items-center justify-between rounded-xl border-2 p-3 text-left transition-all", feeTier === tier ? "border-banking-blue bg-blue-50" : "border-banking-border bg-white hover:border-banking-blue/50")}
              >
                <div className="flex items-center gap-2">
                  {tier === "priority" ? <Zap className="h-3.5 w-3.5 text-banking-gold" /> : <Clock className="h-3.5 w-3.5 text-banking-muted" />}
                  <span className="capitalize text-sm font-bold text-banking-text">{tier}</span>
                </div>
                <span className="text-xs text-banking-muted">{feeInfo[tier]}</span>
              </button>
            ))}
          </div>

          {/* Limits */}
          <div className="rounded-xl border border-banking-border bg-banking-offWhite p-3">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-bold text-banking-muted">Daily Limit Used</span>
              <span className="font-bold text-banking-text">${LIMITS.used.toLocaleString()} / ${LIMITS.daily.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-banking-border">
              <div className={cn("h-2 rounded-full transition-all", usedPct > 90 ? "bg-amber-500" : "bg-banking-blue")} style={{ width: `${usedPct}%` }} />
            </div>
            <p className="mt-1.5 text-[10px] text-banking-muted">Remaining today: ${remaining.toLocaleString()} CAD</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={back} className="flex-1 rounded-xl border border-banking-border py-3 text-sm font-bold text-banking-muted hover:bg-banking-offWhite">Back</button>
            <button
              onClick={next}
              disabled={!amount || parseFloat(amount) <= 0}
              className={cn("flex-1 rounded-xl py-3 text-sm font-bold transition-all", amount && parseFloat(amount) > 0 ? "bg-banking-blue text-white hover:bg-banking-navy" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
            >
              Review →
            </button>
          </div>
        </div>
      )}

      {/* Step 5 — Confirm */}
      {step === 5 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-banking-text mb-1">Confirm Withdrawal</h3>

          {/* Summary */}
          <div className="rounded-xl border border-banking-border bg-white p-4 space-y-3">
            {[
              ["Asset", `${asset.symbol} — ${asset.name}`],
              ["Network", network],
              ["Destination", address.length > 20 ? `${address.slice(0, 10)}...${address.slice(-6)}` : address],
              ["Amount", `${amount} ${asset.symbol}`],
              ["Fee", feeInfo[feeTier].split("(")[0].trim()],
              ["Speed", feeTier.charAt(0).toUpperCase() + feeTier.slice(1)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="text-banking-muted font-semibold">{k}</span>
                <span className="font-bold text-banking-text">{v}</span>
              </div>
            ))}
          </div>

          {/* 2FA */}
          <div className="rounded-xl border border-banking-border bg-white p-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-banking-muted">2FA Authentication Code</label>
            <div className="flex items-center gap-3 mt-2">
              <Lock className="h-4 w-4 text-banking-muted shrink-0" />
              <input
                value={twoFA}
                onChange={(e) => setTwoFA(e.target.value.slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="flex-1 bg-transparent text-2xl font-bold tracking-[0.5em] text-banking-text outline-none placeholder:text-banking-muted/30"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-banking-border bg-amber-50 p-3 cursor-pointer">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-banking-blue shrink-0" />
            <p className="text-xs font-semibold text-amber-800">I confirm this wallet address is correct. I understand crypto transactions are irreversible.</p>
          </label>

          <div className="flex gap-3 pt-2">
            <button onClick={back} className="flex-1 rounded-xl border border-banking-border py-3 text-sm font-bold text-banking-muted hover:bg-banking-offWhite">Back</button>
            <button
              onClick={() => { if (twoFA.length === 6 && confirmed) { next(); notify({ title: "Withdrawal Submitted", description: `${amount} ${asset.symbol} withdrawal is under review.` }); } }}
              disabled={twoFA.length < 6 || !confirmed}
              className={cn("flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all", twoFA.length === 6 && confirmed ? "bg-banking-blue text-white hover:bg-banking-navy" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
            >
              <ShieldCheck className="h-4 w-4" /> Confirm
            </button>
          </div>
        </div>
      )}

      {/* Step 6 — Success */}
      {step === 6 && (
        <div className="text-center py-8">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100 mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-banking-text">Withdrawal Submitted!</h3>
          <p className="mt-2 text-banking-muted text-sm">Your request is under compliance review.</p>

          <div className="mt-6 rounded-xl border border-banking-border bg-banking-offWhite p-4 text-left space-y-2">
            {[
              ["Reference", txnId],
              ["Asset", `${amount} ${asset.symbol}`],
              ["Network", network],
              ["Est. Arrival", feeTier === "priority" ? "5–15 min" : feeTier === "standard" ? "15–30 min" : "30–60 min"],
              ["Status", "Under Review"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-banking-muted">{k}</span>
                <span className="font-bold text-banking-text">{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => { setStep(1); setAddress(""); setAmount(""); setTwoFA(""); setConfirmed(false); }} className="flex-1 rounded-xl border border-banking-border py-3 text-sm font-bold text-banking-muted hover:bg-banking-offWhite">
              New Withdrawal
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-banking-blue py-3 text-sm font-bold text-white hover:bg-banking-navy">
              Track Status <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
