"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ClipboardList,
  Dna,
  FileText,
  Microscope,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { scrollToWaitlist } from "@/lib/navigation";

const STEP_ICONS = [ClipboardList, Dna, Brain, Microscope, FileText] as const;
const STEP_NUMBERS = ["01", "02", "03", "04", "05"] as const;

export function DnaUnifiedPlatform() {
  const { dict } = useLocale();
  const t = dict.landing.dnaUnified;

  return (
    <section className="border-t border-[var(--border-light)] bg-[var(--bone-alabaster)] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--forest-deep)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--forest-deep)] sm:text-4xl">
              {t.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-body)] sm:text-lg">
              {t.intro}
            </p>
          </div>
        </RevealOnScroll>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-6 top-0 hidden h-full w-px bg-[var(--border-light)] sm:block lg:left-1/2"
          />
          <div className="space-y-8">
            {t.steps.map((item, i) => {
              const Icon = STEP_ICONS[i] ?? FileText;
              const step = STEP_NUMBERS[i] ?? String(i + 1).padStart(2, "0");
              const alignRight = i % 2 === 1;
              return (
                <RevealOnScroll key={step} delay={i * 0.05}>
                  <motion.article
                    className={`relative grid gap-6 sm:grid-cols-2 sm:gap-10 ${
                      alignRight ? "lg:[&>div:first-child]:order-2" : ""
                    }`}
                  >
                    <div
                      className={`${alignRight ? "lg:text-right" : ""} flex flex-col justify-center`}
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
                        {t.stepLabel} {step}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-semibold text-[var(--forest-deep)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
                        {item.body}
                      </p>
                    </div>
                    <div
                      className={`flex items-center ${alignRight ? "lg:justify-start" : "lg:justify-end"}`}
                    >
                      <div className="flex w-full max-w-sm items-start gap-4 rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-soft">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                          <Icon className="h-6 w-6" />
                        </span>
                        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                          {t.backendNote}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>

        <RevealOnScroll className="mt-14 text-center">
          <div className="mx-auto max-w-xl rounded-2xl border border-[var(--brand-primary)]/20 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
              {t.readyTitle}
            </p>
            <p className="mt-2 text-[var(--text-body)]">{t.readyBody}</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToWaitlist}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--terracotta)] px-6 py-3 text-sm font-semibold text-white"
              >
                {t.joinWaitlist}
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/products/aylopet-ai#chat"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[var(--border-light)] px-6 py-3 text-sm font-semibold text-[var(--brand-primary)]"
              >
                {t.tryAssistant}
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
