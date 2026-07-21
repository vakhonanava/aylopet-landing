import type { Metadata } from "next";
import { EarlyAdopterForm } from "@/components/early-access/EarlyAdopterForm";
import { PawDecor } from "@/components/decor/PawDecor";
import { Scene3D } from "@/components/visual/Scene3D";
import { getLeadCount } from "@/lib/leads/repository";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Aylopet · Early Adopter რეგისტრაცია",
  description:
    "შემოუერთდი Aylopet early adopter პროგრამას · 40% ფასდაკლება და უფასო კონსულტაცია.",
};

export default async function EarlyAccessPage() {
  const count = await getLeadCount();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background-main)] px-6 py-12 sm:py-20">
      <PawDecor density="trail" />
      <div className="relative z-[1] mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
            Early Adopter
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            შემოუერთდი პირველ მომხმარებლებს
          </h1>
          <p className="mt-3 max-w-lg text-[var(--text-body)]">
            დატოვე შენი და შენი ძაღლის მონაცემები · ჩვენ დაგიკავშირდებით პირველ
            რიგში, როცა გავუშვებთ მიწოდებას.
          </p>
          {count > 0 && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              უკვე {count} early adopter დარეგისტრირდა
            </p>
          )}

          <div className="mt-8 hidden lg:block">
            <Scene3D
              src={IMAGES.earlyAccess3D}
              alt="Happy dog · Aylopet early adopter"
              aspect="portrait"
              glow="sage"
            />
          </div>
        </div>

        <div id="waitlist" className="scroll-mt-28">
          <EarlyAdopterForm />
        </div>
      </div>
    </main>
  );
}
