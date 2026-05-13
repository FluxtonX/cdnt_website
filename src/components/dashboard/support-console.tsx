"use client";

import { useState } from "react";
import { MessageSquare, Paperclip, Send, UserRoundCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const initialMessages = [
  {
    from: "agent",
    text: "Hello, support can help with KYC, deposits, withdrawals, and account security.",
    time: "10:22 AM",
  },
  {
    from: "user",
    text: "I need help with an Interac withdrawal status.",
    time: "10:24 AM",
  },
  {
    from: "agent",
    text: "I can check that. Please confirm the withdrawal request ID from your status page.",
    time: "10:25 AM",
  },
];

export function SupportConsole() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const { notify } = useToast();

  function sendMessage() {
    if (!draft.trim()) return;
    setMessages((current) => [
      ...current,
      { from: "user", text: draft.trim(), time: "Now" },
    ]);
    setDraft("");
    notify({
      title: "Message sent",
      description: "Support will reply in this conversation.",
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-banking-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-banking-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <UserRoundCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Support desk</h2>
            <p className="text-sm text-banking-muted">Average response: under 5 minutes</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          Online
        </span>
      </div>
      <div className="max-h-[420px] space-y-4 overflow-y-auto bg-banking-offWhite p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.time}-${index}`}
            className={message.from === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                message.from === "user"
                  ? "max-w-[78%] rounded-lg bg-banking-blue p-3 text-sm text-white"
                  : "max-w-[78%] rounded-lg border border-banking-border bg-white p-3 text-sm text-banking-muted"
              }
            >
              <p>{message.text}</p>
              <p className={message.from === "user" ? "mt-2 text-xs text-white/70" : "mt-2 text-xs text-banking-muted"}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-banking-border p-3">
        <button className="grid h-10 w-10 place-items-center rounded-md text-banking-muted hover:bg-banking-offWhite">
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
          className="h-10 flex-1 rounded-md border border-transparent px-3 outline-none focus:border-banking-border"
          placeholder="Write a message"
        />
        <button
          onClick={sendMessage}
          className="grid h-10 w-10 place-items-center rounded-md bg-banking-blue text-white"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-2 border-t border-banking-border bg-white px-4 py-3 text-sm text-banking-muted">
        <MessageSquare className="h-4 w-4" />
        This chat can be converted into a support ticket.
      </div>
    </div>
  );
}
