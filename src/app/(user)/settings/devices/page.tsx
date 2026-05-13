import { Laptop, MapPin, Smartphone } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { StatusBadge } from "@/components/ui/status-badge";

export default function DevicesPage() {
  return (
    <>
      <PageTitle
        title="Device Management"
        description="View active sessions, new device logins, IP metadata, and remove sessions you do not recognize."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          ["Active sessions", "3", Laptop],
          ["Known locations", "2", MapPin],
          ["New device alerts", "Enabled", Smartphone],
        ].map(([label, value, Icon]) => (
          <article key={label as string} className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
            <Icon className="h-5 w-5 text-banking-blue" />
            <p className="mt-4 text-sm text-banking-muted">{label as string}</p>
            <p className="mt-1 text-2xl font-semibold">{value as string}</p>
          </article>
        ))}
      </div>
      <Panel title="Active devices">
        <div className="space-y-3">
          {["Chrome on Windows", "Safari on iPhone", "Edge on Windows"].map((device, index) => (
            <article key={device} className="grid gap-3 rounded-md border border-banking-border p-4 md:grid-cols-[1fr_0.7fr_0.5fr_110px] md:items-center">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-banking-blue" />
                <div>
                  <p className="font-semibold">{device}</p>
                  <p className="text-sm text-banking-muted">IP 192.168.1.{index + 12}</p>
                </div>
              </div>
              <p className="text-sm text-banking-muted">{index === 0 ? "Current session" : "Last active today"}</p>
              <StatusBadge status={index === 0 ? "active" : "reviewed"} />
              <button className="rounded-md border border-banking-border px-3 py-2 text-sm font-semibold">
                {index === 0 ? "Current" : "Remove"}
              </button>
            </article>
          ))}
        </div>
      </Panel>
    </>
  );
}
