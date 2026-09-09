/**
 * DNA journey page copy · same _KA/_EN + getter pattern as the other content
 * modules. Previously this lived as a Georgian-only `DNA` const in
 * `lib/constants.ts`, which left the page (including the "AI parsing genome"
 * card in the hero) untranslated in both directions.
 */

export interface DnaMarkerCopy {
  label: string;
  value: string;
}

export interface DnaJourneyStep {
  index: string;
  tag: string;
  title: string;
  text: string;
}

export interface DnaCopy {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    cta: string;
    secondaryCta: string;
    /** Heading of the floating "genome parsing" card. */
    parsingLabel: string;
    /** Live-status pill inside that card. */
    liveLabel: string;
    markers: string;
    markerRows: DnaMarkerCopy[];
  };
  journey: {
    eyebrow: string;
    heading: string;
    steps: DnaJourneyStep[];
    /** Overlay badge pinned to the visual for each journey step. */
    badges: string[];
  };
  bento: {
    eyebrow: string;
    heading: string;
    markersTitle: string;
    markersText: string;
    aiTitle: string;
    aiText: string;
    breedsValue: string;
    breedsLabel: string;
    accuracyValue: string;
    accuracyLabel: string;
    allergyTitle: string;
    allergyText: string;
    cleanLabel: string;
  };
  cta: {
    heading: string;
    subheadline: string;
    cta: string;
  };
}

export const DNA_KA: DnaCopy = {
  hero: {
    eyebrow: "DNA × AI × NUTRITION",
    headline: "მეტი წელი, მეტი სიყვარული.\nმართული დნმ-ითა და AI-ით.",
    subheadline:
      "ვშიფრავთ ძაღლის ჯანმრთელობას გენეტიკისა და ხელოვნური ინტელექტის სინთეზით.\n\nგენეტიკური პროფილი ავლენს ფარულ რისკებს ჯერ კიდევ სიმპტომებამდე.\n\nAI კი ამ მონაცემებს აქცევს ყოველდღიურ, პრაქტიკულ რაციონად.",
    cta: "დაიწყე DNA ტესტი",
    secondaryCta: "როგორ მუშაობს",
    parsingLabel: "AI შიფრავს გენომს",
    liveLabel: "ლაივი",
    markers: "230,000+ მარკერი",
    markerRows: [
      { label: "ჯიში", value: "ვაიმარანერი 98.2%" },
      { label: "მეტაბოლიზმი", value: "სწრაფი" },
      { label: "ალერგენები", value: "0 გამოვლენილი" },
    ],
  },
  journey: {
    eyebrow: "როგორ მუშაობს",
    heading: "ხუთი ნაბიჯი გენეტიკიდან ყოველდღიურ ზრუნვამდე",
    badges: [
      "60 წამი, ლოყის ნაცხი",
      "230,000+ მარკერი",
      "რისკების რუკა, პრევენცია",
      "მორგებული ცოცხალი რაციონი",
      "24/7 AI მონიტორინგი",
    ],
    steps: [
      {
        index: "01",
        tag: "ნიმუში და მონაცემები",
        title: "ნიმუშისა და მონაცემების შეგროვება",
        text: "მარტივი ნაცხი (cheek swab) ლოყის შიდა მხრიდან · სულ რაღაც 60 წამში. პარალელურად ვაგროვებთ ვეტ ჩანაწერებს, ლაბორატორიულ ანალიზებსა და ყოველდღიური ქცევის მონაცემებს.",
      },
      {
        index: "02",
        tag: "მარკერების AI ანალიზი",
        title: "230,000+ გენეტიკური მარკერის დეკოდირება",
        text: "ჩვენი ალგორითმი ამუშავებს 230,000-ზე მეტ გენეტიკურ მარკერს · ჯიში, ალერგენები, მეტაბოლიზმი და წამლებზე მგრძნობელობა იშიფრება რეალურ დროში.",
      },
      {
        index: "03",
        tag: "რისკები და პრევენცია",
        title: "რისკების იდენტიფიცირება და პრევენცია",
        text: "გენომი ერწყმის კლინიკურ ისტორიას და ქმნის რისკების რუკას · ფარული მიდრეკილებები ვლინდება ჯერ კიდევ სიმპტომების გამოჩენამდე, პრევენციის კონკრეტულ ნაბიჯებთან ერთად.",
      },
      {
        index: "04",
        tag: "მორგებული ცოცხალი კვება",
        title: "პერსონალური ცოცხალი რაციონის შედგენა",
        text: "გენეტიკურ პროფილზე მორგებული, ნაზად მომზადებული (gently cooked) საკვები · ზუსტი კალორაჟით, ნუტრიენტული ბალანსითა და ალერგენების გამორიცხვით.",
      },
      {
        index: "05",
        tag: "უწყვეტი AI მონიტორინგი",
        title: "24/7 ველნეს ასისტენტი",
        text: "AylopetAI განუწყვეტლივ აკვირდება ცვლილებებს · წონას, აქტივობასა და ახალ ანალიზებს, და რაციონსა და რეკომენდაციებს ავტომატურად აახლებს.",
      },
    ],
  },
  bento: {
    eyebrow: "მეცნიერება",
    heading: "სად ხვდება მეცნიერება ბუნებას",
    markersTitle: "230,000+",
    markersText:
      "გენეტიკური მარკერი ანალიზდება თითო ნიმუშზე · ბრიდ-სპეციფიკური ნუტრიენტული საჭიროებების ზუსტი რუკის შესაქმნელად.",
    aiTitle: "AI Health Engine",
    aiText:
      "მანქანური სწავლების მოდელი, რომელიც გენომს რეალურ რაციონად გარდაქმნის.",
    breedsValue: "350+",
    breedsLabel: "ჯიში მონაცემთა ბაზაში",
    accuracyValue: "99.9%",
    accuracyLabel: "ლაბორატორიული სიზუსტე",
    allergyTitle: "ალერგენების გამოვლენა",
    allergyText: "გენეტიკურად განპირობებული მგრძნობელობა იდენტიფიცირდება ადრევე.",
    cleanLabel: "ფარული დანამატი",
  },
  cta: {
    heading: "გაიცანი შენი ძაღლი გენეტიკის დონეზე.",
    subheadline:
      "ერთი ნაცხი გყოფნის, რომ პერსონალიზებული, მეცნიერებაზე დაფუძნებული კვება დაიწყო.",
    cta: "დაიწყე DNA ტესტი",
  },
};

