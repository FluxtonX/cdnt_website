import { CheckCircle2, Info } from "lucide-react";
import { FinalCta, PublicHero, SectionHeader } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

const fees = [
  ["Account setup", "$0", "No platform onboarding fee for MVP accounts."],
  ["Crypto deposits", "Network fees", "Blockchain network fees may apply."],
  ["Interac withdrawal", "Manual review", "Withdrawal fee can be configured by operations."],
  ["Statements", "Included", "Monthly statements and CSV reports planned."],
];

export default function PricingPage() {
  return (
    <SiteShell>
      <PublicHero
        eyebrow="Pricing & Fees"
        title="Transparent fee pages for a financial product that users can understand."
        description="The MVP keeps pricing content editable and ready for operations, disclosures, and future CMS control."
      />
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeader
          eyebrow="Fee Structure"
          title="Simple MVP pricing content with room for CMS control"
          description="Pricing and fee values are represented clearly so operations can update them later without changing the user experience."
        />
        <div className="mt-10 grid gap-4">
          {fees.map(([name, price, detail]) => (
            <article key={name} className="flex flex-col gap-3 rounded-lg border border-banking-border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="font-semibold">{name}</h2>
                  <p className="mt-1 text-sm text-banking-muted">{detail}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-banking-blue">{price}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5 text-banking-blue">
          <div className="flex gap-3">
            <Info className="h-5 w-5 shrink-0" />
            <p className="text-sm leading-6">
              Final fees, custody rules, Interac processing costs, and risk
              disclosures should be confirmed with legal and operations before
              launch.
            </p>
          </div>
        </div>
      </section>
      <FinalCta />
    </SiteShell>
  );
}
