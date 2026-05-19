"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const CONTAINER = "max-w-6xl mx-auto px-6";

const NAV_LINKS = [
  { name: "Home", href: "#" },
  { name: "About", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Security", href: "#" },
  { name: "Help", href: "#" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pt-4 px-6 fixed top-0 left-0 right-0 z-50">
      <header
        className={`max-w-6xl mx-auto rounded-full border px-6 py-3 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-md border-gray-200"
            : "bg-white shadow-sm border-gray-100"
        }`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="North Union Bank"
              width={300}
              height={100}
              quality={100}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[14px] transition-colors duration-200 ${
                link.name === "Home" 
                  ? "text-primary-blue font-semibold" 
                  : "font-medium text-gray-700 hover:text-primary-blue"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="text-[14px] font-medium text-gray-700 hover:text-primary-blue transition-colors">
            Sign in
          </button>
          <button className="bg-primary-navy text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors">
            Open Account
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-primary-navy transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[80px] left-6 right-6 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              <nav className="flex flex-col space-y-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-blue rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-3 px-3 pt-4 border-t border-gray-100">
                <button className="w-full justify-center text-[14px] font-medium text-gray-700 py-2">
                  Sign in
                </button>
                <button className="w-full justify-center bg-primary-navy text-white rounded-full px-5 py-3 text-sm font-medium">
                  Open Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
