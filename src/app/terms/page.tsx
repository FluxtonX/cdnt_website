import { SiteShell } from "@/components/public/site-shell";

export default function TermsPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="text-4xl font-semibold tracking-normal">Terms & Conditions</h1>
        <p className="mt-5 leading-8 text-banking-muted">
          This placeholder page is prepared for legal terms, user responsibilities,
          account access rules, withdrawal review processes, and platform usage
          policies. Final legal copy should be provided by qualified counsel.
        </p>
      </main>
    </SiteShell>
  );
}
