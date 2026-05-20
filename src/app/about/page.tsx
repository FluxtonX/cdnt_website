import { SiteShell } from "@/components/public/site-shell";
import { 
  Globe2, 
  Target,
  Compass
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="bg-white">
        {/* Institutional Hero - ADJUSTED PADDING FOR PREMIUM GAP */}
        <section className="relative overflow-hidden bg-banking-navy pt-28 pb-24 text-white">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-banking-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-banking-gold border border-banking-gold/20">
                  Global Financial Mandate
                </div>
                <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                  Banking for the <br />
                  <span className="text-banking-gold italic">Next Century.</span>
                </h1>
                <p className="mt-8 text-lg leading-relaxed text-white/60 font-medium">
                  CDNT (NUB) stands as a beacon of stability in the digital era. 
                  Modeled after the world's most resilient financial institutions, we 
                  combine century-old trust with millisecond technology.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/register" className="rounded-lg bg-banking-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white transition-all shadow-xl shadow-banking-gold/10">
                    Join the Union
                  </Link>
                  <Link href="#vision" className="rounded-lg border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Our Vision
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden group">
                   <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
                    alt="CDNT Headquarters" 
                    className="h-[450px] w-full object-cover rounded-[2rem] brightness-90 group-hover:scale-105 transition-transform duration-1000"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-banking-navy/80 via-transparent to-transparent opacity-60" />
                   <div className="absolute bottom-10 left-10">
                      <p className="text-xs font-bold uppercase tracking-widest text-banking-gold">Operational Base</p>
                      <p className="text-2xl font-bold">CDNT Global HQ</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section id="vision" className="py-24 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="p-12 rounded-[3rem] bg-banking-offWhite border border-banking-border relative group">
                <Target className="h-12 w-12 text-banking-blue mb-8 group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl font-bold text-banking-ink">Our Mission</h2>
                <p className="mt-6 text-lg leading-relaxed text-banking-muted font-medium">
                  To provide a seamless, secure, and institutional-grade financial ecosystem 
                  where traditional banking reliability meets the limitless potential of 
                  digital asset management. We exist to empower individuals and businesses 
                  to preserve and grow their wealth across all financial frontiers.
                </p>
              </div>
              <div className="p-12 rounded-[3rem] bg-banking-navy text-white relative group">
                <Compass className="h-12 w-12 text-banking-gold mb-8 group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
                <p className="mt-6 text-lg leading-relaxed text-white/60 font-medium">
                  To become the world's most trusted unified banking platform, recognized 
                  for setting the global standard in financial transparency, security, 
                  and user-centric innovation. We envision a future where borders no 
                  longer define financial opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Presence Map - HIGHLY REALISTIC WITH FLIGHT PATHS & LABELS */}
        <section className="py-24 bg-banking-offWhite">
          <div className="mx-auto max-w-7xl px-5 text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-banking-blue mb-4">Our Presence</h2>
            <h3 className="text-4xl font-bold text-banking-ink">Operating at Global Scale</h3>
            
            <div className="mt-16 rounded-[3.5rem] border border-banking-border shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden relative group bg-banking-navy h-[650px]">
              {/* High-Fidelity Satellite Map Background */}
              <img 
                src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&q=80&w=2070" 
                alt="Global Network Hubs" 
                className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen group-hover:scale-110 transition-transform duration-[10000ms]"
              />
              
              {/* SVG Flight Paths Overlay */}
              <svg className="absolute inset-0 h-full w-full z-10 pointer-events-none" viewBox="0 0 1000 600">
                <defs>
                   <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FDC205" stopOpacity="0" />
                      <stop offset="50%" stopColor="#FDC205" stopOpacity="1" />
                      <stop offset="100%" stopColor="#FDC205" stopOpacity="0" />
                   </linearGradient>
                </defs>
                
                {/* Arc Paths (Mocking connections) */}
                <path d="M200,250 Q500,50 800,250" stroke="url(#pathGradient)" strokeWidth="2" fill="transparent" className="animate-dash" strokeDasharray="1000" />
                <path d="M200,250 Q400,450 700,400" stroke="url(#pathGradient)" strokeWidth="1" fill="transparent" className="animate-dash opacity-40" strokeDasharray="800" />
                <path d="M800,250 Q600,100 300,150" stroke="url(#pathGradient)" strokeWidth="1" fill="transparent" className="animate-dash opacity-40" strokeDasharray="1200" />
              </svg>

              {/* Floating Labels & Pins */}
              <div className="absolute inset-0 z-20">
                 {/* New York */}
                 <div className="absolute top-[35%] left-[20%] animate-float">
                    <div className="flex flex-col items-center">
                       <div className="h-3 w-3 bg-banking-gold rounded-full shadow-[0_0_15px_rgba(253,194,5,1)] animate-pulse" />
                       <p className="mt-2 text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur px-2 py-1 rounded">New York</p>
                    </div>
                 </div>

                 {/* London */}
                 <div className="absolute top-[25%] left-[48%] animate-float-slow">
                    <div className="flex flex-col items-center">
                       <div className="h-3 w-3 bg-banking-gold rounded-full shadow-[0_0_15px_rgba(253,194,5,1)] animate-pulse" />
                       <p className="mt-2 text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur px-2 py-1 rounded">London Hub</p>
                    </div>
                 </div>

                 {/* Dubai */}
                 <div className="absolute top-[45%] left-[60%] animate-float">
                    <div className="flex flex-col items-center">
                       <div className="h-3 w-3 bg-banking-gold rounded-full shadow-[0_0_15px_rgba(253,194,5,1)] animate-pulse" />
                       <p className="mt-2 text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur px-2 py-1 rounded">Dubai Office</p>
                    </div>
                 </div>

                 {/* Tokyo */}
                 <div className="absolute top-[38%] left-[85%] animate-float-slow">
                    <div className="flex flex-col items-center">
                       <div className="h-3 w-3 bg-banking-gold rounded-full shadow-[0_0_15px_rgba(253,194,5,1)] animate-pulse" />
                       <p className="mt-2 text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur px-2 py-1 rounded">Tokyo Center</p>
                    </div>
                 </div>

                 {/* Singapore */}
                 <div className="absolute top-[65%] left-[78%] animate-float">
                    <div className="flex flex-col items-center">
                       <div className="h-3 w-3 bg-banking-gold rounded-full shadow-[0_0_15px_rgba(253,194,5,1)] animate-pulse" />
                       <p className="mt-2 text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur px-2 py-1 rounded">Singapore</p>
                    </div>
                 </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-2xl">
                 <p className="text-white text-sm font-bold flex items-center gap-4">
                    <Globe2 className="h-5 w-5 text-banking-gold animate-spin-slow" />
                    Real-time connectivity across 140+ sovereign territories
                 </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/CTA */}
        <section className="py-24 bg-banking-navy text-white">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <h2 className="text-4xl font-bold italic">Ready to Secure Your Future?</h2>
            <p className="mt-6 text-lg text-white/60 font-medium leading-relaxed">
              Join thousands of institutional and private investors who trust CDNT 
              with their most valuable assets.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto rounded-lg bg-banking-gold px-10 py-4 text-sm font-bold uppercase tracking-widest text-banking-ink hover:bg-white transition-all shadow-xl shadow-banking-gold/10">
                Start Verification
              </Link>
              <Link href="/contact" className="w-full sm:w-auto rounded-lg border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                Contact Advisory
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
