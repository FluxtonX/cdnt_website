import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/forms/auth-forms";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Start verified onboarding"
      title="Create your North Union account."
      description="Register with secure identity checks, risk consent, and a protected onboarding path built for financial workflows."
    >
      <AuthCard title="Create account" subtitle="Your details should match the identity documents used during KYC.">
        <RegisterForm />
      </AuthCard>
    </AuthShell>
  );
}
