"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { supportTickets } from "@/data/mock";

export function TicketExplorer() {
  const [query, setQuery] = useState("");
  const tickets = useMemo(() => {
    return supportTickets.filter((ticket) =>
      `${ticket.id} ${ticket.category} ${ticket.subject} ${ticket.status}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <label className="flex h-11 items-center gap-2 rounded-md border border-banking-border px-3 text-sm text-banking-muted">
        <Search className="h-4 w-4" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-full flex-1 bg-transparent outline-none"
          placeholder="Search tickets"
        />
      </label>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <article key={ticket.id} className="grid gap-3 rounded-md border border-banking-border p-4 md:grid-cols-[0.7fr_1fr_0.7fr_0.7fr_110px] md:items-center">
            <p className="font-semibold text-banking-blue">{ticket.id}</p>
            <p className="font-medium">{ticket.subject}</p>
            <p className="text-sm text-banking-muted">{ticket.category.replaceAll("_", " ")}</p>
            <StatusBadge status={ticket.status} />
            <Link href={`/support/tickets/${ticket.id}`} className="rounded-md border border-banking-border px-3 py-2 text-center text-sm font-semibold">
              Open
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
