import { Mail, MapPin, MessageSquare } from "lucide-react";
import { FinalCta, PublicHero } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

export default function ContactPage() {
  return (
    <SiteShell>
      <PublicHero
        eyebrow="Contact"
        title="Reach support for onboarding, security, deposit, or withdrawal help."
        description="The MVP contact screen is structured for future support ticket and live chat integration."
      />
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-16 md:grid-cols-3">
        {[
          ["Email support", "support@northunion.example", Mail],
          ["Live chat", "Available inside dashboard", MessageSquare],
          ["Operations", "Canada-focused fintech workflows", MapPin],
        ].map(([title, body, Icon]) => (
          <article key={title as string} className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
            <Icon className="h-6 w-6 text-banking-blue" />
            <h2 className="mt-4 font-semibold">{title as string}</h2>
            <p className="mt-2 text-sm text-banking-muted">{body as string}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-6 rounded-lg border border-banking-border bg-white p-6 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Send a message</h2>
            <p className="mt-3 text-sm leading-6 text-banking-muted">
              This static contact form is ready for support ticket integration.
            </p>
          </div>
          <form className="grid gap-4">
            <input className="h-12 rounded-md border border-banking-border px-4" placeholder="Full name" />
            <input className="h-12 rounded-md border border-banking-border px-4" placeholder="Email address" />
            <textarea className="min-h-32 rounded-md border border-banking-border px-4 py-3" placeholder="How can support help?" />
            <button className="rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white">
              Submit request
            </button>
          </form>
        </div>
      </section>
      <FinalCta />
    </SiteShell>
  );
}
