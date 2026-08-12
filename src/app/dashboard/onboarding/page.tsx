"use client";

import Link from "next/link";
import { Lock, PawPrint, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { OnboardingForm } from "@/components/dashboard/OnboardingForm";
import { ADDITIONAL_PET_PRICE_GEL, canAddPet } from "@/lib/pricing/pets";

export default function OnboardingPage() {
  const { user, ready } = useAuth();
  const { pets, account, ready: dashboardReady } = useDashboard();
  const isAuthenticated = ready && Boolean(user);
  const addPet = canAddPet(pets.length, account?.hasPaidPlan ?? false);
  // Guard the direct URL too · the dashboard card alone is not a gate.
  const locked = dashboardReady && isAuthenticated && !addPet.allowed;

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
            უკვე შესული ხარ. ანგარიშის შექმნა არ სჭირდება.
          </p>
        )}
      </header>
      {locked ? (
        <div className="mx-auto max-w-md rounded-[2rem] border border-dashed border-[#cbd5cf] bg-white p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Lock className="h-6 w-6" />
          </span>
          <p className="mt-4 text-slate-600">
            {addPet.reason === "limit-reached"
              ? "ამჟამად ერთ ანგარიშზე მაქსიმუმ ორი პროფილია ხელმისაწვდომი."
              : `მეორე ძაღლის დამატება (+${ADDITIONAL_PET_PRICE_GEL} ₾) იხსნება პირველი პროფილის გადახდის შემდეგ.`}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-primary)]/[0.08] px-4 py-1.5 text-xs font-semibold text-[var(--brand-primary)]">
            <Users className="h-3.5 w-3.5" />
            Family Sharing (Coming Soon)
          </span>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-semibold text-white"
          >
            დაბრუნება პანელზე
          </Link>
        </div>
      ) : (
        <OnboardingForm />
      )}
    </div>
  );
}
