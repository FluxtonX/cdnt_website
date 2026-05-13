import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { ReportCard } from "@/components/dashboard/report-card";

const reports = [
  ["Monthly statement", "Portfolio, balances, and account summary for the selected month.", "PDF"],
  ["Transaction report", "Deposits, withdrawals, adjustments, fees, and rewards.", "CSV"],
  ["Deposit report", "Crypto deposits, networks, confirmations, and credited timestamps.", "CSV"],
  ["Withdrawal report", "Interac requests, statuses, review notes, and completion timestamps.", "CSV"],
  ["Tax report placeholder", "Prepared area for future tax reporting and export workflows.", "PDF"],
  ["Portfolio performance report", "Allocation, historical values, and profit/loss summary.", "PDF"],
];

export default function StatementsPage() {
  return (
    <>
      <PageTitle
        title="Statements & Reports"
        description="Download account statements and export portfolio, deposit, withdrawal, and transaction data."
      />
      <div className="mb-6 rounded-lg border border-banking-border bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-banking-muted">Current month</p>
            <p className="mt-1 text-2xl font-semibold">May 2026</p>
          </div>
          <div>
            <p className="text-sm text-banking-muted">Export formats</p>
            <p className="mt-1 text-2xl font-semibold">PDF / CSV</p>
          </div>
          <div>
            <p className="text-sm text-banking-muted">Statement status</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-700">Ready</p>
          </div>
        </div>
      </div>
      <Panel title="Available reports">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map(([title, description, format]) => (
            <ReportCard
              key={title}
              title={title}
              description={description}
              format={format}
            />
          ))}
        </div>
      </Panel>
    </>
  );
}
