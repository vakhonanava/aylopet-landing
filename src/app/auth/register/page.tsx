"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthFormShell, RegisterForm } from "@/components/auth/AuthForm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAuthCopy } from "@/lib/content/auth";

function RegisterPageContent() {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const params = useSearchParams();
  const nextPath = params.get("next") || "/dashboard";

  return (
    <AuthFormShell
      title={a.registerTitle}
      subtitle={a.registerSubtitle}
      footer={
        <>
          {a.registerFooterPrompt}{" "}
          <Link
            href={`/auth/login?next=${encodeURIComponent(nextPath)}`}
            className="font-medium text-[var(--brand-primary)] hover:underline"
          >
            {a.registerFooterCta}
          </Link>
          {" · "}
          <Link href="/onboarding/platform" className="hover:underline">
            {a.registerFooterWaitlist}
          </Link>
        </>
      }
    >
      <RegisterForm nextPath={nextPath} />
    </AuthFormShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)]">
          <p className="text-sm text-[var(--text-secondary)]">Loading…</p>
        </main>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
