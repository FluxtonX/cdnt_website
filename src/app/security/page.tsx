import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  FileText, 
  Activity, 
  UserCheck, 
  CheckCircle2, 
  Shield 
} from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <main className="bg-[#F8F9FA] pb-0 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24">
        {/* Header Section */}
        <section className="pt-16 pb-12 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-6 tracking-tight">
              Your Security is Our Priority
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-3xl mx-auto font-medium">
              We employ bank-grade security measures to protect your funds and personal information. Your trust is the foundation of everything we do.
            </p>
          </div>
        </section>

        {/* 4 Badges Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Badge 1 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 h-40">
              <div className="h-12 w-12 rounded-xl bg-[#1A3FBB] flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[#0A0F2C] text-sm leading-tight">FINTRAC<br/>Registered</h3>
            </div>
            
            {/* Badge 2 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 h-40">
              <div className="h-12 w-12 rounded-xl bg-[#F5B01E] flex items-center justify-center mb-4 shadow-md shadow-yellow-500/20">
                <Lock className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[#0A0F2C] text-sm leading-tight">256-bit<br/>Encryption</h3>
            </div>

            {/* Badge 3 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 h-40">
              <div className="h-12 w-12 rounded-xl bg-[#1A3FBB] flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                <Server className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[#0A0F2C] text-sm leading-tight">Cold Storage</h3>
            </div>

            {/* Badge 4 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 h-40">
              <div className="h-12 w-12 rounded-xl bg-[#F5B01E] flex items-center justify-center mb-4 shadow-md shadow-yellow-500/20">
                <FileText className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[#0A0F2C] text-sm leading-tight">$250K<br/>Insurance</h3>
            </div>
          </div>
        </section>

        {/* Multi-Layer Security Architecture */}
        <section className="px-6 py-24 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2C] mb-4">Multi-Layer Security Architecture</h2>
              <p className="text-lg text-[#6B7280]">Every layer designed to protect your assets</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Card 1 */}
              <div className="bg-[#F8F9FA] rounded-3xl p-10 border border-gray-100">
                <div className="h-12 w-12 rounded-xl bg-[#1A3FBB] flex items-center justify-center mb-6">
                  <Lock className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">End-to-End Encryption</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  All data is encrypted in transit and at rest using AES-256 encryption, the standard for banks.
                </p>
                <ul className="space-y-4">
                  {["TLS 1.3 in-transit", "Encrypted database storage", "Secure key management", "Zero-knowledge architecture"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" strokeWidth={2.5} />
                      <span className="text-[#0A0F2C] font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2 */}
              <div className="bg-[#F8F9FA] rounded-3xl p-10 border border-gray-100">
                <div className="h-12 w-12 rounded-xl bg-[#1A3FBB] flex items-center justify-center mb-6">
                  <Server className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">Cold Storage Protection</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  98% of all digital assets are held offline in distributed, geographically secured vaults.
                </p>
                <ul className="space-y-4">
                  {["Multi-signature wallets", "Geographically isolated", "Hardware security modules", "Strict access protocols"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" strokeWidth={2.5} />
                      <span className="text-[#0A0F2C] font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3 */}
              <div className="bg-[#F8F9FA] rounded-3xl p-10 border border-gray-100">
                <div className="h-12 w-12 rounded-xl bg-[#1A3FBB] flex items-center justify-center mb-6">
                  <Activity className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">Real-Time Monitoring</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  Our advanced AI system monitors all transactions 24/7 for suspicious activity.
                </p>
                <ul className="space-y-4">
                  {["Fraud detection algorithms", "Anomaly prevention", "Instant alerts", "Transaction pattern analysis"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" strokeWidth={2.5} />
                      <span className="text-[#0A0F2C] font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 4 */}
              <div className="bg-[#F8F9FA] rounded-3xl p-10 border border-gray-100">
                <div className="h-12 w-12 rounded-xl bg-[#1A3FBB] flex items-center justify-center mb-6">
                  <UserCheck className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">Identity Verification (KYC)</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  Strict identity verification processes ensure that only you can access your account.
                </p>
                <ul className="space-y-4">
                  {["Government ID verification", "Biometric authentication", "Anti-fraud checks", "Ongoing monitoring"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" strokeWidth={2.5} />
                      <span className="text-[#0A0F2C] font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Factor Authentication Section */}
        <section className="px-6 py-24 bg-[#F8F9FA]">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2C] mb-6">Two-Factor<br/>Authentication (2FA)</h2>
                <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
                  Add an extra layer of security to your account with mandatory two-factor authentication. Even if someone obtains your password, they cannot access your account without your mobile device.
                </p>
                <ul className="space-y-5">
                  {[
                    "Authenticator app support (Google Authenticator, Authy)",
                    "Hardware security key support (YubiKey)",
                    "Required for all withdrawals",
                    "Backup codes for recovery"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[#0A0F2C] font-medium text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#1A3FBB] rounded-[2rem] p-12 text-center text-white flex flex-col items-center justify-center min-h-[400px] shadow-2xl shadow-blue-900/20">
                <div className="h-20 w-20 rounded-full border-2 border-white/20 flex items-center justify-center mb-8 bg-white/10 backdrop-blur-sm">
                  <Lock className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Protected Login</h3>
                <p className="text-blue-100/80 max-w-xs mx-auto">Verify your identity to access your portfolio</p>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Compliance */}
        <section className="px-6 py-24 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2C] mb-4">Regulatory Compliance</h2>
              <p className="text-lg text-[#6B7280]">Fully compliant with Canadian financial regulations</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Box 1 */}
              <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="h-16 w-16 rounded-full bg-[#F5B01E]/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-[#F5B01E]" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-4">FINTRAC<br/>Registration</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Registered as a Money Services Business (MSB) with the Financial Transactions and Reports Analysis Centre of Canada.
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="h-16 w-16 rounded-full bg-[#F5B01E]/10 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-8 w-8 text-[#F5B01E]" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-4">KYC/AML<br/>Compliance</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Strict Know Your Customer and Anti-Money Laundering procedures to prevent illicit activity and ensure responsible compliance.
                </p>
              </div>

              {/* Box 3 */}
              <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="h-16 w-16 rounded-full bg-[#F5B01E]/10 flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-[#F5B01E]" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A0F2C] mb-4">Regular Audits</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Independent third-party security audits to maintain integrity and ensure the highest standards of protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#1A3FBB] py-24 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Your Security, Our Promise</h2>
            <p className="text-lg text-white/90 mb-10 font-medium">
              Experience the peace of mind that comes with bank-grade security.
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-[#F5B01E] hover:bg-[#E0A015] text-[#0A0F2C] font-bold px-10 py-4 rounded-xl transition-colors duration-300 shadow-lg"
            >
              Open Secure Account
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
