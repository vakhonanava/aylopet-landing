"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SAMPLE_STAGES } from "@/lib/dna/mock-data";
import type { SampleStage } from "@/lib/dna/types";
import { motionEase } from "@/lib/motion";

interface SampleTrackerProps {
  activeStage: SampleStage;
}

export function SampleTracker({ activeStage }: SampleTrackerProps) {
  const activeIndex = SAMPLE_STAGES.findIndex((s) => s.id === activeStage);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[560px] items-center justify-between gap-2">
        {SAMPLE_STAGES.map((stage, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div key={stage.id} className="flex flex-1 items-center">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: motionEase }}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                    isComplete
                      ? "border-[var(--sage-herbaceous)] bg-[var(--sage-herbaceous)] text-white"
                      : isActive
                        ? "border-[var(--terracotta)] bg-[var(--terracotta)]/10 text-[var(--terracotta)]"
                        : "border-[var(--oat-soft)] bg-white text-[var(--forest-deep)]/30"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </span>
                <span
                  className={`max-w-[7rem] text-center text-[11px] font-medium leading-tight ${
                    isActive
                      ? "text-[var(--terracotta)]"
                      : isComplete
                        ? "text-[var(--sage-herbaceous)]"
                        : "text-[var(--forest-deep)]/40"
                  }`}
                >
                  {stage.label}
                </span>
              </motion.div>
              {index < SAMPLE_STAGES.length - 1 && (
                <div
                  className={`mx-1 mb-6 h-0.5 flex-1 rounded-full transition-colors duration-500 ${
                    index < activeIndex
                      ? "bg-[var(--sage-herbaceous)]"
                      : "bg-[var(--oat-soft)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
