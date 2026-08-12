"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PawPrint } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { PetProfileCard } from "@/components/dashboard/PetProfileCard";
import { LogbookTabs } from "@/components/dashboard/LogbookTabs";
import { MedicalModule } from "@/components/dashboard/medical/MedicalModule";
import { PetHistoryDashboard } from "@/components/dashboard/history/PetHistoryDashboard";

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
      </div>
      <PetProfileCard pet={pet} />
      <LogbookTabs pet={pet} />
      <MedicalModule pet={pet} />
      <PetHistoryDashboard pet={pet} />
    </div>
  );
}
