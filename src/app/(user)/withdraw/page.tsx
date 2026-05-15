"use client";

import { useState } from "react";
import { ArrowUpRight, Bitcoin, Landmark } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { WithdrawalForm } from "@/components/forms/withdrawal-form";
import { CryptoWithdrawForm } from "@/components/dashboard/crypto-withdraw-form";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "crypto", label: "Crypto Withdrawal", icon: Bitcoin, desc: "BTC / ETH / USDT" },
  { id: "interac", label: "Interac / Fiat", icon: Landmark, desc: "CAD Bank Transfer" },
];

export default function WithdrawPage() {
  const [tab, setTab] = useState<"crypto" | "interac">("crypto");

  return (
    <>
      <PageTitle
        title="Withdraw Funds"
        description="Securely withdraw crypto to an external wallet, or request a fiat Interac transfer to your bank account."
      />

      {/* Tab Switcher */}
      <div className="mb-8 flex gap-3">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as "crypto" | "interac")}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 px-5 py-3 text-left transition-all",
                tab === t.id
                  ? "border-banking-blue bg-blue-50 shadow-lg shadow-banking-blue/10"
                  : "border-banking-border bg-white hover:border-banking-blue/40"
              )}
            >
              <Icon className={cn("h-5 w-5", tab === t.id ? "text-banking-blue" : "text-banking-muted")} />
              <div>
                <p className={cn("text-sm font-black", tab === t.id ? "text-banking-blue" : "text-banking-text")}>{t.label}</p>
                <p className="text-xs text-banking-muted">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {tab === "crypto" && (
        <Panel title="Crypto Withdrawal — Step-by-Step">
          <CryptoWithdrawForm />
        </Panel>
      )}

      {tab === "interac" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Panel title="Interac Withdrawal Request">
            <WithdrawalForm />
          </Panel>
          <Panel title="Limits and Status">
            <div className="space-y-4 text-sm">
              <div className="rounded-xl bg-banking-offWhite p-4 border border-banking-border">
                <p className="font-black text-banking-muted uppercase text-[10px] tracking-widest">Available Balance</p>
                <p className="mt-2 text-3xl font-black text-banking-blue">$88,940.46</p>
              </div>
              <div className="rounded-xl border border-banking-border p-4 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-banking-muted mb-3">Withdrawal Limits</p>
                {[
                  ["Minimum", "$100 CAD"],
                  ["Daily Limit", "$10,000 CAD"],
                  ["Monthly Limit", "$50,000 CAD"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-banking-muted">{k}</span>
                    <span className="font-black text-banking-text">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-banking-muted leading-relaxed">Large or suspicious withdrawals may be flagged for compliance review.</p>
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}
