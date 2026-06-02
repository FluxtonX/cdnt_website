"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { Field, PrimaryButton } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };
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
        <form className="space-y-5" onSubmit={handleUpdate}>
          <Field
            label="New password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Field
            label="Confirm password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update password"}
          </PrimaryButton>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
