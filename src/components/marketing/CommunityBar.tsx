"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLiveWaitlistCount } from "@/app/actions/waitlist-count";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { WHATSAPP_GROUP_URL } from "@/lib/constants/marketing";
import { fadeUp } from "@/lib/motion";
import { scrollToWaitlist } from "@/lib/navigation";

const POLL_INTERVAL_MS = 30_000;

/**
 * Waitlist transparency + community entry point for the project status page:
 * the live signup total, a join CTA, and the WhatsApp group invite.
 */
export function CommunityBar({ initialCount }: { initialCount: number }) {
  const { dict } = useLocale();
  const c = dict.community;
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const interval = setInterval(() => {
      void fetchLiveWaitlistCount().then(setCount);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="mx-auto max-w-4xl px-6 pb-12 lg:px-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-organic-xl)] border border-[var(--border-light)] bg-white p-6 text-center shadow-soft sm:p-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
            <Users className="h-5 w-5" aria-hidden />
          </span>
          {/* A bare "0" reads as a dead product · show the invitation instead
              until there is a real number to be transparent about. */}
          {count > 0 ? (
            <>
              <p className="mt-4 font-display text-5xl font-semibold tabular-nums text-[var(--brand-primary)]">
                {count.toLocaleString()}
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                {c.waitlistTotal}
              </p>
            </>
          ) : (
            <p className="mt-4 font-display text-2xl font-semibold text-[var(--brand-primary)]">
              {c.waitlistEmpty}
            </p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            {c.waitlistNote}
          </p>
          <button
            type="button"
            onClick={scrollToWaitlist}
            className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {dict.common.joinWaitlistOffer}
          </button>
        </div>

        <div className="flex flex-col rounded-[var(--radius-organic-xl)] border border-[var(--border-light)] bg-[var(--background-secondary)] p-6 text-center shadow-soft sm:p-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#128C7E]">
            <MessageCircle className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-[var(--forest-deep)]">
            {c.whatsappTitle}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-body)]">
            {c.whatsappBody}
          </p>
          {WHATSAPP_GROUP_URL ? (
            <Link
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {c.whatsappCta}
            </Link>
          ) : (
            <p className="mt-5 rounded-full border border-dashed border-[var(--border-light)] px-6 py-2.5 text-xs font-medium text-[var(--text-secondary)]">
              {c.whatsappSoon}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
}
