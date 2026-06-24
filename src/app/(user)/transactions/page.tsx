"use client";

import { useState, useMemo, useEffect } from "react";
import { Download, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionTable } from "@/components/dashboard/blocks";
import { createClient } from "@/lib/supabase/client";

const FILTERS = ["All", "Deposits", "Withdrawals"];

type TransactionRow = {
  id: string;
  type: string;
  asset: string;
  amount: string;
  fiat: string;
  status: string;
  date: string;
  description?: string;
  rawDate: Date; // for sorting
  rawAmount: number;
};

export default function TransactionsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [depositsRes, withdrawalsRes] = await Promise.all([
          supabase
            .from("deposit_requests")
            .select("id, created_at, amount, currency, status")
            .eq("user_id", user.id),
          supabase
            .from("withdrawal_requests")
            .select("id, created_at, amount, method, status")
            .eq("user_id", user.id)
        ]);

        const deposits: TransactionRow[] = (depositsRes.data || []).map(d => ({
          id: d.id,
          type: "deposit",
          asset: d.currency || "USD",
          amount: String(d.amount),
          rawAmount: Number(d.amount),
          fiat: "USD",
          status: d.status,
          date: new Date(d.created_at).toLocaleDateString(),
          description: `TXN-${d.id.substring(0, 8).toUpperCase()}`,
          rawDate: new Date(d.created_at)
        }));

        const withdrawals: TransactionRow[] = (withdrawalsRes.data || []).map(w => ({
          id: w.id,
          type: "withdrawal",
          asset: w.method === "interac" ? "CAD" : "USD",
          amount: String(w.amount),
          rawAmount: Number(w.amount),
          fiat: "USD",
          status: w.status,
          date: new Date(w.created_at).toLocaleDateString(),
          description: `TXN-${w.id.substring(0, 8).toUpperCase()}`,
          rawDate: new Date(w.created_at)
        }));

        const combined = [...deposits, ...withdrawals].sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
        setTransactions(combined);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredTransactions = useMemo(() => {
    return transactions.filter((row) => {
      let matchesType = true;
      if (activeFilter === "Deposits") matchesType = row.type === "deposit";
      if (activeFilter === "Withdrawals") matchesType = row.type === "withdrawal";
      
      const haystack = `${row.description} ${row.id} ${row.type} ${row.asset} ${row.status} ${row.amount}`.toLowerCase();
      const matchesSearch = haystack.includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }, [activeFilter, searchQuery, transactions]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ["Date", "Description", "Type", "Asset", "Amount", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(row => 
        [row.date, row.description, row.type, row.asset, row.amount, row.status].map(val => `"${val}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto w-full max-w-[1024px] mt-8 space-y-6">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0A0F2C]">Transactions</h1>
          <p className="text-[14px] text-[#718096]">View and manage your transaction history</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-[12px] border border-gray-200 bg-white px-4 text-[14px] font-bold text-[#0A0F2C] shadow-sm hover:bg-gray-50 transition-colors"
        >
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

      {/* Transactions Table */}
      <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {isLoading ? (
          <div className="flex py-12 justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#113285]" />
          </div>
        ) : filteredTransactions.length > 0 ? (
          <TransactionTable rows={filteredTransactions} />
        ) : (
          <div className="py-12 text-center text-sm font-medium text-gray-500">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}
