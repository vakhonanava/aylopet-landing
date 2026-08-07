"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Dog, Lock, PawPrint, Plus, Users } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { AmbassadorProgram } from "@/components/early-access/AmbassadorProgram";
import { ADDITIONAL_PET_PRICE_GEL, canAddPet } from "@/lib/pricing/pets";

export default function DashboardHome() {
  const { pets, account, ready } = useDashboard();
  const addPet = canAddPet(pets.length, account?.hasPaidPlan ?? false);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-3xl">
          მოგესალმებით{account?.name ? `, ${account.name}` : ""} 👋
        </h1>
        <p className="mt-1.5 text-slate-600">
          მართე შენი ძაღლების პროფილები, ჯანმრთელობა და კვება ერთ სივრცეში.
          დააჭირე ძაღლის ბარათს პროფილის რედაქტირების, ანალიზების ატვირთვისა და
          ისტორიის სანახავად.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {ready &&
          pets.map((pet) => (
            <Link
              key={pet.id}
              href={`/dashboard/pets/${pet.id}`}
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
                <p className="truncate text-sm text-slate-500">
                  {pet.breed} · {pet.weightKg}kg
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]" />
            </Link>
          ))}

        {addPet.allowed ? (
          <Link
            href="/dashboard/onboarding"
            className="flex items-center gap-4 rounded-[2rem] border border-dashed border-[#cbd5cf] bg-transparent p-5 text-slate-500 transition-all duration-300 hover:border-[var(--brand-primary)]/40 hover:text-[var(--brand-primary)]"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)]/[0.06] text-[var(--brand-primary)]">
              <Plus className="h-7 w-7" />
            </span>
            <div>
              <h3 className="font-bold text-[var(--brand-primary)]">ახალი ძაღლის დამატება</h3>
              <p className="text-sm">
                დაამატე კიდევ ერთი ოჯახის წევრი · +{ADDITIONAL_PET_PRICE_GEL} ₾
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-4 rounded-[2rem] border border-dashed border-[#cbd5cf] bg-slate-50/60 p-5 text-slate-500">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-200/70 text-slate-400">
              <Lock className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-500">ახალი ძაღლის დამატება</h3>
              <p className="text-sm">
                {addPet.reason === "limit-reached"
                  ? "ამჟამად ერთ ანგარიშზე მაქსიმუმ ორი პროფილია ხელმისაწვდომი."
                  : `მეორე ძაღლის დამატება (+${ADDITIONAL_PET_PRICE_GEL} ₾) იხსნება პირველი პროფილის გადახდის შემდეგ.`}
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-primary)]/[0.08] px-3 py-1 text-xs font-semibold text-[var(--brand-primary)]">
                <Users className="h-3.5 w-3.5" />
                Family Sharing — Coming Soon
              </span>
            </div>
          </div>
        )}
      </div>

      {ready && pets.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-[2rem] border border-[#e5e7eb] bg-white p-10 text-center">
          <PawPrint className="h-8 w-8 text-slate-300" />
          <p className="text-slate-500">ჯერ არ გყავს დამატებული ძაღლი.</p>
        </div>
      )}

      {/* Every registered member is an Ambassador · this is the surface they
          actually land on after onboarding. */}
      <AmbassadorProgram className="mt-8" />
    </div>
  );
}
