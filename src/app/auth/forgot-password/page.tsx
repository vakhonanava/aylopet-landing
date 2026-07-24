"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthFormShell, ForgotPasswordForm } from "@/components/auth/AuthForm";

function ForgotPasswordContent() {
  const params = useSearchParams();
  const expired = params.get("error") === "expired";

  return (
    <AuthFormShell
      title="პაროლის აღდგენა"
      subtitle="შეიყვანე ელ. ფოსტა და გამოგიგზავნით აღდგენის ბმულს."
      footer={
        <>
          გახსენი გახსოვს?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[var(--brand-primary)] hover:underline"
          >
            შესვლა
          </Link>
        </>
      }
    >
      {expired && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          აღდგენის ბმული ვადაგასულია ან უკვე გამოყენებულია. მოითხოვე ახალი ბმული.
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
          <p className="text-sm text-[var(--text-secondary)]">იტვირთება…</p>
        </main>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
