"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Dna } from "lucide-react";
import type { GeneticMarker, RiskLevel } from "@/lib/dna/types";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface HealthRiskCardProps {
  marker: GeneticMarker;
}

const RISK_STYLES: Record<
  RiskLevel,
  { border: string; badge: string; icon: typeof CheckCircle2 }
> = {
  clear: {
    border: "border-[var(--sage-herbaceous)]/40",
    badge: "bg-[var(--sage-herbaceous)]/12 text-[var(--sage-herbaceous)]",
    icon: CheckCircle2,
  },
  carrier: {
    border: "border-[var(--terracotta)]/35",
    badge: "bg-[var(--terracotta)]/12 text-[var(--terracotta)]",
    icon: Dna,
  },
  elevated: {
    border: "border-amber-400/40",
    badge: "bg-amber-50 text-amber-700",
    icon: AlertTriangle,
  },
};

export function HealthRiskCard({ marker }: HealthRiskCardProps) {
  const style = RISK_STYLES[marker.riskLevel];
  const Icon = style.icon;

  return (
    <motion.article
      variants={fadeUp}
      className={`rounded-2xl border bg-white p-6 shadow-[0_4px_24px_rgba(13,46,39,0.04)] ${style.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--forest-deep)]/45">
            {marker.gene}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold text-[var(--forest-deep)]">
            {marker.name}
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${style.badge}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {marker.riskLevel}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--forest-deep)]/70">
        {marker.description}
      </p>

      <div className="mt-5 rounded-xl border border-[var(--oat-soft)] bg-[var(--oat-soft)]/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sage-herbaceous)]">
          Dietary action
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--forest-deep)]/80">
          {marker.dietaryAction}
        </p>
      </div>
    </motion.article>
  );
}

export function HealthRiskGrid({ markers }: { markers: GeneticMarker[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid gap-5 lg:grid-cols-2"
    >
      {markers.map((marker) => (
        <HealthRiskCard key={marker.id} marker={marker} />
      ))}
    </motion.div>
  );
}
