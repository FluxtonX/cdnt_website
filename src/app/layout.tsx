import type { Metadata } from "next";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
