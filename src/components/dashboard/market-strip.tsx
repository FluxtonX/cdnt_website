import { ArrowUpRight, ShieldCheck } from "lucide-react";

const prices = [
  { symbol: "BTC", price: "$69,420.12", change: "+4.8%" },
  { symbol: "ETH", price: "$3,395.40", change: "+2.1%" },
  { symbol: "USDT", price: "$1.00", change: "0.0%" },
];

export function MarketStrip() {
  return (
    <section className="mb-6 grid gap-3 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-3 rounded-lg border border-banking-border bg-white p-4 shadow-sm md:grid-cols-3">
        {prices.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-banking-muted">
                {item.symbol}
              </p>
              <p className="mt-1 text-lg font-semibold">{item.price}</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {item.change}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm">
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Account healthy</p>
            <p className="mt-1 text-sm leading-5">
              KYC approved, 2FA enabled, no active restrictions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
