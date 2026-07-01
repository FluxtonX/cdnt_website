"use client";

import Link from "next/link";
import { Clock3, ShieldCheck, Loader2, Trash2 } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { SupportConsole } from "@/components/dashboard/support-console";
import { StatusBadge } from "@/components/ui/status-badge";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch("/api/support/tickets");
        const data = await response.json();
        if (data.tickets) {
          // Filter only tickets (is_ticket = true)
          const ticketOnly = data.tickets.filter((t: any) => t.is_ticket === true);
          setTickets(ticketOnly);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
        notify({
          title: "Success",
          description: "Ticket deleted successfully",
        });
      } else {
        throw new Error("Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      notify({
        title: "Error",
        description: "Failed to delete ticket",
      });
    }
  };

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
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-banking-blue" />
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-sm text-banking-muted text-center py-4">No tickets found</p>
            ) : (
              tickets.slice(0, 3).map((ticket) => (
                <article key={ticket.id} className="rounded-md border border-banking-border p-4 relative group">
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete ticket"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="mb-2 flex items-center justify-between gap-3 pr-8">
                    <p className="font-semibold">{ticket.ticket_id || ticket.id}</p>
                    <StatusBadge status={ticket.status?.toLowerCase() || "open"} />
                  </div>
                  <p className="text-sm text-banking-muted">{ticket.subject || ticket.category || "Support Request"}</p>
                  <p className="text-xs text-banking-muted mt-1">
                    {ticket.category?.replaceAll("_", " ") || "General"} • {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </article>
              ))
            )}
            {tickets.length > 0 && (
              <Link href="/support/tickets" className="block text-center text-sm text-banking-blue font-semibold py-2 hover:underline">
                View all tickets
              </Link>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}

