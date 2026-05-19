"use client";

import React from "react";
import { SiteShell } from "@/components/public/site-shell";
import Hero from "@/components/Hero";
import TickerBar from "@/components/TickerBar";
import SecuritySection from "@/components/SecuritySection";
import FeatureSection from "@/components/FeatureSection";
import MarketSection from "@/components/MarketSection";
import StepsSection from "@/components/StepsSection";
import MobileAppSection from "@/components/MobileAppSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <SiteShell>
      <div className="bg-[#FAF9F5] text-slate-800 antialiased overflow-x-hidden font-sans">
        {/* Hero Section */}
        <Hero />

        {/* Capsule Ticker Bar */}
        <TickerBar />

        {/* Security & Compliance Grid */}
        <SecuritySection />

        {/* Banking & Crypto Features Grid */}
        <FeatureSection />

        {/* Dark Market Section with Neon Charts */}
        <MarketSection />

        {/* Quick Signup Steps */}
        <StepsSection />

        {/* Overlapping Mobile App Mockups */}
        <MobileAppSection />

        {/* Client Testimonials */}
        <Testimonials />

        {/* Neon Gradient Call to Action */}
        <CTASection />
      </div>
    </SiteShell>
  );
}
