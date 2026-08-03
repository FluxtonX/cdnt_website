import React from "react";
import { siteConfig, getSiteUrl } from "@/config/seo";

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const baseUrl = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.telephone,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    sameAs: siteConfig.sameAs,
  };

  return <JsonLd data={schema} />;
}

export function FinancialServiceJsonLd() {
  const baseUrl = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${baseUrl}/#financial-service`,
    name: siteConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    description: siteConfig.description,
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    currenciesAccepted: "CAD, USD, BTC, ETH, USDT",
    paymentAccepted: "Direct Deposit, Interac e-Transfer, Wire Transfer, Crypto",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
    serviceType: [
      "Digital Banking",
      "Savings Accounts",
      "Chequing Accounts",
      "Crypto Portfolio Management",
      "International Money Transfers",
    ],
  };

  return <JsonLd data={schema} />;
}

export function WebSiteJsonLd() {
  const baseUrl = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "en-CA",
  };

  return <JsonLd data={schema} />;
}

export function WebPageJsonLd({
  title,
  description,
  urlPath,
}: {
  title: string;
  description: string;
  urlPath: string;
}) {
  const baseUrl = getSiteUrl();
  const pageUrl = `${baseUrl}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: title,
    description,
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    inLanguage: "en-CA",
  };

  return <JsonLd data={schema} />;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const baseUrl = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item.startsWith("http")
        ? crumb.item
        : `${baseUrl}${crumb.item.startsWith("/") ? crumb.item : `/${crumb.item}`}`,
    })),
  };

  return <JsonLd data={schema} />;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={schema} />;
}

export function ArticleJsonLd({
  title,
  description,
  urlPath,
  datePublished,
  dateModified,
  authorName = siteConfig.name,
}: {
  title: string;
  description: string;
  urlPath: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}) {
  const baseUrl = getSiteUrl();
  const pageUrl = `${baseUrl}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: pageUrl,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  return <JsonLd data={schema} />;
}

export function SoftwareApplicationJsonLd({
  name = "CDNT Digital Bank App",
  operatingSystem = "iOS, Android, Web",
  applicationCategory = "FinanceApplication",
}: {
  name?: string;
  operatingSystem?: string;
  applicationCategory?: string;
}) {
  const baseUrl = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    operatingSystem,
    applicationCategory,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
  };

  return <JsonLd data={schema} />;
}
