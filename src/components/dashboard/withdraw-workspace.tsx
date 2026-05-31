"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WithdrawWorkspace() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [twoFa, setTwoFa] = useState("");

  const availableBalance = 51750.00;
  const fee = 2.50;
  
  const numAmount = parseFloat(amount || "0");
  const youReceive = numAmount > fee ? numAmount - fee : 0;

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

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

        {/* Step 1: Enter Amount */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Enter Amount</h2>
            
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
              Available balance: ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>

            <div className="mb-8 flex flex-wrap gap-3 sm:flex-nowrap">
              {["100", "500", "1000"].map((preset) => (
                <button 
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className="flex-1 rounded-[12px] border border-gray-200 bg-white py-3 text-[14px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 focus:border-[#113285] focus:ring-1 focus:ring-[#113285] outline-none"
                >
                  ${preset}
                </button>
              ))}
              <button 
                onClick={() => setAmount(availableBalance.toString())}
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

            <button 
              onClick={nextStep}
              disabled={!amount || parseFloat(amount) <= 0}
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

            <div className="flex gap-4">
              <button 
                onClick={prevStep}
                className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!email || !question || !answer}
                className="flex-1 rounded-[14px] bg-[#113285] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
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
                  <span className="text-[14px] font-bold text-[#0A0F2C]">{email || "as@gmail.com"}</span>
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

            <div className="mb-8">
              <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">2FA Code</label>
              <input 
                type="text" 
                placeholder="0 0 0 0 0 0"
                value={twoFa}
                onChange={(e) => setTwoFa(e.target.value)}
                maxLength={6}
                className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[18px] tracking-[0.25em] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={prevStep}
                className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                className="flex-1 rounded-[14px] bg-[#113285] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={twoFa.length < 6}
                onClick={() => {
                  // handle submit
                  alert("Withdrawal submitted!");
                }}
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
