"use client";

import React from "react";
import { siteConfig } from "@/config/seo";
import { Star, CheckCircle, ExternalLink, ShieldCheck, ThumbsUp } from "lucide-react";

const REVIEWS = [
  {
    name: "David Miller",
    location: "Toronto, ON",
    rating: 5,
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    text: "CDNT Bank (Canadian Digital Trust Bank) has completely transformed how I handle CAD e-transfers and my USDT/Bitcoin holdings. Highly secure, fast, and transparent fee structure!",
    verified: true,
  },
  {
    name: "Sarah Lin",
    location: "Vancouver, BC",
    rating: 5,
    date: "1 month ago",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    text: "Switched to CDNT Bank for international cross-border transfers and savings. The mobile web experience is super smooth and support is 24/7 responsive.",
    verified: true,
  },
  {
    name: "Robert Tremblay",
    location: "Montreal, QC",
    rating: 5,
    date: "1 month ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    text: "Best digital bank in Canada! Having FINTRAC compliance, 2FA security, and seamless crypto integration in one platform gives me total peace of mind.",
    verified: true,
  },
];

export function GoogleReviewsSection() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Google Badge Header */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-sm font-medium mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-slate-300">Google Verified Customer Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Trusted by Thousands Across Canada
          </h2>
          <p className="text-lg text-slate-300">
            See what customers are saying about <strong className="text-blue-400">CDNT Bank</strong> (Canadian Digital Trust Bank) on Google Search.
          </p>

          {/* Rating Summary Card */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black text-white">{siteConfig.googleRating}</span>
              <div>
                <div className="flex items-center text-amber-400 gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 text-left">
                  Based on <strong className="text-white">{siteConfig.googleReviewCount}+ Google Reviews</strong>
                </p>
              </div>
            </div>

            <a
              href={siteConfig.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-blue-500/25 transition-all shrink-0"
            >
              <span>Write a Review</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Customer Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-600"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm">{rev.name}</h3>
                      <p className="text-xs text-slate-400">{rev.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified Google Review
                </span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 mb-3">
            Have an account with CDNT Bank? Share your experience with future Canadian digital banking users.
          </p>
          <a
            href={siteConfig.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
          >
            <span>Leave your Google Review for CDNT Bank</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
