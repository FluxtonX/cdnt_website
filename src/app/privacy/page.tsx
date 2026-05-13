import { SiteShell } from "@/components/public/site-shell";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="text-4xl font-semibold tracking-normal">Privacy Policy</h1>
        <p className="mt-5 leading-8 text-banking-muted">
          This placeholder page is prepared for privacy policy content covering
          identity information, KYC documents, device data, security logs,
          notifications, and support communications.
        </p>
      </main>
    </SiteShell>
  );
}
