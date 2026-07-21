"use client";

import { motion } from "framer-motion";
import { Scene3D } from "@/components/visual/Scene3D";
import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";
import { IMAGES } from "@/lib/images";
import { Heart, Microscope, Sparkles } from "lucide-react";
import { PasteurizationModule } from "@/components/about/PasteurizationModule";
import { fadeUp, staggerContainer } from "@/lib/motion";

const BRAND_VALUES = [
  {
    icon: Sparkles,
    title: "Personalization",
    body: "Every recipe adapts to breed, genetics, allergies, and lifestyle · not one-size-fits-all kibble.",
  },
  {
    icon: Microscope,
    title: "Scientific Transparency",
    body: "We publish our processing temperatures, sourcing standards, and nutritional methodology openly.",
  },
  {
    icon: Heart,
    title: "Unconditional Commitment",
    body: "From Koko's first gentle transition to Dante's structured plan · we stay with you at every stage.",
  },
] as const;

export function AboutUsSection() {
  return (
    <div className="bg-[var(--bone-alabaster)]">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--terracotta)]"
          >
            Our story
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-[var(--forest-deep)] sm:text-4xl lg:text-5xl"
          >
            Born from real dogs, built on real science
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-14 grid gap-8 lg:grid-cols-2"
        >
          <StoryCard
            name="Koko"
            breed="Pekingese"
            image={IMAGES.storyPekingese}
            story="Koko struggled with standard kibble processing · persistent digestive allergies, itchy skin, and food refusal cycles that left her family exhausted. Aylopet's gently-cooked, single-protein turkey formula was designed around her sensitivities and MDR1-aware ingredient filters."
          />
          <StoryCard
            name="Dante"
            breed="Cane Corso"
            image={IMAGES.storyCaneCorso}
            story="Dante's Cane Corso metabolism demanded structured, professional guidance through every nutritional transition. His working-dog energy required precise MER calculations and phased recipe updates · the blueprint our platform was built to deliver."
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {BRAND_VALUES.map((value) => (
            <motion.div
              key={value.title}
              variants={fadeUp}
              className="rounded-2xl border border-[var(--oat-soft)] bg-white p-6"
            >
              <value.icon className="h-6 w-6 text-[var(--terracotta)]" />
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--forest-deep)]">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--forest-deep)]/65">
                {value.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-2xl border border-[var(--oat-soft)] bg-[var(--forest-deep)] text-[var(--bone-alabaster)]"
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-10">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--terracotta)]">
                Partner facility
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
                Natural Selection · Israel
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Our specialized production partner in Israel operates
                clinical-grade kitchens with validated low-temperature
                pasteurization protocols. Every batch is traceable from source
                to bowl · meeting EU and Israeli food safety standards.
              </p>
            </div>
            <div className="relative min-h-[280px] lg:min-h-0">
              <FoodLayersVisual
                compact
                showLabels
                tilt={false}
                className="absolute inset-0 m-4"
              />
            </div>
          </div>
        </motion.div>

        <div className="mt-16">
          <PasteurizationModule />
        </div>
      </section>
    </div>
  );
}

function StoryCard({
  name,
  breed,
  image,
  story,
}: {
  name: string;
  breed: string;
  image: string;
  story: string;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className="overflow-hidden rounded-2xl border border-[var(--oat-soft)] bg-white"
    >
      <div className="p-4 pb-0">
        <Scene3D
          src={image}
          alt={`${name} · ${breed}`}
          aspect="landscape"
          glow="sage"
          tilt
          overlay={
            <div className="absolute bottom-3 left-3 rounded-xl bg-[var(--forest-deep)]/75 px-3 py-2 backdrop-blur-sm">
              <p className="font-display text-lg font-semibold text-white">{name}</p>
              <p className="text-xs text-white/75">{breed}</p>
            </div>
          }
        />
      </div>
      <p className="p-6 text-sm leading-relaxed text-[var(--forest-deep)]/75">
        {story}
      </p>
    </motion.article>
  );
}
