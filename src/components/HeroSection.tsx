"use client";

import { motion } from "framer-motion";
import { CONTAINER } from "./Navbar";

export default function HeroSection() {
  return (
    <section 
      className="min-h-screen flex items-center overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #F0E8FF 100%)"
      }}
    >
      <div className={`${CONTAINER} w-full flex flex-col lg:flex-row items-center gap-16 pt-32 pb-16`}>
        
        {/* Left Column */}
        <div className="flex-1 max-w-xl z-10">
          
          {/* Trust Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[12px] text-gray-600 font-medium">
              FINTRAC registered · CDIC-style insured deposits
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-1 mb-6">
            <motion.h1 
              className="font-extrabold text-[42px] sm:text-[56px] leading-tight text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Banking Meets
            </motion.h1>
            <motion.h1 
              className="font-extrabold text-[42px] sm:text-[56px] leading-none text-primary-blue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Crypto
            </motion.h1>
            <motion.h1 
              className="font-extrabold text-[42px] sm:text-[56px] leading-none text-primary-blue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              Intelligence
            </motion.h1>
          </div>

          {/* Body Copy */}
          <motion.p 
            className="text-gray-500 text-[16px] leading-relaxed max-w-md mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            A regulated Canadian digital bank with a built-in crypto engine. 
            Move money, save smarter, and invest in digital assets — all from 
            one elegant, insured account.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <button className="bg-primary-navy text-white rounded-full px-7 py-3.5 font-semibold text-[15px] hover:bg-blue-900 transition-all flex items-center justify-center gap-2">
              Open Account <span>→</span>
            </button>
            <button className="bg-white border border-gray-200 text-gray-800 rounded-full px-7 py-3.5 font-medium text-[15px] hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
              Explore Platform <span>↗</span>
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            className="flex gap-10 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div>
              <p className="text-[22px] font-bold text-gray-900 leading-none">100k+</p>
              <p className="text-[13px] text-gray-500 mt-1">Canadians onboard</p>
            </div>
            <div>
              <p className="text-[22px] font-bold text-gray-900 leading-none">$2.4B</p>
              <p className="text-[13px] text-gray-500 mt-1">Assets secured</p>
            </div>
            <div>
              <p className="text-[22px] font-bold text-gray-900 leading-none flex items-center gap-1">
                4.9<span className="text-amber-500">★</span>
              </p>
              <p className="text-[13px] text-gray-500 mt-1">App Store</p>
            </div>
          </motion.div>

        </div>

        {/* Right Column - Floating Cards */}
        <div className="flex-1 relative min-h-[480px] w-full mt-12 lg:mt-0">
          
          {/* Card 1: North Union Bank Card */}
          <motion.div
            className="absolute top-8 left-0 sm:left-8 w-[300px] h-[180px] rounded-3xl shadow-2xl p-6 text-white z-10"
            style={{ background: "linear-gradient(135deg, #1A3FBB 0%, #0A0F2C 100%)" }}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold tracking-widest">NORTH UNION</span>
              <div className="w-6 h-6 border border-white/40 rounded flex items-center justify-center opacity-80">
                <div className="w-3 h-3 bg-white/80 rounded-sm" />
              </div>
            </div>
            <div className="mt-8">
              <p className="text-xs opacity-60">Available balance</p>
              <p className="text-2xl font-bold mt-1">$48,210.94</p>
            </div>
            <p className="text-sm font-mono opacity-80 mt-6 tracking-widest">•••• 4471</p>
          </motion.div>

          {/* Card 2: Bitcoin Price Card */}
          <motion.div
            className="absolute top-0 right-0 sm:right-4 w-[160px] bg-white rounded-2xl shadow-xl p-4 border border-gray-100 z-20"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, delay: 0.5, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold font-sans">B</span>
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">Bitcoin</p>
                <p className="text-xs text-gray-400 mt-0.5">BTC</p>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900 mt-3">$98,420</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-green-500 font-medium">↗ 2.41%</p>
            </div>
            <div className="mt-3">
              <svg width="60" height="24" viewBox="0 0 60 24" className="overflow-visible">
                <path 
                  d="M 0,20 Q 20,15 30,10 Q 45,3 60,2" 
                  stroke="#22C55E" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.div>

          {/* Card 3: Transaction Card */}
          <motion.div
            className="absolute bottom-8 right-0 sm:right-12 w-[260px] bg-white rounded-2xl shadow-xl p-4 border border-gray-100 z-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-xs text-gray-400 font-medium mb-2">Interac e-Transfer</p>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-gray-800">to Sophie L.</p>
              <p className="text-sm font-semibold text-gray-900">-$240.00</p>
            </div>
            <div>
              <div className="w-full h-1 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-primary-blue w-[70%]" />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Completed · just now</p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
