import type { Metadata } from "next";
import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";
import { constructMetadata } from "@/config/seo";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = constructMetadata({
  title: "Canadian Student Banking Accounts — Low Fees & Financial Tools",
  description:
    "CDNT Student Banking: Zero-fee student chequing, budgeting tools, debit access, credit guidance, and digital financial education.",
  canonicalPath: "/accounts/student-banking",
});

export default function StudentBankingPage() {
  return (
    <>
      <WebPageJsonLd
        title="Canadian Student Banking Accounts"
        description="CDNT Student Banking: Zero-fee student chequing, budgeting tools, debit access, and digital financial education."
        urlPath="/accounts/student-banking"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Accounts", item: "/accounts" },
          { name: "Student Banking", item: "/accounts/student-banking" },
        ]}
      />
      <AccountDetailPage account={accountPages.student} />
    </>
  );
}
