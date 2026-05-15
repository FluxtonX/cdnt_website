import { KeyRound, LockKeyhole, MonitorCheck, ShieldCheck, Siren, UserCheck, Fingerprint, Database, ShieldAlert, Cpu } from "lucide-react";
import { FeatureGrid, FinalCta, PublicHero, SectionHeader } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

export default function SecurityPage() {
  return (
    <SiteShell>
      <PublicHero
        eyebrow="Security & Infrastructure"
        title="Institutional-Grade Security for Your Assets."
        description="We combine military-grade encryption with advanced blockchain custody to ensure your fiat and digital assets are always protected by the highest industry standards."
      />

      <section className="bg-banking-ink text-white py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              { 
                title: "Cold Storage Custody", 
                body: "98% of digital assets are held in geographically distributed, air-gapped cold storage vaults with multi-signature authorization requirements.",
                icon: Database 
              },
              { 
                title: "MPC Technology", 
                body: "Our Multi-Party Computation (MPC) infrastructure eliminates single points of failure by distributing private key shards across secure enclaves.",
                icon: Cpu 
              },
              { 
                title: "End-to-End Encryption", 
                body: "All data at rest and in transit is secured using AES-256 encryption and TLS 1.3 protocols, meeting the strictest financial compliance bars.",
                icon: LockKeyhole 
              },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors group">
                <item.icon className="h-8 w-8 text-banking-gold mb-6 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-bold mb-4">{item.title}</h2>
                <p className="text-sm leading-7 text-white/60">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeader 
          eyebrow="Protection Layers" 
          title="Account Security Controls" 
          description="Your security is a shared responsibility. We provide the tools you need to lock down your account and monitor activity in real-time."
        />
        
        <div className="mt-16">
          <FeatureGrid
            items={[
              { title: "Advanced 2FA", body: "Support for YubiKey, TOTP (Google Authenticator), and biometric WebAuthn protocols.", icon: KeyRound },
              { title: "Withdrawal Whitelisting", body: "Lock withdrawals to pre-approved addresses with a 24-hour cooling-off period for new additions.", icon: ShieldCheck },
              { title: "Device Fingerprinting", body: "Every login is analyzed for suspicious patterns, IP geofencing, and unrecognized hardware signatures.", icon: Fingerprint },
              { title: "Active Session Control", body: "Real-time visibility into all active sessions with the ability to instantly revoke access from any device.", icon: MonitorCheck },
              { title: "Instant Freeze", body: "One-tap security lock for your account if you suspect unauthorized access or lose your mobile device.", icon: Siren },
              { title: "Verified Identity", body: "Strict KYC/AML compliance using AI-driven document verification and liveness checks.", icon: UserCheck },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="rounded-3xl border border-banking-border bg-white p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldAlert className="h-64 w-64" />
          </div>
          <div className="relative z-10">
            <SectionHeader
              eyebrow="Audit & Compliance"
              title="Built for the Future of Finance"
              description="North Union undergoes regular third-party security audits, penetration testing, and compliance reviews to ensure our platform exceeds the expectations of institutional regulators."
            />
            <div className="mt-10 flex flex-wrap gap-8 opacity-40 grayscale items-center justify-center lg:justify-start">
              <span className="font-black text-2xl">SOC2 TYPE II</span>
              <span className="font-black text-2xl">PCI DSS</span>
              <span className="font-black text-2xl">ISO 27001</span>
              <span className="font-black text-2xl">GDPR</span>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </SiteShell>
  );
}

