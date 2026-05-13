"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { CheckCircle2, ShieldCheck, Camera, FileText, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: "identity",
    title: "Document Verification",
    description: "Upload your government-issued ID (Passport, Driver's License, or National ID).",
    icon: FileText,
  },
  {
    id: "liveness",
    title: "Liveness Check",
    description: "Take a short video or selfie to verify your identity in real-time.",
    icon: Camera,
  },
  {
    id: "review",
    title: "Final Review",
    description: "Our AI systems are validating your documents against global databases.",
    icon: ShieldCheck,
  },
];

export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    setIsProcessing(true);
    // Mock processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      // Final delay before dashboard
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/dashboard");
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <AuthShell 
      eyebrow="Identity Security Protocol"
      title="Identity Verification" 
      description="Protecting your wealth with institutional-grade compliance."
    >
      <div className="space-y-8">
        {/* Progress Tracker */}
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2" />
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                idx <= currentStep 
                  ? "bg-banking-gold border-banking-gold text-banking-ink shadow-lg shadow-banking-gold/20" 
                  : "bg-banking-navy border-white/20 text-white/40"
              }`}
            >
              {idx < currentStep ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-black">{idx + 1}</span>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
                <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white/5 border border-white/10">
                  <StepIcon className="h-10 w-10 text-banking-gold" />
                </div>
                <h3 className="text-xl font-bold text-white">{steps[currentStep].title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{steps[currentStep].description}</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleNext}
                  disabled={isProcessing}
                  className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-banking-gold px-6 text-sm font-black text-banking-ink shadow-2xl transition-all hover:bg-white active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>{currentStep === steps.length - 1 ? "Submit for Final Review" : "Continue to Next Step"}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Secured by NUB Guard Protocol
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center"
            >
              <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-black text-white">Verification Success</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Your identity has been verified. Redirecting you to your Command Center...
              </p>
              <Loader2 className="mx-auto mt-8 h-6 w-6 animate-spin text-banking-gold" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthShell>
  );
}
