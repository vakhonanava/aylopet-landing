"use client";

import { useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Cpu,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Scene3D } from "@/components/visual/Scene3D";
import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";
import { PawDecor } from "@/components/decor/PawDecor";
import { IMAGES } from "@/lib/images";

type Overlay = "food" | "health";

interface ScrollSection {
  icon: LucideIcon;
  tag: string;
  headline: string;
  text: string;
  cta: { label: string; href: string; variant: "primary" | "ghost" };
  overlay: Overlay;
  image?: string;
  imageAlt?: string;
}

const SECTIONS: ScrollSection[] = [
  {
    icon: Leaf,
    tag: "ძირითადი პროდუქტი",
    headline: "ბიოლოგიურად სრულფასოვანი საკვები.",
    text: "Aylopet იწყება უმაღლესი ხარისხის, ნაზად მომზადებული (Gently Cooked) რაციონით. ნამდვილი, ცოცხალი ინგრედიენტები სინთეზური დანამატების გარეშე.",
    cta: { label: "შეუკვეთე საკვები", href: "/products/fresh-food", variant: "primary" },
    overlay: "food",
  },
  {
    icon: Cpu,
    tag: "პერსონალური კაბინეტი",
    headline: "შენი ძაღლის ციფრული პროფილი.",
    text: "აკონტროლე ვაქცინები, საკვების მიღება, ხასიათი და დანამატები ერთ ინტელექტუალურ სივრცეში. მიიღე AI რეკომენდაციები.",
    cta: { label: "შექმენი პროფილი", href: "/early-access", variant: "primary" },
    image: IMAGES.healthDog3D,
    imageAlt: "Aylopet · ძაღლის ციფრული ჯანმრთელობის პროფილი",
    overlay: "health",
  },
];

function FoodVisual({
  sectionRef,
  isActive,
  mobile,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  isActive: boolean;
  mobile?: boolean;
}) {
  const { locale } = useLocale();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.75", "end 0.25"],
  });
  const scrollBoost = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.65, 0.15]);

  if (mobile) {
    return (
      <FoodLayersVisual
        locale={locale}
        compact
        tilt={false}
        showLabels={false}
        play={isActive}
        className="mx-auto w-full max-w-[300px]"
      />
    );
  }

  return (
    <FoodLayersVisual
      locale={locale}
      scrollBoost={scrollBoost}
      fill
      tilt
      showLabels
      play={isActive}
      className="h-full w-full"
    />
  );
}

function HealthOverlay({ mobile }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <div className="glass absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 shadow-soft">
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-[var(--text-secondary)]">Health Log</p>
          <p className="text-sm font-bold tracking-tight text-[var(--text-primary)]">Perfect</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--brand-primary)]/10">
            <div className="h-full w-[92%] rounded-full bg-[var(--status-emerald)]" />
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-accent)]">
            <Activity className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass absolute bottom-4 right-4 w-[200px] rounded-2xl p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-secondary)]">Health Log</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-accent)]">
          <Activity className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
      <p className="mt-1.5 text-lg font-bold tracking-tight text-[var(--text-primary)]">Perfect</p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--brand-primary)]/10">
        <div className="h-full w-[92%] rounded-full bg-[var(--status-emerald)]" />
      </div>
    </div>
  );
}

function HealthVisual({
  section,
  priority = false,
  mobile,
}: {
  section: ScrollSection;
  priority?: boolean;
  mobile?: boolean;
}) {
  return (
    <div
      className={
        mobile
          ? "w-full"
          : "flex h-full min-h-[280px] w-full items-center justify-center"
      }
    >
      <Scene3D
        src={section.image!}
        alt={section.imageAlt!}
        aspect={mobile ? "landscape" : "portrait"}
        glow="forest"
        priority={priority}
        tilt={!mobile}
        float={!mobile}
        decorative={!mobile}
        sizes={mobile ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
        className={mobile ? "w-full !min-h-0" : "w-full max-w-md"}
        overlay={<HealthOverlay mobile={mobile} />}
      />
    </div>
  );
}

const ctaLink =
  "group inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full transition-[transform,box-shadow,background-color] duration-200 ease-out active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] sm:min-h-[44px] sm:w-fit sm:justify-start hover:-translate-y-0.5";

function CtaButton({ cta }: { cta: ScrollSection["cta"] }) {
  if (cta.variant === "ghost") {
    return (
      <Link
        href={cta.href}
        className={`${ctaLink} border border-[var(--border-light)] bg-white px-7 py-3.5 text-base font-medium text-[var(--text-primary)] hover:shadow-soft`}
      >
        {cta.label}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
      </Link>
    );
  }
  return (
    <Link
      href={cta.href}
      className={`${ctaLink} bg-[var(--brand-primary)] px-8 py-3.5 text-base font-medium text-white shadow-soft hover:bg-[var(--brand-primary-hover)] hover:shadow-organic`}
    >
      {cta.label}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

export function StickyScrollytelling() {
  const isMobile = useIsMobile();
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [ref0, ref1], []);
  const active = useActiveSection(refs);

  return (
    <section className="relative bg-[var(--background-main)]">
      <PawDecor density={isMobile ? "light" : "medium"} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            {SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.headline}
                  ref={refs[i]}
                  className="flex flex-col border-b border-[var(--border-light)]/60 py-10 last:border-b-0 sm:py-14 lg:min-h-screen lg:justify-center lg:border-b-0 lg:py-16"
                >
                  <div className="mb-5 w-full lg:hidden">
                    {section.overlay === "food" ? (
                      <FoodVisual sectionRef={refs[i]} isActive mobile />
                    ) : (
                      <HealthVisual section={section} priority mobile />
                    )}
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--brand-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--brand-primary)] sm:px-4 sm:py-1.5 sm:text-sm">
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {section.tag}
                  </span>

                  <h2 className="mt-4 max-w-md font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[var(--forest-deep)] sm:mt-6 sm:text-4xl sm:leading-[1.12] lg:text-5xl">
                    {section.headline}
                  </h2>

                  <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--text-body)] sm:mt-5 sm:text-lg">
                    {section.text}
                  </p>

                  <div className="mt-6 sm:mt-8">
                    <CtaButton cta={section.cta} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-36 h-[min(80vh,720px)] min-h-[480px] w-full">
              <div className="grid h-full w-full grid-cols-1 grid-rows-1">
                <div
                  className={`col-start-1 row-start-1 h-full w-full min-h-[480px] transition-opacity duration-500 ease-out ${
                    active === 0
                      ? "z-10 opacity-100"
                      : "pointer-events-none z-0 opacity-0"
                  }`}
                  aria-hidden={active !== 0}
                >
                  <FoodVisual sectionRef={ref0} isActive={active === 0} />
                </div>
                <div
                  className={`col-start-1 row-start-1 h-full w-full min-h-[480px] transition-opacity duration-500 ease-out ${
                    active === 1
                      ? "z-10 opacity-100"
                      : "pointer-events-none z-0 opacity-0"
                  }`}
                  aria-hidden={active !== 1}
                >
                  <HealthVisual section={SECTIONS[1]} priority />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
