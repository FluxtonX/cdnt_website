import Link from "next/link";
import { MessageSquare, Paperclip, UserRoundCheck } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { StatusBadge } from "@/components/ui/status-badge";

export default function TicketDetailPage() {
  return (
    <>
      <PageTitle
        title="Support Ticket SUP-1402"
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
            {[
              ["user", "Can you confirm if my Interac withdrawal is still pending review?"],
              ["agent", "Yes. Your request is in review and no additional documents are required at this moment."],
              ["user", "Thank you. Please notify me when it moves to processing."],
            ].map(([from, text], index) => (
              <div key={index} className={from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={from === "user" ? "max-w-[78%] rounded-lg bg-banking-blue p-3 text-sm text-white" : "max-w-[78%] rounded-lg bg-banking-offWhite p-3 text-sm text-banking-muted"}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Ticket details">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Status</span>
              <StatusBadge status="waiting_admin" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-banking-muted">Category</span>
              <span className="font-semibold">withdrawal_issue</span>
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
