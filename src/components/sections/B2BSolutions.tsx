"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, Handshake, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function B2BSolutions() {
  const { dict } = useLocale();
  const t = dict.landing.b2b;

  const highlights = [
    { icon: Building2, title: t.vetTitle, description: t.vetDescription },
    { icon: Handshake, title: t.corporateTitle, description: t.corporateDescription },
  ];

  return (
    <section id="b2b" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={t.eyebrow}
              title={t.title}
              description={t.description}
              align="center"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 grid gap-6 sm:grid-cols-2"
          >
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-[var(--radius-organic-lg)] border border-[var(--border-light)] bg-[var(--background-main)] p-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-[var(--forest-deep)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex justify-center">
            <Link
              href="/b2b"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--brand-primary)] px-8 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              {t.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
