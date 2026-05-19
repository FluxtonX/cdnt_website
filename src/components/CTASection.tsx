"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#014EA1] via-[#003B7A] to-[#07111F] py-20 px-8 text-center text-white shadow-2xl border border-white/10"
        >
          {/* Neon Glow Highlights */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(48,97,239,0.2),transparent_60%)] pointer-events-none" />
          <div className="absolute top-[20%] left-[10%] h-1 w-1 bg-white rounded-full opacity-60 animate-pulse" />
          <div className="absolute top-[60%] right-[15%] h-1.5 w-1.5 bg-white rounded-full opacity-45" />
          <div className="absolute bottom-[15%] left-[30%] h-1 w-1 bg-white rounded-full opacity-50" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              Your Financial Future, <br />
              <span className="text-[#60a5fa] bg-gradient-to-r from-sky-400 to-[#60a5fa] bg-clip-text text-transparent">
                Unified.
              </span>
            </h2>
            <p className="mt-6 text-base text-white/70 leading-relaxed max-w-xl mx-auto">
              Join over 100,000+ Canadians building their assets with North Union's modern, secure financial ecosystem.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-55 px-8 py-4 text-sm font-bold text-[#0B1220] shadow-lg transition-transform hover:scale-105 duration-300"
              >
                Open Account
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-105 duration-300"
              >
                Talk to our team
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
