import Link from "next/link";
import { LockKeyhole, MonitorCheck, UserRound } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  return (
    <>
      <PageTitle
        title="Settings"
        description="Manage profile details, security preferences, notification settings, and account preferences."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Profile", "Update contact and personal information.", UserRound, "/settings"],
          ["Security", "Password, 2FA, and sensitive actions.", LockKeyhole, "/settings/security"],
          ["Devices", "Review and remove active sessions.", MonitorCheck, "/settings/devices"],
        ].map(([title, body, Icon, href]) => (
          <Link key={title as string} href={href as string} className="rounded-lg border border-banking-border bg-white p-5 shadow-sm hover:border-banking-blue">
            <Icon className="h-6 w-6 text-banking-blue" />
            <h2 className="mt-4 font-semibold">{title as string}</h2>
            <p className="mt-2 text-sm leading-6 text-banking-muted">{body as string}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Panel title="Profile">
          <form className="grid gap-4 md:grid-cols-2">
            <input className="h-12 rounded-md border border-banking-border px-4" placeholder="Full name" />
            <input className="h-12 rounded-md border border-banking-border px-4" placeholder="Email" />
            <input className="h-12 rounded-md border border-banking-border px-4" placeholder="Phone" />
            <input className="h-12 rounded-md border border-banking-border px-4" placeholder="Country" />
          </form>
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title="Appearance">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">Theme preference</h2>
              <p className="mt-1 text-sm text-banking-muted">
                Choose light, dark, or system mode for the client workspace.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </Panel>
      </div>
    </>
  );
}
