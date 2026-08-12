"use client";

import { ArrowLeft, ArrowRight, Dog, PawPrint } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Pet } from "@/lib/dashboard";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { PetHistoryDashboard } from "@/components/dashboard/history/PetHistoryDashboard";

function Loading() {
  return (
    <div className="flex h-64 items-center justify-center text-slate-400">
      იტვირთება...
    </div>
  );
}

function PetPickerCard({ pet }: { pet: Pet }) {
  return (
    <Link
      href={`/dashboard/pet-profile?pet=${pet.id}`}
      className="group flex items-center gap-4 rounded-[2rem] border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]"
    >
      <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400">
        {pet.avatarUrl ? (
          <Image
            src={pet.avatarUrl}
            alt={pet.name}
            width={64}
            height={64}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <Dog className="h-7 w-7" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-[var(--brand-primary)]">{pet.name}</h3>
        <p className="truncate text-sm text-slate-500">{pet.breed}</p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]" />
    </Link>
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

  // Full history only opens once a pet is explicitly picked via `?pet=<id>` —
  // it never auto-selects, even when there's just one dog.
  const requested = searchParams.get("pet");
  const pet = requested
    ? pets.find((candidate) => candidate.id === requested)
    : undefined;

  if (!pet) {
    return (
      <div className="flex flex-col gap-5">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)]">
            ჯანმრთელობის ისტორია
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            აირჩიეთ ძაღლი სრული ისტორიის სანახავად.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {pets.map((candidate) => (
            <PetPickerCard key={candidate.id} pet={candidate} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <Link
          href="/dashboard/pet-profile"
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          უკან
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)]">
          ჯანმრთელობის სრული ისტორია
        </h1>
        <p className="text-sm text-slate-500">
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
