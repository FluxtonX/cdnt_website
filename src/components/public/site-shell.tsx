"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
  { label: "Help", href: "/help" },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 py-4 bg-transparent pointer-events-none">
      {/* Pill navbar */}
      <nav className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-lg shadow-black/5 px-3 py-2 w-full max-w-3xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-3 shrink-0">
          <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-tr from-[#3061EF] to-sky-400 shadow-sm shadow-blue-500/30" />
          <span className="font-bold text-banking-ink text-sm tracking-tight">CDNT</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all",
                  isActive
                    ? "bg-banking-blue text-white shadow-sm"
                    : "text-banking-muted hover:text-banking-ink hover:bg-black/5"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Right-side actions */}
        <div className="hidden md:flex items-center gap-2 ml-2 shrink-0">
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm font-semibold text-banking-muted hover:text-banking-blue transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 rounded-full bg-banking-blue text-white text-sm font-semibold shadow-sm hover:bg-banking-blue/90 transition-all active:scale-95"
          >
            Open Account
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-1.5 rounded-full hover:bg-black/5 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-banking-ink" />
          ) : (
            <Menu className="h-5 w-5 text-banking-ink" />
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto absolute top-full left-4 right-4 mt-2 rounded-2xl bg-white border border-black/10 shadow-xl overflow-hidden">
          <div className="flex flex-col p-3 gap-1">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-banking-blue text-white"
                      : "text-banking-ink hover:bg-black/5"
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <div className="border-t border-black/5 my-1" />
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-banking-muted hover:bg-black/5 transition-all"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-banking-blue text-white text-sm font-semibold text-center hover:bg-banking-blue/90 transition-all"
            >
              Open Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative bg-[#07111F] pt-20 pb-12 text-white border-t border-white/5">
      {/* Background radial highlight */}
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-banking-blue/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-5 relative z-10">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-10 w-auto flex items-center font-bold text-white text-2xl tracking-tight">
                <span className="inline-block h-6 w-6 rounded-full bg-gradient-to-tr from-[#3061EF] to-sky-400 mr-2 shadow-lg shadow-blue-500/30" />
                CDNT
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm font-medium leading-7 text-white/50">
              Bridging traditional banking with the digital asset economy.
              Built to protect, grow, and empower your wealth with institutional-grade security.
            </p>

            <div className="mt-8 flex gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#3061EF] hover:text-white hover:border-[#3061EF] transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#3061EF]">Navigation</h4>
            <ul className="mt-6 space-y-3.5">
              <li><Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/security" className="text-sm text-white/50 hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/help" className="text-sm text-white/50 hover:text-white transition-colors">Help</Link></li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#3061EF]">Account</h4>
            <ul className="mt-6 space-y-3.5">
              <li><Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="text-sm text-white/50 hover:text-white transition-colors">Open Account</Link></li>
              <li><Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">My Accounts</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 text-xs text-white/40 leading-relaxed">
            <div className="max-w-4xl space-y-3">
              <p>
                KYC verification, portfolio visibility, and support are simulated. We are not a registered bank in Canada or a licensed custody provider.
                All digital asset representations and transactions are simulated for platform evaluation purposes.
              </p>
              <p>
                &copy; {new Date().getFullYear()} CDNT Financial Services Inc. All rights reserved.
                Member CDIC (Simulated protection applies to fiat-equivalent deposits).
              </p>
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
