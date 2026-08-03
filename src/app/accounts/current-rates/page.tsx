import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "Current Account Interest Rates & Service Pricing — CDNT Fee Schedules",
  description:
    "Review sample monthly fees, savings interest rates, fee waivers, service pricing, and network notices across all CDNT account tiers.",
  canonicalPath: "/accounts/current-rates",
});

export default function CurrentRatesPage() {
  return (
    <>
      <WebPageJsonLd
        title="Current Account Interest Rates & Service Pricing"
        description="Review sample monthly fees, savings interest rates, fee waivers, service pricing, and network notices across all CDNT account tiers."
        urlPath="/accounts/current-rates"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "Current Rates", item: "/accounts/current-rates" },
        ]}
      />
      <AccountDetailPage account={accountPages.rates} />
    </>
  );
}
