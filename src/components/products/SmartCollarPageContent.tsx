"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BatteryCharging,
  Cpu,
  Droplets,
  MapPin,
  Radio,
  Wifi,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHero } from "@/components/marketing/PageHero";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSmartCollarContent, type CollarFeature } from "@/lib/content/smart-collar";

const FEATURE_ICONS: Record<CollarFeature["icon"], typeof MapPin> = {
  gps: MapPin,
  activity: Activity,
  ai: Cpu,
  waterproof: Droplets,
  battery: BatteryCharging,
  sync: Wifi,
};

export function SmartCollarPageContent() {
  const { dict, locale } = useLocale();
  const copy = getSmartCollarContent(locale);

  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <PageHero
          eyebrow={copy.eyebrow}
          title={copy.title}
          subtitle={copy.subtitle}
          backHref="/"
          backLabel={dict.common.backHome}
        />

        <section className="mx-auto max-w-3xl px-6 pb-4 lg:px-8">
          <RevealOnScroll>
            <div className="rounded-[2rem] border border-[var(--border-light)] bg-white p-8 text-center shadow-soft">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                <Radio className="h-7 w-7" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--terracotta)]">
                {copy.comingSoonBadge}
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-body)]">
                {copy.intro}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/early-access#waitlist"
                  className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-primary-hover)]"
                >
                  {copy.ctaWaitlist}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/faq?category=collar"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-primary)] transition-all duration-300 hover:border-[var(--brand-primary)]/30"
                >
                  {copy.ctaFaq}
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <SectionHeader
            eyebrow={copy.featuresEyebrow}
            title={copy.featuresTitle}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {copy.features.map((feature, i) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <RevealOnScroll key={feature.title} delay={i * 0.05}>
                  <div className="h-full rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-soft transition-colors hover:border-[var(--brand-primary)]/25">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold text-[var(--forest-deep)]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
                      {feature.description}
                    </p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--brand-primary)] py-16 text-white lg:py-24">
          <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
            <SectionHeader
              eyebrow={copy.howEyebrow}
              title={copy.howTitle}
              className="[&_h2]:text-white [&_p]:text-white/80"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {copy.steps.map((step, i) => (
                <RevealOnScroll key={step.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-white/15 bg-white/10 p-6">
                    <span className="font-display text-3xl font-bold text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {step.description}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
          <SectionHeader
            eyebrow={copy.specsEyebrow}
            title={copy.specsTitle}
            align="left"
          />
          <RevealOnScroll>
            <dl className="mt-8 divide-y divide-[var(--border-light)] rounded-2xl border border-[var(--border-light)] bg-white shadow-soft">
              {copy.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <dt className="text-sm font-medium text-[var(--text-secondary)]">
                    {spec.label}
                  </dt>
                  <dd className="text-sm font-semibold text-[var(--forest-deep)]">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-16 lg:px-8">
          <RevealOnScroll>
            <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--oat-soft)] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--terracotta)]">
                {copy.faqEyebrow}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-[var(--forest-deep)]">
                {copy.faqTitle}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-body)]">
                {copy.faqSubtitle}
              </p>
              <Link
                href="/faq?category=collar"
                className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-primary)] px-6 py-3 text-sm font-medium text-[var(--brand-primary)] transition-all duration-300 hover:bg-[var(--brand-primary)] hover:text-white"
              >
                {copy.faqCta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </RevealOnScroll>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24 lg:px-8">
          <RevealOnScroll>
            <div className="rounded-[2rem] border-2 border-[var(--brand-primary)]/15 bg-white p-10 text-center shadow-soft">
              <h3 className="font-display text-2xl font-semibold text-[var(--forest-deep)]">
                {copy.finalCtaTitle}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-body)]">
                {copy.finalCtaBody}
              </p>
              <Link
                href="/early-access#waitlist"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-8 py-4 text-base font-medium text-white transition-all duration-300 hover:bg-[var(--brand-primary-hover)]"
              >
                {copy.finalCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </RevealOnScroll>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
