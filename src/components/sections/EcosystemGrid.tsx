"use client";

import Link from "next/link";
import { ArrowUpRight, Bone, Cpu, Dna, HeartPulse, Leaf, Syringe } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";

export function EcosystemGrid() {
  return (
    <section id="ecosystem" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <RevealOnScroll className="mb-12 max-w-2xl">
          <span className="mb-4 inline-block rounded-full bg-[var(--brand-primary)]/[0.06] px-4 py-1.5 text-sm font-medium text-[var(--brand-primary)]">
            ეკოსისტემა
          </span>
          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-[var(--brand-primary)] sm:text-4xl lg:text-5xl">
            ერთი პლატფორმა შენი ძაღლის სრული ჯანმრთელობისთვის.
          </h2>
        </RevealOnScroll>

        <div className="grid gap-5 lg:grid-cols-2 lg:grid-rows-2">
          {/* Card 1 · Large: The Core (Nutrition) */}
          <RevealOnScroll className="lg:row-span-2">
            <Link
              href="/products/fresh-food"
              className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#e5e7eb] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--background-secondary)]">
                <FoodLayersVisual compact showLabels={false} tilt={false} className="h-full scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)]/15 to-transparent" />
                <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--brand-primary)] backdrop-blur-sm">
                  <Leaf className="h-3.5 w-3.5" />
                  ეტაპი 1 · აქტიური
                </span>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)]">
                  Gently Cooked საკვები
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  ნამდვილი, ცოცხალი ინგრედიენტები სინთეზური დანამატების გარეშე.
                  პერსონალიზებული შენი ძაღლის წონისა და აქტივობის მიხედვით.
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-[var(--brand-primary)] transition-all duration-300 group-hover:gap-2.5">
                  სრულად კვებაზე
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </RevealOnScroll>

          {/* Card 2 · Medium: The App (Digital Profile) */}
          <RevealOnScroll delay={0.1}>
            <Link
              href="/auth/register"
              className="group flex h-full flex-col justify-between gap-6 rounded-[2rem] border border-[#e5e7eb] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/[0.06] text-[var(--brand-primary)]">
                  <Cpu className="h-6 w-6" />
                </span>
                <div className="flex gap-2">
                  {[Syringe, Bone, HeartPulse].map((Icon, i) => (
                    <span
                      key={i}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAFAF8] text-[var(--brand-accent)]"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[var(--brand-primary)]">
                  შენი ძაღლის ციფრული პროფილი
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  აკონტროლე ვაქცინები, საკვების მიღება, ხასიათი და დანამატები ერთ
                  ინტელექტუალურ სივრცეში.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-primary)] transition-all duration-300 group-hover:gap-2.5">
                  შექმენი პროფილი
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </RevealOnScroll>

          {/* Card 3 · Medium: The Future (DNA & AI) */}
          <RevealOnScroll delay={0.2}>
            <Link
              href="/dna-journey"
              className="group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[2rem] border border-[var(--brand-primary-hover)]/15 bg-[var(--brand-primary)] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(58,90,64,0.25)]"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[var(--brand-accent)]/30 blur-3xl" />
              </div>
              <div className="relative flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Dna className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  მალე
                </span>
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  DNA &amp; AI ინტელექტი
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  გენეტიკაზე მორგებული რაციონი და დაავადებების პრევენცია ხელოვნური
                  ინტელექტის დახმარებით.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-all duration-300 group-hover:gap-2.5">
                  როგორ მუშაობს
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
