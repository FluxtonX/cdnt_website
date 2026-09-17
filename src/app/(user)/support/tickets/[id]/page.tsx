"use client";



import Link from "next/link";

import { MessageSquare, Paperclip, UserRoundCheck, Loader2, Send } from "lucide-react";

import { PageTitle, Panel } from "@/components/dashboard/blocks";

import { StatusBadge } from "@/components/ui/status-badge";

import { useState, useEffect, useRef } from "react";

import { useToast } from "@/components/ui/toast";



function formatChatDateDivider(dateStr?: string | null): string {
  if (!dateStr) return "Today";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Today";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Yesterday";

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
  }

  return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

function formatMessageTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatFullDateTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {

  const [thread, setThread] = useState<any>(null);

  const [messages, setMessages] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);

  const [replyText, setReplyText] = useState("");

  const { notify } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ticketId, setTicketId] = useState<string>("");



  useEffect(() => {

    async function loadTicket() {

      const resolvedParams = await params;

      setTicketId(resolvedParams.id);

      

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



  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);



  const handleSendReply = async () => {

    if (!replyText.trim() || sending || !ticketId) return;

    

    setSending(true);

    try {

      const response = await fetch(`/api/support/tickets/${ticketId}`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ text: replyText.trim() }),

      });

      

      const data = await response.json();

      

      if (data.message) {

        setMessages((prev) => [...prev, data.message]);

        setReplyText("");

        notify({

          title: "Success",

          description: "Message sent successfully",

        });

      }

    } catch (error) {

      console.error("Error sending reply:", error);

      notify({

        title: "Error",

        description: "Failed to send message",

      });

    } finally {

      setSending(false);

    }

  };



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

          <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">

            {messages.length === 0 ? (

              <p className="text-sm text-banking-muted text-center py-8">No messages yet</p>

            ) : messages.map((msg, index) => {
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const currentDateKey = msg.created_at ? new Date(msg.created_at).toDateString() : "";
              const prevDateKey = prevMsg?.created_at ? new Date(prevMsg.created_at).toDateString() : "";
              const showDateDivider = !prevMsg || (Boolean(currentDateKey) && currentDateKey !== prevDateKey);

              return (
                <div key={msg.id} className="space-y-2">
                  {showDateDivider && (
                    <div className="flex items-center justify-center my-3 select-none">
                      <div className="flex items-center gap-2">
                        <div className="h-px w-10 bg-banking-border" />
                        <span className="px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-banking-offWhite text-banking-muted rounded-full border border-banking-border shadow-2xs">
                          {formatChatDateDivider(msg.created_at)}
                        </span>
                        <div className="h-px w-10 bg-banking-border" />
                      </div>
                    </div>
                  )}
                  <div className={msg.sender === "Client" ? "flex justify-end" : "flex justify-start"}>
                    <div className={msg.sender === "Client" ? "max-w-[78%] rounded-lg bg-banking-blue p-3 text-sm text-white shadow-xs" : "max-w-[78%] rounded-lg bg-banking-offWhite border border-banking-border p-3 text-sm text-banking-text shadow-xs"}>
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      <p 
                        className={msg.sender === "Client" ? "text-[10px] mt-1 text-white/70 font-mono text-right cursor-default" : "text-[10px] mt-1 text-banking-muted font-mono cursor-default"}
                        title={formatFullDateTime(msg.created_at)}
                      >
                        {formatMessageTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />

          </div>

          <div className="flex gap-2 border-t border-banking-border pt-4">

            <input

              value={replyText}

              onChange={(e) => setReplyText(e.target.value)}

              onKeyDown={(e) => {

                if (e.key === "Enter" && !e.shiftKey) {

                  e.preventDefault();

                  handleSendReply();

                }

              }}

              className="flex-1 rounded-md border border-banking-border px-3 py-2 text-sm outline-none focus:border-banking-blue"

              placeholder="Type your reply..."

              disabled={sending}

            />

            <button

              onClick={handleSendReply}

              disabled={!replyText.trim() || sending}

              className="rounded-md bg-banking-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"

            >

              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}

            </button>

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

              <span className="text-banking-muted">Subject</span>

              <span className="font-semibold text-right">{thread.subject || "Support Request"}</span>

            </div>

            <div className="flex items-center justify-between gap-3">

              <span className="text-banking-muted">Created</span>

              <span className="font-semibold">{new Date(thread.created_at).toLocaleDateString()}</span>

            </div>

            <div className="flex items-center justify-between gap-3">

              <span className="text-banking-muted">Last updated</span>

              <span className="font-semibold">{new Date(thread.updated_at).toLocaleDateString()}</span>

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

