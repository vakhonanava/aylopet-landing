"use client";

import { PawPrint } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { OnboardingForm } from "@/components/dashboard/OnboardingForm";

export default function OnboardingPage() {
  const { user, ready } = useAuth();
  const isAuthenticated = ready && Boolean(user);

  return (
    <div>
      <header className="mb-8 text-center">
        <span className="mb-3 inline-block rounded-full bg-[var(--brand-primary)]/10 px-4 py-1 text-sm font-medium text-[var(--brand-primary)]">
          {isAuthenticated ? "ახალი ძაღლი" : "რეგისტრაცია"}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-4xl">
          {isAuthenticated ? "დაამატე შინაური ცხოველი" : "მოგესალმებით Aylopet-ში"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          {isAuthenticated
            ? "რამდენიმე ველი საკმარისია პერსონალური კვებისა და ჯანმრთელობის რჩევებისთვის."
            : "რამდენიმე ნაბიჯი გვაშორებს შენი მეგობრის პერსონალური პროფილის შექმნამდე."}
        </p>
        {isAuthenticated && (
          <p className="mx-auto mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-500">
            <PawPrint className="h-4 w-4 text-[var(--brand-primary)]" />
            უკვე შესული ხარ — ანგარიშის შექმნა არ სჭირდება.
          </p>
        )}
      </header>
      <OnboardingForm />
    </div>
  );
}
