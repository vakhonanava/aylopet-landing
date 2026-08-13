"use client";

import Link from "next/link";
import { Dog, Printer } from "lucide-react";
import { useMemo } from "react";
import { QrCode } from "@/components/dashboard/history/QrCode";
import { StatusPill } from "@/components/dashboard/history/ui";
import { formatDate, type Pet } from "@/lib/dashboard";
import { MICROCHIP_STATUS } from "@/lib/pet-history/labels";
import { buildSosPayload } from "@/lib/pet-history/sos";

export function SosCardView({ pet }: { pet: Pet }) {
  const registration = pet.history?.microchip ?? null;
  const chip = registration?.code ?? pet.microchipId ?? null;
  const payload = useMemo(() => buildSosPayload(pet, chip), [pet, chip]);

  const vet = pet.history?.vet;
  const callbackNumber = vet?.emergencyPhone || vet?.phone || null;

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/dashboard/pets/${pet.id}`}
          className="text-sm font-medium text-slate-500 hover:text-[var(--brand-primary)]"
        >
          ← პროფილში დაბრუნება
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white"
        >
          <Printer className="h-4 w-4" /> ბეჭდვა / PDF-ად შენახვა
        </button>
      </div>

      <div className="rounded-[2rem] border border-[#e5e7eb] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:border-0 print:p-0 print:shadow-none">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
          Aylopet · SOS იდენტიფიკაცია
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          {pet.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pet.avatarUrl}
              alt={pet.name}
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            />
          ) : (
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Dog className="h-10 w-10" />
            </span>
          )}
          <div>
            <h1 className="text-2xl font-bold text-[var(--brand-primary)]">{pet.name}</h1>
            <p className="text-sm text-slate-500">{pet.breed}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4">
            <QrCode value={payload} size={220} />
          </div>
        </div>

        <div className="mt-8 space-y-3 border-t border-[#eceae5] pt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              მიკროჩიპის ნომერი
            </span>
            <span className="font-mono text-sm font-semibold text-[var(--brand-primary)]">
              {chip ?? "·"}
            </span>
          </div>
          {registration ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                ბაზის სტატუსი
              </span>
              <StatusPill tone={MICROCHIP_STATUS[registration.status]} />
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              საკონტაქტო ნომერი
            </span>
            <span className="text-sm font-semibold text-[var(--brand-primary)]">
              {callbackNumber ?? "დაამატეთ ვეტერინარის კონტაქტში"}
            </span>
          </div>
        </div>

        <p className="mt-8 rounded-2xl bg-[#FAFAF8] px-4 py-3 text-center text-xs leading-relaxed text-slate-500">
          თუ იპოვეთ ეს ძაღლი, დაასკანერეთ QR კოდი ან დარეკეთ ზემოთ მითითებულ
          ნომერზე. მადლობა დახმარებისთვის.
        </p>

        <p className="mt-4 text-center text-[10px] text-slate-300">
          შედგენილია aylopet.com-ზე, {formatDate(new Date().toISOString().slice(0, 10))}
        </p>
      </div>
    </div>
  );
}
