"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ChangePasswordForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/components/auth/AuthProvider";

function SettingsContent() {
  const { displayName, email } = useAuth();
  const params = useSearchParams();
  const passwordUpdated = params.get("password") === "updated";

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-3xl">
          პარამეტრები
        </h1>
        <p className="mt-1.5 text-slate-600">
          მართე ანგარიშის უსაფრთხოება და პაროლი.
        </p>
      </header>

      {passwordUpdated && (
        <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          პაროლი წარმატებით განახლდა.
        </p>
      )}

      <section className="rounded-[2rem] border border-[#e5e7eb] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
        <div className="mb-6 border-b border-[var(--border-light)] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            ანგარიში
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--brand-primary)]">
            {displayName}
          </p>
          <p className="text-sm text-slate-500">{email}</p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-[var(--brand-primary)]">
            პაროლის შეცვლა
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            შეიყვანე მიმდინარე პაროლი და აირჩიე ახალი.
          </p>
          <div className="mt-5">
            <ChangePasswordForm />
          </div>
        </div>
      </section>

      <p className="mt-6 text-sm text-slate-500">
        <Link href="/dashboard" className="font-medium text-[var(--brand-primary)] hover:underline">
          ← პანელში დაბრუნება
        </Link>
      </p>
    </div>
  );
}

export default function DashboardSettingsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-[var(--text-secondary)]">იტვირთება…</p>
        </main>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
