import { PageTitle } from "@/components/dashboard/blocks";
import { DepositWorkspace } from "@/components/dashboard/deposit-workspace";

export default function DepositPage() {
  return (
    <>
      <PageTitle
        title="Deposit Crypto"
        description="Choose an asset and network carefully. Sending assets to the wrong network can cause permanent loss."
      />
      <DepositWorkspace />
    </>
  );
}
