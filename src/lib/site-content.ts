/**
 * site-content.ts
 *
 * Server-side utility for fetching content from the site_content table.
 * Always falls back to DEFAULT_LANDING_CONTENT on any error or missing key,
 * so the page is never empty even if Supabase is unreachable.
 *
 * This function runs ONLY on the server (Server Components / ISR).
 * It must never be imported into a "use client" component.
 */

import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_LANDING_CONTENT,
  type LandingContent,
} from "./content-defaults";

/**
 * Fetches all site_content rows for the "landing" category and maps them
 * into a typed LandingContent object. Missing keys fall back to defaults.
 *
 * Supabase returns JSONB columns as native JS types:
 *   - JSON string   → JS string
 *   - JSON array    → JS array
 *   - JSON object   → JS object
 *   - JSON boolean  → JS boolean
 * So no manual JSON.parse() is needed.
 */
export async function getLandingContent(): Promise<LandingContent> {
  const D = DEFAULT_LANDING_CONTENT;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("category", "landing");

    // If the table doesn't exist yet or DB is unreachable, use defaults
    if (error || !data || data.length === 0) {
      console.warn("[site-content] Falling back to defaults:", error?.message ?? "no data");
      return D;
    }

    // Build a fast lookup map: key → parsed JSONB value
    const db = new Map<string, unknown>(
      data.map((row) => [row.key, row.value])
    );

    /**
     * get<T>(key, fallback) — returns the DB value if present and non-null,
     * otherwise returns the fallback from DEFAULT_LANDING_CONTENT.
     */
    function get<T>(key: string, fallback: T): T {
      const val = db.get(key);
      return val !== undefined && val !== null ? (val as T) : fallback;
    }

    return {
      hero: {
        trustBadge: get("landing.hero.trust_badge", D.hero.trustBadge),
        headline:   get("landing.hero.headline",    D.hero.headline),
        body:       get("landing.hero.body",         D.hero.body),
        btn1:       get("landing.hero.btn1",         D.hero.btn1),
        btn2:       get("landing.hero.btn2",         D.hero.btn2),
        stats:      get("landing.hero.stats",        D.hero.stats),
      },
      features: {
        heading:     get("landing.features.heading",       D.features.heading),
        sub:         get("landing.features.sub",           D.features.sub),
        btn:         get("landing.features.btn",           D.features.btn),
        list:        get("landing.features.list",          D.features.list),
        ctaCardTitle: get("landing.features.cta_card_title", D.features.ctaCardTitle),
        ctaCardDesc:  get("landing.features.cta_card_desc",  D.features.ctaCardDesc),
        ctaCardBtn:   get("landing.features.cta_card_btn",   D.features.ctaCardBtn),
      },
      assets: {
        overline: get("landing.assets.overline", D.assets.overline),
        heading:  get("landing.assets.heading",  D.assets.heading),
      },
      onboarding: {
        overline: get("landing.onboarding.overline", D.onboarding.overline),
        heading:  get("landing.onboarding.heading",  D.onboarding.heading),
        steps:    get("landing.onboarding.steps",    D.onboarding.steps),
      },
      app: {
        overline: get("landing.app.overline", D.app.overline),
        heading:  get("landing.app.heading",  D.app.heading),
        body:     get("landing.app.body",     D.app.body),
        benefits: get("landing.app.benefits", D.app.benefits),
      },
      cta: {
        overline: get("landing.cta.overline", D.cta.overline),
        heading:  get("landing.cta.heading",  D.cta.heading),
        body:     get("landing.cta.body",     D.cta.body),
        btn1:     get("landing.cta.btn1",     D.cta.btn1),
        btn2:     get("landing.cta.btn2",     D.cta.btn2),
      },
      footer: {
        tagline:    get("landing.footer.tagline",    D.footer.tagline),
        regulatory: get("landing.footer.regulatory", D.footer.regulatory),
        copyright:  get("landing.footer.copyright",  D.footer.copyright),
        links:      get("landing.footer.links",       D.footer.links),
      },
    };
  } catch (err) {
    console.error("[site-content] Unexpected error, using defaults:", err);
    return D;
  }
}
