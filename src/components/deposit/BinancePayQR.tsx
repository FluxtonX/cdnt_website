"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";

interface BinancePayQRProps {
  qrContent: string;
  checkoutUrl: string;
  tradeNo: string;
  amount: number;
  asset: string;
  status: string;
  onCheckStatus: () => void;
  checkingStatus: boolean;
}

export function BinancePayQR({
  qrContent,
  checkoutUrl,
  tradeNo,
  amount,
  asset,
  status,
  onCheckStatus,
  checkingStatus,
}: BinancePayQRProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#0A0F2C] p-6 text-white shadow-lg">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-amber-400">AUTOMATED DEPOSIT</p>
          <p className="text-lg font-bold">Binance Pay Checkout</p>
        </div>
        <div className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-500 border border-yellow-500/20">
          Binance Pay
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6">
        <QRCodeSVG
          value={qrContent}
          size={200}
          level="H"
          includeMargin
          className="h-auto max-w-full"
        />
        <p className="mt-3 text-center text-xs font-medium text-gray-500">
          Scan this QR code with your Binance App to pay
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3.5 text-sm font-bold text-[#0A0F2C] transition-colors hover:bg-yellow-400"
        >
          <span>Pay via Binance Web / App</span>
          <ExternalLink className="h-4 w-4" />
        </a>

        <button
          onClick={onCheckStatus}
          disabled={checkingStatus}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${checkingStatus ? "animate-spin" : ""}`} />
          {checkingStatus ? "Checking..." : "Verify Payment Status"}
        </button>
      </div>

      <div className="mt-5 rounded-xl bg-white/5 p-4 border border-white/10 text-xs space-y-2 text-white/80">
        <div className="flex justify-between">
          <span>Amount:</span>
          <span className="font-bold text-white">{amount} {asset}</span>
        </div>
        <div className="flex justify-between">
          <span>Order ID:</span>
          <span className="font-mono text-[10px]">{tradeNo}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Payment Status:</span>
          <span className="flex items-center gap-1.5 font-bold text-yellow-500">
            {status === "PENDING" || status === "INITIAL" ? (
              <>
                <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                Awaiting Payment
              </>
            ) : status === "PAID" ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Paid Successfully
              </span>
            ) : (
              <span className="text-red-500">{status}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
