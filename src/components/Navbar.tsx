"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Security", href: "/security" },
    { name: "Help", href: "/help" },
  ];

  return (
    <motion.header
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`mx-auto max-w-7xl rounded-full border transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            : "bg-white/95 border-slate-100 shadow-[0_8px_25px_rgba(0,0,0,0.02)]"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#3061EF] to-[#60a5fa] shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
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
            <span className="text-lg font-extrabold text-[#0B1220] tracking-tight group-hover:text-[#3061EF] transition-colors duration-300">
              North Union
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-[#3061EF] transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Call to Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-700 hover:text-[#3061EF] transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#0B1220] hover:bg-[#3061EF] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-900/10 hover:shadow-blue-500/20 transition-all hover:scale-105 duration-250 active:scale-[0.98]"
            >
              Open Account
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 z-40 rounded-3xl bg-white border border-slate-100 p-6 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-slate-700 hover:text-[#3061EF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-[#3061EF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#0B1220] hover:bg-[#3061EF] py-3 text-sm font-bold text-white shadow-md transition-all duration-200"
              >
                Open Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
