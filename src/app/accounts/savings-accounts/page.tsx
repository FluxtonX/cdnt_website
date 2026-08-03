import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "High-Interest Canadian Savings Accounts — Goal Transfers & Zero Fees",
  description:
    "CDNT Savings Accounts: No monthly fee options, goal-based savings, clear interest tracking, and seamless transfers for Canadian cash reserves.",
  canonicalPath: "/accounts/savings-accounts",
});

export default function SavingsAccountsPage() {
  return (
    <>
      <WebPageJsonLd
        title="High-Interest Canadian Savings Accounts"
        description="CDNT Savings Accounts: No monthly fee options, goal-based savings, clear interest tracking, and seamless transfers."
        urlPath="/accounts/savings-accounts"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "Savings Accounts", item: "/accounts/savings-accounts" },
        ]}
      />
      <AccountDetailPage account={accountPages.savings} />
    </>
  );
}
