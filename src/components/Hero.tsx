"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const stats = [
    { value: "100k+", label: "Active Clients" },
    { value: "$2.4B", label: "Monthly Volume" },
    { value: "4.9★", label: "App Rating" },
  ];

  return (
    <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-36 bg-gradient-to-b from-[#FAF9F5] via-[#F4F6F9] to-white">
      {/* Background blobs for premium depth */}
      <div
        className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(253,194,5,0.06) 0%, rgba(253,194,5,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[10%] left-[-10%] h-[500px] w-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(48,97,239,0.06) 0%, rgba(48,97,239,0) 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#3061EF]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3061EF] mb-6"
            >
              <span className="h-2 w-2 rounded-full bg-[#3061EF] animate-pulse" />
              A New Era of Crypto-Banking
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-[#0B1220] sm:text-5xl md:text-6.5xl leading-[1.08] lg:max-w-xl"
            >
              Banking Meets <br />
              <span className="text-[#3061EF] bg-gradient-to-r from-[#3061EF] to-[#1e40af] bg-clip-text text-transparent">
                Crypto Intelligence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-slate-500 max-w-lg"
            >
              A revolutionary platform bridging traditional banking reliability with
              modern digital assets, built to protect, grow, and empower your wealth.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#0B1220] hover:bg-[#3061EF] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/10 hover:shadow-blue-500/25 transition-all hover:scale-105 duration-300 w-full sm:w-auto"
              >
                Open Account
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-8 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:scale-105 duration-300 w-full sm:w-auto"
              >
                Explore Platform
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 w-full max-w-md border-t border-slate-200/60 pt-8"
            >
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-3xl font-extrabold text-[#0B1220] tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating Cards Parallax Container */}
          <div className="lg:col-span-5 relative h-[480px] w-full flex items-center justify-center mt-12 lg:mt-0">
            {/* 1. Dark Blue Premium Bank Card */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute z-20 w-[290px] sm:w-[320px] h-[180px] sm:h-[200px] rounded-2xl bg-gradient-to-br from-[#0c2461] via-[#0a3d62] to-[#07111F] p-5 sm:p-6 text-white shadow-[0_20px_50px_rgba(12,36,97,0.22)] border border-white/10 transform rotate-[-4deg] translate-x-[-20px] translate-y-[-20px]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] text-white/50 font-bold uppercase tracking-wider">
                    Available Balance
                  </p>
                  <p className="text-2xl sm:text-3xl font-black mt-0.5 tracking-tight text-white">
                    $45,210.04
                  </p>
                </div>
                <span className="text-xs font-black tracking-widest text-[#60a5fa]">
                  NUB
                </span>
              </div>
              <div className="mt-10 sm:mt-12">
                <p className="text-sm font-mono tracking-widest text-white/70">
                  •••• •••• •••• 8824
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] text-white/40">
                <div>
                  <p className="uppercase text-[8px] font-bold">Cardholder</p>
                  <p className="font-bold text-white/80 mt-0.5">M SAFI</p>
                </div>
                <div>
                  <p className="uppercase text-[8px] font-bold">Expires</p>
                  <p className="font-bold text-white/80 mt-0.5">09/29</p>
                </div>
              </div>
            </motion.div>

            {/* 2. Light Balance Card (behind/above) */}
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute z-10 w-[270px] sm:w-[300px] h-[170px] sm:h-[185px] rounded-2xl bg-white border border-slate-200/60 p-5 text-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.06)] transform rotate-[6deg] translate-x-[40px] translate-y-[-80px]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    Savings Vault
                  </p>
                  <p className="text-2xl font-black mt-0.5 tracking-tight text-slate-900">
                    $128,450.00
                  </p>
                </div>
                <span className="text-xs font-black tracking-widest text-slate-400">
                  VISA
                </span>
              </div>
              <div className="mt-8">
                <p className="text-xs font-mono tracking-widest text-slate-400">
                  •••• •••• •••• 4119
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center text-[9px] text-slate-450">
                <div>
                  <p className="uppercase text-[7px] font-bold text-slate-400">
                    Cardholder
                  </p>
                  <p className="font-bold text-slate-700 mt-0.5">M SAFI</p>
                </div>
                <div>
                  <p className="uppercase text-[7px] font-bold text-slate-400">
                    Expires
                  </p>
                  <p className="font-bold text-slate-700 mt-0.5">12/30</p>
                </div>
              </div>
            </motion.div>

            {/* 3. Small Transaction Card */}
            <motion.div
              animate={{
                x: [0, 5, 0],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="absolute z-35 bottom-[40px] left-[-10px] sm:left-[10px] w-[210px] rounded-xl bg-white p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.06)] border border-slate-100/80 flex items-center gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-4.5 w-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                  />
                </svg>
              </span>
              <div>
                <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Interac e-Transfer
                </p>
                <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                  From Jane S.
                </p>
                <p className="text-xs font-black text-emerald-600 mt-0.5">
                  +$250.00 CAD
                </p>
              </div>
            </motion.div>

            {/* 4. Crypto / Graph Card */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.7,
              }}
              className="absolute z-30 bottom-[60px] right-[-10px] sm:right-[20px] w-[220px] rounded-xl bg-white/95 backdrop-blur-md p-4 shadow-[0_12px_35px_rgba(0,0,0,0.08)] border border-slate-200/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Total Assets
                  </p>
                  <p className="text-base font-black text-slate-900 mt-0.5">
                    $45,210.04
                  </p>
                </div>
                <span className="rounded-full bg-[#3061EF]/10 px-2 py-0.5 text-[9px] font-bold text-[#3061EF]">
                  +2.42%
                </span>
              </div>
              <div className="mt-3 h-10 w-full">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 32 C 25 15, 50 35, 75 12 C 85 5, 95 8, 100 8"
                    fill="none"
                    stroke="#3061EF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 32 C 25 15, 50 35, 75 12 C 85 5, 95 8, 100 8 L 100 40 L 0 40 Z"
                    fill="url(#hero-sparkline-grad)"
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient
                      id="hero-sparkline-grad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3061EF" />
                      <stop offset="100%" stopColor="#3061EF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
