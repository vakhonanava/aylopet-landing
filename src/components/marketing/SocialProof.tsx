"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PawDecor } from "@/components/decor/PawDecor";
import { IMAGES } from "@/lib/images";
import { fadeUp, staggerContainer } from "@/lib/motion";

const TESTIMONIAL_IMAGES = {
  storyPekingese: IMAGES.storyPekingese,
  storyCaneCorso: IMAGES.storyCaneCorso,
  healthDog3D: IMAGES.healthDog3D,
} as const;

export function SocialProof() {
  const { dict } = useLocale();
  const sp = dict.socialProof;

  return (
    <section className="grain-texture relative overflow-hidden bg-[var(--background-secondary)] py-16 sm:py-20 lg:py-24">
      <PawDecor density="light" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[var(--brand-accent)]/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={sp.eyebrow}
              title={sp.title}
              description={sp.description}
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {sp.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-organic-lg)] border border-[var(--border-light)] bg-white px-6 py-5 text-center shadow-soft"
              >
                <p className="font-display text-3xl font-semibold text-[var(--brand-primary)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="mt-12 rounded-[var(--radius-organic-xl)] border border-[var(--border-light)] bg-white p-6 shadow-soft sm:p-8"
          >
            <Quote
              aria-hidden
              className="h-8 w-8 text-[var(--brand-accent)]/40"
              strokeWidth={1.5}
            />
            <p className="mt-4 text-base leading-relaxed text-[var(--text-body)] sm:text-lg">
              &ldquo;{sp.authority.quote}&rdquo;
            </p>
            <footer className="mt-5 flex items-center gap-4 border-t border-[var(--border-light)] pt-5">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[var(--brand-accent-soft)]">
                <Image
                  src={IMAGES.healthDog3D}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <cite className="not-italic">
                <p className="font-semibold text-[var(--forest-deep)]">{sp.authority.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{sp.authority.role}</p>
              </cite>
            </footer>
          </motion.blockquote>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {sp.testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="flex h-full flex-col rounded-[var(--radius-organic-xl)] border border-[var(--border-light)] bg-white p-6 shadow-soft transition-shadow duration-200 hover:shadow-organic"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                    <Image
                      src={TESTIMONIAL_IMAGES[item.imageKey]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.dog}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[var(--trust-gold)] text-[var(--trust-gold)]"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-body)]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </blockquote>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
