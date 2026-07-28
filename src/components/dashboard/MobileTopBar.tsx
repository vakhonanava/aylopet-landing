"use client";

import Link from "next/link";
import { Dog, Plus } from "lucide-react";
import { AylopetLogo } from "@/components/brand/AylopetLogo";
import { useDashboard } from "@/components/dashboard/DashboardStore";

export function MobileTopBar() {
  const { pets, ready } = useDashboard();

  return (
    <div className="sticky top-0 z-30 border-b border-[var(--border-light)] bg-white/80 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between px-5 py-3">
        <AylopetLogo size="sm" />
        <Link
          href="/dashboard/onboarding"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white"
          aria-label="ახალი ძაღლი"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto px-5 pb-3">
        {ready &&
          pets.map((pet) => (
          <Link
            key={pet.id}
            href={`/dashboard/pets/${pet.id}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-light)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--brand-primary)]"
          >
            <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
              {pet.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pet.avatarUrl}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Dog className="h-3.5 w-3.5" />
              )}
            </span>
            {pet.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
