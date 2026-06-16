"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { 
  Bell, 
  ChevronDown,
  LayoutDashboard, 
  Wallet, 
  BarChart3,
  ArrowRightLeft, 
  Settings, 
  HelpCircle,
  LogOut,
  User,
  Shield,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Wallets", href: "/wallets", icon: Wallet },
  { label: "Buy / Sell", href: "/exchange", icon: BarChart3 },
  { label: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help & Support", href: "/support", icon: HelpCircle },
];

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  
  const [userProfile, setUserProfile] = useState<{ email: string, fullName: string, initials: string, isKycVerified: boolean, kycStatus: string | null } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHighValue, setIsHighValue] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const formatTime = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMin = Math.floor(diffMs / 1000 / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHr > 0) return `${diffHr}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return "just now";
  };

  const getReadNotifications = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const read = localStorage.getItem("read_notifications");
      return read ? JSON.parse(read) : [];
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return [];
    }
  };

  const markNotificationAsRead = (id: string) => {
    try {
      const read = getReadNotifications();
      if (!read.includes(id)) {
        read.push(id);
        localStorage.setItem("read_notifications", JSON.stringify(read));
      }
    } catch (e) {
      console.error("Error writing to localStorage:", e);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, kyc_verified")
          .eq("id", user.id)
          .single();

        const { data: kyc } = await supabase
          .from("kyc_submissions")
          .select("status")
          .eq("user_id", user.id)
          .single();

        const fullNameFromProfile = profile?.full_name?.trim();
        const fullNameFromMeta = (user as any).user_metadata?.full_name?.trim();
        const fallbackName = user.email?.split("@")[0] ?? "User";
        const fullName =
          (fullNameFromProfile && fullNameFromProfile.length > 0 && fullNameFromProfile) ||
          (fullNameFromMeta && fullNameFromMeta.length > 0 && fullNameFromMeta) ||
          fallbackName;
        const initials = fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

        setUserProfile({
          email: user.email ?? "",
          fullName,
          initials,
          isKycVerified: profile?.kyc_verified ?? false,
          kycStatus: kyc?.status ?? null,
        });
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setProfileLoading(false);
      }
    }
    loadUser();
  }, [supabase]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setDbNotifications(data);

          const { count } = await supabase
            .from("deposit_requests")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "approved");
          
          setIsHighValue((count || 0) > 0);
        }
      } catch (e) {
        console.error("Error loading notifications:", e);
      } finally {
        setNotificationsLoading(false);
      }
    }
    
    fetchNotifications();

    const channel = supabase
      .channel("realtime-notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const visibleNotifications = useMemo(() => {
    return dbNotifications.filter((n: any) => {
      const aud = n.audience;
      if (!aud || aud === "All") return true;
      if (profileLoading || !userProfile) return false;
      if (aud === "Verified" && userProfile.kycStatus === "approved") return true;
      if (aud === "Unverified" && userProfile.kycStatus !== "approved") return true;
      if (aud === "High Value" && isHighValue) return true;
      return false;
    });
  }, [dbNotifications, userProfile, profileLoading, isHighValue]);

  useEffect(() => {
    if (visibleNotifications.length > 0) {
      const readIds = getReadNotifications();
      const unread = visibleNotifications.filter(n => !readIds.includes(n.id));
      setUnreadCount(unread.length);
    } else {
      setUnreadCount(0);
    }
  }, [visibleNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0A0F2C] lg:grid lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-r border-gray-100 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="flex items-center justify-center h-[88px] px-6 bg-white">
            <Link href="/" className="flex items-center justify-center w-full">
              <Image 
                src="/bluelogo.png" 
                alt="CDNT" 
                width={100}
                height={40}
                className=" h-auto "
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
            <button 
              onClick={handleSignOut}
              className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] font-medium text-[#E53E3E] hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 pb-20 lg:pb-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-[88px] items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6 md:px-8">
          <div className="flex flex-col justify-center min-w-0 mr-4">
            <h1 className="text-[16px] sm:text-[20px] font-bold text-[#0A0F2C] truncate">
              Welcome back, {userProfile?.fullName.split(' ')[0] || 'User'}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#718096] mt-0.5 hidden sm:block truncate">
              Here's what's happening with your portfolio today
            </p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => {
                  const wasOpen = isNotificationsOpen;
                  setIsNotificationsOpen(!wasOpen);
                  if (!wasOpen) {
                    visibleNotifications.forEach(n => markNotificationAsRead(n.id));
                    setUnreadCount(0);
                  }
                }}
                className={cn(
                  "relative text-[#4A5568] hover:text-[#0A0F2C] transition-colors p-2 rounded-lg border",
                  isNotificationsOpen ? "bg-gray-50 border-gray-100" : "border-transparent hover:bg-gray-50 hover:border-gray-100"
                )}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[#E53E3E] ring-2 ring-white animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 py-1 z-50">
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs font-bold text-gray-900">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => {
                          visibleNotifications.forEach(n => markNotificationAsRead(n.id));
                          setUnreadCount(0);
                        }}
                        className="text-[10px] font-bold text-[#113285] hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 no-scrollbar">
                    {notificationsLoading ? (
                      <div className="py-6 text-center text-xs font-semibold text-[#718096] animate-pulse">
                        Loading notifications...
                      </div>
                    ) : visibleNotifications.length === 0 ? (
                      <div className="py-8 text-center text-xs font-semibold text-[#718096]">
                        No new notifications
                      </div>
                    ) : (
                      visibleNotifications.slice(0, 5).map((n: any) => {
                        const Icon = n.type === "Info" ? Info :
                                      n.type === "Warning" ? AlertCircle :
                                      n.type === "Success" ? CheckCircle2 : XCircle;
                        return (
                          <div key={n.id} className="p-3.5 flex gap-3 hover:bg-gray-50/50 transition-colors">
                            <div className={cn("grid h-8 w-8 place-items-center rounded-lg shrink-0", 
                              n.type === "Info" ? "bg-blue-50 text-[#113285]" :
                              n.type === "Warning" ? "bg-amber-50 text-amber-600" :
                              n.type === "Success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#0A0F2C] leading-snug line-clamp-1">{n.title}</p>
                              <p className="text-[11px] text-[#718096] mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                              <span className="text-[9px] text-[#A0AEC0] font-semibold mt-1 block font-mono">{formatTime(n.created_at)}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="py-1 px-2">
                    <Link 
                      href="/notifications" 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block text-center py-2 text-xs font-bold text-[#113285] hover:bg-blue-50/50 rounded-lg transition-colors"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-6 w-px bg-gray-200" />
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors border",
                  isDropdownOpen ? "bg-gray-50 border-gray-100" : "border-transparent hover:bg-gray-50 hover:border-gray-100"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#113285] text-[13px] font-bold text-white">
                  {userProfile?.initials || 'U'}
                </div>
                <span className="text-[14px] font-medium text-[#0A0F2C] hidden sm:block">
                  {userProfile?.fullName || 'Loading...'}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-[#718096] transition-transform", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 py-1">
                  <div className="px-4 py-3">
                    <p className="text-[13px] font-medium text-[#0A0F2C] truncate">{userProfile?.fullName || 'User'}</p>
                    <p className="text-[12px] text-[#718096] truncate">{userProfile?.email || 'Loading...'}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/settings" className="group flex items-center px-4 py-2 text-[13px] text-[#4A5568] hover:bg-gray-50 hover:text-[#0A0F2C]">
                      <User className="mr-3 h-4 w-4 text-[#718096] group-hover:text-[#113285]" />
                      Profile
                    </Link>
                    <Link href="/settings/security" className="group flex items-center px-4 py-2 text-[13px] text-[#4A5568] hover:bg-gray-50 hover:text-[#0A0F2C]">
                      <Shield className="mr-3 h-4 w-4 text-[#718096] group-hover:text-[#113285]" />
                      Security
                    </Link>
                    <Link href="/kyc" className="group flex items-center px-4 py-2 text-[13px] text-[#4A5568] hover:bg-gray-50 hover:text-[#0A0F2C]">
                      <FileCheck className="mr-3 h-4 w-4 text-[#718096] group-hover:text-[#113285]" />
                      Verification/KYC
                    </Link>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={handleSignOut}
                      className="group flex w-full items-center px-4 py-2 text-[13px] text-[#E53E3E] hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-[#E53E3E]" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full p-4 md:p-8">
          {/* Show KYC warning only when profile indicates not verified */}
       {userProfile && userProfile.kycStatus === null && (
  <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
    <div className="flex items-start sm:items-center gap-3">
      <div className="mt-0.5 sm:mt-0 flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-amber-500" strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-[14px] font-bold text-amber-900">Verification Incomplete</h3>
        <p className="text-[13px] text-amber-700 mt-0.5">Please complete your KYC verification to unlock full account features and higher limits.</p>
      </div>
    </div>
    <Link
      href="/kyc"
      className="whitespace-nowrap rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-bold text-white shadow-sm hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex-shrink-0"
    >
      Complete Verification
    </Link>
  </div>
)}

{userProfile && userProfile.kycStatus === 'pending' && (
  <div className="mb-6 rounded-xl bg-yellow-50 border border-yellow-200 p-4 flex items-start sm:items-center gap-3 shadow-sm">
    <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" strokeWidth={2.5} />
    <div>
      <h3 className="text-[14px] font-bold text-yellow-900">KYC Under Review</h3>
      <p className="text-[13px] text-yellow-700 mt-0.5">Your verification is being reviewed. We'll notify you when it's approved.</p>
    </div>
  </div>
)}

          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center border-t border-gray-200 bg-white px-2 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex w-full items-center justify-between overflow-x-auto gap-1 no-scrollbar sm:px-4">
          {sidebarNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            // Shorten label for mobile if needed
            const shortLabel = item.label === "Help & Support" ? "Support" : item.label;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl p-1 transition-colors",
                  active 
                    ? "text-[#113285]" 
                    : "text-[#718096] hover:bg-gray-50 hover:text-[#0A0F2C]"
                )}
              >
                <div className={cn(
                  "flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300",
                  active ? "bg-blue-50/80" : "bg-transparent"
                )}>
                  <Icon className={cn("h-[20px] w-[20px] transition-transform", active ? "scale-110" : "")} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium leading-tight text-center tracking-tight",
                  active ? "font-bold text-[#113285]" : ""
                )}>
                  {shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
