"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Loader2 } from "lucide-react";
import { FixedDepositQR } from "./FixedDepositQR";
import type { DepositAddressConfig } from "@/config/depositAddresses";

export function BinancePayCard({
  amount,
  asset,
  reference,
  config,
}: {
  amount: number;
  asset: string;
  reference: string;
  config: DepositAddressConfig;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payUrl, setPayUrl] = useState<string | null>(null);

  const createOrder = async () => {
    setError(null);
    setPayUrl(null);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setError("Invalid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/binance-pay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, asset, reference }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error || 'Create order failed');
      } else {
        // Prefer common locations for pay link
        const pay = payload?.data?.payUrl || payload?.data?.qrCode || payload?.payUrl || payload?.qrCode || null;
        if (pay) setPayUrl(pay);
        else setError('No payUrl returned from Binance Pay');
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!payUrl) return;
    await navigator.clipboard.writeText(payUrl);
  };

  return (
    <div className="rounded-2xl border p-5">
      <h3 className="mb-2 text-sm font-bold">Pay with Binance</h3>
      <p className="mb-4 text-xs text-[#718096]">Create a Binance Pay order and scan its QR in the Binance app to pay instantly to the merchant account.</p>

      <div className="mb-4">
        <div className="text-xs text-[#718096]">Amount</div>
        <div className="mt-1 rounded-2xl border px-4 py-3 text-lg font-bold">{amount} {asset}</div>
      </div>

      <div className="flex gap-2">
        <button onClick={createOrder} disabled={loading} className="flex-1 rounded-2xl bg-[#F59E0B] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
          {loading ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating...</span> : 'Create Binance Pay order'}
        </button>
        <button onClick={() => { setPayUrl(null); setError(null); }} className="rounded-2xl border px-4 py-3 text-sm font-bold">Reset</button>
      </div>

      {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

      {payUrl ? (
        <div className="mt-4 flex flex-col items-start gap-3">
          <div className="rounded bg-white p-3">
            <QRCodeSVG value={payUrl} size={200} level="H" includeMargin />
          </div>
          <div className="flex items-center gap-2">
            <a href={payUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#113285]">Open payment link</a>
            <button onClick={copyLink} className="inline-flex items-center gap-2 rounded px-3 py-2 text-xs font-medium border"><Copy className="h-4 w-4" />Copy link</button>
          </div>
          <div className="w-full">
            {/* Also show company deposit QR (for record) */}
            <FixedDepositQR config={config} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
