import { AuthCard } from "@/components/auth/auth-card";
import { Field, FinePrint, PrimaryButton } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Recover access without lowering security."
      description="We will verify your email and protect the reset process before allowing account access again."
    >
      <AuthCard title="Reset password" subtitle="Enter the email connected to your North Union account.">
        <form className="space-y-5">
          <Field label="Email address" type="email" placeholder="name@example.com" />
          <PrimaryButton>Send reset instructions</PrimaryButton>
          <FinePrint href="/login" text="Remember your password?" link="Return to login" />
        </form>
      </AuthCard>
    </AuthShell>
  );
}
