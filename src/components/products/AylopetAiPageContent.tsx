"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ChatInterface } from "@/components/portal/chat/ChatInterface";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getProducts } from "@/lib/content/products";
import { IMAGES } from "@/lib/images";

const COPY = {
  ka: {
    badge: "პერსონალური ნუტრიციოლოგი · 24/7",
    startChat: "დაიწყე საუბარი AylopetAI-თან",
    joinWaitlist: "შემოუერთდი waitlist-ს",
    chatEyebrow: "ცოცხალი ჩატი",
    chatTitle: "ერთი კითხვა ერთდროულად · პერსონალური გეგმა",
    chatBody:
      "უპასუხე მოკლე კითხვებს ძაღლის ასაკზე, წონაზე, აქტივობასა და ჯანმრთელობაზე. AylopetAI შექმნის ინდივიდუალურ კვების რეკომენდაციას რეალურ დროში.",
    benefits: [
      {
        icon: MessageCircle,
        title: "საუბრობითი კონსულტაცია",
        body: "არა მკაცრი ფორმა · ცოცხალი დიალოგი, რომელიც შენს მონაცემებს ითვალისწინებს.",
      },
      {
        icon: Clock3,
        title: "გეგმა წუთებში",
        body: "პორციები, მაკრონუტრიენტები და FEDIAF სტანდარტებზე დაფუძნებული რჩევა.",
      },
      {
        icon: ShieldCheck,
        title: "უსაფრთხო მიდგომა",
        body: "ალერგიები, მგრძნობელობა და ჯანმრთელობის ისტორია ჩართულია ფორმულაში.",
      },
    ],
  },
  en: {
    badge: "Personal nutritionist · 24/7",
    startChat: "Start chatting with AylopetAI",
    joinWaitlist: "Join the waitlist",
    chatEyebrow: "Live chat",
    chatTitle: "One question at a time · a personalized plan",
    chatBody:
      "Answer short questions about your dog's age, weight, activity, and health. AylopetAI builds an individualized nutrition recommendation in real time.",
    benefits: [
      {
        icon: MessageCircle,
        title: "Conversational guidance",
        body: "Not a rigid form · a living dialogue that uses your dog's real data.",
      },
      {
        icon: Clock3,
        title: "A plan in minutes",
        body: "Portions, macros, and guidance grounded in FEDIAF standards.",
      },
      {
        icon: ShieldCheck,
        title: "Safety first",
        body: "Allergies, sensitivities, and health history shape the formula.",
      },
    ],
  },
} as const;

export function AylopetAiPageContent() {
  const { locale } = useLocale();
  const ai = getProducts(locale).ai;
  const c = COPY[locale];

  return (
    <>
      <main className="flex-1 bg-[var(--background-main)]">
        <section className="relative overflow-hidden pt-20 pb-14 lg:pt-24 lg:pb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(107,143,113,0.16),transparent_34%),radial-gradient(circle_at_12%_8%,rgba(232,190,169,0.14),transparent_28%)]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8">
            <RevealOnScroll y={20}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary)]/15 bg-white/80 px-4 py-1.5 text-sm font-medium text-[var(--brand-primary)] shadow-soft backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                AylopetAI · {c.badge}
              </span>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--forest-deep)] sm:text-5xl">
                {ai.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--text-body)]">
                {ai.body}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {ai.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-soft backdrop-blur-md"
                  >
                    <p className="text-lg font-bold text-[var(--forest-deep)]">
                      {metric.value}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#chat"
                  className="group inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_42px_rgba(58,90,64,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] sm:text-base"
                >
                  {c.startChat}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link
                  href="/early-access#waitlist"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[var(--brand-primary)]/15 bg-white/80 px-7 py-3.5 text-sm font-semibold text-[var(--forest-deep)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/30 sm:text-base"
                >
                  {c.joinWaitlist}
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll y={20} delay={0.08}>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[var(--forest-deep)] p-5 shadow-[0_30px_80px_rgba(13,46,39,0.2)] sm:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(107,143,113,0.35),transparent_40%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between text-white/65">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                      AylopetAI
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      24/7
                    </span>
                  </div>
                  <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/10">
                    <Image
                      src={IMAGES.aiDog}
                      alt=""
                      width={720}
                      height={540}
                      className="h-64 w-full object-cover sm:h-72"
                      priority
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white">
                      <p className="text-2xl font-bold">60s</p>
                      <p className="mt-1 text-xs text-white/55">
                        {locale === "ka" ? "პერსონალური გეგმა" : "Personalized plan"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white">
                      <p className="text-2xl font-bold">FEDIAF</p>
                      <p className="mt-1 text-xs text-white/55">
                        {locale === "ka" ? "სტანდარტები" : "Aligned standards"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section className="border-y border-[var(--border-light)] bg-white/50 py-12">
          <div className="mx-auto grid max-w-6xl gap-4 px-6 sm:grid-cols-3 lg:px-8">
            {c.benefits.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-[var(--border-light)] bg-white/80 p-5 shadow-soft backdrop-blur-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                  <Icon className="h-4 w-4" />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold text-[var(--forest-deep)]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="chat" className="scroll-mt-28 py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--terracotta)]">
                {c.chatEyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--forest-deep)] sm:text-4xl">
                {c.chatTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-body)]">
                {c.chatBody}
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-3xl">
              <ChatInterface />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
