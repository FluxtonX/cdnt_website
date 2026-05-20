import Link from "next/link";
import { ArrowRight, HelpCircle, Search, CreditCard, Shield, Globe, Wallet, Smartphone, MessageSquare } from "lucide-react";
import { FinalCta, PublicHero, SectionHeader } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

const categories = [
  { title: "Accounts", icon: Wallet, description: "Opening, managing, and closing personal accounts." },
  { title: "Security", icon: Shield, description: "2FA, password recovery, and session management." },
  { title: "Cards", icon: CreditCard, description: "Activation, limits, and dispute resolutions." },
  { title: "Crypto", icon: Globe, description: "Deposits, withdrawals, and network confirmations." },
  { title: "Mobile App", icon: Smartphone, description: "Troubleshooting and feature walkthroughs." },
  { title: "Compliance", icon: HelpCircle, description: "KYC verification and document requirements." },
];

const faqs = [
  { q: "How do I complete KYC verification?", href: "/support" },
  { q: "Which blockchain networks are supported for USDT?", href: "/support" },
  { q: "What are the daily withdrawal limits?", href: "/support" },
  { q: "How long do Interac e-Transfers take?", href: "/support" },
  { q: "How do I reset my 2FA device?", href: "/support" },
  { q: "Is CDNT CDIC insured?", href: "/support" },
];

export default function HelpPage() {
  return (
    <SiteShell>
      <PublicHero
        eyebrow="Support Center"
        title="We're Here to Help."
        description="Search our extensive knowledge base or browse by category to find the answers you need. Institutional support, simplified."
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        {/* Search Bar */}
        <div className="mx-auto mb-20 max-w-3xl relative group">
          <div className="flex h-16 items-center gap-4 rounded-2xl border border-banking-border bg-white px-6 shadow-xl group-focus-within:border-banking-blue group-focus-within:ring-4 group-focus-within:ring-blue-50 transition-all">
            <Search className="h-6 w-6 text-banking-muted" />
            <input 
              placeholder="Search help articles, guides, and troubleshooting..." 
              className="flex-1 text-lg outline-none placeholder:text-banking-muted bg-transparent"
            />
            <button className="rounded-xl bg-banking-blue px-6 py-2 text-sm font-bold text-white hover:bg-banking-navy transition-all">
              Search
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-24">
          {categories.map((cat) => (
            <Link 
              key={cat.title} 
              href="/support" 
              className="group rounded-2xl border border-banking-border bg-white p-8 shadow-sm hover:border-banking-blue hover:shadow-md transition-all"
            >
              <cat.icon className="h-8 w-8 text-banking-blue mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-banking-text">{cat.title}</h3>
              <p className="mt-2 text-sm text-banking-muted leading-relaxed">{cat.description}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          {/* FAQ List */}
          <div>
            <SectionHeader eyebrow="Quick Answers" title="Popular Topics" />
            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <Link 
                  key={faq.q} 
                  href={faq.href} 
                  className="flex items-center justify-between gap-4 rounded-2xl border border-banking-border bg-white p-6 shadow-sm hover:border-banking-blue transition-all group"
                >
                  <span className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-banking-gold" />
                    <span className="font-bold text-banking-text">{faq.q}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-banking-muted group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Support Card */}
          <div className="h-fit rounded-3xl bg-banking-blue p-8 text-white shadow-2xl lg:mt-24">
            <MessageSquare className="h-10 w-10 text-banking-gold mb-6" />
            <h3 className="text-xl font-bold mb-4">Can't find what you're looking for?</h3>
            <p className="text-sm leading-7 text-white/70 mb-8">
              Our support team is available 24/7 to assist with urgent account issues, withdrawal tracking, and KYC appeals.
            </p>
            <div className="space-y-4">
              <Link href="/contact" className="block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-banking-blue hover:bg-banking-gold hover:text-banking-ink transition-all">
                Contact Support
              </Link>
              <Link href="#" className="block w-full rounded-xl border border-white/20 py-3 text-center text-sm font-bold hover:bg-white/10 transition-all">
                Live Chat (Available)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </SiteShell>
  );
}

