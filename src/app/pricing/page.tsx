import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="bg-[#F8F9FA] pb-0 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24">
        {/* Header Section */}
        <section className="pt-16 pb-12 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-6 tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-3xl mx-auto font-medium">
              No hidden fees. No surprises. Just straightforward pricing designed for Canadians.
            </p>
          </div>
        </section>

        {/* Tables Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl space-y-12">
            
            {/* Transaction Fees Table */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <div className="bg-[#1A3FBB] px-8 py-4">
                <h2 className="text-xl font-bold text-white">Transaction Fees</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Transaction Type</th>
                      <th className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Fee</th>
                      <th className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">Cryptocurrency Deposit</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#1A3FBB]">Free</td>
                      <td className="px-8 py-5 text-sm text-[#6B7280]">No limit on all crypto deposits</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">Cryptocurrency Withdrawal</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#1A3FBB]">Network Fee Only</td>
                      <td className="px-8 py-5 text-sm text-[#6B7280]">Strictly external blockchain costs</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">Interac e-Transfer Withdrawal</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#1A3FBB]">$2.50 CAD</td>
                      <td className="px-8 py-5 text-sm text-[#6B7280]">Flat fee to withdraw your funds to bank</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">Currency Conversion (CAD ↔ Crypto)</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#1A3FBB]">Free</td>
                      <td className="px-8 py-5 text-sm text-[#6B7280]">Competitive spread on all trades</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Account Limits Table */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <div className="bg-[#F5B01E] px-8 py-4">
                <h2 className="text-xl font-bold text-[#0A0F2C]">Account Limits</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Verification Level</th>
                      <th className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Daily Limit</th>
                      <th className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Monthly Limit</th>
                      <th className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Requirements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">Basic (Unverified)</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">$1,000</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">$5,000</td>
                      <td className="px-8 py-5 text-sm text-[#6B7280]">Email verification only</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">Verified KYC (Standard)</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">$50,000</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">$500,000</td>
                      <td className="px-8 py-5 text-sm text-[#6B7280]">ID and proof of residence required</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">Premium</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Unlimited</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">Unlimited</td>
                      <td className="px-8 py-5 text-sm text-[#6B7280]">Contact support to upgrade</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* Included With Every Account Section */}
        <section className="px-6 py-24 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#0A0F2C] mb-4">Included With Every Account</h2>
              <p className="text-lg text-[#6B7280]">Everything you need to manage your crypto, at no extra cost.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
              {[
                "Bank-grade security & encryption",
                "Two-factor authentication",
                "Multi-signature cold storage",
                "24/7 customer support",
                "Mobile & desktop access",
                "Real-time portfolio tracking",
                "Transaction history & exports",
                "Email & push notifications",
                "Instant Interac e-Transfer",
                "Multi-currency support (BTC, ETH, USDT)",
                "Educational resources",
                "Insurance up to $250,000"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" strokeWidth={2.5} />
                  <span className="text-[#0A0F2C] font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="px-6 py-24 bg-[#F8F9FA]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A0F2C]">Pricing FAQs</h2>
            </div>
            
            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                <h3 className="text-lg font-bold text-[#0A0F2C] mb-3">Are there any monthly or annual fees?</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Canadian National Trust Bank does not charge any monthly, annual, or account maintenance fees. You only pay transaction fees when you move funds.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                <h3 className="text-lg font-bold text-[#0A0F2C] mb-3">What are network fees?</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Canadian National Trust Bank does not charge any monthly, annual, or account maintenance fees. You only pay transaction fees when you move funds.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                <h3 className="text-lg font-bold text-[#0A0F2C] mb-3">Can I withdraw to my bank account for free?</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Interac e-Transfer withdrawals cost a flat $2.50 CAD per transaction, regardless of the amount. This is one of the lowest withdrawal fees in Canada.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                <h3 className="text-lg font-bold text-[#0A0F2C] mb-3">How do I increase my account limits?</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Complete the KYC verification process to increase your limits from $1,000/day to $50,000/day. For unlimited access, contact our support team to upgrade to a Premium account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#1A3FBB] py-24 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Started?</h2>
            <p className="text-lg text-white/90 mb-10 font-medium">
              Open your account today. No hidden fees, no surprises.
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-[#F5B01E] hover:bg-[#E0A015] text-[#0A0F2C] font-bold px-10 py-4 rounded-xl transition-colors duration-300 shadow-lg"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
