import type { Metadata } from "next";

export const siteConfig = {
  name: "Canadian National Trust Bank",
  shortName: "CDNT Bank",
  description:
    "A regulated Canadian digital bank combining tier-one personal & business banking with a secure crypto engine. Manage CAD, USD, BTC, ETH, and USDT with enterprise security.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.cdntbank.com",
  ogImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
  twitterHandle: "@CDNTBank",
  locale: "en_CA",
  legalName: "Canadian National Trust Bank Inc.",
  telephone: "+1-800-555-0199",
  email: "support@cdntbank.com",
  address: {
    streetAddress: "100 King Street West, Suite 5600",
    addressLocality: "Toronto",
    addressRegion: "ON",
    postalCode: "M5X 1C9",
    addressCountry: "CA",
  },
  sameAs: [
    "https://twitter.com/CDNTBank",
    "https://linkedin.com/company/cdnt-bank",
    "https://facebook.com/cdntbank",
  ],
  keywords: [
    "Canadian Digital Banking",
    "Tier-1 Canadian Bank",
    "Regulated Crypto Banking",
    "Bitcoin Chequing Account",
    "USDT Savings Account",
    "Cross-Border Transfer Canada",
    "2FA Banking Protection",
    "CDNT Vantage",
    "Canadian Trust Bank",
  ],
};

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.cdntbank.com";
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonicalPath = "",
  noIndex = false,
  keywords = siteConfig.keywords,
  type = "website",
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article" | "profile";
} = {}): Metadata {
  const baseUrl = getSiteUrl();
  const url = canonicalPath
    ? `${baseUrl}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`
    : baseUrl;

  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — Banking Meets Crypto Intelligence`;

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        "en-CA": url,
        "en-US": url,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: siteConfig.locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
