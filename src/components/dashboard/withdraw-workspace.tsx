"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useDashboardMetrics, useCreateWithdrawalRequest } from "@/hooks/useClientQueries";

export function WithdrawWorkspace() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [twoFa, setTwoFa] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>("USDT");

  const supabase = createClient();
  const { notify } = useToast();
  const router = useRouter();
  
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const wallets = metrics?.wallets || [];
  const cadRates = metrics?.cadRates || {};
  
  // Compute available balance based on selected asset
  const selectedWallet = wallets.find(w => w.currency === selectedAsset) || { currency: selectedAsset, balance: 0 };
  const selectedRate = cadRates[selectedAsset] || 1.36; // Fallback rate if missing
  const availableBalance = selectedWallet.balance * selectedRate;

  const createWithdrawal = useCreateWithdrawalRequest();

  const fee = 2.50;
  
  const numAmount = parseFloat(amount || "0");
  const youReceive = numAmount > fee ? numAmount - fee : 0;

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
  }, [supabase]);

  const handleNextStep2 = async () => {
    // Before going to step 3, we send the OTP
    setErrorMsg(null);
    setSendingOtp(true);
    try {
      if (!userEmail) throw new Error("Could not determine your registered email.");
      
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send 2FA code.");
      }

      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send 2FA code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const prevStep = () => {
    setErrorMsg(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleConfirmWithdrawal = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (!userEmail) throw new Error("Session expired. Please log in again.");

      // Verify OTP
      const verifyRes = await fetch("/api/withdraw/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: twoFa }),
      });
      
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Invalid 2FA code.");
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User session not found. Please log in again.");
      }

      await createWithdrawal.mutateAsync({
        asset: selectedAsset,
        amount: numAmount,
        interacEmail: email,
        securityQuestion: question,
        securityAnswer: answer,
      });

      notify({
        title: "Withdrawal request submitted successfully!",
        description: "Awaiting admin approval.",
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error submitting withdrawal:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-[20px] w-[20px]" strokeWidth={2} />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0A0F2C]">Withdraw Funds</h1>
          <p className="text-[14px] text-[#718096]">Transfer to your bank via Interac e-Transfer</p>
        </div>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-6 sm:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {/* Stepper */}
        <div className="mb-10 flex items-center justify-center">
          <div className="flex items-center">
            {/* Step 1 */}
            <div className={cn(
              "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
              step >= 1 ? "bg-[#113285] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
            )}>
              1
            </div>
            {/* Line 1-2 */}
            <div className={cn(
              "mx-2 h-[3px] w-[40px] sm:w-[60px] rounded-full transition-colors",
              step >= 2 ? "bg-[#113285]" : "bg-[#F1F5F9]"
            )} />
            {/* Step 2 */}
            <div className={cn(
              "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
              step >= 2 ? "bg-[#113285] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
            )}>
              2
            </div>
            {/* Line 2-3 */}
            <div className={cn(
              "mx-2 h-[3px] w-[40px] sm:w-[60px] rounded-full transition-colors",
              step >= 3 ? "bg-[#113285]" : "bg-[#F1F5F9]"
            )} />
            {/* Step 3 */}
            <div className={cn(
              "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
              step >= 3 ? "bg-[#113285] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
            )}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Select Asset & Enter Amount */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Withdraw Funds</h2>
            
            <div className="mb-6">
              <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Select Asset</label>
              <select
                value={selectedAsset}
                onChange={(e) => {
                  setSelectedAsset(e.target.value);
                  setAmount("");
                  setErrorMsg(null);
                }}
                className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[16px] font-medium text-[#0A0F2C] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
              >
                {wallets.length === 0 && (
                  <option value="USDT">USDT (No balance)</option>
                )}
                {wallets.map((w) => (
                  <option key={w.currency} value={w.currency}>
                    {w.currency} - {w.balance.toFixed(6)} 
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Withdrawal Amount (CAD)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[16px] font-medium text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
              />
            </div>
            
            <p className="mb-6 text-center text-[14px] text-[#718096]">
              {metricsLoading ? (
                "Loading balance..."
              ) : (
                <>
                  Available {selectedAsset} balance: 
                  <span className="font-bold text-[#0A0F2C] ml-1">
                    {selectedWallet.balance.toFixed(6)}
                  </span> 
                  <span className="ml-1">
                    (${(availableBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD)
                  </span>
                </>
              )}
            </p>

            <div className="mb-8 flex flex-wrap gap-3 sm:flex-nowrap">
              {["100", "500", "1000"].map((preset) => (
                <button 
                  key={preset}
                  disabled={true}
                  className="flex-1 rounded-[12px] border border-gray-100 bg-gray-100 py-3 text-[14px] font-bold text-gray-400 cursor-not-allowed outline-none"
                >
                  ${preset}
                </button>
              ))}
              <button 
                onClick={() => setAmount(availableBalance ? availableBalance.toString() : "0")}
                className="flex-1 rounded-[12px] border border-gray-200 bg-white py-3 text-[14px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 focus:border-[#113285] focus:ring-1 focus:ring-[#113285] outline-none"
              >
                Max
              </button>
            </div>

            <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-5 border border-gray-100">
              <div className="mb-3 flex justify-between">
                <span className="text-[14px] font-medium text-[#718096]">Transaction Fee</span>
                <span className="text-[14px] font-bold text-[#0A0F2C]">${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[16px] font-bold text-[#0A0F2C]">You will receive</span>
                <span className="text-[18px] font-bold text-[#113285]">
                  ${youReceive.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            <button 
              onClick={() => {
                if (numAmount > availableBalance) {
                  setErrorMsg(`Amount exceeds available ${selectedAsset} balance in CAD.`);
                  return;
                }
                if (numAmount < 10) {
                  setErrorMsg("Minimum withdrawal amount is $10.");
                  return;
                }
                setErrorMsg(null);
                setStep(2);
              }}
              disabled={!amount || numAmount <= 0 || metricsLoading}
              className="w-full rounded-[14px] bg-[#113285] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Recipient Details */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Recipient Details</h2>

            <div className="space-y-6 mb-8">
              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Recipient Email (Interac e-Transfer)</label>
                <input 
                  type="email" 
                  placeholder="recipient@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Security Question</label>
                <input 
                  type="text" 
                  placeholder="What is your favorite color?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Security Answer</label>
                <input 
                  type="text" 
                  placeholder="Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                />
              </div>
            </div>

            <div className="mb-8 rounded-[16px] bg-[#FFF9EA] p-5 border border-[#FFEDCC]">
              <div className="mb-2 flex items-center gap-2 text-[15px] font-bold text-[#F5A524]">
                <AlertCircle className="h-[18px] w-[18px]" strokeWidth={2.5} />
                Important
              </div>
              <p className="text-[14px] text-[#4A5568] leading-relaxed">
                Make sure the recipient email is correct. The recipient will need the security answer to claim the funds.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={prevStep}
                disabled={sendingOtp}
                className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
              <button 
                onClick={handleNextStep2}
                disabled={!email || !question || !answer || sendingOtp}
                className="flex-1 rounded-[14px] bg-[#113285] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingOtp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Verify */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Confirm & Verify</h2>

            <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-6 border border-gray-100">
              <h3 className="mb-5 text-[15px] font-bold text-[#0A0F2C]">Transaction Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[14px] font-medium text-[#718096]">Amount</span>
                  <span className="text-[14px] font-bold text-[#0A0F2C]">
                    ${numAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] font-medium text-[#718096]">Fee</span>
                  <span className="text-[14px] font-bold text-[#0A0F2C]">
                    ${fee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] font-medium text-[#718096]">Recipient</span>
                  <span className="text-[14px] font-bold text-[#0A0F2C]">{email}</span>
                </div>
              </div>

              <div className="h-px w-full bg-gray-200 mb-5" />

              <div className="flex justify-between items-center">
                <span className="text-[16px] font-bold text-[#0A0F2C]">Total</span>
                <span className="text-[18px] font-bold text-[#113285]">
                  ${youReceive.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            <div className="mb-8">
              <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">2FA Verification Code</label>
              <p className="mb-4 text-sm text-[#718096]">We have sent a 6-digit code to your registered email address.</p>
              <input 
                type="text" 
                placeholder="0 0 0 0 0 0"
                value={twoFa}
                onChange={(e) => setTwoFa(e.target.value)}
                maxLength={6}
                className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[18px] tracking-[0.25em] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285] text-center"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={prevStep}
                disabled={submitting}
                className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
              <button 
                className="flex-1 rounded-[14px] bg-[#113285] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={twoFa.length < 6 || submitting}
                onClick={handleConfirmWithdrawal}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Confirm Withdrawal"
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
