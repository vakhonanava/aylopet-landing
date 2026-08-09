"use client";

import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { scrollToWaitlist } from "@/lib/navigation";

const ACTIVE_ZONES = [
  { city: "თბილისი", districts: ["ვაკე", "საბურთალო", "ვარკეთილი", "ისანი"], status: "active" as const },
  { city: "ბათუმი", districts: ["ცენტრი"], status: "active" as const },
  { city: "ქუთაისი", districts: ["ცენტრი"], status: "coming" as const },
];

const EXPANSION_CITIES = ["რუსთავი", "გორი", "ზუგდიდი", "ფოთი", "თელავი"];

export function ZonesSection() {
  return (
    <section id="zones" className="relative overflow-hidden bg-[var(--bone-alabaster)] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow="Delivery Zones"
              title="ზონების დამატება"
              description="ვაფართოვებთ მიწოდების ზონებს. დაარეგისტრირე შენი ქალაქი და გახდი პირველი, ვისაც ჩვენ მივაწვდით."
              align="center"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {ACTIVE_ZONES.map((zone) => (
                <div
                  key={zone.city}
                  className="rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-soft"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[var(--brand-primary)]" aria-hidden />
                      <h3 className="font-semibold text-[var(--forest-deep)]">{zone.city}</h3>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        zone.status === "active"
                          ? "bg-[var(--status-emerald)]/15 text-[var(--status-emerald)]"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {zone.status === "active" ? "აქტიური" : "მალე"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {zone.districts.map((d) => (
                      <span
                        key={d}
                        className="rounded-full bg-[var(--background-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-dashed border-[var(--brand-primary)]/30 bg-[var(--brand-accent-soft)]/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white">
                <Plus className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--forest-deep)]">
                დაამატე შენი ზონა
              </h3>
              <p className="mt-2 text-sm text-[var(--text-body)]">
                შენი ქალაქი ჯერ არ არის სიაში? Waitlist-ზე რეგისტრაციით ვიცოდებთ სად
                გჭირდება პირველ რიგში.
              </p>
              <p className="mt-4 text-xs font-medium text-[var(--text-secondary)]">
                მალე: {EXPANSION_CITIES.join(", ")}
              </p>
              <button
                type="button"
                onClick={scrollToWaitlist}
                className="mt-6 w-full cursor-pointer rounded-full bg-[var(--brand-primary)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                ზონის მოთხოვნა
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
