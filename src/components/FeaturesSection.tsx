"use client";

import { motion } from "framer-motion";
import { WalletCards, Zap, TrendingUp, Globe, PiggyBank, Sparkles, LineChart, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";

const FEATURES = [
  {
    title: "Crypto + Fiat Wallet",
    description: "Hold CAD and digital assets side by side in one unified interface.",
    icon: <WalletCards className="w-5 h-5 text-primary-blue" />,
  },
  {
    title: "Instant e-Transfer",
    description: "Send and receive Interac e-Transfers in seconds, free of charge.",
    icon: <Zap className="w-5 h-5 text-primary-blue" />,
  },
  {
    title: "Crypto Investing",
    description: "Buy and sell 50+ cryptocurrencies with low, transparent fees.",
    icon: <TrendingUp className="w-5 h-5 text-primary-blue" />,
  },
  {
    title: "Global Transfers",
    description: "Send money internationally at mid-market rates with zero hidden markups.",
    icon: <Globe className="w-5 h-5 text-primary-blue" />,
  },
  {
    title: "Smart Savings",
    description: "Earn high-yield interest on your Canadian Dollar deposits automatically.",
    icon: <PiggyBank className="w-5 h-5 text-primary-blue" />,
  },
  {
    title: "AI Financial Insights",
    description: "Get personalized alerts and insights to optimize your spending and saving.",
    icon: <Sparkles className="w-5 h-5 text-primary-blue" />,
  },
  {
    title: "Portfolio Tracking",
    description: "Monitor your entire net worth with beautiful, real-time exotic curves.",
    icon: <LineChart className="w-5 h-5 text-primary-blue" />,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Left Column (Sticky Heading) */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-32">
              <h2 className="text-4xl md:text-[42px] font-bold text-text-primary leading-tight mb-6">
                Everything a modern <br className="hidden lg:block" />
                Canadian needs from a bank.
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                We've rebuilt banking from the ground up to support both your traditional financial needs and your digital asset investments.
              </p>
              <Button variant="secondary" className="hidden lg:inline-flex items-center gap-2">
                Explore all features <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column (Feature Grid) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="w-10 h-10 bg-primary-blue/5 rounded-xl flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-[18px] font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-[15px]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}

              {/* 8th Card (CTA Card to complete the 2x4 grid) */}
              <motion.div
                className="p-6 rounded-2xl bg-bg-light flex flex-col justify-center items-center text-center border border-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: FEATURES.length * 0.1 }}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <ArrowRight className="w-5 h-5 text-primary-blue" />
                </div>
                <h3 className="text-[18px] font-semibold text-text-primary mb-2">
                  And much more
                </h3>
                <p className="text-text-secondary text-[15px] mb-4">
                  Discover the full power of North Union.
                </p>
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </motion.div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
