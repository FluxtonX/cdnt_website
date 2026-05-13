import { Download } from "lucide-react";
import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { TransactionExplorer } from "@/components/dashboard/transaction-explorer";

export default function TransactionsPage() {
  return (
    <>
      <PageTitle
        title="Transactions"
        description="Search and filter deposits, withdrawal requests, adjustments, fees, bonuses, and portfolio updates."
        action={
          <button className="inline-flex items-center gap-2 rounded-md bg-banking-blue px-4 py-2 text-sm font-semibold text-white">
            <Download className="h-4 w-4" />
            Download report
          </button>
        }
      />
      <Panel title="Transaction history">
        <TransactionExplorer />
      </Panel>
    </>
  );
}
