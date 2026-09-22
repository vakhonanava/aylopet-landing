export interface WhyFreshFact {
  title: string;
  body: string;
  cta: string;
  /** Empty until a real study link exists · the card hides the CTA meanwhile. */
  ctaHref: string;
}

export interface WhyFreshCopy {
  title: string;
  philosophy: string;
  lifespanLabel: string;
  moistureLabel: string;
  facts: [WhyFreshFact, WhyFreshFact];
}

const WHY_FRESH_KA: WhyFreshCopy = {
  title: "რატომ არის ცოცხალი კვება გადამწყვეტი?",
  philosophy:
    "Aylopet-ის ფილოსოფია მარტივია და მეცნიერულად დასაბუთებულია: დაბალანსირებული, ცოცხალი კვება (რომელიც თავისი თვისებებით საუკეთესო სახლში მომზადებულ რაციონს უტოლდება) პირდაპირ კავშირშია უფრო ხანგრძლივ და ენერგიულ სიცოცხლესთან.",
  lifespanLabel: "სიცოცხლის ხანგრძლივობის ზრდა",
  moistureLabel: "ტენი",
  facts: [
    {
      title: "სიცოცხლის ხანგრძლივობის ზრდა (+32%)",
      body: "2003 წელს ჩატარებულმა მასშტაბურმა კვლევამ (Lippert & Sapy), რომელიც 537 ძაღლის მონაცემებს ეყრდნობოდა, აჩვენა, რომ ძაღლები, რომლებიც ნატურალური, მინიმალურად დამუშავებული საკვებით იკვებებოდნენ, საშუალოდ 32 თვის (თითქმის 3 წლის) მეტხანს ცოცხლობდნენ, ვიდრე ისინი, ვინც ინდუსტრიულად დამუშავებულ მშრალ საკვებს იღებდნენ.",
      cta: "კვლევის ნახვა (PDF)",
      ctaHref: "",
    },
    {
      title: "გაუმჯობესებული იმუნიტეტი და მონელება",
      body: "The Farmer's Dog-ისა და დამოუკიდებელი მკვლევარების მიერ ჩატარებულმა კვლევებმა დაადასტურა, რომ ნატურალური ინგრედიენტებით კვება აუმჯობესებს ჰიდრატაციას, ხელს უწყობს ჯანსაღ მონელებას, აძლიერებს იმუნურ პასუხს და უზრუნველყოფს ენერგიის უფრო სტაბილურ დონეს.",
      cta: "კვლევის ნახვა",
      ctaHref: "",
    },
  ],
};

const WHY_FRESH_EN: WhyFreshCopy = {
  title: "Why does fresh food matter so much?",
  philosophy:
    "Aylopet's philosophy is simple and backed by science: a balanced fresh diet (one that matches the best home-cooked meals in quality) is directly linked to a longer, more energetic life.",
  lifespanLabel: "longer lifespan",
  moistureLabel: "moisture",
  facts: [
    {
      title: "A longer lifespan (+32%)",
      body: "A large 2003 study (Lippert & Sapy) based on data from 537 dogs found that dogs fed natural, minimally processed food lived on average 32 months (almost 3 years) longer than dogs fed industrially processed dry food.",
      cta: "View the study (PDF)",
      ctaHref: "",
    },
    {
      title: "Better immunity and digestion",
      body: "Studies by The Farmer's Dog and independent researchers have confirmed that feeding natural ingredients improves hydration, supports healthy digestion, strengthens the immune response and keeps energy levels more stable.",
      cta: "View the study",
      ctaHref: "",
    },
  ],
};

/** Georgian copy · server metadata cannot read the client-side locale. */
export const WHY_FRESH = WHY_FRESH_KA;

export function getWhyFresh(locale: "ka" | "en"): WhyFreshCopy {
  return locale === "ka" ? WHY_FRESH_KA : WHY_FRESH_EN;
}
