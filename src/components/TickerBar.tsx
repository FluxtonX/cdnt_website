"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TickerBar() {
  const coins = [
    { name: "BTC", fullName: "Bitcoin", price: "$99,420.12", change: "+2.42%", up: true },
    { name: "ETH", fullName: "Ethereum", price: "$2,912.04", change: "+1.08%", up: true },
    { name: "SOL", fullName: "Solana", price: "$219.82", change: "-0.35%", up: false },
    { name: "USDT", fullName: "Tether", price: "$1.0001", change: "+0.03%", up: true },
    { name: "BTC", fullName: "Bitcoin", price: "$99,420.12", change: "+2.42%", up: true }, // duplicates for marquee flow on mobile if needed
    { name: "ETH", fullName: "Ethereum", price: "$2,912.04", change: "+1.08%", up: true },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 -translate-y-6 relative z-30">
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-full bg-white border border-slate-200/60 shadow-[0_12px_30px_rgba(0,0,0,0.03)] px-6 py-4 overflow-hidden"
        >
          <div className="flex items-center justify-between gap-8 md:justify-around overflow-x-auto scrollbar-none whitespace-nowrap">
            {coins.slice(0, 4).map((coin, index) => (
              <div key={index} className="flex items-center gap-2.5 min-w-[150px] md:min-w-0">
                {/* Small indicator dot */}
                <span className={`h-1.5 w-1.5 rounded-full ${coin.up ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className="text-sm font-extrabold text-[#0B1220]">{coin.name}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{coin.fullName}</span>
                <span className="text-sm font-bold text-slate-700">{coin.price}</span>
                <span 
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    coin.up 
                      ? "text-emerald-700 bg-emerald-500/10" 
                      : "text-rose-700 bg-rose-500/10"
                  }`}
                >
                  {coin.change}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
