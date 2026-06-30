"use client";

import Link from "next/link";
import { MessageSquare, Paperclip, UserRoundCheck, Loader2 } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { StatusBadge } from "@/components/ui/status-badge";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [thread, setThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  useEffect(() => {
    async function loadTicket() {
      const resolvedParams = await params;
      
      try {
        const response = await fetch(`/api/support/tickets/${resolvedParams.id}`);
        const data = await response.json();
        
        if (data.thread) {
          setThread(data.thread);
        }
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error loading ticket:", error);
        notify({
          title: "Error",
          description: "Failed to load support ticket",
        });
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [params, notify]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-banking-blue" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center py-12">
        <p className="text-banking-muted">Ticket not found</p>
        <Link href="/support/tickets" className="inline-block mt-4 text-banking-blue font-semibold">
          Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title={`Support Ticket ${thread.id}`}
        description="Ticket detail, message history, attachments, status, and next actions."
        action={
          <Link href="/support" className="rounded-md bg-banking-blue px-4 py-2 text-sm font-semibold text-white">
            Open chat
          </Link>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Panel title="Conversation">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-sm text-banking-muted text-center py-8">No messages yet</p>
            ) : messages.map((msg) => (
              <div key={msg.id} className={msg.sender === "Client" ? "flex justify-end" : "flex justify-start"}>
                <div className={msg.sender === "Client" ? "max-w-[78%] rounded-lg bg-banking-blue p-3 text-sm text-white" : "max-w-[78%] rounded-lg bg-banking-offWhite p-3 text-sm text-banking-muted"}>
                  <p>{msg.text}</p>
                  <p className="text-[10px] mt-1 opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Ticket details">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Status</span>
              <StatusBadge status={thread.status?.toLowerCase() || "open"} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Category</span>
              <span className="font-semibold">{thread.category?.replaceAll("_", " ") || "general"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Assigned agent</span>
              <span className="inline-flex items-center gap-2 font-semibold">
                <UserRoundCheck className="h-4 w-4 text-banking-blue" />
                Support desk
              </span>
            </div>
            <div className="rounded-md border border-banking-border p-4">
              <div className="flex gap-2">
                <Paperclip className="h-4 w-4 text-banking-blue" />
                No attachments uploaded
              </div>
            </div>
            <Link href="/support/tickets" className="inline-flex items-center gap-2 text-sm font-semibold text-banking-blue">
              <MessageSquare className="h-4 w-4" />
              Back to tickets
            </Link>
          </div>
        </Panel>
      </div>
    </>
  );
}
