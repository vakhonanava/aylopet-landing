"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Accordion } from "@/components/marketing/Accordion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getHomeFaqTeasers } from "@/lib/content/faq";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function HomeFaqSection() {
  const { dict, locale } = useLocale();
  const f = dict.homeFaq;
  const items = getHomeFaqTeasers(locale);

  return (
    <section className="bg-[var(--background-secondary)] py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader eyebrow={f.eyebrow} title={f.title} align="center" />
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8" key={locale}>
            <Accordion items={items} />
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-primary)] hover:underline"
            >
              {f.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
