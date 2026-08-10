"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Dna, Leaf } from "lucide-react";
import { IMAGES } from "@/lib/images";

const pillars = [
  { icon: Leaf, label: "კვება" },
  { icon: Cpu, label: "ციფრული პროფილი" },
  { icon: Dna, label: "DNA & AI" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-[var(--brand-primary)]/8 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[var(--brand-accent)]/12 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 md:flex-row md:gap-16 lg:px-8">
        <div className="flex w-full flex-col gap-8 md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            {pillars.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-primary)]/[0.06] px-3.5 py-1.5 text-xs font-medium text-[var(--brand-primary)]"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--brand-primary)] sm:text-5xl lg:text-[3.5rem]"
          >
            გაუხანგრძლივე სიცოცხლე შენს საუკეთესო მეგობარს.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="max-w-xl text-lg leading-relaxed text-slate-600"
          >
            Aylopet აერთიანებს ბიოლოგიურად სრულფასოვან კვებას, პერსონალურ ციფრულ
            ასისტენტსა და მომავლის დნმ ტექნოლოგიებს.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/auth/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-8 py-4 text-base font-medium text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] hover:shadow-[0_12px_40px_rgba(58,90,64,0.2)]"
            >
              დაიწყე აქედან
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#ecosystem"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-7 py-4 text-base font-medium text-[var(--brand-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              გაიგე მეტი
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full md:w-1/2"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-[#e5e7eb] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Image
              src={IMAGES.healthDog3D}
              alt="Aylopet, შენი საუკეთესო მეგობარი"
              width={819}
              height={546}
              priority
              className="aspect-[4/3] w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)]/20 to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:-left-6"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
              <Leaf className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--brand-primary)]">Gently Cooked</p>
              <p className="text-xs text-slate-500">ცოცხალი, ბუნებრივი კვება</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
