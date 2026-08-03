import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "./json-ld";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  const jsonLdItems: BreadcrumbItem[] = allItems.map((item) => ({
    name: item.label,
    item: item.href,
  }));

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs font-medium text-[#6B7280] py-3 px-6 max-w-7xl mx-auto ${className}`}
      >
        <ol className="flex items-center space-x-2 flex-wrap">
          {allItems.map((crumb, idx) => {
            const isLast = idx === allItems.length - 1;
            return (
              <li key={crumb.href} className="flex items-center space-x-2">
                {idx > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" aria-hidden="true" />
                )}
                {isLast ? (
                  <span
                    className="text-[#0A0F2C] font-semibold tracking-tight"
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#1A3FBB] transition-colors flex items-center gap-1"
                  >
                    {idx === 0 && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                    <span>{crumb.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
