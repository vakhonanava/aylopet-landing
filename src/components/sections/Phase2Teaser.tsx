"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Dna, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { IMAGES } from "@/lib/images";

const markers = [
  { label: "Breed", value: "Weimaraner 98.2%" },
  { label: "Metabolism", value: "Fast oxidizer" },
  { label: "Allergens", value: "0 detected" },
];

export function Phase2Teaser() {
  return (
    <section id="future" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <RevealOnScroll className="mb-12 text-center">
          <span className="mb-5 inline-block rounded-full bg-[var(--brand-primary)]/10 px-4 py-1 text-sm font-medium text-[var(--brand-primary)]">
            ეტაპი 2 | მალე
          </span>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight text-[var(--brand-primary)] sm:text-4xl lg:text-5xl">
            მეტი წელი, მეტი სიყვარული. მართული დნმ-ითა და AI-ით.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--text-body)]">
            შეისწავლე შენი ძაღლის დნმ და მართე მისი მომავალი
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="grid items-center gap-8 rounded-[2rem] border border-[#e5e7eb] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:grid-cols-2 lg:gap-12 lg:p-10">
            {/* Visual · Weimaraner with glass AI overlay */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <Image
                  src={IMAGES.healthDog3D}
                  alt="Aylopet DNA & AI"
                  width={819}
                  height={546}
                  className="aspect-[4/5] w-full object-cover object-[center_25%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)]/20 to-transparent" />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="glass absolute -bottom-5 -left-3 w-[70%] rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:-left-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                    AI parsing genome
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--brand-accent)]" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--brand-accent)]">
                      soon
                    </span>
                  </span>
                </div>

                <div className="space-y-2">
                  {markers.map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
                      className="flex items-center justify-between rounded-xl bg-white/50 px-3 py-2 text-xs"
                    >
                      <span className="text-slate-400">{m.label}</span>
                      <span className="font-semibold text-slate-700">
                        {m.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-6 lg:pl-4">
              <div className="flex gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/[0.06] text-[var(--brand-primary)]">
                  <Dna className="h-6 w-6" />
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/[0.06] text-[var(--brand-primary)]">
                  <Cpu className="h-6 w-6" />
                </span>
              </div>

              <div className="space-y-4 text-lg leading-[1.75] text-slate-600">
                <p>შეისწავლე შენი ოთხფეხა მეგობრის გენეტიკური პროფილი.</p>
                <p>აარიდე თავი ფარულ რისკებს, ჯერ კიდევ სიმპტომებამდე.</p>
                <p>შექმენი მასზე იდეალურად მორგებული რაციონი.</p>
              </div>

              <Link
                href="/dna-journey"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-7 py-3.5 text-base font-medium text-[var(--brand-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                გაიგე მეტი DNA & AI-ზე
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
