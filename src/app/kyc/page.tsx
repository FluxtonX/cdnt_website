"use client";

import React, { useState } from "react";
import { Check, Upload, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIndicator = () => {
    return (
      <div className="flex items-center justify-center w-full max-w-[400px] mb-6">
        {[1, 2, 3, 4].map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div 
                className={cn(
                  "flex items-center justify-center w-[30px] h-[30px] rounded-full text-[13px] font-bold z-10 transition-colors shadow-sm",
                  isCompleted || isActive ? "bg-[#F5A623] text-[#0A0F2C]" : "bg-[#335CBC] text-blue-200"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : step}
              </div>

              {/* Connecting Line */}
              {index < 3 && (
                <div 
                  className={cn(
                    "flex-1 h-[2px] mx-2 transition-colors rounded-full",
                    step < currentStep ? "bg-[#F5A623]" : "bg-[#335CBC]"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {currentStep <= 4 && (
        <>
          <h1 className="text-[28px] font-bold text-white mb-1 text-center">
            Identity Verification
          </h1>
          <p className="text-[14px] text-blue-100 mb-5 text-center font-medium">
            Complete KYC to unlock your account
          </p>
          <StepIndicator />
        </>
      )}

      <div className="bg-white rounded-2xl w-full p-6 shadow-xl shadow-blue-900/20">
        
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-[17px] font-bold text-[#0A0F2C]">Personal Information</h2>
              <p className="text-[13px] text-[#718096] mt-1">Provide your legal information</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Legal Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Michael Smith" 
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Date of Birth</label>
                  <input 
                    type="text" 
                    placeholder="dd/mm/yy" 
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Social Insurance Number (SIN)</label>
                  <input 
                    type="text" 
                    placeholder="000-000-000" 
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Occupation</label>
                <input 
                  type="text" 
                  placeholder="Software Engineer" 
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                />
              </div>
            </div>

            <button 
              onClick={nextStep}
              className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl mt-6 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Address Details */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-[17px] font-bold text-[#0A0F2C]">Address Details</h2>
              <p className="text-[13px] text-[#718096] mt-1">Your current residential address</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Street Address</label>
                <input 
                  type="text" 
                  placeholder="123 Main Street" 
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">City</label>
                  <input 
                    type="text" 
                    placeholder="Toronto" 
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Province</label>
                  <input 
                    type="text" 
                    placeholder="Ontario" 
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Postal Code</label>
                  <input 
                    type="text" 
                    placeholder="M5A 1A1" 
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Country</label>
                  <input 
                    type="text" 
                    placeholder="Canada" 
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={prevStep}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Government ID Upload */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-[17px] font-bold text-[#0A0F2C]">Government ID Upload</h2>
              <p className="text-[13px] text-[#718096] mt-1">Upload a clear photo of your ID</p>
            </div>
            
            <div className="space-y-3">
              {/* Upload Front */}
              <button className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
                <div className="w-10 h-10 mb-2 text-[#4A5568] group-hover:text-[#113285]">
                  <Upload className="w-full h-full" strokeWidth={1.5} />
                </div>
                <div className="text-[14px] font-bold text-[#0A0F2C] mb-1">Upload Front of ID</div>
                <div className="text-[12px] text-[#718096]">Driver's License, Passport, or Government ID</div>
              </button>

              {/* Upload Back */}
              <button className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
                <div className="w-10 h-10 mb-2 text-[#4A5568] group-hover:text-[#113285]">
                  <Upload className="w-full h-full" strokeWidth={1.5} />
                </div>
                <div className="text-[14px] font-bold text-[#0A0F2C] mb-1">Upload Back of ID</div>
                <div className="text-[12px] text-[#718096]">Clear, well-lit photo</div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={prevStep}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Selfie Upload */}
        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-[17px] font-bold text-[#0A0F2C]">Government ID Upload</h2>
              <p className="text-[13px] text-[#718096] mt-1">Upload a clear photo of your ID</p>
            </div>
            
            <div className="space-y-4">
              
              <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
                <h3 className="text-[13px] font-bold text-[#0A0F2C] mb-2">Selfie Guidelines:</h3>
                <ul className="space-y-1.5">
                  <li className="flex items-center text-[12px] text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-2 flex-shrink-0" />
                    Face clearly visible
                  </li>
                  <li className="flex items-center text-[12px] text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-2 flex-shrink-0" />
                    Good lighting
                  </li>
                  <li className="flex items-center text-[12px] text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-2 flex-shrink-0" />
                    No sunglasses or hats
                  </li>
                  <li className="flex items-center text-[12px] text-[#4A5568]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-2 flex-shrink-0" />
                    Neutral expression
                  </li>
                </ul>
              </div>

              <button className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
                <div className="w-10 h-10 mb-2 text-[#4A5568] group-hover:text-[#113285]">
                  <Upload className="w-full h-full" strokeWidth={1.5} />
                </div>
                <div className="text-[14px] font-bold text-[#0A0F2C] mb-1">Upload Selfie</div>
                <div className="text-[12px] text-[#718096]">JPG or PNG, max 10MB</div>
              </button>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={prevStep}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors"
              >
                Submit for Review
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Verification in Progress */}
        {currentStep === 5 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFF8EB] flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-[#F5A623]" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-[20px] font-bold text-[#0A0F2C] mb-2">Verification in Progress</h2>
            
            <p className="text-[13px] text-[#718096] mb-6 max-w-[360px] leading-relaxed mx-auto">
              Thank you for submitting your documents.<br />
              Our team is reviewing your information.<br />
              This typically takes 1-2 business days.
            </p>
            
            <div className="bg-[#F8F9FA] rounded-xl p-5 w-full mb-6">
              <h3 className="text-[13px] font-bold text-[#0A0F2C] mb-3">What happens next?</h3>
              <ul className="space-y-2 text-[12px] text-[#718096] text-left max-w-[260px] mx-auto list-disc pl-4 marker:text-gray-400">
                <li className="pl-1">We'll verify your identity documents</li>
                <li className="pl-1">You'll receive an email when approved</li>
                <li className="pl-1">You can then access your full account</li>
              </ul>
            </div>

            <Link 
              href="/dashboard"
              className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors block"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
