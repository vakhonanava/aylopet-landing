"use client";

import { motion } from "framer-motion";
import { Award, Brain, Cpu, Dna } from "lucide-react";
import { PawDecor } from "@/components/decor/PawDecor";
import { fadeUp, staggerContainer } from "@/lib/motion";

const TRUST_ITEMS = [
  {
    icon: Brain,
    label: "AI Engine",
    detail: "პერსონალური MER/RER და ინსაითები",
  },
  {
    icon: Dna,
    label: "230K+ Markers",
    detail: "გენომური ანალიზის სიღრმე",
  },
  {
    icon: Cpu,
    label: "Live Dashboard",
    detail: "ციფრული პეტ პროფილი რეალურ დროში",
  },
  {
    icon: Award,
    label: "Ambassador",
    detail: "40% OFF · Waitlist უპირატესობა",
  },
] as const;

export function TrustBar() {
  return (
    <section
      aria-label="Trust indicators"
      className="relative overflow-hidden border-y border-[var(--border-light)] bg-[var(--bone-alabaster)] py-8 sm:py-10"
    >
      <PawDecor density="trail" />
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {TRUST_ITEMS.map((item) => (
            <motion.li
              key={item.label}
              variants={fadeUp}
              className="flex items-start gap-4"
            >
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-organic-md)] bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]"
              >
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-display text-base font-semibold text-[var(--forest-deep)]">
                  {item.label}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {item.detail}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
