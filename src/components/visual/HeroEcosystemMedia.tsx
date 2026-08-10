"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, Brain, Dna, MapPin, Salad, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { IMAGES } from "@/lib/images";

const FLOAT = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
};

export function HeroEcosystemMedia() {
  const { locale } = useLocale();
  const ka = locale === "ka";

  return (
    <div className="relative mx-auto aspect-[1.08/1] w-full max-w-[610px] [perspective:1200px]">
      <div
        aria-hidden
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(107,143,113,0.24),rgba(232,190,169,0.12)_42%,transparent_70%)] blur-2xl"
      />

      <motion.div
        initial={false}
        animate={{ opacity: 1, rotateX: 4, rotateY: -4, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-[8%] bottom-[8%] top-[9%] [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 rotate-[-2deg] rounded-[2.25rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(242,238,228,0.74))] shadow-[0_35px_90px_rgba(13,46,39,0.18)] backdrop-blur-xl" />
        <div className="absolute inset-[5%] overflow-hidden rounded-[1.8rem] bg-[var(--forest-deep)] shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(107,143,113,0.35),transparent_40%)]" />
          <div className="relative flex h-full flex-col p-5 sm:p-7">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                Aylopet OS
              </span>
              <span className="flex items-center gap-1.5 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                {ka ? "ცოცხალი პროფილი" : "Live profile"}
              </span>
            </div>

            <div className="mt-auto grid grid-cols-[0.88fr_1.12fr] items-end gap-4">
              <div>
                <div className="relative aspect-[0.82/1] overflow-hidden rounded-[1.35rem] border border-white/15">
                  <Image
                    src={IMAGES.heroDog3D}
                    alt={ka ? "ძაღლის Aylopet პროფილი" : "Dog profile in Aylopet"}
                    fill
                    priority
                    sizes="260px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--forest-deep)] via-[var(--forest-deep)]/70 to-transparent p-4 pt-12 text-white">
                    <p className="font-display text-lg font-semibold">Rocky</p>
                    <p className="text-[10px] text-white/65">
                      {ka ? "ჯანმრთელობის პროფილი" : "Health profile"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pb-1">
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3.5">
                  <div className="flex items-center justify-between">
                    <Brain className="h-4 w-4 text-[var(--terracotta-bright)]" />
                    <span className="text-[9px] uppercase tracking-wider text-white/45">AI</span>
                  </div>
                  <p className="mt-3 text-xl font-bold text-white">1,240 kcal</p>
                  <p className="text-[10px] text-white/55">
                    {ka ? "დღიური ნუტრიცია" : "Daily nutrition"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3">
                    <Dna className="h-3.5 w-3.5 text-cyan-300" />
                    <p className="mt-2 text-sm font-bold text-white">230K+</p>
                    <p className="text-[9px] text-white/45">DNA</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3">
                    <Activity className="h-3.5 w-3.5 text-emerald-300" />
                    <p className="mt-2 text-sm font-bold text-white">Perfect</p>
                    <p className="text-[9px] text-white/45">
                      {ka ? "ფორმა" : "Condition"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        {...FLOAT}
        className="absolute -left-[1%] top-[12%] z-20 w-[38%] rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-[0_18px_45px_rgba(13,46,39,0.16)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
            <Salad className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold text-[var(--forest-deep)]">
              {ka ? "ცოცხალი საკვები" : "Fresh food"}
            </p>
            <p className="text-[9px] text-[var(--text-secondary)]">
              {ka ? "პერსონალური რაციონი" : "Personal ration"}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute -right-[1%] top-[22%] z-20 w-[37%] rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-[0_18px_45px_rgba(13,46,39,0.16)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--terracotta)]/12 text-[var(--terracotta)]">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold text-[var(--forest-deep)]">Aylopet Smart Collar</p>
            <p className="text-[9px] text-[var(--text-secondary)]">
              GPS, {ka ? "აქტივობა" : "activity"}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[2%] right-[10%] z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-[var(--terracotta)] text-white shadow-[0_16px_35px_rgba(198,123,92,0.3)]"
      >
        <Sparkles className="h-5 w-5" />
      </motion.div>
    </div>
  );
}
