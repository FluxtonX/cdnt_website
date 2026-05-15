import { CheckCircle2, ShieldCheck, Zap, Info, Clock, Globe } from "lucide-react";
import { FinalCta, PublicHero, SectionHeader } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

const retailFees = [
  { service: "Personal Chequing", fee: "$0.00 / mo", detail: "With $5,000 minimum daily balance", status: "Popular" },
  { service: "Savings (High Interest)", fee: "$0.00 / mo", detail: "No minimum balance required", status: "Free" },
  { service: "Interac e-Transfer®", fee: "Unlimited", detail: "Included in all account tiers", status: "Free" },
  { service: "Non-NUB ATM (Canada)", fee: "$2.00", detail: "Plus any convenience fees by owner", status: "Fixed" },
];

const cryptoFees = [
  { service: "Crypto Deposit", fee: "Free", detail: "No platform fee for incoming transfers", status: "Free" },
  { service: "Asset Exchange", fee: "0.00%", detail: "Zero-spread conversion for MVP users", status: "Promo" },
  { service: "Crypto Withdrawal", fee: "Network Only", detail: "Standard blockchain gas/miner fees", status: "Variable" },
  { service: "Portfolio Analytics", fee: "Included", detail: "Institutional tracking tools", status: "Free" },
];

export default function PricingPage() {
  return (
    <SiteShell>
      <PublicHero
        eyebrow="Transparent Pricing"
        title="Institutional Features. Zero Hidden Fees."
        description="We believe in clear, upfront pricing. Whether you're banking in CAD or managing a global crypto portfolio, you'll always know exactly what you're paying."
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeader
          eyebrow="Retail Banking"
          title="Personal Account Fees"
          description="Straightforward daily banking with no surprises. Our accounts are designed to scale with your wealth."
        />
        
        <div className="mt-12 overflow-hidden rounded-2xl border border-banking-border bg-white shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-banking-offWhite border-b border-banking-border">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-banking-muted">Service</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-banking-muted">Our Fee</th>
                <th className="hidden px-8 py-5 text-xs font-bold uppercase tracking-widest text-banking-muted md:table-cell">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-banking-border">
              {retailFees.map((f) => (
                <tr key={f.service} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-banking-text">{f.service}</p>
                    <p className="mt-1 text-xs text-banking-muted md:hidden">{f.detail}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-lg font-bold text-banking-blue">{f.fee}</span>
                      {f.status === "Promo" && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">LIMITED</span>}
                    </span>
                  </td>
                  <td className="hidden px-8 py-6 text-sm text-banking-muted md:table-cell">{f.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-32">
          <SectionHeader
            eyebrow="Digital Assets"
            title="Crypto & Exchange Fees"
            description="High-frequency tools without the high-frequency costs. We minimize friction so you can maximize performance."
          />
          
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {cryptoFees.map((f) => (
              <div key={f.service} className="flex items-center justify-between rounded-2xl border border-banking-border bg-white p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-banking-blue/5 text-banking-blue">
                    {f.service.includes("Exchange") ? <Zap className="h-6 w-6" /> : <Globe className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-banking-text text-lg">{f.service}</h3>
                    <p className="mt-1 text-sm text-banking-muted">{f.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-banking-blue">{f.fee}</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{f.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclosures */}
        <div className="mt-24 rounded-2xl border border-blue-100 bg-blue-50/50 p-8">
          <div className="flex gap-4">
            <Info className="h-6 w-6 shrink-0 text-banking-blue" />
            <div className="space-y-4">
              <h4 className="font-bold text-banking-text">Important Disclosures</h4>
              <p className="text-sm leading-7 text-banking-muted">
                Fees are subject to change with 30 days notice. Crypto network fees are determined by blockchain congestion 
                and are not controlled by North Union. Interac e-Transfer® is a registered trademark of Interac Corp. 
                Full list of service charges and specific transaction limits can be found in our Account Agreement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </SiteShell>
  );
}

