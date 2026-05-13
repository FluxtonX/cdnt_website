import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileCheck2,
  Headphones,
  ShieldCheck,
  WalletCards,
  ChevronRight,
  CreditCard,
  Home as HomeIcon,
  PiggyBank,
  TrendingUp,
  CheckCircle2,
  Landmark,
} from "lucide-react";
import {
  FaqSection,
  FeatureGrid,
  FinalCta,
  HowItWorks,
  SectionHeader,
  StatsBand,
} from "@/components/public/page-blocks";
import { HeroSlider } from "@/components/public/hero-slider";
import { SiteShell } from "@/components/public/site-shell";

const productCategories = [
  {
    title: "Accounts",
    icon: PiggyBank,
    description: "Chequing, Savings, and specialized accounts for every need.",
    links: ["Chequing Accounts", "Savings Accounts", "Student Banking", "VIP Banking"]
  },
  {
    title: "Credit Cards",
    icon: CreditCard,
    description: "Earn rewards, travel points, or build your credit history.",
    links: ["Travel Cards", "Cash Back Cards", "No Annual Fee Cards", "Business Cards"]
  },
  {
    title: "Mortgages",
    icon: HomeIcon,
    description: "Home buying solutions with competitive rates and expert advice.",
    links: ["Buying your first home", "Renewing your mortgage", "Refinancing", "Rates"]
  },
  {
    title: "Investments",
    icon: TrendingUp,
    description: "Grow your wealth with our range of investment options.",
    links: ["Mutual Funds", "GICs", "RRSPS & TFSAs", "Self-Directed Investing"]
  }
];

