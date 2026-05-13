import { ArrowUpRight, PieChart, TrendingUp } from "lucide-react";
import { portfolioAssets } from "@/data/mock";

export function AllocationDonut() {
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
      <div className="relative mx-auto grid h-48 w-48 place-items-center rounded-full bg-[conic-gradient(#014EA1_0_52%,#3878B8_52%_83%,#FDC205_83%_100%)]">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center shadow-inner">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-banking-muted">
              Assets
            </p>
            <p className="mt-1 text-2xl font-semibold">3</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {portfolioAssets.map((asset, index) => (
          <div key={asset.symbol} className="flex items-center justify-between gap-4 rounded-md border border-banking-border p-3">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: ["#014EA1", "#3878B8", "#FDC205"][index] }}
              />
              <div>
                <p className="font-semibold">{asset.symbol}</p>
                <p className="text-sm text-banking-muted">{asset.name}</p>
              </div>
            </div>
            <p className="font-semibold">{asset.allocation}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioInsightStrip() {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      {[
        ["Net deposits", "$96,400.28", "+$9,340.18 unrealized", TrendingUp],
        ["Best performer", "BTC", "+4.8% today", ArrowUpRight],
        ["Risk profile", "Balanced", "52% BTC allocation", PieChart],
      ].map(([label, value, detail, Icon]) => (
        <article key={label as string} className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
          <Icon className="h-5 w-5 text-banking-blue" />
          <p className="mt-4 text-sm font-medium text-banking-muted">{label as string}</p>
          <p className="mt-1 text-2xl font-semibold">{value as string}</p>
          <p className="mt-2 text-sm text-banking-muted">{detail as string}</p>
        </article>
      ))}
    </div>
  );
}
