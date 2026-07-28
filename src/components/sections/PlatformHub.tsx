"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Dna, MessageCircle, User } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DnaHelix3D } from "@/components/visual/DnaHelix3D";
import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";
import { PawDecor } from "@/components/decor/PawDecor";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { IMAGES } from "@/lib/images";
import type { LucideIcon } from "lucide-react";

const FEATURE_META = [
  { href: "/onboarding/platform", icon: User, visual: "dog" as const },
  { href: "/products/aylopet-ai#chat", icon: MessageCircle, visual: "dog" as const },
  { href: "/dna-journey", icon: Dna, visual: "helix" as const },
  { href: "/b2b", icon: Building2, visual: "food" as const },
] satisfies { href: string; icon: LucideIcon; visual: "dog" | "food" | "helix" }[];

function statusLabel(
  status: "live" | "waitlist" | "soon",
  copy: { statusLive: string; statusWaitlist: string; statusSoon: string },
) {
  if (status === "live") return copy.statusLive;
  if (status === "waitlist") return copy.statusWaitlist;
  return copy.statusSoon;
}

function statusClass(status: "live" | "waitlist" | "soon") {
  if (status === "live")
    return "bg-[var(--status-emerald)]/15 text-[var(--status-emerald)]";
  if (status === "waitlist")
    return "bg-[var(--terracotta)]/15 text-[var(--terracotta)]";
  return "bg-white/90 text-[var(--forest-deep)]";
}

const cardLinkClass =
  "group card-hover block overflow-hidden rounded-[var(--radius-organic-lg)] border border-[var(--border-light)] bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]";

export function PlatformHub({ variant = "full" }: { variant?: "full" | "home" }) {
  const { dict, locale } = useLocale();
  const { platformHub: copy } = dict;
  const isHome = variant === "home";
  const features = isHome ? copy.features.slice(0, 2) : copy.features;
  const meta = isHome ? FEATURE_META.slice(0, 2) : FEATURE_META;

  return (
    <section id="platform" className="relative overflow-hidden bg-[var(--bone-alabaster)] py-16 sm:py-20 lg:py-24">
      <PawDecor density="light" />
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp} className="mx-auto">
            <SectionHeader
              eyebrow={copy.eyebrow}
              title={isHome ? copy.homeTitle : copy.title}
              description={isHome ? copy.homeDescription : copy.description}
              align="center"
              className="sm:text-left"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className={`mt-12 grid gap-6 ${isHome ? "sm:grid-cols-2 lg:max-w-3xl lg:mx-auto" : "sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"}`}
          >
            {meta.map((metaItem, i) => {
              const feature = features[i];
              const accent =
                metaItem.visual === "helix"
                  ? "bg-[var(--status-emerald)]/15 text-[var(--status-emerald)]"
                  : metaItem.visual === "food"
                    ? "bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]"
                    : "bg-[var(--terracotta-bright)]/10 text-[var(--terracotta-bright)]";

              return (
                <Link key={metaItem.href} href={metaItem.href} className={cardLinkClass}>
                  <div className="relative h-40 overflow-hidden">
                    {metaItem.visual === "helix" ? (
                      <div className="absolute inset-0 bg-[var(--forest-deep)]">
                        <DnaHelix3D
                          progress={0.42}
                          highlightRatio={0.55}
                          autoRotate
                          variant="dark"
                          interactive={false}
                          config={{ rungs: 40, radius: 52, spacing: 9 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)] via-transparent to-[var(--forest-deep)]/30" />
                      </div>
                    ) : metaItem.visual === "food" ? (
                      <div className="absolute inset-0 bg-[var(--background-main)]">
                        <FoodLayersVisual
                          locale={locale}
                          compact
                          tilt={false}
                          showLabels={false}
                          className="h-full scale-110"
                        />
                      </div>
                    ) : (
                      <>
                        <Image
                          src={i === 0 ? IMAGES.earlyAccess3D : IMAGES.healthDog3D}
                          alt=""
                          fill
                          sizes="280px"
                          className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/75 via-[var(--forest-deep)]/25 to-transparent" />
                      </>
                    )}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClass(feature.status)}`}
                    >
                      {statusLabel(feature.status, copy)}
                    </span>
                    <span
                      className={`absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm backdrop-blur-sm ${accent}`}
                    >
                      <metaItem.icon className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--terracotta)]">
                      {feature.label}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-semibold text-[var(--forest-deep)]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {feature.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-[gap] duration-200 group-hover:gap-2">
                      {feature.open}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
