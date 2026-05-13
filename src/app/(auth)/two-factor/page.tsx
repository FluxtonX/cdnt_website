import { AuthCard } from "@/components/auth/auth-card";
import { OtpInput, PrimaryButton } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function TwoFactorPage() {
  return (
    <AuthShell
      eyebrow="Two-factor authentication"
      title="One more check before secure access."
      description="North Union requires stronger verification for financial actions, admin areas, new devices, and security changes."
    >
      <AuthCard title="Enter 2FA code" subtitle="Use the code from email, SMS, or your authenticator when enabled.">
        <form className="space-y-6">
          <OtpInput />
          <PrimaryButton>Confirm and continue</PrimaryButton>
          <p className="text-center text-sm text-banking-muted">
            Lost access? <button className="font-semibold text-banking-blue">Contact support</button>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
