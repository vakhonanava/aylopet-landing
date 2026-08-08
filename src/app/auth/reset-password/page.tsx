"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthFormShell, ResetPasswordForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAuthCopy } from "@/lib/content/auth";

export default function ResetPasswordPage() {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/auth/forgot-password?error=expired");
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)]">
        <p className="text-sm text-[var(--text-secondary)]">Loading…</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthFormShell
      title={a.resetTitle}
      subtitle={a.resetSubtitle}
      footer={
        <>
          {a.resetFooterPrompt}{" "}
          <Link
            href="/dashboard"
            className="font-medium text-[var(--brand-primary)] hover:underline"
          >
            {a.resetFooterCta}
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthFormShell>
  );
}
