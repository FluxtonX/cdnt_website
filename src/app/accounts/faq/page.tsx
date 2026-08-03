import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "Accounts FAQ — Opening Accounts, Identity Verification & Transfers",
  description:
    "Clear answers to common questions about opening CDNT accounts, identity verification (KYC), fee waivers, and integrated crypto workflows.",
  canonicalPath: "/accounts/faq",
});

const faqItems = [
  {
    question: "What documents are required to open a CDNT account?",
    answer: "You need a valid government-issued photo ID (passport, driver's license) and proof of Canadian residence for KYC verification.",
  },
  {
    question: "Are there monthly maintenance fees?",
    answer: "We offer zero-fee student and savings options. Chequing monthly fees are waived with minimum daily balance requirements.",
  },
  {
    question: "Can I hold digital assets in my account?",
    answer: "Yes, CDNT Bank supports secure CAD and USD alongside BTC, ETH, and USDT balances with 2FA protection.",
  },
];

export default function AccountFaqPage() {
  return (
    <>
      <WebPageJsonLd
        title="Accounts FAQ — Opening Accounts, Identity Verification & Transfers"
        description="Clear answers to common questions about opening CDNT accounts, identity verification (KYC), fee waivers, and integrated crypto workflows."
        urlPath="/accounts/faq"
      />
      <FaqJsonLd faqs={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "Accounts FAQ", item: "/accounts/faq" },
        ]}
      />
      <AccountDetailPage account={accountPages.faq} />
    </>
  );
}
