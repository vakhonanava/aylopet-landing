"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthFormShell, LoginForm } from "@/components/auth/AuthForm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAuthCopy } from "@/lib/content/auth";

function LoginPageContent() {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const params = useSearchParams();
  const nextPath = params.get("next") || "/dashboard";
  const authError = params.get("error");

  return (
    <AuthFormShell
      title={a.loginTitle}
      subtitle={a.loginSubtitle}
      footer={
        <>
          {a.loginFooterPrompt}{" "}
          <Link
            href={`/auth/register?next=${encodeURIComponent(nextPath)}`}
            className="font-medium text-[var(--brand-primary)] hover:underline"
          >
            {a.loginFooterCta}
          </Link>
        </>
      }
    >
      {authError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {a.oauthFailed}
        </p>
      )}
      <LoginForm nextPath={nextPath} />
    </AuthFormShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)]">
          <p className="text-sm text-[var(--text-secondary)]">Loading…</p>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
