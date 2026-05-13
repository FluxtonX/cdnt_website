import { PageTitle, Panel } from "@/components/dashboard/blocks";
import { WithdrawalForm } from "@/components/forms/withdrawal-form";

export default function WithdrawPage() {
  return (
    <>
      <PageTitle
        title="Interac Withdrawal"
        description="Submit a fiat withdrawal request for manual review. 2FA confirmation is required before submission."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Panel title="Withdrawal request">
          <WithdrawalForm />
        </Panel>
        <Panel title="Limits and status">
          <div className="space-y-4 text-sm">
            <div className="rounded-md bg-banking-offWhite p-4">
              <p className="font-semibold">Available balance</p>
              <p className="mt-1 text-2xl font-semibold text-banking-blue">$88,940.46</p>
            </div>
            <p className="text-banking-muted">Minimum withdrawal: $100 CAD</p>
            <p className="text-banking-muted">Daily limit: $10,000 CAD</p>
            <p className="text-banking-muted">Monthly limit: $50,000 CAD</p>
            <p className="text-banking-muted">Large or suspicious withdrawals may be flagged for compliance review.</p>
          </div>
        </Panel>
      </div>
    </>
  );
}
