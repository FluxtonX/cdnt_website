import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/phone-otp",
          "/two-factor",
          "/two-factor-setup",
          "/auth-error",
          "/wallets/",
          "/deposit/",
          "/withdraw/",
          "/portfolio/",
          "/transactions/",
          "/notifications/",
          "/support/",
          "/statements/",
          "/price-alerts/",
          "/referral/",
          "/settings/",
          "/kyc/",
          "/account-restricted",
          "/states/",
          "/ui-completion",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
