"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";

const TICKER_ITEMS = [
  { symbol: "BTC", price: "$98,420.13", change: "+1.43%", isPositive: true },
  { symbol: "ETH", price: "$3,612.04", change: "+0.87%", isPositive: true },
  { symbol: "SOL", price: "$248.92", change: "-0.34%", isPositive: false },
  { symbol: "USDT", price: "$1.0001", change: "+0.01%", isPositive: true },
  { symbol: "BNB", price: "$612.40", change: "+2.11%", isPositive: true },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-bg-light pt-32 pb-16 overflow-hidden flex flex-col justify-center">
      {/* Background Dot Pattern (CSS-based) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{
          backgroundImage: "radial-gradient(#0A0F2C 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (60%) */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-accent-gold font-semibold tracking-widest text-sm uppercase mb-4">
                Built For Trust
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-extrabold text-text-primary leading-[1.1] tracking-tight">
                Banking Meets <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 text-primary-blue">Crypto Intelligence</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-primary-blue/10 -z-10 transform -rotate-1"></span>
                </span>
              </h1>
            </div>

            <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
              A regulated Canadian digital bank with a built-in crypto engine. 
              Move money, save smarter, and invest in digital assets — all from one deposit-insured account.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="primary" className="text-base h-12 px-8">
                Open Account &rarr;
              </Button>
              <Button variant="secondary" className="text-base h-12 px-8 bg-white border-gray-300 text-gray-800 hover:bg-gray-50">
                Explore Platform &nearr;
              </Button>
            </div>

            <div className="grid grid-cols-3 divide-x divide-gray-200 pt-8 mt-8 border-t border-gray-200/60 max-w-2xl">
              <div className="pr-6">
                <p className="text-3xl font-bold text-text-primary">100k+</p>
                <p className="text-sm text-text-muted mt-1">Accounts Opened</p>
              </div>
              <div className="px-6">
                <p className="text-3xl font-bold text-text-primary">$2.4B</p>
                <p className="text-sm text-text-muted mt-1">Assets Managed</p>
              </div>
              <div className="pl-6">
                <p className="text-3xl font-bold text-text-primary">4.9★</p>
                <p className="text-sm text-text-muted mt-1">App Store Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column (40%) */}
          <div className="lg:col-span-5 relative h-[500px] sm:h-[600px] w-full mt-12 lg:mt-0">
            {/* Background Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-blue/20 blur-[100px] rounded-full -z-10" />

            <motion.div
              className="absolute right-[20%] top-0 w-64 sm:w-72 z-0"
              initial={{ opacity: 0, x: 100, y: 50, rotate: 0 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
            >
              <Image
                src="/assets/phone-dark.png"
                alt="Crypto Portfolio Interface"
                width={300}
                height={600}
                className="w-full h-auto drop-shadow-2xl rounded-[2.5rem]"
              />
            </motion.div>

            <motion.div
              className="absolute left-[10%] sm:left-[20%] top-12 sm:top-16 w-64 sm:w-72 z-10"
              initial={{ opacity: 0, x: 100, y: 50, rotate: 0 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -8 }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.4 }}
            >
              <Image
                src="/assets/phone-light.png"
                alt="Banking Interface"
                width={300}
                height={600}
                className="w-full h-auto drop-shadow-2xl rounded-[2.5rem]"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ticker Marquee */}
      <div className="absolute bottom-0 left-0 w-full bg-primary-navy py-3 overflow-hidden border-t border-white/10 z-20">
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
          {/* Double the items for infinite scroll effect */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mx-8">
              <span className="text-white font-medium text-sm">{item.symbol}</span>
              <span className="text-gray-300 text-sm">{item.price}</span>
              <span className={`text-sm font-medium ${item.isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
