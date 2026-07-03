import Link from "next/link";

import { Clock3, ShieldCheck } from "lucide-react";

import { PageTitle, Panel } from "@/components/dashboard/blocks";

import { SupportConsole } from "@/components/dashboard/support-console";

import { StatusBadge } from "@/components/ui/status-badge";

import { createClient } from "@/lib/supabase/server";
import { DeleteTicketButton } from "@/components/dashboard/delete-ticket-button";

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tickets: any[] = [];
  if (user) {
    const { data } = await supabase
      .from("support_threads")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_ticket", true)
      .order("created_at", { ascending: false });
    
    if (data) tickets = data;
  }

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
            {tickets.length === 0 ? (
              <p className="text-sm text-banking-muted text-center py-4">No tickets yet.</p>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="flex justify-between items-center p-3 border border-banking-border rounded-lg bg-banking-offWhite/50 hover:bg-banking-offWhite transition-colors">
                  <div>
                    <p className="font-semibold text-sm">{t.ticket_id}</p>
                    <p className="text-xs text-banking-muted mt-1">{t.category} • {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={t.status === "Waiting" ? "pending" : t.status === "Closed" ? "failed" : t.status === "Resolved" ? "completed" : "pending"} />
                    <DeleteTicketButton id={t.id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

      </div>

    </>

  );

}

