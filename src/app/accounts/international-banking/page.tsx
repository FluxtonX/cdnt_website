import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "International & Cross-Border Banking Accounts — Global FX & Wire Transfers",
  description:
    "CDNT International Banking: Low-cost global transfers, multi-currency cash flow planning, travel controls, and FX review support for Canadians worldwide.",
  canonicalPath: "/accounts/international-banking",
});

export default function InternationalBankingPage() {
  return (
    <>
      <WebPageJsonLd
        title="International & Cross-Border Banking Accounts"
        description="CDNT International Banking: Low-cost global transfers, multi-currency cash flow planning, travel controls, and FX support."
        urlPath="/accounts/international-banking"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "International Banking", item: "/accounts/international-banking" },
        ]}
      />
      <AccountDetailPage account={accountPages.international} />
    </>
  );
}
