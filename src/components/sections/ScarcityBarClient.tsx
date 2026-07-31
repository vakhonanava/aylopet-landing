"use client";

import { motion } from "framer-motion";
import { Clock, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLiveWaitlistCount } from "@/app/actions/waitlist-count";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { fadeUp } from "@/lib/motion";

const POLL_INTERVAL_MS = 20_000;

interface ScarcityBarClientProps {
  initialCount: number;
  cap: number;
}

export function ScarcityBarClient({ initialCount, cap }: ScarcityBarClientProps) {
  const { dict } = useLocale();
  const s = dict.scarcity;
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const interval = setInterval(() => {
      void fetchLiveWaitlistCount().then(setCount);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const displayCount = Math.min(Math.max(count, 1), cap - 1);
  const pct = Math.round((displayCount / cap) * 100);
  const filledText = s.filled
    .replace("{count}", String(displayCount))
    .replace("{cap}", String(cap));

  return (
    <section
      aria-label={s.urgency}
      className="border-b border-[var(--border-light)] bg-white/90 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-semibold text-[var(--forest-deep)]">{filledText}</span>
              <span className="hidden h-4 w-px bg-[var(--border-light)] sm:inline" aria-hidden />
              <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
                <Lock className="h-3.5 w-3.5 text-[var(--brand-primary)]" aria-hidden />
                {s.priceLocked}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-[var(--background-secondary)]"
              role="progressbar"
              aria-valuenow={displayCount}
              aria-valuemin={0}
              aria-valuemax={cap}
              aria-label={filledText}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--terracotta)] to-[var(--brand-primary)] transition-[width] duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <p className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--terracotta)]">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {s.urgency}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
