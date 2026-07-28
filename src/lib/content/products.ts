export interface ProductMetric {
  value: string;
  label: string;
}

export interface ProductsCopy {
  ai: {
    title: string;
    body: string;
    metrics: ProductMetric[];
  };
  freshFood: {
    title: string;
    subheading: string;
    paragraph1: string;
    paragraph2: string;
    whyAylopet: string;
    cta: string;
    ctaHref: string;
  };
}

export const PRODUCTS_KA: ProductsCopy = {
  ai: {
    title: "AylopetAI · თქვენი ძაღლის პერსონალური ციფრული ასისტენტი",
    body: "ეს არის სპეციალიზირებული ხელოვნური ინტელექტი, რომლის ცოდნა სრულად არის კონცენტრირებული ძაღლის კვებასა და მოვლაზე. საერთაშორისო დონის პროფესიონალ ვეტ ნუტრიციოლოგების მიერ შემუშავებული სისტემა გაძლევთ საშუალებას სულ რაღაც 60 წამიანი გასაუბრების შედეგად მიიღოთ მეცნიერულად დამტკიცებული, პერსონალიზირებული კვების გეგმა და რჩევები. AylopetAI ხელმისაწვდომია 24/7 თქვენი მეგობრის ჯანმრთელობის დასაცავად.",
    metrics: [
      { value: "60 წამი", label: "პერსონალიზირებული გეგმა" },
      { value: "24/7", label: "ხელმისაწვდომობა" },
    ],
  },
  freshFood: {
    title: "ძაღლის ცოცხალი საკვები",
    subheading:
      "აღმოაჩინე ნაზად მომზადებული რაციონის ძალა და სიმართლე, რომელსაც მშრალი საკვების მწარმოებლები არ გეუბნებიან.",
    paragraph1:
      "ჩვენ გვჯერა, რომ ნამდვილი სიცოცხლისუნარიანობა მხოლოდ ბუნებრივი, მინიმალური დაუმუშავებელი საკვებიდან მოდის. Aylopet-ის რაციონი, რომელიც მზადდება ნაზი დამუშავების (Gently Cooked) მეთოდით, არის ევოლუციური ხიდი ველურ ინსტინქტებსა და თანამედროვე უსაფრთხოებას შორის. ჩვენ შევქმენით ფორმულა, სადაც თქვენს ოთხფეხა მეგობარს აღარ უწევს არჩევანის გაკეთება ცოცხალ კვებასა და უსაფრთხოებას შორის.",
    paragraph2:
      "ჩვენი დაბალტემპერატურული პასტერიზაციის (70-დან 75°C-მდე) მეთოდით, სრულად ვანადგურებთ მავნე პათოგენებს, თუმცა ცოცხლად ვინარჩუნებთ იმ სასიცოცხლო ფერმენტებს, ნუტრიენტებსა და ამინომჟავებს, რომლებიც მხოლოდ ნედლ ხორცშია. ეს სწორედ ის კომპონენტებია, რომლებიც მაღალტემპერატურული თერმული დამუშავებისას (150-200°C-ზე ხარშვის ან გამოცხობისას) მომენტალურად ნადგურდება.",
    whyAylopet:
      "ჩვენ არ ვაწარმოებთ ინდუსტრიულ „ძაღლის საჭმელს“, ჩვენ ბუნებრივ პროდუქტს უსაფრთხო, ცოცხალ საკვებად ვაქცევთ. შედეგად, თქვენი ოთხფეხა მეგობარი იღებს ბიოლოგიურად აქტიურ რაციონს, რომელსაც მხოლოდ აუცილებელ ვიტამინებს ვამატებთ, ყოველგვარი ხელოვნური დანამატების, ფარული შაქრების, სინთეზური კონსერვანტებისა და გემოს გამაძლიერებლების გარეშე.",
    cta: "ნახეთ წარმოების პროცესი",
    ctaHref: "/about/process",
  },
};

export const PRODUCTS_EN: ProductsCopy = {
  ai: {
    title: "AylopetAI · Your dog's personal digital nutritionist",
    body: "This is a specialized artificial intelligence whose entire knowledge base is focused on canine nutrition. Built by an international team of professional nutritionists, the system gives you a scientifically backed, individualized nutrition plan and guidance in just 60 seconds. AylopetAI is available 24/7 to help protect your best friend's health.",
    metrics: [
      { value: "60 seconds", label: "Personalized plan" },
      { value: "24/7", label: "Availability" },
    ],
  },
  freshFood: {
    title: "Fresh dog food: a nutrition evolution for your best friend",
    subheading:
      "Discover the power and truth behind gently prepared meals that dry food makers won't tell you.",
    paragraph1:
      "We believe true vitality comes only from natural, unprocessed food. Aylopet's ration, made with the Gently Cooked method, is an evolutionary bridge between wild instincts and modern safety. We built a formula so your four legged friend never has to choose between fresh food and safety.",
    paragraph2:
      "With our low temperature pasteurization method (70 to 75°C), we fully eliminate harmful pathogens while keeping alive the vital enzymes, nutrients, and amino acids found only in raw meat. These are exactly the components that high heat processing (boiling or baking at 200°C) destroys instantly.",
    whyAylopet:
      "We don't make \"dog food\", we turn real ingredients into safe, fresh nutrition. As a result, your companion gets a biologically active ration with no artificial additives, synthetic preservatives, hidden sugars, or flavor enhancers. We offer what dry food makers won't tell you: real meat instead of synthetic vitamins.",
    cta: "See our production process",
    ctaHref: "/about/process",
  },
};

export function getProducts(locale: "ka" | "en"): ProductsCopy {
  return locale === "ka" ? PRODUCTS_KA : PRODUCTS_EN;
}

/** @deprecated Use getProducts(locale) instead. Kept for static metadata (locale-agnostic). */
export const PRODUCTS = PRODUCTS_KA;
