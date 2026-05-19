import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";

const FOOTER_LINKS = {
  COMPANY: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
  ],
  PRODUCTS: [
    { name: "Banking", href: "#" },
    { name: "Crypto", href: "#" },
    { name: "Savings", href: "#" },
    { name: "Cards", href: "#" },
  ],
  LEGAL: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Compliance", href: "#" },
    { name: "Security", href: "#" },
  ],
  SUPPORT: [
    { name: "Help Center", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Status", href: "#" },
    { name: "FAQ", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary-navy pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/assets/logo.png"
                alt="North Union Bank"
                width={160}
                height={53}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              A regulated Canadian digital bank with a built-in crypto engine. 
              Banking meets crypto intelligence.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="lg:col-span-1">
              <h4 className="text-white font-semibold text-sm tracking-wider mb-6 uppercase">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-[15px]"
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
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 North Union Bank. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
