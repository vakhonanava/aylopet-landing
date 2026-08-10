"use client";

import { Dog, PawPrint } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { PetHistoryDashboard } from "@/components/dashboard/history/PetHistoryDashboard";

function Loading() {
  return (
    <div className="flex h-64 items-center justify-center text-slate-400">
      იტვირთება...
    </div>
  );
}

function PetProfileContent() {
  const searchParams = useSearchParams();
  const { pets, ready } = useDashboard();

  if (!ready) return <Loading />;

  if (pets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-[#e5e7eb] bg-white p-12 text-center">
        <PawPrint className="h-9 w-9 text-slate-300" />
        <p className="text-slate-500">ჯერ არცერთი ძაღლი არ დაგიმატებია.</p>
        <Link
          href="/dashboard/onboarding"
          className="rounded-full bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
        >
          ძაღლის დამატება
        </Link>
      </div>
    );
  }

  // `?pet=<id>` keeps the selection linkable; the first pet is the default.
  const requested = searchParams.get("pet");
  const pet = pets.find((candidate) => candidate.id === requested) ?? pets[0];

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)]">
          ჯანმრთელობის სრული ისტორია
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {pet.name} · ბიოლოგიური, სამედიცინო, გენეტიკური და აქტივობის მონაცემები
          ერთ ადგილას.
        </p>
      </header>

      {pets.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {pets.map((candidate) => {
            const active = candidate.id === pet.id;
            return (
              <Link
                key={candidate.id}
                href={`/dashboard/pet-profile?pet=${candidate.id}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                    : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                }`}
              >
                <Dog className="h-4 w-4" />
                {candidate.name}
              </Link>
            );
          })}
        </div>
      ) : null}

      <PetHistoryDashboard pet={pet} />
    </div>
  );
}

export default function PetProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PetProfileContent />
    </Suspense>
  );
}
