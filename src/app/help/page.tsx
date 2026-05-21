import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  Smartphone, 
  CreditCard, 
  Shield, 
  UserCog,
  ChevronDown,
  MessageSquare,
  Mail,
  Phone
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <main className="bg-[#F8F9FA] pb-0 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24">
        {/* Header Section */}
        <section className="pt-16 pb-16 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-4 tracking-tight">
              How Can We Help?
            </h1>
            <p className="text-lg text-[#6B7280] mb-10">
              Search our knowledge base or browse categories below
            </p>
            
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent outline-none text-[#0A0F2C] placeholder-gray-400 transition-all" 
                placeholder="Search for help articles..."
              />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Category 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <div className="h-14 w-14 rounded-2xl bg-[#1A3FBB] flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Smartphone className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#0A0F2C] mb-6">Getting<br/>Started</h3>
              <ul className="space-y-4 flex-grow">
                {["How to create an account", "Completing KYC verification", "Setting up two-factor authentication", "Making your first deposit"].map((link, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-[#6B7280] hover:text-[#1A3FBB] transition-colors inline-block leading-relaxed">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <div className="h-14 w-14 rounded-2xl bg-[#1A3FBB] flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <CreditCard className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#0A0F2C] mb-6">Deposits &<br/>Withdrawals</h3>
              <ul className="space-y-4 flex-grow">
                {["How to deposit cryptocurrency", "Withdrawal methods and fees", "Understanding network confirmations", "Interac e-Transfer guide"].map((link, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-[#6B7280] hover:text-[#1A3FBB] transition-colors inline-block leading-relaxed">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <div className="h-14 w-14 rounded-2xl bg-[#1A3FBB] flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#0A0F2C] mb-6">Security &<br/>Privacy</h3>
              <ul className="space-y-4 flex-grow">
                {["Securing your account", "Understanding cold storage", "Privacy and data protection", "Reporting suspicious activity"].map((link, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-[#6B7280] hover:text-[#1A3FBB] transition-colors inline-block leading-relaxed">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category 4 */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <div className="h-14 w-14 rounded-2xl bg-[#1A3FBB] flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <UserCog className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#0A0F2C] mb-6">Account<br/>Management</h3>
              <ul className="space-y-4 flex-grow">
                {["Updating personal information", "Account limits and upgrades", "Transaction history and exports", "Closing your account"].map((link, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-[#6B7280] hover:text-[#1A3FBB] transition-colors inline-block leading-relaxed">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* FAQs Section */}
        <section className="px-6 py-24 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A0F2C] mb-3">Frequently Asked Questions</h2>
              <p className="text-lg text-[#6B7280]">Quick answers to common questions</p>
            </div>

            <div className="space-y-4">
              {[
                "How long does KYC verification take?",
                "What are the withdrawal fees?",
                "Is my cryptocurrency insured?",
                "Can I withdraw to any Canadian bank?",
                "What cryptocurrencies are supported?",
                "How do I enable two-factor authentication?"
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex justify-between items-center cursor-pointer hover:border-gray-200 transition-colors">
                  <h3 className="text-[15px] font-bold text-[#0A0F2C]">{faq}</h3>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Need Help Section */}
        <section className="px-6 py-24 bg-[#F8F9FA]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A0F2C] mb-3">Still Need Help?</h2>
              <p className="text-lg text-[#6B7280]">Our support team is here for you</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Live Chat */}
              <div className="bg-white rounded-3xl p-10 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
                <div className="h-16 w-16 rounded-full bg-[#1A3FBB] flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/20">
                  <MessageSquare className="h-7 w-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">Live Chat</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed h-10">
                  Chat with our support team in real-time
                </p>
                <button className="w-full bg-[#1A3FBB] hover:bg-[#153299] text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-300">
                  Start Chat
                </button>
              </div>

              {/* Email Support */}
              <div className="bg-white rounded-3xl p-10 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
                <div className="h-16 w-16 rounded-full bg-[#F5B01E] flex items-center justify-center mx-auto mb-6 shadow-md shadow-yellow-500/20">
                  <Mail className="h-7 w-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">Email Support</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed h-10">
                  Get help via email within 24 hours
                </p>
                <button className="w-full bg-white hover:bg-gray-50 text-[#0A0F2C] border border-gray-200 font-bold py-3.5 px-6 rounded-xl transition-colors duration-300">
                  Email Us
                </button>
              </div>

              {/* Phone Support */}
              <div className="bg-white rounded-3xl p-10 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
                <div className="h-16 w-16 rounded-full bg-[#1A3FBB] flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/20">
                  <Phone className="h-7 w-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">Phone Support</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed h-10">
                  Call us Monday-Friday, 9am-5pm EST
                </p>
                <button className="w-full bg-white hover:bg-gray-50 text-[#0A0F2C] border border-gray-200 font-bold py-3.5 px-6 rounded-xl transition-colors duration-300">
                  1-800-555-1234
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