export const DNA_EN: DnaCopy = {
  hero: {
    eyebrow: "DNA × AI × NUTRITION",
    headline: "More years, more love.\nGuided by DNA and AI.",
    subheadline:
      "We decode your dog's health by combining genetics with artificial intelligence.\n\nA genetic profile surfaces hidden risks long before symptoms appear.\n\nAI turns that data into a practical, everyday ration.",
    cta: "Start the DNA test",
    secondaryCta: "How it works",
    parsingLabel: "AI parsing genome",
    liveLabel: "live",
    markers: "230,000+ markers",
    markerRows: [
      { label: "Breed", value: "Weimaraner 98.2%" },
      { label: "Metabolism", value: "Fast oxidizer" },
      { label: "Allergens", value: "0 detected" },
    ],
  },
  journey: {
    eyebrow: "How it works",
    heading: "Five steps from genetics to everyday care",
    badges: [
      "60s, cheek swab",
      "230,000+ markers",
      "risk map, prevention",
      "tailored fresh ration",
      "24/7 AI monitoring",
    ],
    steps: [
      {
        index: "01",
        tag: "Data & Sample Collection",
        title: "Sample and data collection",
        text: "A simple cheek swab from the inside of the cheek · about 60 seconds. In parallel we gather vet records, lab results, and everyday behaviour data.",
      },
      {
        index: "02",
        tag: "AI Marker Analysis",
        title: "Decoding 230,000+ genetic markers",
        text: "Our algorithm processes more than 230,000 genetic markers · breed, allergens, metabolism, and drug sensitivity are decoded in real time.",
      },
      {
        index: "03",
        tag: "Risk & Prevention Mapping",
        title: "Identifying risks and preventing them",
        text: "The genome merges with clinical history to build a risk map · hidden predispositions surface before symptoms do, with concrete prevention steps attached.",
      },
      {
        index: "04",
        tag: "Tailored Fresh Nutrition",
        title: "Building a personal fresh ration",
        text: "Gently cooked food matched to the genetic profile · precise calories, balanced nutrients, and allergens excluded.",
      },
      {
        index: "05",
        tag: "Continuous AI Monitoring",
        title: "A 24/7 wellness assistant",
        text: "AylopetAI keeps watching for change · weight, activity, and new lab results, and updates the ration and recommendations automatically.",
      },
    ],
  },
  bento: {
    eyebrow: "The science",
    heading: "Where science meets nature",
    markersTitle: "230,000+",
    markersText:
      "Genetic markers analysed per sample · to map breed specific nutrient needs precisely.",
    aiTitle: "AI Health Engine",
    aiText: "A machine learning model that turns the genome into a real ration.",
    breedsValue: "350+",
    breedsLabel: "breeds in the database",
    accuracyValue: "99.9%",
    accuracyLabel: "laboratory accuracy",
    allergyTitle: "Allergen detection",
    allergyText: "Genetically driven sensitivities are identified early.",
    cleanLabel: "hidden additives",
  },
  cta: {
    heading: "Get to know your dog at the genetic level.",
    subheadline:
      "One swab is enough to start personalized, science-backed nutrition.",
    cta: "Start the DNA test",
  },
};

export function getDnaCopy(locale: "ka" | "en"): DnaCopy {
  return locale === "ka" ? DNA_KA : DNA_EN;
}
