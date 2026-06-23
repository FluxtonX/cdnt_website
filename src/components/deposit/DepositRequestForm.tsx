"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { DepositAddressConfig } from "@/config/depositAddresses";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export function DepositRequestForm({ config, amount }: { config: DepositAddressConfig; amount: number }) {
  const supabase = createClient();
  const router = useRouter();
  const { notify } = useToast();
  const [txHash, setTxHash] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const canSubmit =
    Number.isFinite(amount) &&
    amount >= config.minAmount &&
    txHash.trim().length > 0 &&
    !submitting;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!canSubmit) {
      setMessage({
        type: "error",
        text: `Enter an amount of at least ${config.minAmount} ${config.asset} and a transaction hash.`,
      });
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSubmitting(false);
      setMessage({ type: "error", text: "Please sign in before submitting a deposit request." });
      return;
    }

    const { error } = await supabase.from("deposit_requests").insert({
      user_id: user.id,
      asset: config.asset,
      network: config.network,
      company_address: config.address,
      expected_amount: amount,
      tx_hash: txHash.trim(),
      status: "pending",
    });

    setSubmitting(false);

    if (error) {
      setMessage({
        type: "error",
        text: "Deposit request could not be submitted. Please try again or contact support.",
      });
      return;
    }

    setTxHash("");
    notify({
      title: "Deposit request submitted successfully! Awaiting admin approval.",
    });
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
      <h3 className="text-sm font-bold text-[#0A0F2C]">Submit deposit request</h3>
      <p className="mt-1 text-xs font-medium leading-5 text-[#718096]">
        Use this after sending funds from your external wallet. Balance is not credited automatically.
      </p>

      <div className="mt-4 grid gap-4">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#718096]">
            Transaction hash / ID
          </span>
          <input
            value={txHash}
            onChange={(event) => setTxHash(event.target.value)}
            placeholder="Paste tx hash after sending"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#0A0F2C] outline-none focus:border-[#113285] focus:ring-4 focus:ring-[#113285]/10"
          />
        </label>
      </div>

      {message ? (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#113285] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0D2768] disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
