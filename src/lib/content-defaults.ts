/**
 * content-defaults.ts
 *
 * Shared TypeScript types and hardcoded fallback values for all
 * DB-driven content on the Landing Page.
 *
 * These defaults serve two purposes:
 *  1. Instant fallback if Supabase is unreachable or a key is missing.
 *  2. The source of truth that matches exactly what was seeded into the DB.
 *
 * IMPORTANT: If you change a value here, update the seed SQL too so
 * they stay in sync for new environments.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export interface LandingFeatureItem {
  title: string;
  description: string;
}

export interface LandingOnboardingStep {
  title: string;
  description: string;
}

export interface LandingFooterLinkGroup {
  /** Column heading, e.g. "Company" */
  title: string;
  /** Comma-separated link names, e.g. "About, Careers, Press, Blog" */
  description: string;
}

export interface LandingHeroContent {
  trustBadge: string;
  /** Newline-separated headline lines — split on "\n" to render each line */
  headline: string;
  body: string;
  btn1: string;
  btn2: string;
  /** Format per item: "Value / Label" — split on " / " to separate them */
  stats: string[];
}

export interface LandingFeaturesContent {
  heading: string;
  sub: string;
  btn: string;
  list: LandingFeatureItem[];
  ctaCardTitle: string;
  ctaCardDesc: string;
  ctaCardBtn: string;
}

export interface LandingAssetsContent {
  overline: string;
  heading: string;
}

export interface LandingOnboardingContent {
  overline: string;
  heading: string;
  steps: LandingOnboardingStep[];
}

export interface LandingAppContent {
  overline: string;
  heading: string;
  body: string;
  benefits: string[];
}

export interface LandingCtaContent {
  overline: string;
  heading: string;
  body: string;
  btn1: string;
  btn2: string;
}

export interface LandingFooterContent {
  tagline: string;
  regulatory: string;
  copyright: string;
  links: LandingFooterLinkGroup[];
}

export interface LandingContent {
  hero: LandingHeroContent;
  features: LandingFeaturesContent;
  assets: LandingAssetsContent;
  onboarding: LandingOnboardingContent;
  app: LandingAppContent;
  cta: LandingCtaContent;
  footer: LandingFooterContent;
}

// ── Defaults ───────────────────────────────────────────────────────────────
// These must exactly match the values seeded in site_content_seed.sql.

export const DEFAULT_LANDING_CONTENT: LandingContent = {
  hero: {
    trustBadge: "FINTRAC registered · CDIC-style insured deposits",
    headline: "Banking Meets\nCrypto\nIntelligence",
    body: "A regulated Canadian digital bank with a built-in crypto engine. Move money, save smarter, and invest in digital assets — all from one elegant, insured account.",
    btn1: "Open Account",
    btn2: "Explore Platform",
    stats: [
      "2M+ / Canadians onboard",
      "$2.4B / Assets secured",
      "4.9 / App Store",
    ],
  },
  features: {
    heading: "Everything a modern Canadian needs from a bank.",
    sub: "We've rebuilt banking from the ground up to support both your traditional financial needs and your digital asset investments.",
    btn: "Explore all features",
    list: [
      { title: "Crypto + Fiat Wallet",    description: "Hold CAD and digital assets side by side in one unified interface." },
      { title: "Instant e-Transfer",       description: "Send and receive Interac e-Transfers in seconds, free of charge." },
      { title: "Crypto Investing",         description: "Buy and sell 50+ cryptocurrencies with low, transparent fees." },
      { title: "Global Transfers",         description: "Send money internationally at mid-market rates with zero hidden markups." },
      { title: "Smart Savings",            description: "Earn high-yield interest on your Canadian Dollar deposits automatically." },
      { title: "AI Financial Insights",    description: "Get personalized alerts and insights to optimize your spending and saving." },
      { title: "Portfolio Tracking",       description: "Monitor your entire net worth with beautiful, real-time exotic curves." },
    ],
    ctaCardTitle: "And much more",
    ctaCardDesc: "Discover the full power of CDNT.",
    ctaCardBtn: "Get Started",
  },
  assets: {
    overline: "Digital Banking",
    heading: "Digital assets, held to a higher standard.",
  },
  onboarding: {
    overline: "Getting Started",
    heading: "From signup to first trade in minutes.",
    steps: [
      { title: "Create your account",       description: "Sign up online. ID documents and social insurance number required." },
      { title: "Verify your Identity",      description: "Government-issued ID, powered by Interac. Approved in minutes." },
      { title: "Start banking & investing", description: "Load your account, buy crypto, save smarter, and earn through the app." },
    ],
  },
  app: {
    overline: "Your Pocket Branch",
    heading: "Your entire financial life, in your pocket.",
    body: "Send money, manage cards, track investments and oversee your crypto portfolio — all from one beautifully designed interface.",
    benefits: [
      "Portfolio profiles with live data and live exotic curves",
      "Portfolio analytics with your daily and live exotic curves",
      "Instant e-Transfers, bill pay, and crypto through the app",
    ],
  },
  cta: {
    overline: "Your Financial Future",
    heading: "Your Financial Future, Unified.",
    body: "Join 2M+ Canadians saving, banking and investing — with the confidence of regulation and the speed of crypto.",
    btn1: "Open Account",
    btn2: "Talk to our Team",
  },
  footer: {
    tagline: "A modern Canadian digital bank uniting traditional finance with regulated digital assets.",
    regulatory: "Canadian National Trust Bank is a federally regulated Canadian financial institution. FINTRAC #M24-0042001.",
    copyright: "© 2026 Canadian National Trust Bank, Inc. All rights reserved.",
    links: [
      { title: "Company",  description: "About, Careers, Press, Blog" },
      { title: "Products", description: "Banking, Crypto, Savings, Cards" },
      { title: "Legal",    description: "Terms, Privacy, Cookies, Disclosures" },
      { title: "Security", description: "Trust center, Vulnerability, Status, Audits" },
    ],
  },
};
