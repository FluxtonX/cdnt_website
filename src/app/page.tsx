import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TickerBar from "@/components/TickerBar";

import FeaturesSection from "@/components/FeaturesSection";
import DigitalAssetsSection from "@/components/DigitalAssetsSection";
import OnboardingSection from "@/components/OnboardingSection";
import AppPreviewSection from "@/components/AppPreviewSection";

import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TickerBar />

      <FeaturesSection />
      <DigitalAssetsSection />
      <OnboardingSection />
      <AppPreviewSection />

      <CTASection />
      <Footer />
    </main>
  );
}
