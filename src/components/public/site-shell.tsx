"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Search, 
  Globe, 
  Phone, 
  Menu, 
  X,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MegaMenu, MenuSection } from "./mega-menu";
import { cn } from "@/lib/utils";


import { usePathname } from "next/navigation";

const topLinksLeft = [
  "Personal", "Business", "Commercial", "Wealth", "Institutional", "About NUB"
];

const topLinksRight = [
  "Promotions", "EN", "Contact Us"
];

const productLinks = [
  "Accounts", "Credit Cards", "Mortgages", "Loans", "Investments", "Insurance"
];

const solutionLinks = [
  "Ways to Bank", "Newcomers", "Retirement Planning", "Student Solutions", "Beyond Banking", "Sustainable Finance"
];

const bottomLinks = [
  "Accounts", "Chequing Accounts", "Savings Accounts", "International Banking", "Student Banking", "Help With My Account", "NUB Vantage"
];

const accountNavRoutes: Record<string, string> = {
  Accounts: "/accounts",
  "Chequing Accounts": "/accounts/chequing-accounts",
  "Savings Accounts": "/accounts/savings-accounts",
  "International Banking": "/accounts/international-banking",
  "Student Banking": "/accounts/student-banking",
  "Help With My Account": "/accounts/help-with-my-account",
  "NUB Vantage": "/accounts/nub-vantage",
};

