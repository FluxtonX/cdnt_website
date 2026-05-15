import Link from "next/link";
import { ArrowDownToLine, CircleDollarSign, Plus, ArrowUpRight, ShieldCheck, RefreshCw } from "lucide-react";
import {
  AccountHealth,
  AssetRow,
  PageTitle,
  Panel,
  PerformanceChart,
  StatCard,
  TransactionTable,
} from "@/components/dashboard/blocks";
import { MarketStrip } from "@/components/dashboard/market-strip";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { dashboardStats, portfolioAssets, transactions } from "@/data/mock";

export default function DashboardPage() {
  return (
    <>
      <PageTitle
        title="Command Center"
        description="Welcome back. Here is your unified view of your portfolio, accounts, and market performance."
        action={
          <div className="flex gap-3">
            <Link
              href="/deposit"
              className="relative inline-flex items-center gap-2 rounded-lg bg-banking-blue px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-banking-blue/20 hover:bg-banking-navy transition-all active:scale-95"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Deposit
            </Link>
            <Link
              href="/withdraw"
              className="relative inline-flex items-center gap-2 rounded-lg border-2 border-banking-blue bg-white px-6 py-2.5 text-sm font-bold text-banking-blue hover:bg-blue-50 transition-all active:scale-95"
            >
              <ArrowUpRight className="h-4 w-4" />
              Withdraw
            </Link>
            <Link
              href="/exchange"
              className="relative inline-flex items-center gap-2 rounded-lg bg-banking-gold px-6 py-2.5 text-sm font-bold text-banking-ink shadow-lg shadow-banking-gold/20 hover:bg-amber-400 transition-all active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Exchange
            </Link>
          </div>
        }
      />
      
      <div className="mb-6 rounded-xl bg-banking-gold p-4 shadow-lg shadow-banking-gold/10 border border-banking-gold/20 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-banking-ink text-banking-gold shadow-xl">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-banking-ink opacity-60">Security Action Required</p>
            <p className="text-sm font-black text-banking-ink">Verify your identity to enable full portfolio access and withdrawals.</p>
          </div>
        </div>
        <Link href="/kyc" className="shrink-0 rounded-lg bg-banking-ink px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-banking-navy transition-all shadow-xl">
          Complete Verification Now
        </Link>
      </div>

      <MarketStrip />
      
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5 overflow-hidden">
        <AccountHealth />
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
        <StatCard 
          label="Credit Score" 
          value="784" 
          detail="TransUnion® • Excellent" 
          tone="positive" 
          icon={ShieldCheck} 
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8 min-w-0">
          <Panel title="Portfolio performance (30D)">
            <PerformanceChart />
          </Panel>
          
          <Panel 
            title="Recent Activity" 
            action={<Link href="/transactions" className="text-[10px] font-black uppercase tracking-widest text-banking-blue hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Transaction Ledger</Link>}
          >
            <TransactionTable rows={transactions.slice(0, 5)} />
          </Panel>
        </div>

        <div className="space-y-8">
          <Panel title="Asset Distribution">
            <div className="space-y-1">
              {portfolioAssets.map((asset) => (
                <AssetRow key={asset.symbol} {...asset} />
              ))}
            </div>
          </Panel>

          <Panel title="Quick Links">
            <QuickActions />
          </Panel>
        </div>
      </div>
    </>
  );
}

