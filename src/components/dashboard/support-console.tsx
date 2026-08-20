"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  Paperclip, 
  Send, 
  UserRoundCheck, 
  Loader2, 
  Check, 
  CheckCheck, 
  Clock, 
  Bot, 
  ArrowLeftRight, 
  ShieldCheck, 
  User, 
  HelpCircle,
  RotateCcw,
  Tag
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type MessageStatus = "sending" | "sent" | "delivered" | "seen";

type Message = {
  id: string;
  from: "user" | "agent" | "bot";
  text: string;
  time: string;
  status: MessageStatus;
};

// ─── Triage Options Structure ────────────────────────────────────────────────
interface CategoryOption {
  id: string;
  label: string;
  icon: any;
  subcategories: string[];
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "Transfer",
    label: "Transfer",
    icon: ArrowLeftRight,
    subcategories: ["Deposit", "Withdraw", "Internal Transfer", "Other Transfer Issue"],
  },
  {
    id: "Account",
    label: "Account",
    icon: User,
    subcategories: ["Login & Password", "Security & 2FA", "Profile Details", "Other Account Issue"],
  },
  {
    id: "Verification",
    label: "Verification",
    icon: ShieldCheck,
    subcategories: ["KYC Status Pending", "Document Rejection", "Proof of Address", "Other Verification Issue"],
  },
  {
    id: "Other",
    label: "Other",
    icon: HelpCircle,
    subcategories: [],
  },
];

interface SupportConsoleProps {
  onTicketCreated?: () => void;
}

