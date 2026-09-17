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
  Tag,
  FileText,
  X,
  Download
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
  created_at?: string;
  status: MessageStatus;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentType?: string | null;
};

/* ─── Date & Time Formatting Utilities ────────────────────────────────────────── */
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

function isImageAttachment(url?: string | null, name?: string | null, type?: string | null): boolean {
  if (type && type.startsWith("image/")) return true;
  const cleanUrl = (url || "").split("?")[0].toLowerCase();
  const cleanName = (name || "").toLowerCase();
  const imageRegex = /\.(png|jpe?g|webp|gif|svg|bmp|ico|tiff)$/i;
  return imageRegex.test(cleanUrl) || imageRegex.test(cleanName);
}

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
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { notify } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inactivity timeout duration: 3 minutes (180,000 ms)
  const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000;

  // Use useRef for supabase client to ensure stable reference across renders
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // Track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { 
      mountedRef.current = false; 
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
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
            time: formatMessageTime(m.created_at),
            created_at: m.created_at,
            status: m.sender === "Client"
              ? (threadData.unread_count_admin === 0 ? "seen" : "delivered") as MessageStatus
              : "seen" as MessageStatus,
            attachmentUrl: m.attachment_url || null,
            attachmentName: m.attachment_name || null,
            attachmentType: m.attachment_type || null,
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
            time: formatMessageTime(newMsg.created_at),
            created_at: newMsg.created_at,
            status: newMsg.sender === "Client" ? "delivered" : "seen",
            attachmentUrl: newMsg.attachment_url || null,
            attachmentName: newMsg.attachment_name || null,
            attachmentType: newMsg.attachment_type || null,
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

            // Check for temp-id messages matching text or attachment (optimistic adds)
            const tempIndex = current.findIndex(
              (m) =>
                m.id.startsWith("temp-") &&
                (m.text === newMsg.text || (m.attachmentName && m.attachmentName === newMsg.attachment_name)) &&
                m.from === "user"
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

  // ─── Inactivity Timer Helpers ─────────────────────────────────────────────
  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    // Only arm inactivity timer during active triage before first ticket submission
    if (triageStep !== "completed") {
      inactivityTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setIsTimedOut(true);
        }
      }, INACTIVITY_TIMEOUT_MS);
    }
  }, [clearInactivityTimer, triageStep, INACTIVITY_TIMEOUT_MS]);

  // ─── Auto-scroll to bottom ───────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, triageStep, isBotTyping, isTimedOut]);

  // ─── Handle Category Selection ──────────────────────────────────────────
  const handleSelectCategory = (category: string) => {
    setIsTimedOut(false);
    setSelectedCategory(category);
    resetInactivityTimer();
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
    setIsTimedOut(false);
    setSelectedSubcategory(subcategory);
    resetInactivityTimer();
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      setTriageStep("describe");
      setTimeout(() => inputRef.current?.focus(), 150);
    }, 400);
  };

  // ─── Reset / Start New Inquiry ──────────────────────────────────────────
  const handleStartNewInquiry = async () => {
    clearInactivityTimer();
    setIsTimedOut(false);
    setThread(null);
    setMessages([]);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setTriageStep("category");
    setDraft("");
  };

  // ─── Send Message & Automated Ticket Creation ───────────────────────────
  const sendMessage = useCallback(async () => {
    if ((!draft.trim() && !selectedFile) || !user || sending || isTimedOut) return;
    clearInactivityTimer();
    const fileToSend = selectedFile;
    const messageText = draft.trim() || (fileToSend ? `Sent an attachment: ${fileToSend.name}` : "");
    setDraft("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSending(true);

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const isFirstIssueSubmission = triageStep !== "completed" || !thread;

    const nowIso = new Date().toISOString();
    const tempUserMsg: Message = {
      id: tempId,
      from: "user",
      text: messageText,
      time: formatMessageTime(nowIso),
      created_at: nowIso,
      status: "sending",
      attachmentName: fileToSend?.name,
      attachmentType: fileToSend?.type,
      attachmentUrl: fileToSend ? URL.createObjectURL(fileToSend) : undefined,
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

      // If there is an attachment, upload to Supabase storage via server route
      let uploadedUrl: string | null = null;
      let uploadedName: string | null = null;
      let uploadedType: string | null = null;

      if (fileToSend) {
        try {
          const formData = new FormData();
          formData.append("file", fileToSend);
          formData.append("threadId", currentThread.id);

          const uploadRes = await fetch("/api/support/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => ({}));
            throw new Error(errData.error || `Upload failed with status ${uploadRes.status}`);
          }

          const uploadData = await uploadRes.json();
          uploadedUrl = uploadData.url;
          uploadedName = uploadData.name;
          uploadedType = uploadData.type;
        } catch (uploadException: any) {
          console.error("Chat attachment upload exception:", uploadException);
          notify({
            title: "Upload failed",
            description: uploadException.message || "Failed to upload attachment.",
          });
          // Remove optimistic message and restore input
          setMessages((current) => current.filter((m) => m.id !== tempId));
          setSelectedFile(fileToSend);
          setDraft(draft);
          setSending(false);
          return;
        }
      }

      // 1. Insert the user's message
      const insertPayload: any = {
        thread_id: currentThread.id,
        sender: "Client",
        text: messageText,
      };
      if (uploadedUrl) {
        insertPayload.attachment_url = uploadedUrl;
        insertPayload.attachment_name = uploadedName;
        insertPayload.attachment_type = uploadedType;
      }

      const { data: newMsg, error: msgErr } = await supabase
        .from("support_messages")
        .insert(insertPayload)
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
                  time: formatMessageTime(newMsg.created_at),
                  created_at: newMsg.created_at,
                  status: "delivered" as MessageStatus,
                  attachmentUrl: newMsg.attachment_url || uploadedUrl,
                  attachmentName: newMsg.attachment_name || uploadedName,
                  attachmentType: newMsg.attachment_type || uploadedType,
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
                    time: formatMessageTime(botMsg.created_at),
                    created_at: botMsg.created_at,
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
        {messages.map((message, index) => {
          const isUser = message.from === "user";
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const currentDateKey = message.created_at ? new Date(message.created_at).toDateString() : "";
          const prevDateKey = prevMsg?.created_at ? new Date(prevMsg.created_at).toDateString() : "";
          const showDateDivider = !prevMsg || (Boolean(currentDateKey) && currentDateKey !== prevDateKey);

          return (
            <div key={message.id} className="space-y-2">
              {showDateDivider && (
                <div className="flex items-center justify-center my-3 select-none">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-10 bg-slate-200" />
                    <span className="px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-500 rounded-full border border-slate-200/80 shadow-2xs">
                      {formatChatDateDivider(message.created_at)}
                    </span>
                    <div className="h-px w-10 bg-slate-200" />
                  </div>
                </div>
              )}
              <div
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
                {message.attachmentUrl && (
                  <div className="mt-2.5">
                    {isImageAttachment(message.attachmentUrl, message.attachmentName, message.attachmentType) ? (
                      <a
                        href={message.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-xl border border-white/20 shadow-sm hover:opacity-95 transition-opacity max-w-sm"
                      >
                        <img
                          src={message.attachmentUrl}
                          alt={message.attachmentName || "Attachment"}
                          className="max-h-60 max-w-full rounded-xl object-contain bg-black/10 cursor-zoom-in"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <a
                        href={message.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={message.attachmentName || "attachment"}
                        className={cn(
                          "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-xs font-semibold",
                          isUser
                            ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                            : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"
                        )}
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                          isUser ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"
                        )}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold">{message.attachmentName || "Download Attachment"}</p>
                          <p className={cn(
                            "text-[10px] uppercase font-mono tracking-wider",
                            isUser ? "text-blue-200" : "text-slate-500"
                          )}>
                            {message.attachmentName?.split(".").pop() || "FILE"}
                          </p>
                        </div>
                        <div className={cn(
                          "p-1.5 rounded-lg transition-colors shrink-0",
                          isUser ? "hover:bg-white/20 text-white" : "hover:bg-slate-200 text-slate-500"
                        )}>
                          <Download className="h-4 w-4" />
                        </div>
                      </a>
                    )}
                  </div>
                )}
                <div 
                  className="mt-1.5 flex items-center justify-end gap-1.5"
                  title={formatFullDateTime(message.created_at)}
                >
                  <span className={isUser ? "text-[9px] text-white/70 font-semibold font-mono" : "text-[9px] text-slate-500 font-semibold font-mono"}>
                    {message.time}
                  </span>
                  {isUser && <MessageStatusIcon status={message.status} />}
                </div>
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

        {/* Inactivity Timeout Notice Bubble */}
        {isTimedOut && (
          <div className="flex justify-start items-start gap-2.5 animate-fadeIn">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-500 text-white text-xs shadow-sm mt-0.5">
              <Clock className="h-4 w-4" />
            </div>
            <div className="space-y-2.5 max-w-[88%] sm:max-w-[80%]">
              <div className="rounded-2xl rounded-tl-none border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900 shadow-sm">
                <p className="font-bold flex items-center gap-1.5 text-amber-950 mb-1">
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  Inactivity Timeout Notice
                </p>
                <p className="text-amber-800">
                  No response was entered for over 3 minutes, so this session has been automatically closed. If you still need help, feel free to start from the beginning.
                </p>
              </div>

              <div>
                <button
                  onClick={handleStartNewInquiry}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-banking-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Start From Start
                </button>
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
      ) : isTimedOut ? (
        <div className="flex items-center justify-between p-3.5 border-t border-banking-border bg-amber-50/50">
          <div className="flex items-center gap-2 text-xs text-amber-800 font-medium pl-1">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>Bot session closed due to inactivity.</span>
          </div>
          <button
            onClick={handleStartNewInquiry}
            className="inline-flex items-center gap-1.5 rounded-xl bg-banking-blue px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Start From Start
          </button>
        </div>
      ) : (
        <div className="border-t border-banking-border bg-white">
          {/* Attachment Preview Chip */}
          {selectedFile && (
            <div className="px-3.5 pt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-xs text-banking-blue font-medium">
                <Paperclip className="h-3.5 w-3.5" />
                <span className="truncate max-w-[220px] font-semibold">{selectedFile.name}</span>
                <span className="text-[10px] text-slate-500">
                  ({(selectedFile.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="ml-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="p-3.5 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 20 * 1024 * 1024) {
                  notify({ title: "File too large", description: "Attachment must be under 20MB." });
                  return;
                }
                setSelectedFile(file);
              }}
              className="hidden"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-banking-muted hover:bg-slate-100 transition-colors cursor-pointer",
                selectedFile && "text-banking-blue bg-blue-50 border border-blue-200"
              )}
              title="Attach document or screenshot"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                if (triageStep !== "completed") resetInactivityTimer();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-[40px] max-h-32 py-2.5 flex-1 rounded-xl border border-slate-200 px-3.5 outline-none focus:border-banking-blue focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm text-slate-900 placeholder:text-slate-600 resize-none overflow-y-auto leading-relaxed"
              placeholder={
                selectedFile
                  ? "Add a message (optional)..."
                  : triageStep === "category"
                  ? "Select an issue above or describe your question..."
                  : triageStep === "subcategory"
                  ? "Select a subtopic above or type your issue..."
                  : "Describe your issue in detail (Shift+Enter for new line)..."
              }
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={(!draft.trim() && !selectedFile) || sending}
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
