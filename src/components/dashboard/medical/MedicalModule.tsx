"use client";

import { useState } from "react";
import { ClipboardList, FileHeart, Pill, Share2 } from "lucide-react";
import type { Pet } from "@/lib/dashboard";
import { SymptomTracker } from "@/components/dashboard/medical/SymptomTracker";
import { MedicalRecordForm } from "@/components/dashboard/medical/MedicalRecordForm";
import { MedicationsPanel } from "@/components/dashboard/medical/MedicationsPanel";
import { VetExportButton } from "@/components/dashboard/medical/VetExportButton";

type Section = "symptoms" | "record" | "medications" | "export";

const NAV: { value: Section; label: string; icon: typeof ClipboardList }[] = [
  { value: "symptoms", label: "სიმპტომები", icon: ClipboardList },
  { value: "record", label: "სამედიცინო ბარათი", icon: FileHeart },
  { value: "medications", label: "მედიკამენტები", icon: Pill },
  { value: "export", label: "ექსპორტი ვეტისთვის", icon: Share2 },
];

export function MedicalModule({ pet }: { pet: Pet }) {
  const [section, setSection] = useState<Section>("symptoms");

  return (
    <section className="rounded-[2rem] border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7">
      <h2 className="mb-1 text-lg font-bold tracking-tight text-[var(--brand-primary)]">
        სამედიცინო მონაცემები
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        ვაქცინები და პრევენციული მოვლა ხელმისაწვდომია{" "}
        <a
          href="#logbook-vaccines"
          className="font-medium text-[var(--brand-primary)] underline underline-offset-2"
        >
          ზემოთ „ვაქცინები & პრევენცია“ ჩანართში
        </a>
        .
      </p>

      <div className="mb-6 flex flex-wrap gap-1.5 rounded-full border border-[#e5e7eb] bg-[#FAFAF8] p-1.5">
        {NAV.map((item) => {
          const active = section === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setSection(item.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active ? "bg-[var(--brand-primary)] text-white" : "text-slate-500"
              }`}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          );
        })}
      </div>

      {section === "symptoms" && <SymptomTracker pet={pet} />}
      {section === "record" && <MedicalRecordForm pet={pet} />}
      {section === "medications" && <MedicationsPanel pet={pet} />}
      {section === "export" && <VetExportButton pet={pet} />}
    </section>
  );
}
