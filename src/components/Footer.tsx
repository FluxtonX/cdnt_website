import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Instagram, GitBranch, Star, ExternalLink } from "lucide-react";
import type { LandingFooterContent } from "@/lib/content-defaults";
import { DEFAULT_LANDING_CONTENT } from "@/lib/content-defaults";
import { siteConfig } from "@/config/seo";

export default function Footer({ content = DEFAULT_LANDING_CONTENT.footer }: { content?: LandingFooterContent }) {
  // Convert list of complex objects to key-value record to map dynamically
  const footerLinksMap: Record<string, { name: string; href: string }[]> = {};
  
  content.links.forEach((linkCol) => {
    footerLinksMap[linkCol.title.toUpperCase()] = linkCol.description.split(", ").map((item) => ({
      name: item,
      href: "#"
    }));
  });

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Logo, Tagline, and Google Reviews Badge */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-4 mb-6 group ">
              <Image
                src="/bluelogo.png"
                alt="Canadian National Trust Bank Logo"
                width={120}
                height={40}
                quality={100}
                priority
                unoptimized={true}
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-[#64748b] leading-relaxed max-w-sm mb-6 text-[15px]">
              {content.tagline.split("\n").map((part, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {part}
                </span>
              ))}
            </p>

            {/* Google Reviews Footer Badge */}
            <a
              href={siteConfig.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all mb-6 group max-w-sm"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  Google Verified Reviews ({siteConfig.googleRating}/5)
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </p>
                <p className="text-[11px] text-slate-500">Read or leave a review on Google</p>
              </div>
            </a>

            <div className="flex items-center space-x-3">
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <span className="sr-only">Branch</span>
                <GitBranch className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinksMap).map(([title, links]) => (
            <div key={title} className="lg:col-span-1">
              <h4 className="text-[#0f172a] font-bold text-xs tracking-[0.1em] mb-6 uppercase">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-[#64748b] hover:text-[#0f172a] transition-colors text-[15px]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12">
          <p className="text-[#64748b] text-xs shrink-0">
            {content.copyright}
          </p>
          <p className="text-[#94a3b8] text-xs leading-relaxed lg:text-right max-w-3xl">
            {content.regulatory}
          </p>
        </div>

      </div>
    </footer>
  );
}
