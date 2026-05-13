"use client";

import { useMemo, useState } from "react";
import { Search, Settings } from "lucide-react";
import Link from "next/link";
import { notifications } from "@/data/mock";

const filters = ["all", "security", "kyc", "wallet"];

export function NotificationCenter() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const rows = useMemo(() => {
    return notifications.filter((item) => {
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
  }, [query, filter]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <label className="flex h-11 items-center gap-2 rounded-md border border-banking-border px-3 text-sm text-banking-muted">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-full flex-1 bg-transparent outline-none"
            placeholder="Search notifications"
          />
        </label>
        <select
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
        {rows.map((item) => {
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
        })}
      </div>
    </div>
  );
}
