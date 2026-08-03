import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "CDNT Vantage Private Relationship Banking — Premium Insights & Priority Service",
  description:
    "CDNT Vantage: Premium relationship banking with dedicated advisor access, higher transfer limits, cash and crypto portfolio insights, and priority support.",
  canonicalPath: "/accounts/nub-vantage",
});

export default function NubVantagePage() {
  return (
    <>
      <WebPageJsonLd
        title="CDNT Vantage Private Relationship Banking"
        description="CDNT Vantage: Premium relationship banking with dedicated advisor access, higher transfer limits, and cash & crypto portfolio insights."
        urlPath="/accounts/nub-vantage"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "CDNT Vantage", item: "/accounts/nub-vantage" },
        ]}
      />
      <AccountDetailPage account={accountPages.vantage} />
    </>
  );
}
