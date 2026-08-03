import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "Canadian Chequing Accounts — Unlimited Digital Banking & Direct Deposit",
  description:
    "CDNT Chequing Accounts: Unlimited digital transactions, bill payment, direct deposit, and integrated 2FA protection for everyday banking in Canada.",
  canonicalPath: "/accounts/chequing-accounts",
});

export default function ChequingAccountsPage() {
  return (
    <>
      <WebPageJsonLd
        title="Canadian Chequing Accounts"
        description="CDNT Chequing Accounts: Unlimited digital transactions, bill payment, direct deposit, and 2FA protection."
        urlPath="/accounts/chequing-accounts"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "Chequing Accounts", item: "/accounts/chequing-accounts" },
        ]}
      />
      <AccountDetailPage account={accountPages.chequing} />
    </>
  );
}
