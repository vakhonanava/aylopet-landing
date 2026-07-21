"use client";

import { Activity, Brain, Dna, ShieldCheck } from "lucide-react";
import { DnaStrand } from "@/components/dna/DnaStrand";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { DNA } from "@/lib/constants";

const cardBase =
  "rounded-[2rem] border border-[var(--border-light)] bg-white p-8 shadow-soft transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:scale-[1.01] hover:bg-[var(--background-main)] hover:shadow-diffuse";

export function DnaBento() {
  const { bento } = DNA;

  return (
    <section id="science" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <RevealOnScroll className="mb-14 max-w-2xl">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
            {bento.eyebrow}
          </span>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[var(--brand-primary)] sm:text-4xl">
            {bento.heading}
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2">
          {/* Big data-viz card: DNA dissolving into data */}
          <RevealOnScroll
            delay={0.1}
            className={`${cardBase} relative overflow-hidden md:col-span-2 md:row-span-2 md:p-10`}
          >
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ece7] text-[var(--brand-primary)]">
                <Dna className="h-6 w-6" />
              </div>
              <p className="text-5xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-6xl">
                {bento.markersTitle}
              </p>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-[var(--text-secondary)]">
                {bento.markersText}
              </p>
            </div>
            <DnaStrand
              className="pointer-events-none absolute -right-6 bottom-0 h-[90%] w-auto opacity-90"
              rungs={20}
            />
            <div className="pointer-events-none absolute -right-10 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[var(--brand-accent)]/20 blur-3xl" />
          </RevealOnScroll>

          {/* AI Health Engine */}
          <RevealOnScroll delay={0.2} className={`${cardBase} md:col-span-2`}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ece7] text-[var(--brand-primary)]">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold tracking-tight text-[var(--brand-primary)]">
              {bento.aiTitle}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {bento.aiText}
            </p>
          </RevealOnScroll>

          {/* Breeds */}
          <RevealOnScroll
            delay={0.3}
            className={`${cardBase} flex flex-col justify-between`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ece7] text-[var(--brand-accent)]">
              <Activity className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-[var(--brand-primary)]">
                {bento.breedsValue}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{bento.breedsLabel}</p>
            </div>
          </RevealOnScroll>

          {/* Accuracy */}
          <RevealOnScroll
            delay={0.35}
            className={`${cardBase} flex flex-col justify-between`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ece7] text-[var(--brand-primary)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-[var(--brand-primary)]">
                {bento.accuracyValue}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {bento.accuracyLabel}
              </p>
            </div>
          </RevealOnScroll>

          {/* Allergen + clean · wide accent card */}
          <RevealOnScroll
            delay={0.4}
            className="flex flex-col justify-between gap-6 rounded-[2rem] border border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-hover)] p-8 shadow-soft transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:scale-[1.01] hover:shadow-diffuse sm:flex-row sm:items-center md:col-span-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {bento.allergyTitle}
                </h3>
                <p className="mt-1 max-w-md text-sm text-[#d3e0da]">
                  {bento.allergyText}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <span className="text-3xl font-bold text-white">0</span>
              <span className="text-sm leading-tight text-[#d3e0da]">
                {bento.cleanLabel}
              </span>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
