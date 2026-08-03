import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/seo";

interface RouteConfig {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

const publicRoutes: RouteConfig[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/security", changeFrequency: "monthly", priority: 0.8 },
  { path: "/help", changeFrequency: "weekly", priority: 0.8 },
  { path: "/accounts", changeFrequency: "weekly", priority: 0.9 },
  { path: "/accounts/chequing-accounts", changeFrequency: "weekly", priority: 0.8 },
  { path: "/accounts/savings-accounts", changeFrequency: "weekly", priority: 0.8 },
  { path: "/accounts/international-banking", changeFrequency: "weekly", priority: 0.8 },
  { path: "/accounts/student-banking", changeFrequency: "weekly", priority: 0.8 },
  { path: "/accounts/help-with-my-account", changeFrequency: "monthly", priority: 0.7 },
  { path: "/accounts/nub-vantage", changeFrequency: "weekly", priority: 0.8 },
  { path: "/accounts/advantage", changeFrequency: "monthly", priority: 0.7 },
  { path: "/accounts/current-rates", changeFrequency: "weekly", priority: 0.8 },
  { path: "/accounts/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/accounts/apply", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
