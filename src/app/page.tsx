import type { Metadata } from "next";
import { getLandingContent } from "@/lib/site-content";
import { constructMetadata } from "@/config/seo";
import { FinancialServiceJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/json-ld";

import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TickerBar from "@/components/TickerBar";
import FeaturesSection from "@/components/FeaturesSection";
import DigitalAssetsSection from "@/components/DigitalAssetsSection";
import OnboardingSection from "@/components/OnboardingSection";
import AppPreviewSection from "@/components/AppPreviewSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Canadian National Trust Bank — Regulated Digital Banking & Crypto Engine",
  description:
    "Tier-one Canadian digital banking integrated with crypto intelligence. Manage CAD, USD, BTC, ETH, and USDT with enterprise 2FA protection.",
  canonicalPath: "/",
});

export default async function Home() {
  const content = await getLandingContent();

  return (
    <main className="min-h-screen">
      <FinancialServiceJsonLd />
      <SoftwareApplicationJsonLd />
      <AnnouncementBanner />
      <Navbar />
      <HeroSection content={content.hero} />
      <TickerBar />

      <FeaturesSection content={content.features} />
      <DigitalAssetsSection content={content.assets} />
      <OnboardingSection content={content.onboarding} />
      <AppPreviewSection content={content.app} />

      <CTASection content={content.cta} />
      <Footer content={content.footer} />
    </main>
  );
}
