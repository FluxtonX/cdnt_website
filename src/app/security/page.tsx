import { KeyRound, LockKeyhole, MonitorCheck, ShieldCheck, Siren, UserCheck } from "lucide-react";
import { FeatureGrid, FinalCta, PublicHero, SectionHeader } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

export default function SecurityPage() {
  return (
    <SiteShell>
      <PublicHero
        eyebrow="Security & Compliance"
        title="Security workflows built into every account action."
        description="North Union prioritizes verification, session control, device visibility, human-readable warnings, and audit-ready actions."
      />
      <section className="bg-banking-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-3">
          {[
            ["Identity", "Email, phone, KYC, and selfie verification flows."],
            ["Access", "2FA, device sessions, and account state controls."],
            ["Operations", "Audit-ready events and review-first financial actions."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-lg border border-white/12 bg-white/7 p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/66">{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <SectionHeader eyebrow="Controls" title="Core MVP security coverage" />
        <div className="mt-10">
          <FeatureGrid
            items={[
              { title: "Email verification", body: "Users verify ownership before full access.", icon: UserCheck },
              { title: "Phone OTP", body: "Phone verification supports sensitive account actions.", icon: KeyRound },
              { title: "Two-factor auth", body: "2FA is required for withdrawals and security updates.", icon: LockKeyhole },
              { title: "Device sessions", body: "Users can review and remove active devices.", icon: MonitorCheck },
              { title: "KYC workflow", body: "Identity review statuses stay visible across onboarding.", icon: ShieldCheck },
              { title: "Risk alerts", body: "Clear warnings for frozen accounts, unsupported networks, and limits.", icon: Siren },
            ]}
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-lg border border-banking-border bg-white p-6 shadow-sm md:p-8">
          <SectionHeader
            eyebrow="Compliance Ready"
            title="Built for provider integrations later"
            description="The MVP keeps real custody, automated blockchain settlement, regulated financial operations, and external KYC integrations separated from the static UI until licensed providers are selected."
          />
        </div>
      </section>
      <FinalCta />
    </SiteShell>
  );
}
