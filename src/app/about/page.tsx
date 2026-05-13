import { SiteShell } from "@/components/public/site-shell";
import { Shield, Globe, Award, Users, Landmark, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-banking-navy pt-32 pb-24 text-white">
          <div className="mx-auto max-w-7xl px-5">
            <div className="relative z-10 max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-banking-gold/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-banking-gold border border-banking-gold/20">
                Institutional Profile
              </div>
              <h1 className="text-5xl font-black leading-tight lg:text-7xl">
                The Royal Standard of <span className="text-banking-gold">Digital Wealth.</span>
              </h1>
              <p className="mt-8 text-xl leading-relaxed text-white/60">
                North Union (NUB) is a premier global financial institution bridging the gap between 
                legacy banking stability and the future of decentralized asset management.
              </p>
            </div>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-banking-gold/10 to-transparent" />
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-banking-blue/20 blur-[120px]" />
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-banking-ink">Our Core Mandate</h2>
                <div className="mt-8 space-y-8">
                  <div className="flex gap-6">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-banking-offWhite border border-banking-border shadow-sm">
                      <Shield className="h-7 w-7 text-banking-blue" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-banking-ink">Sovereign Security</h4>
                      <p className="mt-2 text-sm leading-relaxed text-banking-muted font-medium">
                        Utilizing institutional-grade cold storage and multi-party computation (MPC) 
                        to ensure your assets remain under the highest level of protection.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-banking-offWhite border border-banking-border shadow-sm">
                      <Globe className="h-7 w-7 text-banking-blue" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-banking-ink">Global Accessibility</h4>
                      <p className="mt-2 text-sm leading-relaxed text-banking-muted font-medium">
                        Borderless financial services that enable real-time settlement and liquidity 
                        across 150+ jurisdictions without legacy friction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-[3rem] bg-banking-offWhite p-12 border-2 border-banking-border shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <Landmark className="h-12 w-12 text-banking-gold mb-8" />
                  <blockquote className="text-2xl font-bold leading-relaxed text-banking-ink">
                    "We didn't just build a bank; we engineered a financial ecosystem that respects 
                    the user's time, privacy, and sovereignty."
                  </blockquote>
                  <div className="mt-8">
                    <p className="font-black text-banking-ink uppercase tracking-widest text-xs">Alistair North</p>
                    <p className="text-xs font-bold text-banking-muted">Founder & CEO, North Union</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-banking-gold/5 rounded-full blur-3xl group-hover:bg-banking-gold/10 transition-colors" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-banking-ink py-24 text-white">
          <div className="mx-auto max-w-7xl px-5 text-center">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-banking-gold">NUB by the Numbers</h2>
            <div className="mt-16 grid gap-12 md:grid-cols-3">
              {[
                { value: "$14.2B", label: "Assets Under Custody" },
                { value: "480k+", label: "Verified Clients" },
                { value: "99.99%", label: "Uptime SLA" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-6xl font-black text-white">{stat.value}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5 text-center">
            <h2 className="text-3xl font-black text-banking-ink">Why Choose North Union?</h2>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Institutional RBAC", icon: Users, desc: "Sophisticated Role-Based Access Control for corporate and family office management." },
                { title: "Royal Rewards", icon: Award, desc: "Earn up to 4.25% APY on idle digital assets with monthly dividend payouts." },
                { title: "Instant Settlement", icon: Zap, desc: "Move between fiat and crypto assets in milliseconds with NUB Vantage technology." },
              ].map((value) => (
                <div key={value.title} className="rounded-3xl border border-banking-border p-10 text-center hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-banking-offWhite mb-6">
                    <value.icon className="h-8 w-8 text-banking-blue" />
                  </div>
                  <h4 className="text-xl font-bold text-banking-ink">{value.title}</h4>
                  <p className="mt-4 text-sm leading-relaxed text-banking-muted font-medium">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
