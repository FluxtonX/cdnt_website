"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Settings, Info, AlertTriangle, ShieldCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const filters = ["all", "security", "kyc", "wallet"];

export function NotificationCenter() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isHighValue, setIsHighValue] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: kyc } = await supabase
          .from("kyc_submissions")
          .select("status")
          .eq("user_id", user.id)
          .single();
        
        setKycStatus(kyc?.status ?? null);

        const { count } = await supabase
          .from("deposit_requests")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "approved");

        setIsHighValue((count || 0) > 0);
      } catch (e) {
        console.error("Error loading user context for notifications:", e);
      } finally {
        setUserLoading(false);
      }
    }

    async function fetchNotifications() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setDbNotifications([]);
          return;
        }

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error && data) {
          setDbNotifications(data);
        }
      } catch (e) {
        console.error("Error loading notifications:", e);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
    fetchNotifications();

    const channel = supabase
      .channel("realtime-announcements")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const visibleNotifications = useMemo(() => {
    return dbNotifications;
  }, [dbNotifications]);

  const mergedNotifications = useMemo(() => {
    const iconMap: Record<string, any> = {
      Info: Info,
      Warning: AlertTriangle,
      Success: ShieldCheck,
      Error: XCircle,
    };

    return visibleNotifications.map((n: any) => {
      const diffMs = Date.now() - new Date(n.created_at).getTime();
      const diffMin = Math.floor(diffMs / 1000 / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHr / 24);

      let timeStr = "just now";
      if (diffDays > 0) timeStr = `${diffDays}d ago`;
      else if (diffHr > 0) timeStr = `${diffHr}h ago`;
      else if (diffMin > 0) timeStr = `${diffMin}m ago`;

      return {
        title: n.title,
        body: n.message,
        time: timeStr,
        icon: iconMap[n.type] || Info,
      };
    });
  }, [visibleNotifications]);

  const rows = useMemo(() => {
    return mergedNotifications.filter((item) => {
      const text = `${item.title} ${item.body}`.toLowerCase();
      const category =
        item.title.toLowerCase().includes("kyc")
          ? "kyc"
          : item.title.toLowerCase().includes("deposit")
            ? "wallet"
            : "security";
      return (
        text.includes(query.toLowerCase()) &&
        (filter === "all" || category === filter)
      );
    });
  }, [mergedNotifications, query, filter]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <label className="flex h-11 items-center gap-2 rounded-md border border-banking-border px-3 text-sm text-banking-muted">
          <Search className="h-4 w-4" />
          <input
            suppressHydrationWarning
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-full flex-1 bg-transparent outline-none"
            placeholder="Search notifications"
          />
        </label>
        <select
          suppressHydrationWarning
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="h-11 rounded-md border border-banking-border bg-white px-3 text-sm"
        >
          {filters.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <Link
          href="/notifications/preferences"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-banking-border bg-white px-4 text-sm font-semibold"
        >
          <Settings className="h-4 w-4" />
          Preferences
        </Link>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-banking-muted animate-pulse">
            Loading announcements...
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-sm font-semibold text-banking-muted border border-dashed border-banking-border rounded-lg bg-banking-offWhite/30">
            No announcements found.
          </div>
        ) : (
          rows.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex gap-4 rounded-md border border-banking-border bg-white p-4"
              >
                <div className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-banking-blue">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <h2 className="font-semibold">{item.title}</h2>
                    <span className="w-fit rounded-full bg-banking-offWhite px-2.5 py-1 text-xs font-semibold text-banking-muted">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-banking-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