export function SupportConsole({ onTicketCreated }: SupportConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [thread, setThread] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Guided triage state
  const [triageStep, setTriageStep] = useState<"category" | "subcategory" | "describe" | "completed">("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { notify } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use useRef for supabase client to ensure stable reference across renders
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // Track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ─── Load User + Thread + Messages ────────────────────────────────────────
  const initChat = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }
      setUser(authUser);

      // Fetch the latest active or waiting thread for this user
      const { data: threadData, error: threadErr } = await supabase
        .from("support_threads")
        .select("*")
        .eq("user_id", authUser.id)
        .in("status", ["Active", "Waiting"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (threadErr) {
        console.error("Error fetching thread:", threadErr);
      }

      if (threadData) {
        setThread(threadData);
        setTriageStep("completed");
        if (threadData.category) {
          const parts = threadData.category.split(" - ");
          setSelectedCategory(parts[0] || null);
          setSelectedSubcategory(parts[1] || null);
        }

        // Fetch all messages for this thread
        const { data: msgs, error: msgsErr } = await supabase
          .from("support_messages")
          .select("*")
          .eq("thread_id", threadData.id)
          .order("created_at", { ascending: true });

        if (msgsErr) {
          console.error("Error fetching messages:", msgsErr);
        }

        if (msgs && msgs.length > 0) {
          const formattedMsgs: Message[] = msgs.map((m: any) => ({
            id: m.id,
            from: m.sender === "Client" ? "user" : m.sender === "Bot" ? "bot" : "agent",
            text: m.text,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: m.sender === "Client"
              ? (threadData.unread_count_admin === 0 ? "seen" : "delivered") as MessageStatus
              : "seen" as MessageStatus,
          }));
          setMessages(formattedMsgs);
        } else {
          // If thread exists but has 0 messages, start fresh triage
          setTriageStep("category");
          setMessages([]);
        }

        // Reset client's own unread count
        if (threadData.unread_count_user > 0) {
          await supabase
            .from("support_threads")
            .update({ unread_count_user: 0 })
            .eq("id", threadData.id);
        }
      } else {
        // No active thread -> Start fresh interactive triage
        setThread(null);
        setMessages([]);
        setTriageStep("category");
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
    } catch (err) {
      console.error("Error loading support chat:", err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  // ─── Realtime Subscriptions ───────────────────────────────────────────────
  useEffect(() => {
    if (!thread?.id) return;

    // Listen for NEW messages in this thread
    const messagesChannel = supabase
      .channel(`support_messages_client:${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `thread_id=eq.${thread.id}`,
        },
        async (payload) => {
          if (!mountedRef.current) return;
          const newMsg = payload.new as any;

          const formattedMsg: Message = {
            id: newMsg.id,
            from: newMsg.sender === "Client" ? "user" : newMsg.sender === "Bot" ? "bot" : "agent",
            text: newMsg.text,
            time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: newMsg.sender === "Client" ? "delivered" : "seen",
          };

          setMessages((current) => {
            // Check if we already have this message
            const existingIndex = current.findIndex((m) => m.id === newMsg.id);
            if (existingIndex !== -1) {
              const updated = [...current];
              updated[existingIndex] = {
                ...updated[existingIndex],
                status: formattedMsg.status,
              };
              return updated;
            }

            // Check for temp-id messages matching text (optimistic adds)
            const tempIndex = current.findIndex(
              (m) => m.id.startsWith("temp-") && m.text === newMsg.text && m.from === "user"
            );
            if (tempIndex !== -1) {
              const updated = [...current];
              updated[tempIndex] = formattedMsg;
              return updated;
            }

            return [...current, formattedMsg];
          });

          // If message is from admin or bot, clear user unread count
          if (newMsg.sender === "Admin" || newMsg.sender === "Bot") {
            await supabase
              .from("support_threads")
              .update({ unread_count_user: 0 })
              .eq("id", thread.id);

            if (document.hidden && newMsg.sender === "Admin") {
              notify({
                title: "Support Reply",
                description: newMsg.text,
              });
            }
          }
        }
      )
      .subscribe();

    // Listen for thread updates (status changes, resolved, etc.)
    const threadChannel = supabase
      .channel(`support_threads_client:${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "support_threads",
          filter: `id=eq.${thread.id}`,
        },
        (payload) => {
          if (!mountedRef.current) return;
          const updatedThread = payload.new as any;
          setThread(updatedThread);

          if (updatedThread.unread_count_admin === 0) {
            setMessages((current) =>
              current.map((m) =>
                m.from === "user" && m.status !== "seen"
                  ? { ...m, status: "seen" as MessageStatus }
                  : m
              )
            );
          }

          if (payload.old) {
            const oldStatus = (payload.old as any).status;
            if (oldStatus !== "Resolved" && updatedThread.status === "Resolved") {
              notify({
                title: "Ticket Resolved",
                description: "This support conversation has been marked as resolved.",
              });
            } else if (oldStatus !== "Closed" && updatedThread.status === "Closed") {
              notify({
                title: "Ticket Closed",
                description: "This support conversation has been closed by an administrator.",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(threadChannel);
    };
  }, [thread?.id, supabase, notify]);

  // ─── Auto-scroll to bottom ───────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, triageStep, isBotTyping]);

  // ─── Handle Category Selection ──────────────────────────────────────────
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    const categoryConfig = CATEGORIES.find((c) => c.id === category);

    if (categoryConfig && categoryConfig.subcategories.length > 0) {
      // Move to subcategory selection
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        setTriageStep("subcategory");
      }, 400);
    } else {
      // Skip straight to describe
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        setTriageStep("describe");
        setTimeout(() => inputRef.current?.focus(), 150);
      }, 400);
    }
  };

  // ─── Handle Subcategory Selection ───────────────────────────────────────
  const handleSelectSubcategory = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      setTriageStep("describe");
      setTimeout(() => inputRef.current?.focus(), 150);
    }, 400);
  };

  // ─── Reset / Start New Inquiry ──────────────────────────────────────────
  const handleStartNewInquiry = async () => {
    setThread(null);
    setMessages([]);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setTriageStep("category");
    setDraft("");
  };

  // ─── Send Message & Automated Ticket Creation ───────────────────────────
  const sendMessage = useCallback(async () => {
    if (!draft.trim() || !user || sending) return;
    const messageText = draft.trim();
    setDraft("");
    setSending(true);

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const isFirstIssueSubmission = triageStep !== "completed" || !thread;

    const tempUserMsg: Message = {
      id: tempId,
      from: "user",
      text: messageText,
      time: currentTime,
      status: "sending",
    };

    setMessages((current) => [...current, tempUserMsg]);

    try {
      let currentThread = thread;
      let ticketId = currentThread?.ticket_id;
      const categoryTag = selectedCategory
        ? selectedSubcategory
          ? `${selectedCategory} - ${selectedSubcategory}`
          : selectedCategory
        : "General Inquiry";

      // If no thread exists or this is the first issue submission: create ticket thread
      if (!currentThread) {
        ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

        const { data: newThread, error: threadErr } = await supabase
          .from("support_threads")
          .insert({
            user_id: user.id,
            status: "Waiting",
            is_ticket: true,
            category: categoryTag,
            ticket_id: ticketId,
          })
          .select()
          .single();

        if (threadErr) throw threadErr;
        if (!newThread) throw new Error("Failed to create support ticket");

        currentThread = newThread;
        setThread(newThread);
        setTriageStep("completed");
        onTicketCreated?.();
      } else if (!currentThread.is_ticket) {
        // Upgrade existing thread to ticket if it wasn't one
        ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
        const { data: updatedThread } = await supabase
          .from("support_threads")
          .update({
            is_ticket: true,
            category: categoryTag,
            ticket_id: ticketId,
          })
          .eq("id", currentThread.id)
          .select()
          .single();

        if (updatedThread) {
          currentThread = updatedThread;
          setThread(updatedThread);
          onTicketCreated?.();
        }
      }

      // 1. Insert the user's message
      const { data: newMsg, error: msgErr } = await supabase
        .from("support_messages")
        .insert({
          thread_id: currentThread.id,
          sender: "Client",
          text: messageText,
        })
        .select()
        .single();

      if (msgErr) throw msgErr;

      if (newMsg) {
        setMessages((current) =>
          current.map((m) =>
            m.id === tempId
              ? {
                  id: newMsg.id,
                  from: "user" as const,
                  text: newMsg.text,
                  time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  status: "delivered" as MessageStatus,
                }
              : m
          )
        );
      }

      // 2. If this was the initial issue submission, trigger automated bot confirmation reply
      if (isFirstIssueSubmission) {
        setIsBotTyping(true);

        const botReplyText = `Thank you! We have created your ticket (#${ticketId}) for ${categoryTag}. One of our agents will reply as soon as possible.`;

        // Small realistic response delay
        setTimeout(async () => {
          try {
            const { data: botMsg } = await supabase
              .from("support_messages")
              .insert({
                thread_id: currentThread.id,
                sender: "Admin",
                text: botReplyText,
              })
              .select()
              .single();

            if (botMsg && mountedRef.current) {
              setMessages((current) => {
                if (current.some((m) => m.id === botMsg.id)) return current;
                return [
                  ...current,
                  {
                    id: botMsg.id,
                    from: "agent" as const,
                    text: botMsg.text,
                    time: new Date(botMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    status: "seen" as MessageStatus,
                  },
                ];
              });
            }
          } catch (botErr) {
            console.error("Error inserting bot confirmation:", botErr);
          } finally {
            if (mountedRef.current) setIsBotTyping(false);
          }
        }, 700);
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      setMessages((current) =>
        current.map((m) =>
          m.id === tempId ? { ...m, status: "sending" as MessageStatus } : m
        )
      );
      notify({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }, [draft, user, thread, sending, triageStep, selectedCategory, selectedSubcategory, supabase, notify, onTicketCreated]);

  // ─── Message Status Icon ──────────────────────────────────────────────────
  const MessageStatusIcon = useCallback(({ status }: { status: MessageStatus }) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 shrink-0 text-white/40 animate-pulse" />;
      case "sent":
        return <Check className="h-3.5 w-3.5 shrink-0 text-white/50" />;
      case "delivered":
        return <CheckCheck className="h-3.5 w-3.5 shrink-0 text-white/50" />;
      case "seen":
        return <CheckCheck className="h-3.5 w-3.5 shrink-0 text-sky-300" />;
      default:
        return null;
    }
  }, []);

  // ─── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[440px] items-center justify-center rounded-2xl border border-banking-border bg-white shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-banking-blue" />
      </div>
    );
  }

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="flex flex-col rounded-2xl border border-banking-border bg-white shadow-sm overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-banking-border bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-banking-blue">
              <Bot className="h-5 w-5" />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-slate-900">Support Desk</h2>
              {thread?.ticket_id && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-banking-blue font-mono border border-blue-100">
                  <Tag className="h-2.5 w-2.5" />
                  {thread.ticket_id}
                </span>
              )}
            </div>
            <p className="text-xs text-banking-muted">
              {thread?.category ? thread.category : "24/7 Automated Triage & Live Agents"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {thread && (
            <button
              onClick={handleStartNewInquiry}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              title="Start a new support inquiry"
            >
              <RotateCcw className="h-3 w-3" />
              New Inquiry
            </button>
          )}
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            thread?.status === "Resolved" ? "bg-gray-100 text-gray-700" :
            thread?.status === "Waiting" ? "bg-amber-50 text-amber-700" :
            "bg-emerald-50 text-emerald-700"
          }`}>
            {thread?.status || "Online"}
          </span>
        </div>
      </div>

      {/* Messages / Interactive Triage Flow Area */}
      <div className="max-h-[460px] min-h-[380px] space-y-4 overflow-y-auto bg-slate-50/60 p-4 sm:p-5">
        
        {/* Step 1: Initial Bot Greeting & Primary Categories */}
        <div className="flex justify-start items-start gap-2.5">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-white text-xs shadow-sm mt-0.5">
            <Bot className="h-4 w-4" />
          </div>
          <div className="space-y-3 max-w-[85%] sm:max-w-[78%]">
            <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3.5 text-xs font-semibold leading-relaxed text-slate-800 shadow-sm">
              <p>
                👋 Hello! Welcome to CDNT Support. To help us route your request to the right specialist, please select the issue you need help with:
              </p>
            </div>

            {/* Interactive Category Chips */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    disabled={triageStep === "completed" && selectedCategory !== cat.id}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all border shadow-xs",
                      isSelected
                        ? "bg-banking-blue text-white border-banking-blue ring-2 ring-blue-500/20"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 active:scale-95 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 2: Subcategory Selection (If category has subcategories) */}
        {selectedCategory && selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
          <div className="flex justify-start items-start gap-2.5 animate-fadeIn">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-white text-xs shadow-sm mt-0.5">
              <Bot className="h-4 w-4" />
            </div>
            <div className="space-y-3 max-w-[85%] sm:max-w-[78%]">
              <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3.5 text-xs font-semibold leading-relaxed text-slate-800 shadow-sm">
                <p>
                  Got it, <strong className="text-banking-blue">{selectedCategory}</strong>. Please specify the topic:
                </p>
              </div>

              {/* Interactive Subcategory Chips */}
              <div className="flex flex-wrap gap-2">
                {selectedCategoryObj.subcategories.map((sub) => {
                  const isSelected = selectedSubcategory === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => handleSelectSubcategory(sub)}
                      disabled={triageStep === "completed" && selectedSubcategory !== sub}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all border shadow-xs",
                        isSelected
                          ? "bg-banking-blue text-white border-banking-blue ring-2 ring-blue-500/20"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 active:scale-95 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200"
                      )}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Prompt to describe issue */}
        {(triageStep === "describe" || (triageStep === "completed" && messages.length > 0)) && (
          <div className="flex justify-start items-start gap-2.5 animate-fadeIn">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-white text-xs shadow-sm mt-0.5">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3.5 text-xs font-semibold leading-relaxed text-slate-800 shadow-sm max-w-[85%] sm:max-w-[78%]">
              <p>
                Please describe your issue in detail below. Once submitted, we will create your ticket and connect you with an agent:
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Chat Messages History */}
        {messages.map((message) => {
          const isUser = message.from === "user";
          return (
            <div
              key={message.id}
              className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}
            >
              {!isUser && (
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-800 text-white text-xs shadow-sm mb-1">
                  <UserRoundCheck className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-xs font-semibold leading-relaxed shadow-xs",
                  isUser
                    ? "rounded-br-none bg-banking-blue text-white"
                    : "rounded-bl-none border border-slate-200 bg-white text-slate-900"
                )}
                style={isUser ? { background: "linear-gradient(135deg, #0A3D91 0%, #1650AB 100%)" } : {}}
              >
                <p className="break-words whitespace-pre-wrap">{message.text}</p>
                <div className="mt-1.5 flex items-center justify-end gap-1.5">
                  <span className={isUser ? "text-[9px] text-white/70 font-semibold" : "text-[9px] text-slate-600 font-semibold"}>
                    {message.time}
                  </span>
                  {isUser && <MessageStatusIcon status={message.status} />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bot Typing Animation Indicator */}
        {isBotTyping && (
          <div className="flex justify-start items-center gap-2 animate-fadeIn">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-white text-xs shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-bl-none border border-slate-200 bg-white px-4 py-3 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / Compose Area */}
      {thread?.status === "Resolved" || thread?.status === "Closed" ? (
        <div className="flex flex-col items-center justify-center p-6 border-t border-banking-border bg-white text-center">
          <p className="text-sm font-semibold text-banking-muted mb-3">
            This conversation has been {thread.status.toLowerCase()}.
          </p>
          <button 
            onClick={handleStartNewInquiry}
            className="rounded-xl bg-banking-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all cursor-pointer"
          >
            Start New Inquiry
          </button>
        </div>
      ) : (
        <div className="p-3.5 border-t border-banking-border bg-white">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-banking-muted hover:bg-slate-100 transition-colors"
              title="Attach document or screenshot"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              className="h-10 flex-1 rounded-xl border border-slate-200 px-3.5 outline-none focus:border-banking-blue focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm text-slate-900 placeholder:text-slate-600"
              placeholder={
                triageStep === "category"
                  ? "Select an issue above or describe your question..."
                  : triageStep === "subcategory"
                  ? "Select a subtopic above or type your issue..."
                  : "Describe your issue in detail..."
              }
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim() || sending}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-banking-blue text-white shadow-xs disabled:opacity-40 hover:bg-blue-700 transition-all cursor-pointer"
              title="Send message"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
