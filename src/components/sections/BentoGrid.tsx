"use client";

import { FlaskConical, Heart, Thermometer, Zap } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CONTENT } from "@/lib/constants";

const cardBase =
  "rounded-[2rem] border border-[#e5e7eb] bg-white p-8 shadow-soft transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:scale-[1.01] hover:bg-[#FAFAF8] hover:shadow-diffuse";

export function BentoGrid() {
  return (
    <section id="science" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <RevealOnScroll className="mb-14 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary-hover)]">
            მეცნიერება
          </span>
          <h2 className="text-3xl font-semibold tracking-[-0.01em] text-[var(--brand-primary-hover)] sm:text-4xl">
            ინოვაცია, რომელიც ცვლის ყველაფერს
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2">
          <RevealOnScroll
            delay={0.1}
            className={`${cardBase} md:col-span-2 md:row-span-2 md:p-10`}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ece7] text-[var(--brand-primary-hover)]">
              <FlaskConical className="h-6 w-6" />
            </div>
            <h3 className="mb-4 text-2xl font-semibold tracking-tight text-[var(--brand-primary-hover)] sm:text-3xl">
              {CONTENT.bento.card1.title}
            </h3>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              {CONTENT.bento.card1.text}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["75°C", "78°C", "80°C"].map((temp) => (
                <span
                  key={temp}
                  className="rounded-full border border-[#d6e1db] bg-[#e3ece7]/80 px-4 py-1.5 text-sm font-semibold text-[var(--brand-primary-hover)]"
                >
                  {temp}
                </span>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2} className={`${cardBase} md:col-span-2`}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ece7] text-[var(--brand-accent)]">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold tracking-tight text-[var(--brand-primary-hover)]">
              {CONTENT.bento.card2.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {CONTENT.bento.card2.text}
            </p>
          </RevealOnScroll>

          <RevealOnScroll
            delay={0.3}
            className={`${cardBase} flex flex-col justify-between`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ece7] text-[var(--brand-primary-hover)]">
              <Thermometer className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-[var(--brand-primary-hover)]">70 to 75°</p>
              <p className="mt-1 text-sm text-slate-500">
                ოპტიმალური ტემპერატურა
              </p>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#e3ece7]">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[var(--brand-primary-hover)] to-[var(--brand-accent)]" />
            </div>
          </RevealOnScroll>

          <RevealOnScroll
            delay={0.35}
            className="flex items-center gap-4 rounded-[2rem] border border-[var(--brand-primary-hover)]/30 bg-gradient-to-br from-[var(--brand-primary-hover)] to-[#143a2e] p-8 shadow-soft transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:scale-[1.01] hover:shadow-diffuse"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">0%</p>
              <p className="text-sm text-[#d3e0da]">ხელოვნური დანამატები</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
