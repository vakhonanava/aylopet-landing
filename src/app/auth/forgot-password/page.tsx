"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthFormShell, ForgotPasswordForm } from "@/components/auth/AuthForm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAuthCopy } from "@/lib/content/auth";

function ForgotPasswordContent() {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const params = useSearchParams();
  const expired = params.get("error") === "expired";

  return (
    <AuthFormShell
      title={a.forgotTitle}
      subtitle={a.forgotSubtitle}
      footer={
        <>
          {a.forgotFooterPrompt}{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[var(--brand-primary)] hover:underline"
          >
            {a.forgotFooterCta}
          </Link>
        </>
      }
    >
      {expired && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {a.resetLinkExpired}
        </p>
      )}
      <ForgotPasswordForm />
    </AuthFormShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)]">
          <p className="text-sm text-[var(--text-secondary)]">Loading…</p>
        </main>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
