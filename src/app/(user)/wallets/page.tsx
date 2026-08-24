"use client";

import { useState, useEffect } from "react";
import { AccountsSummary } from "@/components/dashboard/accounts-summary";
import { CryptoInvesting } from "@/components/dashboard/crypto-investing";
import { Landmark, Bitcoin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function WalletsPage() {
  const [activeTab, setActiveTab] = useState<"accounts" | "crypto">("accounts");
  const [userName, setUserName] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        setUserName(profile?.full_name || user.email?.split("@")[0] || "Valued Client");
      }
    }
    loadUser();
  }, [supabase]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Section Nav Tabs (RBC Style Sub-Header) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm flex gap-2">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "accounts"
              ? "bg-[#003366] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Landmark className="w-4 h-4" />
          Accounts Summary
        </button>

        <button
          onClick={() => setActiveTab("crypto")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "crypto"
              ? "bg-[#003366] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Bitcoin className="w-4 h-4" />
          Crypto Investing
        </button>
      </div>

      {/* Main Workspace Render */}
      {activeTab === "accounts" ? (
        <AccountsSummary userName={userName} />
      ) : (
        <CryptoInvesting />
      )}
    </div>
  );
}
