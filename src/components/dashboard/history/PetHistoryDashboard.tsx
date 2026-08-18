"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  Dna,
  Droplets,
  FlaskConical,
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
import { HydrationPanel } from "@/components/dashboard/history/sections/HydrationPanel";
import { IdentityPassport } from "@/components/dashboard/history/sections/IdentityPassport";
import { LabMetricsPanel } from "@/components/dashboard/history/sections/LabMetricsPanel";
import { MedicalHistoryPanel } from "@/components/dashboard/history/sections/MedicalHistoryPanel";
import { MicrochipSosCard } from "@/components/dashboard/history/sections/MicrochipSosCard";
import { NutritionPanel } from "@/components/dashboard/history/sections/NutritionPanel";
import { VetVisitsPanel } from "@/components/dashboard/history/sections/VetVisitsPanel";
import { GroupSection, sectionMotion } from "@/components/dashboard/history/ui";
import type { Pet } from "@/lib/dashboard";
import { PRIVACY_NOTICE } from "@/lib/pet-history/labels";
import { getPetTelemetry } from "@/lib/pet-history/telemetry";

/**
 * The 15 record types read as one flat, undifferentiated list — no sense of
 * what matters when. Grouped here by the question an owner is actually
 * asking: who is this dog (profile), am I covered if something goes wrong
 * (safety — deliberately placed second, right after orientation, so the
 * reassurance is never buried), how is he doing day to day (health
 * monitoring, the largest and most frequently checked cluster), and how do I
 * care for him (lifestyle, lowest-urgency, last).
 */
const SECTION_GROUPS = [
  {
    id: "group-profile",
    icon: IdCard,
    eyebrow: "01",
    title: "პროფილი",
    description:
      "ვინ არის ის — ძირითადი მონაცემები, წონის დინამიკა და დნმ კვლევა.",
    items: [
      { id: "passport", label: "პასპორტი", icon: IdCard },
      { id: "weight", label: "წონა", icon: Scale },
      { id: "dna", label: "დნმ", icon: Dna },
    ],
  },
  {
    id: "group-safety",
    icon: ShieldCheck,
    eyebrow: "02",
    title: "უსაფრთხოება",
    description:
      "მიკროჩიპი, SOS ბარათი და საკონტაქტო პირები — ყველაფერი ერთად, საგანგებო სიტუაციისთვის.",
    items: [
      { id: "microchip", label: "მიკროჩიპი და SOS", icon: ScanLine },
      { id: "vet", label: "ვეტერინარი", icon: Stethoscope },
      { id: "caretaker", label: "მომვლელი", icon: NotebookPen },
    ],
  },
  {
    id: "group-health",
    icon: Activity,
    eyebrow: "03",
    title: "ჯანმრთელობის მონიტორინგი",
    description:
      "ვაქცინები, ალერგიები, ლაბორატორიული მაჩვენებლები, ვიზიტები და დოკუმენტები.",
    items: [
      { id: "vaccines", label: "ვაქცინაცია", icon: Syringe },
      { id: "allergies", label: "ალერგიები", icon: AlertTriangle },
      { id: "hydration", label: "წყალი/ტუალეტი", icon: Droplets },
      { id: "lab-metrics", label: "ლაბ. მაჩვენებლები", icon: FlaskConical },
      { id: "vet-visits", label: "ვიზიტები", icon: ClipboardList },
      { id: "vault", label: "დოკუმენტები", icon: FolderLock },
      { id: "ai", label: "AylopetAI", icon: Sparkles },
    ],
  },
  {
    id: "group-lifestyle",
    icon: UtensilsCrossed,
    eyebrow: "04",
    title: "ცხოვრების წესი",
    description: "კვება და ყოველდღიური აქტივობა.",
    items: [
      { id: "nutrition", label: "კვება", icon: UtensilsCrossed },
      { id: "collar", label: "საყელო", icon: Radio },
    ],
  },
] as const;

function SectionNav() {
  return (
    // Deliberately not sticky: GlobalHeader is `sticky top-0` and retracts on
    // scroll, so any fixed offset here would either overlap it or leave a gap.
    <nav
      aria-label="სექციები"
      className="-mx-5 mb-6 border-b border-[#eceae5] px-5 pb-5 sm:-mx-8 sm:px-8"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SECTION_GROUPS.map((group) => (
          <div
            key={group.id}
            className="rounded-2xl border border-[#eceae5] bg-[#FAFAF8]/70 p-3.5"
          >
            <a
              href={`#${group.id}`}
              className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-[var(--brand-primary)]"
            >
              <group.icon className="h-3.5 w-3.5" />
              {group.title}
            </a>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium whitespace-nowrap text-slate-500 transition-colors hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)]"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

export function PetHistoryDashboard({ pet }: { pet: Pet }) {
  const telemetry = useMemo(() => getPetTelemetry(pet), [pet]);
  const [profileGroup, safetyGroup, healthGroup, lifestyleGroup] = SECTION_GROUPS;

  return (
    <div className="flex flex-col">
      <SectionNav />

      <div className="flex flex-col gap-5">
        <GroupSection
          id={profileGroup.id}
          icon={profileGroup.icon}
          eyebrow={profileGroup.eyebrow}
          title={profileGroup.title}
          description={profileGroup.description}
          defaultOpen
        >
          <IdentityPassport pet={pet} />
          <DnaPanel pet={pet} dna={telemetry.dna} />
        </GroupSection>

        <GroupSection
          id={safetyGroup.id}
          icon={safetyGroup.icon}
          eyebrow={safetyGroup.eyebrow}
          title={safetyGroup.title}
          description={safetyGroup.description}
        >
          <MicrochipSosCard pet={pet} />
          <ContactsPanel pet={pet} />
        </GroupSection>

        <GroupSection
          id={healthGroup.id}
          icon={healthGroup.icon}
          eyebrow={healthGroup.eyebrow}
          title={healthGroup.title}
          description={healthGroup.description}
        >
          <MedicalHistoryPanel pet={pet} />
          <HydrationPanel pet={pet} />
          <LabMetricsPanel pet={pet} />
          <VetVisitsPanel pet={pet} />

          {/* The vault is the existing upload surface — drag & drop, PDF/JPEG/PNG,
              10MB cap, progress and preview cards all already live there. */}
          <div id="vault" className="scroll-mt-28">
            <LabResultsUpload pet={pet} />
          </div>

          <AiInsightsPanel
            consultations={telemetry.consultations}
            insights={telemetry.insights}
          />
        </GroupSection>

        <GroupSection
          id={lifestyleGroup.id}
          icon={lifestyleGroup.icon}
          eyebrow={lifestyleGroup.eyebrow}
          title={lifestyleGroup.title}
          description={lifestyleGroup.description}
        >
          <NutritionPanel pet={pet} />
          <CollarPanel collar={telemetry.collar} />
        </GroupSection>
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
