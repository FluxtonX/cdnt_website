"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Bell, 
  ChevronDown,
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  Settings, 
  HelpCircle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Wallets", href: "/wallets", icon: Wallet },
  { label: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help & Support", href: "/support", icon: HelpCircle },
];

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0A0F2C] lg:grid lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-r border-gray-100 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="flex items-center justify-center pt-[18px] pb-0 px-6 mb-0 bg-white">
            <Link href="/" className="flex items-center justify-center w-full">
              <Image 
                src="/cdnt-logo.png" 
                alt="CDNT" 
                width={100}
                height={40}
                className="w-[100px] h-auto object-contain brightness-0"
                priority
                unoptimized
              />
            </Link>
          </div>
          
          {/* Nav Links */}
          <nav className="flex-1 space-y-1.5 px-4">
            {sidebarNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors",
                    active 
                      ? "bg-[#113285] text-white shadow-md shadow-blue-900/10" 
                      : "text-[#4A5568] hover:bg-gray-50 hover:text-[#0A0F2C]"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          {/* Sign Out */}
          <div className="p-4 mb-4">
            <button className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] font-medium text-[#E53E3E] hover:bg-red-50 transition-colors">
              <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 pb-20 lg:pb-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-[88px] items-center justify-between border-b border-gray-100 bg-white px-4 md:px-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-[20px] font-bold text-[#0A0F2C]">Welcome back, Sarah</h1>
            <p className="text-[13px] text-[#718096] mt-0.5">Here's what's happening with your portfolio today</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-[#4A5568] hover:text-[#0A0F2C] transition-colors">
              <Bell className="h-5 w-5" strokeWidth={2} />
              <span className="absolute top-0 right-0 block h-2 w-2 -translate-y-0.5 translate-x-0.5 rounded-full bg-[#E53E3E] ring-2 ring-white" />
            </button>
            
            <div className="h-6 w-px bg-gray-200" />
            
            <button className="flex items-center gap-3 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#113285] text-[13px] font-bold text-white">
                S
              </div>
              <span className="text-[14px] font-medium text-[#0A0F2C] hidden sm:block">Sarah Chen</span>
              <ChevronDown className="h-4 w-4 text-[#718096]" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
