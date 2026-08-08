"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Brain,
  Dna,
  Hourglass,
  Radio,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DnaHelix3D } from "@/components/visual/DnaHelix3D";
import { FloatingOrb } from "@/components/visual/FloatingOrb";
import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";
import { useTilt } from "@/hooks/useTilt";
import { IMAGES } from "@/lib/images";
import { fadeUp, staggerContainer } from "@/lib/motion";
import type { ProjectPhaseCopy } from "@/lib/i18n/types";

const PHASE_META = [
  {
    icon: UtensilsCrossed,
    visual: "food" as const,
    accent: "from-[var(--terracotta)]/20 via-white to-[var(--brand-accent-soft)]",
    glow: "var(--terracotta)",
  },
  {
    icon: Brain,
    visual: "ai" as const,
    accent: "from-[var(--brand-primary)]/15 via-white to-[var(--brand-accent-soft)]",
    glow: "var(--brand-primary)",
  },
  {
    icon: Radio,
    visual: "collar" as const,
    accent: "from-[var(--terracotta-bright)]/15 via-white to-[var(--brand-accent-soft)]",
    glow: "var(--terracotta-bright)",
  },
  // DNA Lab sits last · the long-term goal at the bottom of the timeline.
  {
    icon: Dna,
    visual: "helix" as const,
    accent: "from-[var(--forest-deep)]/10 via-white to-[var(--status-emerald)]/10",
    glow: "var(--status-emerald)",
  },
] as const;

const REACTION_EMOJI: Record<string, string> = {
  სიხარული: "😊",
  აღფრთოვანება: "🤩",
  "ღრმა მოლოდინი": "✨",
  "გულღვიძი სიამოვნება": "🐾",
  Joy: "😊",
  Excitement: "🤩",
  "Deep anticipation": "✨",
  "Heartwarming delight": "🐾",
};

function statusLabel(
  status: ProjectPhaseCopy["status"],
  copy: { statusLive: string; statusActive: string; statusSoon: string },
) {
  if (status === "live") return copy.statusLive;
  if (status === "active") return copy.statusActive;
  return copy.statusSoon;
}

function statusClass(status: ProjectPhaseCopy["status"]) {
  if (status === "live")
    return "bg-[var(--status-emerald)]/15 text-[var(--status-emerald)] ring-[var(--status-emerald)]/25";
  if (status === "active")
    return "bg-[var(--terracotta)]/15 text-[var(--terracotta)] ring-[var(--terracotta)]/25";
  return "bg-white/90 text-[var(--text-secondary)] ring-[var(--border-light)]";
}

function PhaseVisual({
  visual,
  locale,
}: {
  visual: (typeof PHASE_META)[number]["visual"];
  locale: "ka" | "en";
}) {
  if (visual === "food") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[var(--background-main)]">
        <FoodLayersVisual locale={locale} compact tilt={false} showLabels={false} className="h-full scale-110" />
      </div>
    );
  }
  if (visual === "helix") {
    return (
      <div className="relative h-full w-full bg-[var(--forest-deep)]">
        <DnaHelix3D
          progress={0.38}
          highlightRatio={0.5}
          autoRotate
          variant="dark"
          interactive={false}
          config={{ rungs: 32, radius: 44, spacing: 8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)] via-transparent to-[var(--forest-deep)]/40" />
      </div>
    );
  }
  if (visual === "collar") {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--bone-alabaster)] to-[var(--brand-accent-soft)]">
        <div
          className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[var(--brand-primary)]/30 bg-white shadow-[0_20px_50px_rgba(58,90,64,0.2)]"
          style={{ transform: "translateZ(24px)" }}
        >
          <Radio className="h-10 w-10 text-[var(--brand-primary)]" aria-hidden />
          <span
            aria-hidden
            className="absolute inset-2 rounded-full border border-dashed border-[var(--terracotta)]/40"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-full w-full">
      <Image src={IMAGES.healthDog3D} alt="" fill className="object-cover" sizes="320px" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/70 via-[var(--brand-primary)]/20 to-transparent" />
      <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)] backdrop-blur-sm">
        AI
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  meta,
  index,
  statusCopy,
  locale,
}: {
  phase: ProjectPhaseCopy;
  meta: (typeof PHASE_META)[number];
  index: number;
  statusCopy: { statusLive: string; statusActive: string; statusSoon: string };
  locale: "ka" | "en";
}) {
  const tilt = useTilt(10);
  const Icon = meta.icon;
  const emoji = REACTION_EMOJI[phase.reaction] ?? "💚";

  return (
    <motion.div variants={fadeUp}>
      {/* Status cards, not navigation · they no longer redirect into product
          pages. The header nav still links to every product. */}
      <div className="group block">
        <div className="perspective-[1200px]">
          <div
            ref={tilt.ref}
            style={tilt.style}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={`relative overflow-hidden rounded-[2rem] border border-[var(--border-light)] bg-gradient-to-br ${meta.accent} p-1 shadow-[0_20px_60px_rgba(13,46,39,0.08)] transition-shadow duration-300 group-hover:shadow-[0_28px_70px_rgba(13,46,39,0.12)]`}
          >
            <FloatingOrb
              className="-right-8 -top-8 opacity-60"
              color={meta.glow}
              size="140px"
              delay={index * 0.4}
            />

            <div className="relative rounded-[1.85rem] bg-white/80 p-5 backdrop-blur-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--forest-deep)] font-display text-lg font-bold text-white shadow-lg"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--terracotta)]">
                      {phase.label}
                    </p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${statusClass(phase.status)}`}
                    >
                      {statusLabel(phase.status, statusCopy)}
                    </span>
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--background-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--forest-deep)]"
                  style={{ transform: "translateZ(16px)" }}
                >
                  <span aria-hidden>{emoji}</span>
                  {phase.reaction}
                </span>
              </div>

              <div
                className="relative mt-5 h-36 overflow-hidden rounded-2xl border border-[var(--border-light)] shadow-inner sm:h-40"
                style={{ transform: "translateZ(12px)" }}
              >
                <PhaseVisual visual={meta.visual} locale={locale} />
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-[var(--brand-primary)] shadow-sm backdrop-blur-sm">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-[var(--forest-deep)] sm:text-2xl">
                {phase.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
                {phase.description}
              </p>

              <blockquote className="mt-4 rounded-2xl border border-[var(--border-light)] bg-[var(--background-main)] px-4 py-3">
                <p className="flex items-start gap-2 text-sm italic text-[var(--text-secondary)]">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--terracotta)]" aria-hidden />
                  {phase.reactionNote}
                </p>
              </blockquote>

              {phase.horizonNote ? (
                <p className="mt-4 flex items-start gap-2 rounded-2xl border border-dashed border-[var(--terracotta)]/40 bg-[var(--terracotta)]/5 px-4 py-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                  <Hourglass
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--terracotta)]"
                    aria-hidden
                  />
                  {phase.horizonNote}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectStatusPhases() {
  const { dict, locale } = useLocale();
  const t = dict.projectStatus;

  return (
    <section className="relative mx-auto max-w-4xl px-6 pb-24 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--brand-primary)]/20 to-transparent"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="relative space-y-8"
      >
        {t.phases.map((phase, i) => (
          <PhaseCard
            key={phase.label}
            phase={phase}
            meta={PHASE_META[i] ?? PHASE_META[0]}
            index={i}
            statusCopy={t}
            locale={locale}
          />
        ))}
      </motion.div>
    </section>
  );
}
