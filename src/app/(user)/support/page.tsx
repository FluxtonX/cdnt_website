import Link from "next/link";

import { Clock3, ShieldCheck } from "lucide-react";

import { PageTitle, Panel } from "@/components/dashboard/blocks";

import { SupportConsole } from "@/components/dashboard/support-console";

import { StatusBadge } from "@/components/ui/status-badge";



export default function SupportPage() {

  return (

    <>

      <PageTitle

        title="Live Chat & Support"

        description="Contact support for deposit, withdrawal, KYC, login, portfolio, and security issues."

        action={<Link href="/support/tickets" className="rounded-md border border-banking-border bg-white px-4 py-2 text-sm font-semibold">View tickets</Link>}

      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">

        {[

          ["Response target", "Under 5 minutes", Clock3],

          ["Secure attachments", "Screenshots and documents", ShieldCheck],

          ["Ticket history", "Always available", Clock3],

        ].map(([label, value, Icon]) => (

          <article key={label as string} className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">

            <Icon className="h-5 w-5 text-banking-blue" />

            <p className="mt-4 text-sm text-banking-muted">{label as string}</p>

            <p className="mt-1 font-semibold">{value as string}</p>

          </article>

        ))}

      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

        <SupportConsole />

        <Panel title="Latest tickets">

          <div className="space-y-3">

            <p className="text-sm text-banking-muted text-center py-4">View your ticket history in the Tickets page</p>

          </div>

        </Panel>

      </div>

    </>

  );

}

