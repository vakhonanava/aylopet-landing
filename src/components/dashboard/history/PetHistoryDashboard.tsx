"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Dna,
  FolderLock,
  IdCard,
  NotebookPen,
  Radio,
  Scale,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  UtensilsCrossed,
} from "lucide-react";
import { useMemo } from "react";
import { LabResultsUpload } from "@/components/dashboard/LabResultsUpload";
import { AiInsightsPanel } from "@/components/dashboard/history/sections/AiInsightsPanel";
import { CollarPanel } from "@/components/dashboard/history/sections/CollarPanel";
import { ContactsPanel } from "@/components/dashboard/history/sections/ContactsPanel";
import { DnaPanel } from "@/components/dashboard/history/sections/DnaPanel";
import { IdentityPassport } from "@/components/dashboard/history/sections/IdentityPassport";
import { MedicalHistoryPanel } from "@/components/dashboard/history/sections/MedicalHistoryPanel";
import { MicrochipSosCard } from "@/components/dashboard/history/sections/MicrochipSosCard";
import { NutritionPanel } from "@/components/dashboard/history/sections/NutritionPanel";
import { sectionMotion } from "@/components/dashboard/history/ui";
import type { Pet } from "@/lib/dashboard";
import { PRIVACY_NOTICE } from "@/lib/pet-history/labels";
import { getPetTelemetry } from "@/lib/pet-history/telemetry";

const NAV = [
  { id: "passport", label: "პასპორტი", icon: IdCard },
  { id: "microchip", label: "მიკროჩიპი", icon: ScanLine },
  { id: "weight", label: "წონა", icon: Scale },
  { id: "vaccines", label: "ვაქცინაცია", icon: Syringe },
  { id: "allergies", label: "ალერგიები", icon: AlertTriangle },
  { id: "vault", label: "დოკუმენტები", icon: FolderLock },
  { id: "dna", label: "დნმ", icon: Dna },
  { id: "nutrition", label: "კვება", icon: UtensilsCrossed },
  { id: "collar", label: "საყელო", icon: Radio },
  { id: "ai", label: "AylopetAI", icon: Sparkles },
  { id: "vet", label: "ვეტერინარი", icon: Stethoscope },
  { id: "caretaker", label: "მომვლელი", icon: NotebookPen },
] as const;

function SectionNav() {
  return (
    // Deliberately not sticky: GlobalHeader is `sticky top-0` and retracts on
    // scroll, so any fixed offset here would either overlap it or leave a gap.
    <nav
      aria-label="სექციები"
      className="-mx-5 mb-6 border-b border-[#eceae5] px-5 pb-4 sm:-mx-8 sm:px-8"
    >
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-3.5 py-2 text-xs font-medium whitespace-nowrap text-slate-500 transition-colors hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)]"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PetHistoryDashboard({ pet }: { pet: Pet }) {
  const telemetry = useMemo(() => getPetTelemetry(pet), [pet]);

  return (
    <div className="flex flex-col">
      <SectionNav />

      <div className="flex flex-col gap-5">
        <IdentityPassport pet={pet} />
        <MicrochipSosCard pet={pet} />

        <MedicalHistoryPanel pet={pet} />

        {/* The vault is the existing upload surface — drag & drop, PDF/JPEG/PNG,
            10MB cap, progress and preview cards all already live there. */}
        <div id="vault" className="scroll-mt-28">
          <LabResultsUpload pet={pet} />
        </div>

        <DnaPanel pet={pet} dna={telemetry.dna} />
        <NutritionPanel pet={pet} />
        <CollarPanel collar={telemetry.collar} />
        <AiInsightsPanel
          consultations={telemetry.consultations}
          insights={telemetry.insights}
        />
        <ContactsPanel pet={pet} />
      </div>

      <motion.footer
        {...sectionMotion}
        className="mt-8 flex items-start gap-3 rounded-[2rem] border border-[var(--brand-primary)]/15 bg-[var(--brand-primary)]/[0.04] px-6 py-5"
      >
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-primary)]" />
        <p className="text-sm leading-relaxed text-slate-600">
          {PRIVACY_NOTICE}
        </p>
      </motion.footer>
    </div>
  );
}
