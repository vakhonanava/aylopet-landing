"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { fadeUp, staggerContainer } from "@/lib/motion";

/** Replace with your production demo video URL */
const DEMO_VIDEO_EMBED =
  "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0&modestbranding=1";

const COPY = {
  ka: {
    eyebrow: "Product Demo",
    title: "ნახე ტექნოლოგია მოქმედებაში",
    description: "AI ნუტრიცია, გენომური ინსაითები და ციფრული პროფილი, ერთ პლატფორმაზე.",
    playHint: "დააჭირე და ნახე როგორ აერთიანებს Aylopet AI, DNA და პერსონალურ კვებას",
  },
  en: {
    eyebrow: "Product Demo",
    title: "See the technology in action",
    description: "AI nutrition, genomic insights, and a digital profile, all in one platform.",
    playHint: "Tap to see how Aylopet unites AI, DNA, and personalized nutrition",
  },
} as const;

export function TechVideoSection() {
  const { locale } = useLocale();
  const c = COPY[locale];
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-[var(--background-secondary)] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={c.eyebrow}
              title={c.title}
              description={c.description}
              align="center"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-[var(--radius-bento)] border border-[var(--border-light)] bg-[var(--forest-deep)] shadow-organic"
          >
            <div className="relative aspect-video w-full">
              {playing ? (
                <iframe
                  title="Aylopet technology demo"
                  src={DEMO_VIDEO_EMBED}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[var(--forest-deep)] via-[var(--brand-primary)]/40 to-[var(--forest-deep)]"
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      className="group flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white text-[var(--forest-deep)] shadow-lg transition-transform hover:scale-105 active:scale-95"
                      aria-label="Play demo video"
                    >
                      <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
                    </button>
                    <p className="max-w-sm text-sm font-medium text-white/80">
                      {c.playHint}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
