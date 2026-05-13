import Link from "next/link";
import { ArrowRight, HelpCircle, Search } from "lucide-react";
import { FinalCta, PublicHero, SectionHeader } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

const faqs = [
  "How do I complete KYC?",
  "Which crypto assets are supported?",
  "How do Interac withdrawals work?",
  "What happens if I choose the wrong USDT network?",
  "How do I download statements?",
];

export default function HelpPage() {
  return (
    <SiteShell>
      <PublicHero
        eyebrow="Help Center"
        title="Clear support content for deposits, withdrawals, KYC, and account security."
        description="Help content will later connect to CMS, support tickets, and article search."
      />
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="mb-8 flex h-14 items-center gap-3 rounded-lg border border-banking-border bg-white px-4 shadow-sm">
          <Search className="h-5 w-5 text-banking-muted" />
          <span className="text-sm text-banking-muted">Search help articles, deposits, withdrawals, KYC</span>
        </div>
        <SectionHeader eyebrow="Popular Topics" title="Help organized around real user tasks" />
        <div className="mt-10 grid gap-3">
          {faqs.map((faq) => (
            <Link key={faq} href="/support" className="flex items-center justify-between gap-3 rounded-lg border border-banking-border bg-white p-5 shadow-sm hover:border-banking-blue">
              <span className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-banking-blue" />
                <span className="font-semibold">{faq}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-banking-muted" />
            </Link>
          ))}
        </div>
      </section>
      <FinalCta />
    </SiteShell>
  );
}
