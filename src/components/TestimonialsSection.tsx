"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Henry A.",
    role: "Verified Customer",
    quote: "Finally, an app that lets me top up my North Union Card and buy BTC from the same screen. Best bank I've ever used.",
    initials: "HA",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    name: "Jordan Thomas",
    role: "Verified Customer",
    quote: "Saving in both CAD and crypto seamlessly. I've been on the platform for 3 months and already trust it more than my old bank.",
    initials: "JT",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  {
    name: "Priya Singh",
    role: "Verified Customer",
    quote: "The AI insights feature alone is worth it. I got an alert saving me $340 last month in fees I didn't know about.",
    initials: "PS",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent-gold font-semibold tracking-widest text-sm uppercase mb-4">
            North Union Users
          </p>
          <h2 className="text-4xl md:text-[42px] font-bold text-text-primary leading-tight">
            Trusted by people who <br />
            <span className="relative inline-block mt-1">
              <span className="relative z-10 text-accent-gold">take money seriously.</span>
              <span className="absolute bottom-2 left-0 w-full h-[3px] bg-accent-gold/40 -z-10"></span>
            </span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-gold text-accent-gold" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-text-secondary leading-relaxed text-[16px] mb-8 flex-grow">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4 mt-auto pt-6 border-t border-gray-50">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${testimonial.bgColor} ${testimonial.textColor}`}>
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-text-muted text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
