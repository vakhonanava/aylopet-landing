export const BRAND = {
  name: "Aylopet",
  tagline: "ცოცხალი საკვები",
} as const;

export const CONTENT = {
  hero: {
    headline: "ძაღლის ცოცხალი საკვები: კვების ევოლუცია შენი მეგობრისთვის",
    subheadline:
      "აღმოაჩინე ნაზად მომზადებული რაციონის ძალა და სიმართლე, რომელსაც მშრალი საკვების მწარმოებლები არ გეუბნებიან.",
    cta: "ნახეთ წარმოების პროცესი",
  },
  philosophy: {
    text: "ჩვენ გვჯერა, რომ ნამდვილი სიცოცხლისუნარიანობა მხოლოდ ბუნებრივი, მინიმალური დაუმუშავებელი საკვებიდან მოდის. Aylopet-ის რაციონი, რომელიც მზადდება ნაზი დამუშავების (Gently Cooked) მეთოდით, არის ევოლუციური ხიდი ველურ ინსტინქტებსა და თანამედროვე უსაფრთხოებას შორის. ჩვენ შევქმენით ფორმულა, სადაც თქვენს ოთხფეხა მეგობარს აღარ უწევს არჩევანის გაკეთება ცოცხალ კვებასა და უსაფრთხოებას შორის.",
  },
  bento: {
    card1: {
      title: "ინოვაცია, რომელიც ინარჩუნებს სიცოცხლეს.",
      text: "ჩვენი დაბალტემპერატურული პასტერიზაციის (75-დან 80°C-მდე) მეთოდით, სრულად ვანადგურებთ მავნე პათოგენებს, თუმცა ცოცხლად ვინარჩუნებთ იმ სასიცოცხლო ფერმენტებს, ნუტრიენტებსა და ამინომჟავებს, რომლებიც მხოლოდ ნედლ ხორცშია. ეს სწორედ ის კომპონენტებია, რომლებიც მაღალტემპერატურული თერმული დამუშავებისას (150-200°C-ზე ხარშვის ან გამოცხობისას) მომენტალურად ნადგურდება.",
    },
    card2: {
      title: "რატომ Aylopet?",
      text: "ჩვენ არ ვაწარმოებთ ინდუსტრიულ „ძაღლის საჭმელს“, ჩვენ ბუნებრივ პროდუქტს უსაფრთხო, ცოცხალ საკვებად ვაქცევთ. შედეგად, თქვენი ოთხფეხა მეგობარი იღებს ბიოლოგიურად აქტიურ რაციონს, რომელსაც მხოლოდ აუცილებელ ვიტამინებს ვამატებთ, ყოველგვარი ხელოვნური დანამატების, ფარული შაქრების, სინთეზური კონსერვანტებისა და გემოს გამაძლიერებლების გარეშე.",
    },
  },
  footer: {
    headline: "იხილეთ კვების ევოლუცია მოქმედებაში:",
    subheadline:
      "გაიგეთ, როგორ ვქმნით უსაფრთხო და ცოცხალ კვებას თქვენი მეგობრებისთვის.",
    cta: "ნახეთ წარმოების პროცესი",
  },
} as const;

