"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthFormShell, LoginForm } from "@/components/auth/AuthForm";

function LoginPageContent() {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/dashboard";
  const authError = params.get("error");

  return (
    <AuthFormShell
      title="კეთილი იყოს დაბრუნება"
      subtitle="შედი შენს Aylopet ანგარიშზე."
      footer={
        <>
          არ გაქვს ანგარიში?{" "}
          <Link
            href={`/auth/register?next=${encodeURIComponent(nextPath)}`}
            className="font-medium text-[var(--brand-primary)] hover:underline"
          >
            რეგისტრაცია
          </Link>
        </>
      }
    >
      {authError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          ავტორიზაცია ვერ მოხერხდა. სცადე თავიდან.
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
          <p className="text-sm text-[var(--text-secondary)]">იტვირთება…</p>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
