import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "Apply Online — Open a Regulated CDNT Account in Minutes",
  description:
    "Start secure online account opening with identity verification (KYC), 2FA setup, and instant digital access to CDNT chequing and savings products.",
  canonicalPath: "/accounts/apply",
});

export default function ApplyOnlinePage() {
  return (
    <>
      <WebPageJsonLd
        title="Apply Online — Open a Regulated CDNT Account"
        description="Start secure online account opening with identity verification (KYC), 2FA setup, and instant digital access to CDNT products."
        urlPath="/accounts/apply"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "Apply Online", item: "/accounts/apply" },
        ]}
      />
      <AccountDetailPage account={accountPages.apply} />
    </>
  );
}
