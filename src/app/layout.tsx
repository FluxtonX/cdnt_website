import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://northunion.example"),
  title: {
    default: "North Union",
    template: "%s | North Union",
  },
  description: "Secure fintech banking and crypto portfolio platform.",
  keywords: [
    "North Union",
    "fintech",
    "crypto portfolio",
    "KYC",
    "Interac withdrawals",
    "secure banking dashboard",
  ],
  openGraph: {
    title: "North Union",
    description: "Secure fintech banking and crypto portfolio platform.",
    type: "website",
    siteName: "North Union",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

