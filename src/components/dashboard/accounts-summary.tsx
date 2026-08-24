"use client";

import { useState } from "react";
import { 
  Landmark, 
  PlusCircle, 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  XCircle,
  ShieldCheck
} from "lucide-react";
import { useUserBankAccounts, useTransferBankFunds } from "@/hooks/useClientQueries";
import { OpenBankAccountModal } from "@/components/accounts/open-account-modal";

export function AccountsSummary({ userName }: { userName: string }) {
  const { data: bankAccounts = [], isLoading } = useUserBankAccounts();
  const transferMutation = useTransferBankFunds();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fromAccountId, setFromAccountId] = useState<string>("");
  const [toAccountId, setToAccountId] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const activeAccounts = bankAccounts.filter((a) => a.status === "active");

  const totalCadBalance = activeAccounts
    .filter((a) => a.currency === "CAD")
    .reduce((sum, a) => sum + Number(a.balance), 0);

  const totalUsdBalance = activeAccounts
    .filter((a) => a.currency === "USD")
    .reduce((sum, a) => sum + Number(a.balance), 0);

  const selectedFromAccount = activeAccounts.find((a) => a.id === fromAccountId);

  const handleTransfer = async () => {
    if (!fromAccountId || !toAccountId || !transferAmount) return;
    if (fromAccountId === toAccountId) {
      alert("Source and Destination accounts must be different.");
      return;
    }
    const amount = Number(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }

    setTransferSuccess(null);
    try {
      await transferMutation.mutateAsync({
        fromAccountId,
        toAccountId,
        amount,
      });
      setTransferSuccess(`Successfully transferred $${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} to destination account.`);
      setTransferAmount("");
      setTimeout(() => setTransferSuccess(null), 4000);
    } catch (err: any) {
      console.error("Transfer failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* RBC Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003366] via-[#004B8D] to-[#002244] text-white shadow-xl">
        {/* Decorative Mountain Parallax Background Simulation */}
        <div className="absolute inset-0 opacity-15 bg-[radial-[#ffffff]_1px,transparent_1px] [background-size:16px_16px]" />

        <div className="relative p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
              <Landmark className="w-4 h-4 text-emerald-400" /> Bank & Investment Accounts
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Accounts Summary</h1>
            <p className="text-blue-100 text-sm mt-1">Good Day, <span className="font-semibold text-white uppercase">{userName || "Valued Client"}</span></p>
          </div>

          {/* Total Banking Assets */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" /> Total Banking Assets
            </div>
            <div className="text-2xl font-bold text-white">
              ${totalCadBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-semibold text-blue-200 ml-1">CAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Bank Accounts, Right Quick Payments & Transfers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Bank Accounts (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-primary-blue" /> Bank Accounts
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Everyday banking, registered accounts & flexible investments</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700">
                  Total: <span className="text-gray-900 font-bold">${totalCadBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} CAD</span>
                  {totalUsdBalance > 0 && <span className="ml-1 text-gray-500"> / ${totalUsdBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : bankAccounts.length === 0 ? (
                <div className="text-center py-10 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <Landmark className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 text-base">No Active Bank Accounts</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    You haven't opened any bank accounts yet. Click below to apply for Chequing, Savings, TFSA, or Investment accounts.
                  </p>
                  <button
                    onClick={() => setIsOpenModal(true)}
                    className="mt-4 px-5 py-2.5 bg-primary-blue hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow transition-colors inline-flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Open a Bank Account
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {bankAccounts.map((account) => {
                    const statusLower = (account.status || "").toLowerCase();
                    const isPending = statusLower === "pending";
                    const isRejected = statusLower === "rejected";
                    const isClosed = statusLower === "closed";

                    return (
                      <div key={account.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 text-base hover:text-primary-blue transition-colors cursor-pointer">
                              {account.account_name}
                            </span>
                            {isPending ? (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
                              </span>
                            ) : isRejected ? (
                              <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold rounded-full flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-red-600" /> Rejected
                              </span>
                            ) : isClosed ? (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-semibold rounded-full flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-gray-500" /> Closed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 font-mono">
                            {account.account_type.toUpperCase()}{" "}
                            {isRejected
                              ? `• Application Rejected${account.admin_notes ? `: ${account.admin_notes}` : ""}`
                              : isPending
                              ? "• Verification in progress"
                              : account.account_number
                              ? `• ${account.account_number}`
                              : ""}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ${Number(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-xs font-semibold text-gray-500 ml-1 uppercase">{account.currency}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Open Bank Account Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsOpenModal(true)}
                  className="text-primary-blue hover:text-blue-800 font-semibold text-sm flex items-center gap-2 transition-colors py-2 px-1 rounded-lg hover:bg-blue-50/50"
                >
                  <PlusCircle className="w-5 h-5 text-primary-blue" />
                  Open a Bank Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Payments & Transfers Widget (1 Col) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 sticky top-6">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary-blue" /> Quick Payments & Transfers
              </h3>
              <p className="text-xs text-gray-500 mt-1">Move funds instantly between your accounts</p>
            </div>

            {/* Transfer Form */}
            <div className="space-y-4">
              {/* From Account */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">From Account</label>
                <select
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-primary-blue focus:outline-none"
                >
                  <option value="">Select source account...</option>
                  {activeAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} ({acc.account_number || "Active"}) - ${Number(acc.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} {acc.currency}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Account */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">To Account</label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-primary-blue focus:outline-none"
                >
                  <option value="">Select destination account...</option>
                  {activeAccounts
                    .filter((acc) => acc.id !== fromAccountId)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.account_name} ({acc.account_number || "Active"}) - ${Number(acc.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} {acc.currency}
                      </option>
                    ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="10"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-4 pr-16 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary-blue focus:outline-none"
                  />
                  <div className="absolute right-3 top-2.5 text-xs font-bold text-gray-500">
                    {selectedFromAccount?.currency || "CAD"}
                  </div>
                </div>
              </div>

              {transferMutation.error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{(transferMutation.error as Error).message}</span>
                </div>
              )}

              {transferSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{transferSuccess}</span>
                </div>
              )}

              <button
                onClick={handleTransfer}
                disabled={transferMutation.isPending || !fromAccountId || !toAccountId || !transferAmount}
                className="w-full bg-primary-blue hover:bg-blue-800 text-white font-semibold rounded-xl py-3 text-xs flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50"
              >
                {transferMutation.isPending ? (
                  "Executing Transfer..."
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4" /> Complete Transfer
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Instant Internal Settlement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Opening Catalog Modal */}
      <OpenBankAccountModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
    </div>
  );
}
