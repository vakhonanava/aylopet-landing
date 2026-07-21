import type { Metadata } from "next";
import { DnaLeafFusion, GeometricPattern } from "@/components/japandi/LineArtIcons";
import { ValueCardsInteractive } from "@/components/japandi/ValueCardsInteractive";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ABOUT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Aylopet · კომპანიის ხედვა",
  description: ABOUT.vision.body.slice(0, 160),
};

export default function VisionPage() {
  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <section className="relative overflow-hidden bg-[var(--background-secondary)] pt-24 pb-16 lg:pt-28">
          <GeometricPattern className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
          <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
            <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
                  {ABOUT.vision.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-body)]">
                  {ABOUT.vision.body}
                </p>
              </div>
              <DnaLeafFusion className="mx-auto h-48 w-48 lg:h-56 lg:w-56" />
            </RevealOnScroll>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            ჩვენი ძირითადი ღირებულებები
          </h2>
        </section>
        <ValueCardsInteractive items={ABOUT.values} />
      </main>
      <SiteFooter />
    </>
  );
}
