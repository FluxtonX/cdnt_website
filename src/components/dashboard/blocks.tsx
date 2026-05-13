import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { performancePoints } from "@/data/mock";
import { cn } from "@/lib/utils";

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal text-banking-text">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-banking-muted">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <article className="rounded-xl border border-banking-border bg-white p-5 shadow-[2px_2px_0px_0px_rgba(8,23,54,0.1)] border-b-2 border-r-2 border-banking-gold/30 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(8,23,54,0.1)]">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-widest text-banking-muted">{label}</p>
          <p className="mt-1 text-xl font-black tracking-tight text-banking-ink truncate">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-banking-border bg-banking-offWhite shadow-inner",
            tone === "positive" && "text-emerald-600 bg-emerald-50/50 border-emerald-100",
            tone === "warning" && "text-amber-600 bg-amber-50/50 border-amber-100",
            tone === "neutral" && "text-banking-blue bg-blue-50/50 border-blue-100",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-banking-border/50 flex items-center justify-between">
        <p className="text-[10px] font-bold text-banking-muted truncate">
          {detail}
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-banking-gold shadow-glow-gold shrink-0" />
      </div>
    </article>
  );
}


export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border-2 border-banking-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black tracking-tight text-banking-ink">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PerformanceChart() {
  const bars = [45, 52, 48, 65, 59, 72, 85, 78, 92, 88, 95];
  return (
    <div className="flex h-56 items-end gap-3 rounded-xl bg-banking-offWhite p-6 border border-banking-border shadow-inner">
      {bars.map((point, index) => (
        <div key={index} className="flex flex-1 items-end group relative h-full">
          <div
            className={cn(
              "w-full rounded-t-lg transition-all duration-500 shadow-lg",
              index === bars.length - 1 ? "bg-banking-gold" : "bg-banking-blue/60 group-hover:bg-banking-blue"
            )}
            style={{ height: `${point}%` }}
          />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-banking-ink px-2.5 py-1.5 text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl whitespace-nowrap z-20">
            {point}.4% APY
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-banking-ink" />
          </div>
        </div>
      ))}
    </div>
  );
}


export function AssetRow({
  symbol,
  name,
  balance,
  value,
  allocation,
  change,
}: {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  allocation: number;
  change: string;
}) {
  return (
    <div className="grid gap-3 border-b border-banking-border py-4 last:border-0 md:grid-cols-[1.2fr_1fr_1fr_0.8fr] md:items-center hover:bg-banking-offWhite px-2 rounded-lg transition-colors">
      <div>
        <p className="font-black text-banking-ink">{symbol}</p>
        <p className="text-[10px] font-bold uppercase text-banking-muted">{name}</p>
      </div>
      <div className="text-sm font-semibold text-banking-muted">{balance}</div>
      <div className="font-black text-banking-blue">{value}</div>
      <div>
        <div className="mb-1.5 flex justify-between text-[10px] font-black text-banking-muted uppercase">
          <span>{change}</span>
          <span>{allocation}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-banking-border">
          <div
            className="h-full rounded-full bg-banking-gold"
            style={{ width: `${allocation}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function AccountHealth() {
  return (
    <article className="rounded-xl border border-banking-border bg-white p-5 shadow-[2px_2px_0px_0px_rgba(8,23,54,0.1)] border-b-2 border-r-2 border-banking-gold/30 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(8,23,54,0.1)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-bold text-banking-ink uppercase tracking-widest">Account Health</h3>
        <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase">Pending Verification</span>
      </div>
      <div className="flex items-end gap-1 mb-4 h-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className={cn("flex-1 rounded-sm transition-all", i <= 4 ? "bg-banking-gold h-2.5" : "bg-slate-100 h-1.5")} />
        ))}
      </div>
      <div className="pt-3 border-t border-banking-border/50">
        <p className="text-[10px] font-bold text-banking-muted leading-tight">
          Verify identity to unlock full limits. <Link href="/kyc" className="text-banking-blue hover:underline">Verify Now</Link>
        </p>
      </div>
    </article>
  );
}




export function TransactionTable({
  rows,
}: {
  rows: Array<{
    id: string;
    type: string;
    asset: string;
    amount: string;
    fiat: string;
    status: string;
    date: string;
    description?: string;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-banking-border text-xs uppercase tracking-[0.12em] text-banking-muted">
          <tr>
            <th className="py-3 font-semibold">Date</th>
            <th className="py-3 font-semibold">Description</th>
            <th className="py-3 font-semibold">Type</th>
            <th className="py-3 font-semibold">Asset</th>
            <th className="py-3 font-semibold">Amount</th>
            <th className="py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-banking-border last:border-0 hover:bg-banking-offWhite transition-colors">
              <td className="py-4 text-banking-muted">{row.date}</td>
              <td className="py-4 font-semibold text-banking-text">
                <div className="flex flex-col">
                  <span>{row.description || row.id}</span>
                  <span className="text-[10px] font-medium text-banking-muted uppercase">{row.id}</span>
                </div>
              </td>
              <td className="py-4 text-xs font-medium uppercase text-banking-muted">{row.type.replaceAll("_", " ")}</td>
              <td className="py-4">{row.asset}</td>
              <td className="py-4 font-bold text-banking-text">{row.amount}</td>
              <td className="py-4"><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

