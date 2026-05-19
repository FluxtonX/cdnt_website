"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: "About NUB", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact Us", href: "/contact" },
      { name: "Press Kit", href: "/press" },
    ],
    Products: [
      { name: "Personal Accounts", href: "/accounts" },
      { name: "Credit Cards", href: "/products/credit-cards" },
      { name: "Crypto Investing", href: "/investing" },
      { name: "Wealth Management", href: "/wealth" },
    ],
    Legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Risk Disclosure", href: "/risk-disclosure" },
      { name: "CDIC Protection", href: "/cdic" },
    ],
    Security: [
      { name: "Security Standard", href: "/security" },
      { name: "Proof of Reserves", href: "/reserves" },
      { name: "Audit Reports", href: "/audits" },
      { name: "Status Page", href: "/status" },
    ],
  };

  return (
    <footer className="bg-[#FAF9F5] border-t border-slate-200/60 pt-20 pb-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 mb-16">
          {/* Logo / Description Block */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3061EF] shadow-md shadow-blue-500/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-5 w-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253"
                  />
                </svg>
              </span>
              <span className="text-lg font-extrabold text-[#0B1220] tracking-tight">
                North Union
              </span>
            </Link>
            <p className="mt-6 text-sm text-slate-500 leading-relaxed max-w-sm">
              Bridging traditional banking with the digital asset economy. Built to protect, grow, and empower your wealth with institutional-grade security.
            </p>

            {/* Social Links */}
            <div className="mt-8 flex gap-3">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={i}
                    href={social.href}
                    className="h-9 w-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-[#3061EF] hover:border-[#3061EF] hover:bg-slate-50 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#0B1220] mb-5">
                  {title}
                </h4>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-[#3061EF] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footnotes / Disclaimers */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 text-xs text-slate-400 leading-relaxed flex flex-col md:flex-row justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <p>
              KYC verification, portfolio visibility, and support are simulated. We are not a registered bank in Canada or a licensed custody provider. All digital asset representations and transactions are simulated for platform evaluation purposes.
            </p>
            <p>
              &copy; {currentYear} North Union Financial Services Inc. All rights reserved. Member CDIC (Simulated protection applies to fiat-equivalent deposits).
            </p>
          </div>
          <div className="flex gap-4 whitespace-nowrap">
            <Link href="/terms" className="hover:text-[#3061EF] underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#3061EF] underline">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
