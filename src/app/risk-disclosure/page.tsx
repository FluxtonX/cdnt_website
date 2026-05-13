import { SiteShell } from "@/components/public/site-shell";

export default function RiskDisclosurePage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="text-4xl font-semibold tracking-normal">Risk Disclosure</h1>
        <p className="mt-5 leading-8 text-banking-muted">
          Crypto assets can be volatile. This page is reserved for investment,
          custody, transfer, network, and operational risk disclosures required
          before users complete onboarding or deposit assets.
        </p>
      </main>
    </SiteShell>
  );
}
