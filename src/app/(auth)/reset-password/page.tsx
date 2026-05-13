import { AuthCard } from "@/components/auth/auth-card";
import { Field, PrimaryButton } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Secure password reset"
      title="Set a new password for protected account access."
      description="Choose a strong password before returning to portfolio, wallet, withdrawal, and security settings."
    >
      <AuthCard
        title="Create new password"
        subtitle="Use a unique password with letters, numbers, and symbols."
      >
        <form className="space-y-5">
          <Field
            label="New password"
            type="password"
            placeholder="Enter new password"
          />
          <Field
            label="Confirm password"
            type="password"
            placeholder="Confirm new password"
          />
          <PrimaryButton>Update password</PrimaryButton>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