const DNA_KA = {
  hero: {
    eyebrow: "DNA × AI × NUTRITION",
    headline: "მეტი წელი, მეტი სიყვარული.\nმართული დნმ-ითა და AI-ით.",
    subheadline:
      "ვშიფრავთ ძაღლის ჯანმრთელობას გენეტიკისა და ხელოვნური ინტელექტის სინთეზით.\n\nგენეტიკური პროფილი ავლენს ფარულ რისკებს ჯერ კიდევ სიმპტომებამდე.\n\nAI კი ამ მონაცემებს აქცევს ყოველდღიურ, პრაქტიკულ რაციონად.",
    cta: "დაიწყე DNA ტესტი",
    secondaryCta: "როგორ მუშაობს",
    parsingLabel: "AI parsing genome",
    markers: "230,000+ მარკერი",
  },
  journey: {
    eyebrow: "HOW IT WORKS",
    heading: "ხუთი ნაბიჯი გენეტიკიდან ყოველდღიურ ზრუნვამდე",
    steps: [
      {
        index: "01",
        tag: "Data & Sample Collection",
        title: "მონაცემთა და ნიმუშის შეგროვება",
        text: "მარტივი ნაცხი (cheek swab) ლოყის შიდა მხრიდან · სულ რაღაც 60 წამში. პარალელურად ვაგროვებთ ვეტ ჩანაწერებს, ლაბორატორიულ ანალიზებსა და ყოველდღიური ქცევის მონაცემებს.",
      },
      {
        index: "02",
        tag: "AI Marker Analysis",
        title: "230,000+ გენეტიკური მარკერის დეკოდირება",
        text: "ჩვენი ალგორითმი ამუშავებს 230,000-ზე მეტ გენეტიკურ მარკერს · ჯიში, ალერგენები, მეტაბოლიზმი და წამლებზე მგრძნობელობა იშიფრება რეალურ დროში.",
      },
      {
        index: "03",
        tag: "Risk & Prevention Mapping",
        title: "რისკების იდენტიფიცირება და პრევენცია",
        text: "გენომი ერწყმის კლინიკურ ისტორიას და ქმნის რისკების რუკას · ფარული მიდრეკილებები ვლინდება ჯერ კიდევ სიმპტომების გამოჩენამდე, პრევენციის კონკრეტულ ნაბიჯებთან ერთად.",
      },
      {
        index: "04",
        tag: "Tailored Fresh Nutrition",
        title: "პერსონალური ცოცხალი რაციონის შედგენა",
        text: "გენეტიკურ პროფილზე მორგებული, ნაზად მომზადებული (gently cooked) საკვები · ზუსტი კალორაჟით, ნუტრიენტული ბალანსითა და ალერგენების გამორიცხვით.",
      },
      {
        index: "05",
        tag: "Continuous AI Monitoring",
        title: "24/7 ველნეს ასისტენტი",
        text: "AylopetAI განუწყვეტლივ აკვირდება ცვლილებებს · წონას, აქტივობასა და ახალ ანალიზებს, და რაციონსა და რეკომენდაციებს ავტომატურად აახლებს.",
      },
    ],
  },
  bento: {
    eyebrow: "THE SCIENCE",
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

type DnaCopy = typeof DNA_KA;

const DNA_EN: DnaCopy = {
  hero: {
    eyebrow: "DNA × AI × NUTRITION",
    headline: "More years, more love.\nGuided by DNA and AI.",
    subheadline:
      "We decode your dog's health by combining genetics with artificial intelligence.\n\nA genetic profile reveals hidden risks before symptoms ever appear.\n\nAI then turns that data into a practical, everyday diet.",
    cta: "Start the DNA test",
    secondaryCta: "How it works",
    parsingLabel: "AI parsing genome",
    markers: "230,000+ markers",
  },
  journey: {
    eyebrow: "HOW IT WORKS",
    heading: "Five steps from genetics to everyday care",
    steps: [
      {
        index: "01",
        tag: "Data & Sample Collection",
        title: "Collecting data and a sample",
        text: "A simple swab from the inside of the cheek · done in just 60 seconds. Alongside it, we gather vet records, lab results and everyday behavior data.",
      },
      {
        index: "02",
        tag: "AI Marker Analysis",
        title: "Decoding 230,000+ genetic markers",
        text: "Our algorithm processes more than 230,000 genetic markers · breed, allergens, metabolism and drug sensitivities are decoded in real time.",
      },
      {
        index: "03",
        tag: "Risk & Prevention Mapping",
        title: "Spotting risks early and preventing them",
        text: "The genome is merged with clinical history into a risk map · hidden predispositions surface before symptoms appear, together with concrete prevention steps.",
      },
      {
        index: "04",
        tag: "Tailored Fresh Nutrition",
        title: "Composing a personal fresh diet",
        text: "Gently cooked food tailored to the genetic profile · with precise calories, balanced nutrients and allergens left out.",
      },
      {
        index: "05",
        tag: "Continuous AI Monitoring",
        title: "A 24/7 wellness assistant",
        text: "AylopetAI keeps track of changes · weight, activity and new lab results, and updates the diet and recommendations automatically.",
      },
    ],
  },
  bento: {
    eyebrow: "THE SCIENCE",
    heading: "Where science meets nature",
    markersTitle: "230,000+",
    markersText:
      "genetic markers analyzed per sample · to map breed-specific nutrient needs precisely.",
    aiTitle: "AI Health Engine",
    aiText:
      "A machine-learning model that turns the genome into a real diet.",
    breedsValue: "350+",
    breedsLabel: "breeds in the database",
    accuracyValue: "99.9%",
    accuracyLabel: "lab accuracy",
    allergyTitle: "Allergen detection",
    allergyText: "Genetically driven sensitivities are identified early.",
    cleanLabel: "hidden additives",
  },
  cta: {
    heading: "Get to know your dog at the genetic level.",
    subheadline:
      "One swab is all it takes to start personalized, science-based nutrition.",
    cta: "Start the DNA test",
  },
};

/** /dna-journey copy · components read the locale and pick a side. */
export function getDna(locale: "ka" | "en"): DnaCopy {
  return locale === "ka" ? DNA_KA : DNA_EN;
}

export const ROADMAP = {
  hero: {
    eyebrow: "ჩვენი ხედვა",
    headline: "ჩვენი მთავარი მოტივი: სიცოცხლის გახანგრძლივება.",
    subheadline:
      "ყოველი ნაბიჯი, რომელსაც Aylopet დგამს, ემსახურება ერთადერთ მიზანს · ვაჩუქოთ ჩვენს ოთხფეხა ოჯახის წევრებს მეტი ჯანსაღი და ბედნიერი წელი.",
  },
  phase1: {
    badge: "ეტაპი 1 | აქტიური",
    headline: "ბიოლოგიურად სრულფასოვანი კვება",
    description:
      "ჩვენი მოგზაურობა იწყება საძირკვლით · Gently Cooked, პერსონალიზებული კვებით, რომელიც აერთიანებს ბუნებრივ ინგრედიენტებსა და საერთაშორისო ნუტრიციოლოგების ცოდნას.",
    cta: "დეტალურად კვების შესახებ",
    href: "/products/fresh-food",
  },
  phase2: {
    badge: "ეტაპი 2 | მალე",
    headline: "პერსონალიზებული მედიცინა · AI & დნმ",
    description:
      "მომავალი, სადაც ვხვდებით დაავადებებს მათ გამოვლენამდე. ხელოვნური ინტელექტის ასისტენტი და დნმ ტესტირება მოგვცემს საშუალებას, შევქმნათ აბსოლუტურად უნიკალური ჯანმრთელობის პროფილი თქვენი ძაღლისთვის.",
    cta: "როგორ იმუშავებს AI და დნმ?",
    href: "/dna-journey",
  },
} as const;

export const SUBPAGES = {
  nutrition: {
    eyebrow: "ეტაპი 1 | აქტიური",
    title: "ბიოლოგიურად სრულფასოვანი კვება",
    intro:
      "Gently Cooked მეთოდი, პერსონალიზებული რეცეპტები და საერთაშორისო ნუტრიციოლოგების ცოდნა · ერთ თეფშზე.",
    backLabel: "უკან ხედვაზე",
  },
  aiDna: {
    eyebrow: "ეტაპი 2 | მალე",
    title: "პერსონალიზებული მედიცინა · AI & დნმ",
    intro:
      "დნმ ტესტირება და ხელოვნური ინტელექტი, რომელიც ქმნის თქვენი ძაღლის უნიკალურ ჯანმრთელობის პროფილს.",
    backLabel: "უკან ხედვაზე",
  },
} as const;
