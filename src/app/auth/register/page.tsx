"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthFormShell, RegisterForm } from "@/components/auth/AuthForm";

function RegisterPageContent() {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/dashboard";

  return (
    <AuthFormShell
      title="ანგარიშის შექმნა"
      subtitle="შექმენი Aylopet ანგარიში და გახსენი პერსონალური პანელი."
      footer={
        <>
          უკვე გაქვს ანგარიში?{" "}
          <Link
            href={`/auth/login?next=${encodeURIComponent(nextPath)}`}
            className="font-medium text-[var(--brand-primary)] hover:underline"
          >
            შესვლა
          </Link>
          {" · "}
          <Link href="/onboarding/platform" className="hover:underline">
            მოლოდინის სია
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
          <p className="text-sm text-[var(--text-secondary)]">იტვირთება…</p>
        </main>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
