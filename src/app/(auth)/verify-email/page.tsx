import { AuthCard } from "@/components/auth/auth-card";
import { OtpInput, PrimaryButton } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="Email verification"
      title="Confirm your email before entering the platform."
      description="Email verification keeps account ownership clear before KYC, deposits, withdrawals, and support access."
    >
      <AuthCard title="Verify email" subtitle="Enter the 6-digit code sent to your registered email.">
        <form className="space-y-6">
          <OtpInput />
          <PrimaryButton>Verify email</PrimaryButton>
          <p className="text-center text-sm text-banking-muted">
            Did not receive it? <button className="font-semibold text-banking-blue">Resend code</button>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
