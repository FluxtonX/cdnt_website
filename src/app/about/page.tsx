import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, TrendingUp, Shield, Users, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-[#F8F9FA] pb-0 min-h-screen">
      <Navbar />
        {/* Header Section */}
        <section className="pt-24 pb-16 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-6 tracking-tight">
              About Canadian National Trust Bank
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-3xl mx-auto font-medium">
              We're building the future of banking in Canada—where traditional finance meets cryptocurrency innovation, creating a secure and accessible platform for everyone.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-2xl bg-[#1A3FBB] flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                <Target className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-[#0A0F2C] mb-6">Our Mission</h2>
              <p className="text-[#6B7280] leading-loose">
                To democratize access to cryptocurrency and modern financial services for all Canadians. We believe in creating a platform that combines the security of traditional banking with the innovation of blockchain technology—making it simple, safe, and transparent for everyone.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-2xl bg-[#F5B01E] flex items-center justify-center mb-8 shadow-lg shadow-yellow-500/20">
                <TrendingUp className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-[#0A0F2C] mb-6">Our Vision</h2>
              <p className="text-[#6B7280] leading-loose">
                To become Canada's most trusted digital banking and cryptocurrency platform. We envision a future where managing your finances—whether traditional currency or crypto—is as simple as sending a text message, backed by institutional-grade security and full regulatory compliance.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="px-6 py-24 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#0A0F2C] mb-4">Why Choose Canadian National Trust Bank</h2>
              <p className="text-lg text-[#6B7280]">Built with trust, security, and simplicity at the core</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Security Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
                <div className="h-12 w-12 rounded-full bg-[#1A3FBB] flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-6">Bank-Grade Security</h3>
                <ul className="space-y-4">
                  {[
                    "Multi-signature cold storage",
                    "Two-factor authentication",
                    "Real-time fraud detection",
                    "Insurance up to $250,000"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#F5B01E]" />
                      <span className="text-[#6B7280] font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer First Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
                <div className="h-12 w-12 rounded-full bg-[#1A3FBB] flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-6">Customer First</h3>
                <ul className="space-y-4">
                  {[
                    "24/7 customer support",
                    "No hidden fees",
                    "Transparent pricing",
                    "Educational resources"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#F5B01E]" />
                      <span className="text-[#6B7280] font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fully Compliant Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
                <div className="h-12 w-12 rounded-full bg-[#1A3FBB] flex items-center justify-center mb-6">
                  <Award className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-6">Fully Compliant</h3>
                <ul className="space-y-4">
                  {[
                    "FINTRAC registered MSB",
                    "KYC/AML compliant",
                    "Regular security audits",
                    "Canadian regulated"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#F5B01E]" />
                      <span className="text-[#6B7280] font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white pb-24 px-6 border-b border-gray-100">
          <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-2 tracking-tight">100,000+</div>
              <div className="text-[#6B7280] font-medium">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-2 tracking-tight">$500M+</div>
              <div className="text-[#6B7280] font-medium">Assets Protected</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-2 tracking-tight">99.9%</div>
              <div className="text-[#6B7280] font-medium">Uptime SLA</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-2 tracking-tight">24/7</div>
              <div className="text-[#6B7280] font-medium">Customer Support</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#1A3FBB] py-24 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-white/90 mb-10 font-medium">
              Join thousands of Canadians who trust Canadian National Trust Bank for their crypto banking needs
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-[#F5B01E] hover:bg-[#E0A015] text-[#0A0F2C] font-bold px-10 py-4 rounded-xl transition-colors duration-300 shadow-lg"
            >
              Open Your Account Today
            </Link>
          </div>
        </section>
        <Footer />
      </main>
  );
}
