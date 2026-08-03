import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "Account Support & Client Guidance — Login, KYC & Transaction Help",
  description:
    "CDNT Account Support: Secure ticket resolution, KYC document verification help, card management, and digital asset transaction assistance.",
  canonicalPath: "/accounts/help-with-my-account",
});

export default function HelpWithMyAccountPage() {
  return (
    <>
      <WebPageJsonLd
        title="Account Support & Client Guidance"
        description="CDNT Account Support: Secure ticket resolution, KYC document verification help, card management, and digital asset transaction assistance."
        urlPath="/accounts/help-with-my-account"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "Account Support", item: "/accounts/help-with-my-account" },
        ]}
      />
      <AccountDetailPage account={accountPages.help} />
    </>
  );
}
