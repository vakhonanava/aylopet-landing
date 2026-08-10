"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Dna, Utensils } from "lucide-react";

const MODULES = [
  {
    icon: Brain,
    title: "AylopetAI",
    stat: "MER/RER",
    value: "1,240 kcal",
    trend: "+12% accuracy",
    color: "var(--brand-primary)",
  },
  {
    icon: Dna,
    title: "DNA Insights",
    stat: "Markers",
    value: "200,847",
    trend: "98% mapped",
    color: "var(--status-emerald)",
  },
  {
    icon: Activity,
    title: "Health Log",
    stat: "Score",
    value: "Perfect",
    trend: "7-day streak",
    color: "var(--terracotta)",
  },
  {
    icon: Utensils,
    title: "Fresh Ration",
    stat: "Today",
    value: "320g",
    trend: "On target",
    color: "var(--sage-herbaceous)",
  },
];

export function TechDashboardPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--brand-accent)]/20 via-transparent to-[var(--terracotta)]/10 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-[var(--radius-bento)] border border-[var(--border-light)] bg-[var(--forest-deep)] shadow-[0_32px_80px_rgba(13,46,39,0.25)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-xs font-medium text-white/50">Aylopet OS Live</span>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
          {MODULES.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in srgb, ${mod.color} 25%, transparent)` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: mod.color }} aria-hidden />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                    {mod.stat}
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-white/60">{mod.title}</p>
                <p className="text-xl font-bold tracking-tight text-white">{mod.value}</p>
                <p className="mt-1 text-[11px] font-medium text-emerald-300/80">{mod.trend}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="border-t border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Real-time pet health intelligence</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Synced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