export default function HomePage() {
  return (
    <SiteShell>
      {/* Hero Section */}
      <HeroSlider />

      {/* Product Categories Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeader 
            eyebrow="Our Solutions" 
            title="Banking made for your life" 
            description="Explore our range of financial products and services designed to help you achieve your goals."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((cat) => (
              <div key={cat.title} className="group flex flex-col rounded-xl border border-banking-border bg-banking-offWhite p-8 transition-all hover:border-banking-blue hover:shadow-xl">
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-lg bg-white text-banking-blue shadow-sm group-hover:bg-banking-blue group-hover:text-white transition-colors">
                  <cat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-banking-text">{cat.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-banking-muted">{cat.description}</p>
                <ul className="mt-6 space-y-3">
                  {cat.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="flex items-center justify-between text-sm font-medium text-banking-text hover:text-banking-blue">
                        {link}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsBand />

      {/* Main Features */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeader
          eyebrow="The North Union Experience"
          title="Security, Performance, and Simplicity"
          description="We combine traditional banking reliability with modern fintech innovation to give you the best of both worlds."
        />
        <div className="mt-16">
          <FeatureGrid
            items={[
              {
                title: "Institutional-Grade Security",
                body: "Multi-factor authentication, end-to-end encryption, and biometric security layers protect your assets 24/7.",
                icon: ShieldCheck,
              },
              {
                title: "Real-Time Portfolio Insights",
                body: "Track your performance, allocation, and market trends across BTC, ETH, and USDT in one unified dashboard.",
                icon: BarChart3,
              },
              {
                title: "Accelerated KYC Verification",
                body: "Our streamlined onboarding gets you verified and ready to invest faster than traditional financial institutions.",
                icon: FileCheck2,
              },
              {
                title: "Seamless Crypto Deposits",
                body: "Securely deposit digital assets with clear network guidance, QR code support, and real-time confirmation tracking.",
                icon: WalletCards,
              },
              {
                title: "Priority Withdrawal Support",
                body: "Fast and secure Interac withdrawal requests with transparent status tracking and expert compliance review.",
                icon: ArrowRight,
              },
              {
                title: "Dedicated Advisor Access",
                body: "Connect with our financial experts through live chat or secure ticketing for personalized support and guidance.",
                icon: Headphones,
              },
            ]}
          />
        </div>
      </section>

      {/* 4. Quick Application Section */}
      <section className="py-24 bg-white border-t border-banking-border">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeader
            eyebrow="Get Started"
            title="Apply for a Personal Bank Account Online in Minutes"
            description="Secure, paperless onboarding with instant account activation. Choose the plan that fits your financial lifestyle."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Signature No Limit Banking */}
            <div className="relative group flex flex-col rounded-[2rem] bg-banking-navy p-8 text-white shadow-[0_15px_40px_rgba(8,23,54,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(8,23,54,0.4)] border border-white/5">
              <div className="absolute top-0 right-0 p-6">
                <div className="rounded-full bg-banking-gold px-3 py-1 text-[9px] font-black uppercase tracking-widest text-banking-ink shadow-lg shadow-banking-gold/20">
                  Preferred
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold leading-tight">NUB Signature<br/>No Limit</h3>
                <p className="mt-2 text-xs text-white/50 font-medium">Unrivaled freedom for the professional.</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-banking-gold">$16</span>
                <span className="text-lg font-bold opacity-50">.95</span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest opacity-30">/ mo</span>
              </div>

              <div className="space-y-3.5 flex-1">
                {[
                  "Unlimited global Interac e-Transfers",
                  "Exclusive Metal Signature Card",
                  "Complimentary Lounge Access",
                  "Relationship Manager",
                  "Institutional FX Rates"
                ].map(feature => (
                  <div key={feature} className="flex items-center gap-3 group/item">
                    <CheckCircle2 className="h-3.5 w-3.5 text-banking-gold shrink-0" />
                    <span className="text-[12px] font-semibold text-white/70 group-hover/item:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/register" 
                className="mt-10 group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-banking-gold py-4 text-xs font-black text-banking-ink shadow-xl transition-all active:scale-95"
              >
                <span className="relative z-10 uppercase tracking-widest">Open Account</span>
                <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                <div className="absolute inset-0 translate-y-full bg-white transition-transform group-hover/btn:translate-y-0" />
              </Link>
            </div>

            {/* High Interest eSavings */}
            <div className="relative group flex flex-col rounded-[2rem] border-2 border-banking-border bg-white p-8 shadow-xl shadow-black/[0.03] transition-all hover:-translate-y-1 hover:border-banking-gold">
              <div className="absolute top-0 right-0 p-6">
                <div className="rounded-full bg-banking-offWhite border border-banking-border px-3 py-1 text-[9px] font-black uppercase tracking-widest text-banking-muted">
                  Wealth Builder
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold leading-tight text-banking-ink">NUB Elite<br/>eSavings</h3>
                <p className="mt-2 text-xs text-banking-muted font-medium">Institutional yields for digital savers.</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-banking-blue">4.25</span>
                <span className="text-lg font-bold text-banking-blue/60">%</span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-banking-muted">APY High-Yield</span>
              </div>

              <div className="space-y-3.5 flex-1">
                {[
                  "No minimum balance requirements",
                  "Automated Round-Up technology",
                  "Instant liquidity to BTC/ETH",
                  "Multi-layered security",
                  "Monthly interest payouts"
                ].map(feature => (
                  <div key={feature} className="flex items-center gap-3 group/item">
                    <CheckCircle2 className="h-3.5 w-3.5 text-banking-blue shrink-0" />
                    <span className="text-[12px] font-semibold text-banking-muted group-hover/item:text-banking-ink transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/register" 
                className="mt-10 group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-banking-blue py-4 text-xs font-black text-banking-blue transition-all hover:bg-banking-blue hover:text-white active:scale-95"
              >
                <span className="relative z-10 uppercase tracking-widest">Start Saving</span>
                <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>


        </div>
      </section>

      {/* 4. Core Banking Services Grid */}
      <section className="py-24 bg-white border-t border-banking-border">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeader
            eyebrow="Financial Ecosystem"
            title="Comprehensive Solutions for Every Goal"
            description="From everyday banking to long-term wealth management, we provide the tools and expertise to move your finances forward."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border border-banking-border bg-white p-8 hover:shadow-2xl hover:shadow-banking-blue/5 transition-all">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-blue-50 text-banking-blue mb-6 group-hover:bg-banking-blue group-hover:text-white transition-colors">
                <PiggyBank className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-banking-text">Personal Banking</h3>
              <p className="mt-4 text-sm leading-relaxed text-banking-muted">
                Experience banking that adapts to your lifestyle. Our chequing and savings accounts offer industry-leading rewards and zero-fee options.
              </p>
              <ul className="mt-6 space-y-3">
                {["Advantage Banking", "High Interest eSavings", "Student Solutions"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold text-banking-text">
                    <ChevronRight className="h-4 w-4 text-banking-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/accounts" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-banking-blue hover:underline">
                Explore Personal Accounts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="group rounded-2xl border border-banking-border bg-white p-8 hover:shadow-2xl hover:shadow-banking-blue/5 transition-all">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-blue-50 text-banking-blue mb-6 group-hover:bg-banking-blue group-hover:text-white transition-colors">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-banking-text">Credit & Borrowing</h3>
              <p className="mt-4 text-sm leading-relaxed text-banking-muted">
                Unlock the purchasing power you need with our range of credit cards and personalized loan solutions designed for flexibility.
              </p>
              <ul className="mt-6 space-y-3">
                {["NUB Rewards Visa", "Mortgage Rates", "Personal Lines of Credit"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold text-banking-text">
                    <ChevronRight className="h-4 w-4 text-banking-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="#" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-banking-blue hover:underline">
                Compare Credit Cards
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="group rounded-2xl border border-banking-border bg-white p-8 hover:shadow-2xl hover:shadow-banking-blue/5 transition-all">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-blue-50 text-banking-blue mb-6 group-hover:bg-banking-blue group-hover:text-white transition-colors">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-banking-text">Investments & Wealth</h3>
              <p className="mt-4 text-sm leading-relaxed text-banking-muted">
                Build a legacy with institutional-grade investment tools and expert advice tailored to your long-term financial goals.
              </p>
              <ul className="mt-6 space-y-3">
                {["Managed Portfolios", "Crypto Index Funds", "Retirement Planning"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold text-banking-text">
                    <ChevronRight className="h-4 w-4 text-banking-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/portfolio" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-banking-blue hover:underline">
                View Investment Options
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Business Banking Banner */}
      <section className="py-24 bg-banking-offWhite">
        <div className="mx-auto max-w-7xl px-5">
          <div className="relative overflow-hidden rounded-3xl bg-banking-navy p-12 text-white shadow-2xl">
            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold md:text-5xl leading-tight">Scale Your Business with North Union</h2>
                <p className="mt-6 text-lg text-white/70 leading-relaxed">
                  From startups to established enterprises, we provide the cash management, 
                  payroll, and credit solutions you need to compete globally.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="#" className="rounded-lg bg-banking-gold px-8 py-3 text-sm font-bold text-banking-ink hover:bg-white transition-all">
                    Open a Business Account
                  </Link>
                  <Link href="#" className="rounded-lg bg-white/10 px-8 py-3 text-sm font-bold hover:bg-white/20 transition-all border border-white/10">
                    Contact an Advisor
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Business Elite", detail: "High-volume transacting" },
                  { label: "Merchant Services", detail: "Global payment processing" },
                  { label: "Payroll Solutions", detail: "Automated tax handling" },
                  { label: "Commercial Loans", detail: "Up to $5M in credit" },
                ].map(card => (
                  <div key={card.label} className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                    <p className="font-bold">{card.label}</p>
                    <p className="mt-2 text-xs text-white/50">{card.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-banking-blue/20 blur-[100px]" />
          </div>
        </div>
      </section>

      {/* FAQ & CTA */}

      <FaqSection />
      <FinalCta />
    </SiteShell>
  );
}