export function SiteHeader() {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [openBottomMenu, setOpenBottomMenu] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState("EN");

  const pathname = usePathname();

  return (
    <>
      <header className="relative z-50 w-full bg-white">
        {/* 1. TOP BAR - Narrow */}
        <div className="hidden border-b border-banking-border bg-banking-offWhite lg:block">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-5">
            <nav className="flex items-center gap-6">
              {topLinksLeft.map((link) => {
                const href = 
                  link === "Personal" ? "/personal" : 
                  link === "Business" ? "/business" :
                  link === "Commercial" ? "/commercial" :
                  link === "Wealth" ? "/wealth" :
                  link === "Institutional" ? "/institutional" :
                  link === "About NUB" ? "/about" : 
                  "#";
                
                const isActive = pathname === href;

                return (
                  <Link 
                    key={link} 
                    href={href} 
                    className={cn(
                      "text-[11px] font-bold transition-all uppercase tracking-wider relative group",
                      isActive ? "text-banking-blue" : "text-banking-muted hover:text-banking-blue"
                    )}
                  >
                    {link}
                    <motion.div 
                      className="absolute -bottom-1 left-0 h-[2px] bg-banking-gold"
                      initial={{ width: 0 }}
                      animate={{ width: isActive ? "100%" : 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                );
              })}
            </nav>
            <nav className="flex items-center gap-6">
              <Link href="#" className="text-[11px] font-bold text-banking-muted hover:text-banking-blue transition-colors">Promotions</Link>
              
              {/* Language Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-[11px] font-bold text-banking-muted hover:text-banking-blue transition-colors uppercase">
                  <Globe className="h-3 w-3" />
                  {currentLang}
                </button>
                <div className="absolute right-0 top-full mt-0 hidden w-32 bg-white border border-banking-border shadow-xl group-hover:block z-[60]">
                  {["English", "Français", "Español", "Urdu"].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => setCurrentLang(lang.slice(0, 2).toUpperCase())}
                      className="w-full px-4 py-2 text-left text-[11px] font-bold text-banking-muted hover:bg-banking-offWhite hover:text-banking-blue"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <Link href="#" className="flex items-center gap-1 text-[11px] font-bold text-banking-muted hover:text-banking-blue transition-colors uppercase">
                <Phone className="h-3 w-3" />
                Contact Us
              </Link>
            </nav>
          </div>
        </div>

        {/* 2. MIDDLE BAR - Logo & Main Controls */}
        <div className="border-b border-banking-border bg-banking-blue shadow-lg">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-auto">
                <img 
                  src="/logo.png" 
                  alt="North Union" 
                  className="h-full w-auto object-contain" 
                  onError={(e) => {
                    // Fallback to text if image fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'font-bold', 'text-white', 'text-2xl');
                    if(e.currentTarget.parentElement) e.currentTarget.parentElement.innerText = 'NORTH UNION';
                  }}
                />
              </div>
            </Link>

            {/* Middle Navigation */}
            <nav className="hidden h-full items-center lg:flex gap-2">
              <MegaMenu 
                label="Product" 
                isOpen={openMenu === "Product"}
                onMouseEnter={() => setOpenMenu("Product")}
                onMouseLeave={() => setOpenMenu(null)}
                className="text-white hover:bg-white/10"
              >
                <MenuSection 
                  title="Banking Products" 
                  links={productLinks.map(p => ({ label: p, href: p === "Credit Cards" ? "/products/credit-cards" : p === "Accounts" ? "/accounts" : "#" }))} 
                />
                <MenuSection 
                  title="Featured" 
                  links={[
                    { label: "Accounts", href: "/accounts" },
                    { label: "Credit Cards", href: "/products/credit-cards" },
                    { label: "Mortgages", href: "#" },
                  ]} 
                />
              </MegaMenu>

              <MegaMenu 
                label="Solution" 
                isOpen={openMenu === "Solution"}
                onMouseEnter={() => setOpenMenu("Solution")}
                onMouseLeave={() => setOpenMenu(null)}
                className="text-white hover:bg-white/10"
              >
                <MenuSection 
                  title="Financial Life Stages" 
                  links={solutionLinks.map(s => ({ label: s, href: "#" }))} 
                />
                <MenuSection 
                  title="Resources" 
                  links={[
                    { label: "Financial Health Tool", href: "#" },
                    { label: "Retirement Planner", href: "#" },
                    { label: "Buying a Home Guide", href: "#" },
                  ]} 
                />
              </MegaMenu>

              <Link href="/advice" className="px-4 py-2 text-sm font-bold text-white hover:bg-white/10 rounded-md transition-all">
                Advice
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-all border border-white/10"
              >
                <Search className="h-4 w-4 text-banking-gold" />
                <span className="text-[13px] font-bold">Search</span>
              </button>
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden lg:flex items-center gap-2 rounded-full bg-banking-gold px-8 py-2.5 text-sm font-bold text-banking-ink shadow-lg shadow-black/10 hover:bg-white hover:text-banking-blue transition-all active:scale-[0.98]"
                >
                  Sign In
                </Link>
                <button 
                  className="lg:hidden p-2 rounded-md hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6 text-banking-gold" /> : <Menu className="h-6 w-6 text-white" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR - Narrow Secondary Navigation with Dropdowns */}
        <div className="hidden border-b border-banking-border bg-white lg:block">
          <div className="mx-auto flex h-10 max-w-7xl items-center px-5">
            <nav className="flex h-full items-center gap-8">
              {bottomLinks.map((link) => (
                <div 
                  key={link} 
                  className="relative h-full"
                  onMouseEnter={() => setOpenBottomMenu(link)}
                  onMouseLeave={() => setOpenBottomMenu(null)}
                >
                  <Link 
                    href={accountNavRoutes[link] ?? "/accounts"} 
                    className={cn(
                      "flex h-full items-center text-[12px] font-bold text-banking-text hover:text-banking-blue border-b-2 transition-all",
                      openBottomMenu === link ? "border-banking-blue text-banking-blue" : "border-transparent"
                    )}
                  >
                    {link}
                  </Link>

                  {/* Bottom Bar Sub-Dropdown */}
                  {openBottomMenu === link && (
                    <div className="absolute left-0 top-full w-56 bg-white border border-banking-border shadow-2xl z-[50] py-2">
                      <div className="px-4 py-2 border-b border-banking-border mb-2">
                        <span className="text-[10px] font-bold text-banking-muted uppercase tracking-widest">{link} Options</span>
                      </div>
                      {[
                        { label: `View ${link} details`, href: accountNavRoutes[link] ?? "/accounts" },
                        { label: "Current Rates", href: "/accounts/current-rates" },
                        { label: "Apply Online", href: "/accounts/apply" },
                        { label: "Frequently Asked Questions", href: "/accounts/faq" },
                      ].map(sub => (
                        <Link 
                          key={sub.label} 
                          href={sub.href} 
                          className="block px-4 py-2 text-[11px] font-bold text-banking-text hover:bg-banking-offWhite hover:text-banking-blue"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-20 z-40 bg-white lg:hidden">
            <div className="flex flex-col p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-banking-muted">Products & Solutions</h3>
                {productLinks.concat(solutionLinks).map((item) => (
                  <Link key={item} href="#" className="block text-lg font-bold text-banking-text">
                    {item}
                  </Link>
                ))}
              </div>
              <div className="border-t border-banking-border pt-6 space-y-4">
                {topLinksRight.map((link) => (
                  <Link key={link} href="#" className="block text-lg font-bold text-banking-text">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Static Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center bg-banking-ink/80 pt-20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center gap-4 border-b border-banking-border p-6">
                <Search className="h-6 w-6 text-banking-blue" />
                <input 
                  autoFocus
                  placeholder="What can we help you find?" 
                  className="flex-1 text-xl outline-none placeholder:text-banking-muted"
                />
                <button onClick={() => setIsSearchOpen(false)} className="rounded-md p-2 hover:bg-banking-offWhite">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-banking-muted">Popular Searches</h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    ["Open an Account", "/accounts/apply"],
                    ["Mortgage Rates", "#"],
                    ["Find an ATM", "/contact"],
                    ["Login Help", "/accounts/help-with-my-account"],
                    ["NUB Vantage", "/accounts/nub-vantage"],
                  ].map(([tag, href]) => (
                    <Link key={tag} href={href} className="rounded-full bg-banking-offWhite border border-banking-border px-4 py-2 text-sm font-bold text-banking-text hover:border-banking-blue hover:text-banking-blue transition-colors">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-banking-blue pt-20 pb-10 text-white">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center hover:scale-105 transition-transform">
              <div className="h-12 w-auto">
                <img 
                  src="/logo.png" 
                  alt="North Union" 
                  className="h-full w-auto object-contain" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'font-bold', 'text-banking-blue', 'text-xl');
                    if(e.currentTarget.parentElement) e.currentTarget.parentElement.innerText = 'NORTH UNION';
                  }}
                />
              </div>
            </Link>



            <p className="mt-8 max-w-sm text-sm font-medium leading-7 text-white/60">
              North Union is a premier digital banking and crypto portfolio platform. 
              We provide institutional-grade security and sophisticated financial tools 
              for modern investors.
            </p>
            <div className="mt-8 flex gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:bg-banking-gold hover:text-banking-ink hover:border-banking-gold transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Personal Banking</h4>
            <ul className="mt-6 space-y-4">
              <li><Link href="/accounts/chequing-accounts" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Chequing Accounts</Link></li>
              <li><Link href="/accounts/savings-accounts" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Savings Accounts</Link></li>
              <li><Link href="/accounts/advantage" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Advantage Banking</Link></li>
              <li><Link href="/accounts/student-banking" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Student Banking</Link></li>
              <li><Link href="/accounts/savings-accounts" className="text-sm text-white/50 hover:text-banking-gold transition-colors">High Interest Savings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Company</h4>
            <ul className="mt-6 space-y-4">
              <li><Link href="/about" className="text-sm text-white/50 hover:text-banking-gold transition-colors">About NUB</Link></li>
              <li><Link href="/pricing" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Fees & Pricing</Link></li>
              <li><Link href="/security" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Security & Compliance</Link></li>
              <li><Link href="/help" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Legal</h4>
            <ul className="mt-6 space-y-4">
              <li><Link href="/terms" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/risk-disclosure" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Risk Disclosure</Link></li>
              <li><Link href="/statements" className="text-sm text-white/50 hover:text-banking-gold transition-colors">Financial Statements</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 text-xs text-white/40 leading-relaxed">
            <div className="max-w-3xl space-y-4">
              <p>
                North Union Financial is a fintech SaaS platform providing user-facing interfaces for onboarding, 
                KYC verification, portfolio visibility, and support. We are not a bank or a regulated custody provider. 
                All financial services are simulated or provided through licensed third-party partners where applicable.
              </p>
              <p>
                &copy; {new Date().getFullYear()} North Union Financial Services Inc. All rights reserved. 
                Member CDIC (Simulated).
              </p>
            </div>
            <div className="flex gap-6 whitespace-nowrap">
              <Link href="#" className="hover:text-white underline">Accessibility</Link>
              <Link href="#" className="hover:text-white underline">AdChoices</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-banking-offWhite text-banking-text">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
