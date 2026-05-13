"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Landmark, LogOut, Search } from "lucide-react";
import { userNav } from "@/data/mock";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-banking-offWhite text-banking-text lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-banking-border bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="flex h-20 items-center gap-3 border-b border-banking-border px-5">
            <Link href="/" className="h-10 w-auto min-w-[140px]">
              <img 
                src="/logo.png" 
                alt="North Union" 
                className="h-full w-auto object-contain" 
              />
            </Link>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {userNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-banking-muted transition hover:bg-blue-50 hover:text-banking-blue",
                    active && "bg-blue-50 text-banking-blue",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-banking-border p-4">
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-banking-muted hover:bg-slate-50">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-banking-border bg-white/92 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 lg:hidden">
              <div className="h-8 w-auto min-w-[120px]">
                <img 
                  src="/logo.png" 
                  alt="North Union" 
                  className="h-full w-auto object-contain" 
                />
              </div>
            </Link>
            <div className="hidden h-10 min-w-[280px] items-center gap-2 rounded-md border border-banking-border bg-banking-offWhite px-3 text-sm text-banking-muted md:flex">
              <Search className="h-4 w-4" />
              Search transactions, tickets, assets
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              href="/notifications"
              className="grid h-10 w-10 place-items-center rounded-md border border-banking-border text-banking-muted hover:text-banking-blue"
            >
              <Bell className="h-5 w-5" />
            </Link>
            <div className="h-10 w-10 rounded-full bg-banking-blue text-center text-sm font-semibold leading-10 text-white">
              NU
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
          {children}
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-banking-border bg-white px-2 py-2 shadow-2xl shadow-black/10 lg:hidden">
          {userNav.slice(0, 5).map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] font-semibold text-banking-muted",
                  active && "bg-blue-50 text-banking-blue",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
