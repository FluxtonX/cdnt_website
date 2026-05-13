import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/forms/auth-forms";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Secure client access"
      title="Sign in to your financial command center."
      description="Access portfolio balances, deposits, withdrawals, support, and account security from one clean banking workspace."
    >
      <AuthCard title="Welcome back" subtitle="Use your verified email and password to continue.">
        <LoginForm />
      </AuthCard>
    </AuthShell>
  );
}
