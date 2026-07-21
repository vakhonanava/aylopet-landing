"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  PRODUCT_INTEREST_LABELS,
  PRODUCT_INTEREST_LABELS_EN,
  productInterests,
  type ProductInterest,
} from "@/lib/leads/types";

interface ProductInterestMultiSelectProps {
  value: ProductInterest[];
  onChange: (value: ProductInterest[]) => void;
  locale?: "ka" | "en";
  disabled?: boolean;
}

export function ProductInterestMultiSelect({
  value,
  onChange,
  locale = "ka",
  disabled = false,
}: ProductInterestMultiSelectProps) {
  const labels =
    locale === "ka" ? PRODUCT_INTEREST_LABELS : PRODUCT_INTEREST_LABELS_EN;

  const toggle = (interest: ProductInterest) => {
    onChange(
      value.includes(interest)
        ? value.filter((item) => item !== interest)
        : [...value, interest],
    );
  };

  return (
    <fieldset disabled={disabled}>
      <legend className="text-sm font-semibold text-[var(--text-primary)]">
        {locale === "ka"
          ? "რომელი პროდუქტები გაინტერესებს? *"
          : "Which products are you most excited about? *"}
      </legend>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        {locale === "ka"
          ? "შეგიძლია რამდენიმე პასუხის არჩევა"
          : "Select all that apply"}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {productInterests.map((interest) => {
          const selected = value.includes(interest);

          return (
            <motion.button
              key={interest}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(interest)}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex min-h-14 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/40 disabled:cursor-not-allowed disabled:opacity-60 ${
                selected
                  ? "border-[var(--brand-primary)]/55 bg-gradient-to-br from-[var(--brand-accent-soft)] to-white text-[var(--forest-deep)] shadow-[0_8px_28px_rgba(58,90,64,0.12)]"
                  : "border-[var(--border-light)] bg-white text-[var(--text-secondary)] hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/25 hover:text-[var(--forest-deep)] hover:shadow-soft"
              }`}
            >
              {selected && (
                <motion.span
                  aria-hidden
                  layoutId={`interest-glow-${interest}`}
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(107,143,113,0.18),transparent_52%)]"
                />
              )}
              <span className="relative flex-1">{labels[interest]}</span>
              <span
                aria-hidden
                className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  selected
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                    : "border-[var(--border-light)] bg-white text-transparent group-hover:border-[var(--brand-primary)]/30"
                }`}
              >
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      initial={{ scale: 0, rotate: -25 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 24 }}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}
