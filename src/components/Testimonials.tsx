"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    {
      quote: "North Union has completely replaced my old traditional chequing account and broker. Direct deposits are instant and I buy BTC seamlessly.",
      name: "Marcus K.",
      role: "Founder, SpokenOdyssey",
      avatarLetter: "M",
    },
    {
      quote: "The interface is beautiful and the security is top tier. Being CDIC protected on my CAD deposits gives me complete peace of mind.",
      name: "Sarah L.",
      role: "VP of Product, MedVoryx",
      avatarLetter: "S",
    },
    {
      quote: "e-Transfers take seconds, trading fees are lower than major Canadian exchanges, and their client support is incredibly responsive.",
      name: "Alex P.",
      role: "Digital Asset Investor",
      avatarLetter: "A",
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-[#3061EF] mb-3"
          >
            Client Reviews
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl leading-tight"
          >
            Trusted by people who <br className="xs:hidden" />
            take money seriously.
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-slate-150 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* 5 stars */}
                <div className="flex gap-1 text-[#FDC205] mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-500 italic">
                  "{review.quote}"
                </p>
              </div>

              {/* User Block */}
              <div className="mt-8 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3061EF]/10 text-[#3061EF] font-extrabold text-sm">
                  {review.avatarLetter}
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0B1220] tracking-tight">{review.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{review.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
