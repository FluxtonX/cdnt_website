import { ArrowUpRight, TrendingUp, ShieldAlert, BarChart3, Info } from "lucide-react";
import { PageTitle, Panel, PerformanceChart } from "@/components/dashboard/blocks";
import { AllocationDonut, PortfolioInsightStrip } from "@/components/dashboard/portfolio-insights";
import { portfolioAssets } from "@/data/mock";
import { cn } from "@/lib/utils";

function RiskMetric({ label, value, detail, status }: { label: string; value: string; detail: string; status: 'good' | 'neutral' | 'warn' }) {
  return (
    <div className="rounded-xl border border-banking-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-banking-muted">{label}</span>
        <div className={cn(
          "h-2 w-2 rounded-full",
          status === 'good' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
          status === 'warn' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-blue-500'
        )} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-banking-text">{value}</span>
        <span className="text-xs font-medium text-banking-muted">{detail}</span>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <>
      <PageTitle
        title="Portfolio Analytics"
        description="Institutional-grade visibility into your asset performance, risk metrics, and tax-efficient profit/loss tracking."
      />
      
      <PortfolioInsightStrip />

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <RiskMetric label="Beta (Market Vol)" value="0.84" detail="Low Volatility" status="good" />
        <RiskMetric label="Sharpe Ratio" value="2.14" detail="High Efficiency" status="good" />
        <RiskMetric label="Max Drawdown" value="12.4%" detail="Last 12 Months" status="neutral" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <Panel title="Value Growth (365D)">
            <PerformanceChart />
          </Panel>

          <Panel title="Detailed Asset Inventory">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-banking-border text-[11px] font-bold uppercase tracking-wider text-banking-muted">
                  <tr>
                    <th className="pb-4">Asset</th>
                    <th className="pb-4">Balance</th>
                    <th className="pb-4">Market Value</th>
                    <th className="pb-4">Net P/L</th>
                    <th className="pb-4">Network</th>
                    <th className="pb-4">Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-banking-border">
                  {portfolioAssets.map((asset) => (
                    <tr key={asset.symbol} className="group hover:bg-banking-offWhite transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-banking-offWhite font-bold text-xs group-hover:bg-white transition-colors">
                            {asset.symbol.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-banking-text">{asset.symbol}</p>
                            <p className="text-xs text-banking-muted">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 font-medium text-banking-text">{asset.balance}</td>
                      <td className="py-5 font-bold text-banking-text">{asset.value}</td>
                      <td className="py-5">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <ArrowUpRight className="h-3 w-3" />
                          {asset.change}
                        </span>
                      </td>
                      <td className="py-5 text-xs font-bold text-banking-muted uppercase tracking-tight">{asset.network}</td>
                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                            <div 
                              className="h-1.5 rounded-full bg-banking-blue" 
                              style={{ width: `${asset.allocation}%` }} 
                            />
                          </div>
                          <span className="text-[11px] font-bold w-8">{asset.allocation}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="space-y-8">
          <Panel title="Allocation Breakdown">
            <AllocationDonut />
          </Panel>

          <Panel title="P/L Summary (YTD)">
            <div className="space-y-4">
              <div className="rounded-xl border border-banking-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-banking-muted uppercase">Unrealized P/L</span>
                  <Info className="h-4 w-4 text-banking-muted" />
                </div>
                <p className="text-3xl font-bold text-emerald-600">+$12,842.10</p>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">+14.2% Growth</span>
                </div>
              </div>
              
              <div className="rounded-xl border border-banking-border p-5 bg-banking-offWhite/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-banking-muted uppercase">Realized P/L</span>
                </div>
                <p className="text-2xl font-bold text-banking-text">+$4,210.18</p>
                <p className="mt-2 text-xs text-banking-muted font-medium">After estimated 15% capital gains tax.</p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                <div className="flex gap-3 text-amber-800">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Tax Optimization Tip</p>
                    <p className="mt-1 text-xs leading-relaxed">Consider harvesting losses on assets with &gt;15% drawdown to offset gains before the tax year ends.</p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

