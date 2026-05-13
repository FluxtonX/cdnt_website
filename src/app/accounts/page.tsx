import Link from "next/link";
import { CheckCircle2, ChevronRight, PiggyBank, Landmark, ShieldCheck, Zap } from "lucide-react";
import { SiteShell } from "@/components/public/site-shell";
import { SectionHeader } from "@/components/public/page-blocks";

const accounts = [
  {
    title: "Advantage Banking",
    category: "Chequing",
    description: "Our most popular chequing account with unlimited transactions and premium benefits.",
    features: ["Unlimited transactions", "No monthly fee with $4,000 balance", "Interac e-Transfer included", "Mobile check deposit"],
    href: "/accounts/advantage"
  },
  {
    title: "High Interest eSavings",
    category: "Savings",
    description: "Watch your savings grow faster with a competitive interest rate and no monthly fees.",
    features: ["No monthly fees", "High interest on every dollar", "Easy transfers to chequing", "No minimum balance"],
    href: "/savings/high-interest"
  },
  {
    title: "VIP Banking",
    category: "Premium",
    description: "Exclusive benefits, personalized service, and waived fees on multiple accounts.",
    features: ["Priority support", "Waived credit card fees", "Free safety deposit box", "International bank drafts"],
    href: "/accounts/vip"
  }
];

export default function AccountsOverviewPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="bg-banking-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold md:text-5xl">Personal Banking Accounts</h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Find the right account for your daily banking, savings goals, or premium lifestyle needs. 
              North Union offers a range of options designed to simplify your financial life.
            </p>
            <div className="mt-10 flex gap-4">
              <button className="rounded-md bg-banking-gold px-6 py-3 font-bold text-banking-ink hover:bg-banking-goldLight transition-colors">
                Help Me Choose
              </button>
              <button className="rounded-md border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20 transition-colors">
                Compare Accounts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Account Categories */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeader 
            eyebrow="Explore Options" 
            title="Accounts designed for how you live" 
          />
          
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {accounts.map((acc) => (
              <div key={acc.title} className="flex flex-col border border-banking-border rounded-xl p-8 hover:shadow-lg transition-shadow bg-banking-offWhite">
                <span className="text-xs font-bold uppercase tracking-widest text-banking-blue">{acc.category}</span>
                <h3 className="mt-4 text-2xl font-bold text-banking-text">{acc.title}</h3>
                <p className="mt-4 text-sm text-banking-muted leading-relaxed">{acc.description}</p>
                <ul className="mt-8 space-y-3 flex-grow">
                  {acc.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-banking-text">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={acc.href}
                  className="mt-10 flex items-center justify-between rounded-md bg-banking-blue px-5 py-3 text-sm font-bold text-white hover:bg-banking-navy transition-colors"
                >
                  Learn More
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-banking-offWhite">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-banking-text">Why bank with North Union?</h2>
              <div className="mt-10 space-y-8">
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-100 text-banking-blue">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-banking-text">Safe and Secure</h4>
                    <p className="mt-2 text-sm text-banking-muted">Your money is protected by state-of-the-art encryption and fraud prevention systems.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gold-100 text-banking-gold">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-banking-text">Speed and Convenience</h4>
                    <p className="mt-2 text-sm text-banking-muted">Open an account in minutes and manage your finances anywhere with our mobile-first platform.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                    <PiggyBank className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-banking-text">Great Value</h4>
                    <p className="mt-2 text-sm text-banking-muted">Enjoy competitive interest rates and transparent fee structures with no hidden costs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-banking-navy p-10 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-banking-blue/20 blur-3xl" />
              <div className="relative z-10">
                <p className="text-sm font-bold uppercase tracking-widest text-banking-gold">Limited Time Offer</p>
                <h3 className="mt-4 text-3xl font-bold">Get a $350 bonus</h3>
                <p className="mt-4 text-white/80 leading-relaxed">
                  Open an eligible Advantage Banking account and set up a recurring direct deposit to earn your bonus.
                </p>
                <Link 
                  href="/register"
                  className="mt-8 inline-flex items-center gap-2 rounded-md bg-banking-gold px-8 py-4 text-sm font-bold text-banking-ink hover:bg-banking-goldLight transition-colors"
                >
                  Start Application
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
