"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, Landmark } from "lucide-react";
import { useApplyBankAccount, BankAccount } from "@/hooks/useClientQueries";

export type AccountCatalogItem = {
  category: "everyday" | "registered" | "other";
  categoryLabel: string;
  type: BankAccount["account_type"];
  name: string;
  currency: "CAD" | "USD";
  badge?: string;
  description: string;
};

export const ACCOUNT_CATALOG: AccountCatalogItem[] = [
  // Everyday
  {
    category: "everyday",
    categoryLabel: "Everyday Banking",
    type: "chequing",
    name: "Chequing Account",
    currency: "CAD",
    badge: "Popular",
    description: "For daily transactions like paying bills, making purchases, and direct deposits."
  },
  {
    category: "everyday",
    categoryLabel: "Everyday Banking",
    type: "savings",
    name: "Savings Account",
    currency: "CAD",
    description: "For setting money aside and earning higher interest on your deposits."
  },
  // Registered / Tax-Advantaged
  {
    category: "registered",
    categoryLabel: "Registered & Tax-Advantaged",
    type: "tfsa",
    name: "TFSA (Tax-Free Savings Account)",
    currency: "CAD",
    badge: "Tax-Free",
    description: "Invest after-tax money and watch it grow tax-free with flexible withdrawals."
  },
  {
    category: "registered",
    categoryLabel: "Registered & Tax-Advantaged",
    type: "rrsp",
    name: "RRSP (Registered Retirement Savings Plan)",
    currency: "CAD",
    badge: "Tax-Deductible",
    description: "Save for retirement with tax-deductible contributions and tax-deferred growth."
  },
  {
    category: "registered",
    categoryLabel: "Registered & Tax-Advantaged",
    type: "fhsa",
    name: "FHSA (First Home Savings Account)",
    currency: "CAD",
    badge: "First Home",
    description: "Save for a first home with tax-deductible contributions and tax-free withdrawals."
  },
  {
    category: "registered",
    categoryLabel: "Registered & Tax-Advantaged",
    type: "resp",
    name: "RESP (Registered Education Savings Plan)",
    currency: "CAD",
    description: "Long-term savings plan for post-secondary education with government grant eligibility."
  },
  {
    category: "registered",
    categoryLabel: "Registered & Tax-Advantaged",
    type: "rrif",
    name: "RRIF (Registered Retirement Income Fund)",
    currency: "CAD",
    description: "Converts savings from your RRSP into regular retirement income."
  },
  // Other
  {
    category: "other",
    categoryLabel: "Investment & Special Accounts",
    type: "non_registered",
    name: "Non-Registered Investment Account",
    currency: "CAD",
    description: "Flexible investment account without contribution limits or registered rules."
  },
  {
    category: "other",
    categoryLabel: "Investment & Special Accounts",
    type: "joint",
    name: "Joint Account",
    currency: "CAD",
    description: "Shared account for partners or family members with equal access to funds."
  },
  {
    category: "other",
    categoryLabel: "Investment & Special Accounts",
    type: "business",
    name: "Business Account",
    currency: "CAD",
    description: "Designed for business owners to manage company finances and transactions."
  }
];

export function OpenBankAccountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "everyday" | "registered" | "other">("all");
  const [selectedAccount, setSelectedAccount] = useState<AccountCatalogItem | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const applyMutation = useApplyBankAccount();

  // Clean state whenever modal is closed or reopened
  const handleClose = () => {
    setSelectedAccount(null);
    setSuccessMessage(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedAccount(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredAccounts = selectedCategory === "all" 
    ? ACCOUNT_CATALOG 
    : ACCOUNT_CATALOG.filter(a => a.category === selectedCategory);

  const handleApply = async () => {
    if (!selectedAccount) return;
    setSuccessMessage(null);
    try {
      await applyMutation.mutateAsync({
        account_category: selectedAccount.category,
        account_type: selectedAccount.type,
        account_name: selectedAccount.name,
        currency: selectedAccount.currency,
      });
      setSuccessMessage(`Your application for ${selectedAccount.name} has been submitted successfully.`);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      console.error("Failed to apply for account:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#003366] via-[#0055A5] to-[#003366] text-white p-6 relative">
          <button 
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Open a New Bank Account</h2>
              <p className="text-blue-100 text-sm mt-0.5">Explore our range of everyday, registered tax-advantaged, and investment accounts</p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Accounts" },
              { id: "everyday", label: "Everyday Banking" },
              { id: "registered", label: "Registered & Tax-Advantaged" },
              { id: "other", label: "Investment & Other" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? "bg-white text-[#003366] shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {successMessage ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center my-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Application Submitted</h3>
              <p className="text-emerald-700 text-sm max-w-md mx-auto">{successMessage}</p>
            </div>
          ) : selectedAccount ? (
            /* Application Details Step */
            <div className="space-y-6">
              <button
                onClick={() => {
                  setSelectedAccount(null);
                }}
                className="text-xs font-semibold text-primary-blue hover:underline flex items-center gap-1 mb-2"
              >
                ← Back to Account List
              </button>

              <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-blue text-white mb-2 inline-block">
                      {selectedAccount.categoryLabel}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{selectedAccount.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{selectedAccount.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-white border border-gray-200 font-bold text-xs rounded-lg text-gray-700 shadow-sm">
                    {selectedAccount.currency} Currency
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
                <h4 className="font-semibold text-sm text-gray-900">Account Details</h4>
                <div className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-emerald-600 text-lg">✓</span>
                  <p className="text-xs text-emerald-800">
                    No initial deposit is required. You can fund your account at any time via internal transfer or deposit after approval.
                  </p>
                </div>
              </div>

              {applyMutation.error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {(applyMutation.error as Error).message}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    setSelectedAccount(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applyMutation.isPending}
                  className="px-6 py-2.5 bg-primary-blue hover:bg-blue-800 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-colors disabled:opacity-50 rounded-xl"
                >
                  {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          ) : (
            /* Catalog Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccounts.map((account) => (
                <div
                  key={account.type}
                  className="bg-white border border-gray-200 hover:border-primary-blue rounded-2xl p-5 transition-all hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        {account.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {account.badge && (
                          <span className="px-2 py-0.5 bg-blue-50 text-primary-blue font-semibold text-[10px] rounded-full border border-blue-100">
                            {account.badge}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold text-[10px] rounded-md">
                          {account.currency}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-primary-blue transition-colors">
                      {account.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">
                      {account.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setSelectedAccount(account);
                      }}
                      className="px-4 py-2 bg-primary-blue/10 hover:bg-primary-blue text-primary-blue hover:text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-1"
                    >
                      Apply Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
