"use client";

import { motion } from "framer-motion";
import { Scene3D } from "@/components/visual/Scene3D";
import { FoodLayersVisual } from "@/components/visual/FoodLayersVisual";
import { IMAGES } from "@/lib/images";
import { ValueLineIcon } from "@/components/japandi/LineArtIcons";
import { PasteurizationModule } from "@/components/about/PasteurizationModule";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAbout } from "@/lib/content/about";

type Locale = "ka" | "en";

const COPY = {
  ka: {
    eyebrow: "ჩვენი ისტორია",
    headline: "დაფუძნებული რეალურ ისტორიებზე, აგებული მეცნიერებაზე",
    kokoBreed: "პეკინესი",
    kokoStory:
      "კოკოს, ჩვენი პეკინესის, ბრძოლამ მშრალი საკვების მონელებასთან, მუდმივ დისკომფორტთან და ალერგიებთან გვაჩვენა, რომ პატარა ჯიშის ძაღლებისთვის ინდივიდუალური მიდგომა თითქმის არსად მოიძებნება. სწორედ ეს გახდა Aylopet-ის იდეის პირველი ბიძგი.",
    danteBreed: "კანე კორსო",
    danteStory:
      "დანტემ, ჩვენმა კანე კორსომ, მუდმივად მოითხოვა ნამდვილი ხორცი და უარი თქვა დამუშავებულ საკვებზე. მისმა აგრესიული სიმსივნის დიაგნოზმა საბოლოოდ დაგვანახა, რომ კვება, გენეტიკა და ადრეული პრევენცია ერთმანეთისგან განუყოფელია — და გახდა Aylopet-ის ეკოსისტემის შექმნის მთავარი მიზეზი.",
    partnerLabel: "პარტნიორი საწარმო",
    partnerTitle: "Natural Selection · ისრაელი",
    partnerBody:
      "ჩვენი სპეციალიზირებული საწარმოო პარტნიორი ისრაელში მუშაობს კლინიკური დონის სამზარეულოებში, დადასტურებული დაბალტემპერატურული პასტერიზაციის პროტოკოლებით. ყოველი პარტია სრულად თვალსაჩინოა წყაროდან თეფშამდე — შეესაბამება ევროკავშირისა და ისრაელის სურსათის უსაფრთხოების სტანდარტებს.",
  },
  en: {
    eyebrow: "Our story",
    headline: "Built on real stories, grounded in science",
    kokoBreed: "Pekingese",
    kokoStory:
      "Koko, our Pekingese, struggled with digesting dry food, constant discomfort, and allergies. Watching her showed us how hard it is to find truly individual care for small-breed dogs — and planted the first seed of the Aylopet idea.",
    danteBreed: "Cane Corso",
    danteStory:
      "Dante, our Cane Corso, constantly demanded real meat and refused processed food. His diagnosis with an aggressive tumor ultimately showed us that nutrition, genetics, and early prevention can't be separated — and became the reason the Aylopet ecosystem exists.",
    partnerLabel: "Partner facility",
    partnerTitle: "Natural Selection · Israel",
    partnerBody:
      "Our specialized production partner in Israel operates clinical-grade kitchens with validated low-temperature pasteurization protocols. Every batch is traceable from source to bowl · meeting EU and Israeli food safety standards.",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function AboutUsSection() {
  const { locale } = useLocale();
  const c = COPY[locale];
  const { values } = getAbout(locale);

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
            {c.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-[var(--forest-deep)] sm:text-4xl lg:text-5xl"
          >
            {c.headline}
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
            name={locale === "ka" ? "კოკო" : "Koko"}
            breed={c.kokoBreed}
            image={IMAGES.storyPekingese}
            story={c.kokoStory}
          />
          <StoryCard
            name={locale === "ka" ? "დანტე" : "Dante"}
            breed={c.danteBreed}
            image={IMAGES.storyCaneCorso}
            story={c.danteStory}
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={fadeUp}
              className="rounded-2xl border border-[var(--oat-soft)] bg-white p-6"
            >
              <ValueLineIcon type={value.icon} />
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
                {c.partnerLabel}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
                {c.partnerTitle}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75">{c.partnerBody}</p>
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
          <PasteurizationModule locale={locale} />
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
