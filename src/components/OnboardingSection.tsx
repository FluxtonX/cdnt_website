"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "1",
    title: "Create your account",
    description: "Sign up online. ID documents and social insurance number required.",
  },
  {
    number: "2",
    title: "Verify your Identity",
    description: "Government-issued ID, powered by Interac. Approved in minutes.",
  },
  {
    number: "3",
    title: "Start banking & investing",
    description: "Load your account, buy crypto, save smarter, and earn through the app.",
  },
];

export default function OnboardingSection() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <p className="text-accent-gold font-semibold tracking-widest text-sm uppercase mb-4">
            Getting Started
          </p>
          <h2 className="text-4xl md:text-[42px] font-bold text-text-primary leading-tight">
            From signup to first trade <br />
            <span className="relative inline-block mt-1">
              <span className="relative z-10 text-primary-blue">in minutes.</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-primary-blue/10 -z-10 transform -rotate-1"></span>
            </span>
          </h2>
        </div>

        {/* Steps Flow */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center text-center relative bg-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                {/* Number Circle */}
                <div className="w-16 h-16 rounded-full bg-primary-blue text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-primary-blue/20">
                  {step.number}
                </div>
                
                <h3 className="text-[20px] font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-[15px] max-w-[260px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
