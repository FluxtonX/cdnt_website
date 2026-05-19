import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TickerBar from "@/components/TickerBar";
import TrustSection from "@/components/TrustSection";
import FeaturesSection from "@/components/FeaturesSection";
import DigitalAssetsSection from "@/components/DigitalAssetsSection";
import OnboardingSection from "@/components/OnboardingSection";
import AppPreviewSection from "@/components/AppPreviewSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TickerBar />
      <TrustSection />
      <FeaturesSection />
      <DigitalAssetsSection />
      <OnboardingSection />
      <AppPreviewSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
