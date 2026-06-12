import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, Smartphone, Clock } from "lucide-react";

interface BinancePayQRProps {
  qrContent: string;
  checkoutUrl: string;
  deeplink?: string;
  universalUrl?: string;
  expireTime?: number;
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
  deeplink,
  universalUrl,
  expireTime,
  tradeNo,
  amount,
  asset,
  status,
  onCheckStatus,
  checkingStatus,
}: BinancePayQRProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (!expireTime) return 900;
    return Math.max(0, Math.floor((expireTime - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!expireTime) return;
    
    // Update immediately
    const updateTime = () => {
      const remaining = Math.max(0, Math.floor((expireTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    updateTime();

    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [expireTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isExpired = timeLeft <= 0 || status === "EXPIRED";

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

      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 relative">
        {isExpired && (
          <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 text-[#0A0F2C]">
            <Clock className="h-12 w-12 text-red-500 mb-2 animate-pulse" />
            <p className="font-bold text-lg">Payment Expired</p>
            <p className="text-xs text-gray-500 text-center mt-1">
              This payment session has timed out. Please generate a new QR code.
            </p>
          </div>
        )}
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
        {universalUrl || deeplink ? (
          <a
            href={isExpired ? undefined : (universalUrl || deeplink)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3.5 text-sm font-bold text-[#0A0F2C] transition-colors hover:bg-yellow-400 ${
              isExpired ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Open Binance App</span>
          </a>
        ) : null}

        <a
          href={isExpired ? undefined : checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 ${
            isExpired ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <span>Pay via Web Browser</span>
          <ExternalLink className="h-4 w-4" />
        </a>

        {!isExpired && (
          <button
            onClick={onCheckStatus}
            disabled={checkingStatus}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${checkingStatus ? "animate-spin" : ""}`} />
            {checkingStatus ? "Checking..." : "Verify Payment Status"}
          </button>
        )}
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
          <span>Time Remaining:</span>
          <span className={`font-mono font-bold ${isExpired ? "text-red-500" : "text-yellow-500"}`}>
            {isExpired ? "00:00 (Expired)" : formatTime(timeLeft)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Payment Status:</span>
          <span className="flex items-center gap-1.5 font-bold text-yellow-500">
            {isExpired ? (
              <span className="text-red-500">EXPIRED</span>
            ) : status === "PENDING" || status === "INITIAL" ? (
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
