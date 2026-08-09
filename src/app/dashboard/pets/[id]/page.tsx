"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HeartPulse, PawPrint } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { LabResultsUpload } from "@/components/dashboard/LabResultsUpload";
import { PetProfileCard } from "@/components/dashboard/PetProfileCard";
import { LogbookTabs } from "@/components/dashboard/LogbookTabs";
import { MedicalModule } from "@/components/dashboard/medical/MedicalModule";

export default function PetProfilePage() {
  const params = useParams<{ id: string }>();
  const { getPet, ready } = useDashboard();
  const pet = getPet(params.id);

  if (!ready) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        იტვირთება...
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-[#e5e7eb] bg-white p-12 text-center">
        <PawPrint className="h-9 w-9 text-slate-300" />
        <p className="text-slate-500">ეს ძაღლი ვერ მოიძებნა.</p>
        <Link
          href="/dashboard"
          className="rounded-full bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-medium text-white"
        >
          დაბრუნება პანელზე
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-slate-400 transition-colors hover:text-[var(--brand-primary)]"
        >
          ← პანელი
        </Link>
        <Link
          href={`/dashboard/pet-profile?pet=${pet.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)]/30"
        >
          <HeartPulse className="h-4 w-4" /> სრული ჯანმრთელობის ისტორია
        </Link>
      </div>
      <PetProfileCard pet={pet} />
      <LabResultsUpload pet={pet} />
      <LogbookTabs pet={pet} />
      <MedicalModule pet={pet} />
    </div>
  );
}
