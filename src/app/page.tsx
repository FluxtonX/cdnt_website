"use client";

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
  MapPin,
} from "lucide-react";
import {
  FaqSection,
  FeatureGrid,
  FinalCta,
  SectionHeader,
  StatsBand,
} from "@/components/public/page-blocks";
import { HeroSlider } from "@/components/public/hero-slider";
import { SiteShell } from "@/components/public/site-shell";
import { motion } from "framer-motion";

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

      {/* Find Branch Section */}
      <section className="relative overflow-hidden bg-banking-ink py-20 text-white md:py-24">
        <img
          src="/branch-map.png"
          alt="Global banking locations map"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-80 saturate-[1.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.94)_0%,rgba(7,17,31,0.78)_36%,rgba(7,17,31,0.35)_66%,rgba(7,17,31,0.16)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,rgba(253,194,5,0.18),transparent_26%),linear-gradient(180deg,rgba(7,17,31,0.12),rgba(7,17,31,0.52))]" />
        <div className="absolute left-[58%] top-[28%] z-0 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-rose-600 shadow-xl ring-4 ring-white/45 md:grid">
          <MapPin className="h-6 w-6 fill-current" />
        </div>
        <div className="absolute left-[72%] top-[58%] z-0 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-rose-600 shadow-xl ring-4 ring-white/45 md:grid">
          <MapPin className="h-6 w-6 fill-current" />
        </div>
        <div className="absolute left-[83%] top-[38%] z-0 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-rose-600 shadow-xl ring-4 ring-white/45 lg:grid">
          <MapPin className="h-6 w-6 fill-current" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-banking-gold shadow-lg backdrop-blur">
              Near me
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-normal text-white md:text-5xl">
              Find a North Union branch or advisor near you.
            </h2>
            <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/82">
              Explore nearby branches, commercial advisory centers, private
              client offices, and institutional service desks across the North
              Union network.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-xl bg-banking-gold px-7 py-4 text-xs font-black uppercase tracking-widest text-banking-ink shadow-xl shadow-black/20 transition hover:bg-white">
                Use my location
              </button>
              <button className="rounded-xl border border-white/25 bg-white/12 px-7 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg backdrop-blur transition hover:bg-white/20">
                Search by city
              </button>
            </div>
          </motion.div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/25 bg-white/[0.12] shadow-2xl shadow-black/35 backdrop-blur-md">
            <img
              src="/branch-map.png"
              alt="Detailed map of nearby North Union service points"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-95"
            />
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-banking-ink/52" />

            {[
              ["left-[16%] top-[24%]", "bg-banking-gold"],
              ["left-[34%] top-[42%]", "bg-sky-300"],
              ["left-[55%] top-[31%]", "bg-banking-gold"],
              ["left-[72%] top-[49%]", "bg-sky-300"],
              ["left-[46%] top-[66%]", "bg-banking-gold"],
            ].map(([position, color]) => (
              <div
                key={position}
                className={`absolute ${position} z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_0_35px_rgba(253,194,5,0.55)] ring-4 ring-white/40`}
              >
                <span className={`h-3.5 w-3.5 rounded-full ${color}`} />
              </div>
            ))}

            <div className="absolute left-4 top-4 z-20 rounded-xl border border-banking-border bg-white px-4 py-3 text-banking-ink shadow-xl sm:left-5 sm:top-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-banking-muted">Live coverage</p>
              <p className="mt-1 text-sm font-black">12 offices within 25 km</p>
            </div>

            <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/20 bg-banking-ink/88 p-4 text-white shadow-2xl backdrop-blur-md sm:left-6 sm:right-auto sm:w-[380px]">
              <div className="flex gap-4">
                <div className="grid h-24 w-28 shrink-0 place-items-center rounded-xl bg-white text-banking-blue shadow-inner">
                  <Landmark className="h-10 w-10" />
                </div>
                <div className="min-w-0 py-1">
                  <div className="flex items-center gap-2 text-banking-gold">
                    <MapPin className="h-4 w-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nearest branch</p>
                  </div>
                  <p className="mt-2 text-base font-bold leading-tight">North Union Financial Centre</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/78">
                    Full-service banking, advisory support, ATMs, and private meeting suites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
      <FinalCta />
    </SiteShell>
  );
}
