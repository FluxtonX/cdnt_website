import { AlertTriangle, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";

export default function SecuritySettingsPage() {
  return (
    <>
      <PageTitle
        title="Security Settings"
        description="Manage password, 2FA, withdrawal confirmation, and security alerts."
      />
      <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
        <div className="flex gap-3">
          <ShieldCheck className="h-6 w-6 shrink-0" />
          <div>
            <p className="font-semibold">Security score: Strong</p>
            <p className="mt-1 text-sm leading-6">
              2FA is enabled, email and phone are verified, and withdrawal
              confirmation is active.
            </p>
          </div>
        </div>
      </div>
      <Panel title="Security controls">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Password", "Last changed 12 days ago", LockKeyhole],
            ["Two-factor auth", "Enabled for withdrawals", ShieldCheck],
            ["Recovery codes", "Generate backup access codes", KeyRound],
          ].map(([title, body, Icon]) => (
            <article key={title as string} className="rounded-md border border-banking-border p-4">
              <Icon className="h-5 w-5 text-banking-blue" />
              <h2 className="mt-4 font-semibold">{title as string}</h2>
              <p className="mt-2 text-sm text-banking-muted">{body as string}</p>
              <button className="mt-4 rounded-md border border-banking-border px-3 py-2 text-sm font-semibold">
                Manage
              </button>
            </article>
          ))}
        </div>
      </Panel>
      <div className="mt-6">
        <Panel title="Sensitive action rules">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Require 2FA for withdrawals",
              "Require 2FA for password changes",
              "Send alert for new device login",
              "Lock account after repeated failed attempts",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md border border-banking-border p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-banking-blue" />
                  <p className="font-medium">{item}</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-banking-border" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
