"use client";

import { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionTable } from "@/components/dashboard/blocks";
import { transactions } from "@/data/mock";

const FILTERS = ["All", "Deposits", "Withdrawals", "Fees"];

export default function TransactionsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((row) => {
      let matchesType = true;
      if (activeFilter === "Deposits") matchesType = row.type === "crypto_deposit";
      if (activeFilter === "Withdrawals") matchesType = row.type === "withdrawal_request";
      if (activeFilter === "Fees") matchesType = row.type === "admin_adjustment"; // Or whatever logic maps to fees
      
      const haystack = `${row.id} ${row.type} ${row.asset} ${row.status}`.toLowerCase();
      const matchesSearch = haystack.includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-[1024px] mt-8 space-y-6">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0A0F2C]">Transactions</h1>
          <p className="text-[14px] text-[#718096]">View and manage your transaction history</p>
        </div>
        <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-[12px] border border-gray-200 bg-white px-4 text-[14px] font-bold text-[#0A0F2C] shadow-sm hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" strokeWidth={2} />
          Export CSV
        </button>
      </div>

      {/* Filter Card */}
      <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-[480px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#718096]" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transaction ID, crypto, or hash..."
              className="h-[44px] w-full rounded-[14px] border border-gray-200 bg-white pl-11 pr-4 text-[14px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "h-[44px] rounded-[14px] px-5 text-[14px] font-bold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-[#113285] text-white"
                      : "border border-gray-200 bg-white text-[#4A5568] hover:bg-gray-50"
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions Table (Below the filter card, keeping functionality intact) */}
      <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <TransactionTable rows={filteredTransactions} />
      </div>
    </div>
  );
}
