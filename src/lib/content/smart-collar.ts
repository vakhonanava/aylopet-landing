export interface CollarFeature {
  icon: "gps" | "activity" | "ai" | "waterproof" | "battery" | "sync";
  title: string;
  description: string;
}

export interface CollarStep {
  title: string;
  description: string;
}

export interface CollarSpec {
  label: string;
  value: string;
}

export interface SmartCollarCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  comingSoonBadge: string;
  ctaWaitlist: string;
  ctaFaq: string;
  intro: string;
  featuresEyebrow: string;
  featuresTitle: string;
  features: CollarFeature[];
  howEyebrow: string;
  howTitle: string;
  steps: CollarStep[];
  specsEyebrow: string;
  specsTitle: string;
  specs: CollarSpec[];
  faqEyebrow: string;
  faqTitle: string;
  faqSubtitle: string;
  faqCta: string;
  finalCtaTitle: string;
  finalCtaBody: string;
  finalCta: string;
}

export const SMART_COLLAR_KA: SmartCollarCopy = {
  eyebrow: "Aylopet Smart Collar · მალე",
  title: "Aylopet Smart Collar · ჭკვიანი ყელსაბამი",
  subtitle:
    "GPS მდებარეობა, აქტივობის მონიტორინგი და AI-ის მიერ გამოთვლილი, რეალურ დროში განახლებადი კალორიული საჭიროება, ერთ მოწყობილობაში.",
  comingSoonBadge: "მალე · Coming soon",
  ctaWaitlist: "შემოუერთდი waitlist-ს",
  ctaFaq: "Aylopet Smart Collar-ს ხშირი კითხვები",
  intro:
    "Aylopet Smart Collar არის ჭკვიანი ყელსაბამი, რომელიც გამოიყენება თქვენი ძაღლის რეალურ დროში მონიტორინგისთვის, რაც უზრუნველყოფს მის უსაფრთხოებასა და აქტივობის კონტროლს. მოწყობილობა ზუსტად ზომავს ლოკაციასა და გავლილ მანძილს, რაც გვეხმარება ენერგიის რეალური დანახარჯის გამოთვლაში. Aylopet Smart Collar-დან მიღებულ მონაცემებზე დაყრდნობით, AylopetAI განსაზღვრავს კალორიების საჭირო რაოდენობას, რათა თქვენმა მეგობარმა მიიღოს ზუსტად ის, რაც მას ნამდვილად სჭირდება.",
  featuresEyebrow: "რატომ Aylopet Smart Collar",
  featuresTitle: "GPS, აქტივობა და AI, ერთ ყელსაბამში",
  features: [
    {
      icon: "gps",
      title: "GPS მდებარეობა რეალურ დროში",
      description:
        "ყოველთვის იცოდეთ, სად არის თქვენი ძაღლი, ზუსტი ლოკაცია და გავლილი მანძილი ერთ აპლიკაციაში.",
    },
    {
      icon: "activity",
      title: "ჯანმრთელობისა და აქტივობის მონიტორინგი",
      description:
        "ჩვეულებრივი GPS თრექერისგან განსხვავებით, Aylopet Smart Collar აკონტროლებს ძილის ფაზებს, გულისცემას, დახარჯულ კალორიებსა და შფოთვის დონეს.",
    },
    {
      icon: "ai",
      title: "AI კალორიების ზუსტი გამოთვლა",
      description:
        "მოწყობილობიდან მიღებულ მონაცემებზე დაყრდნობით AylopetAI ავტომატურად ითვლის და აკორექტირებს თქვენი ძაღლის ყოველდღიურ კვების საჭიროებას.",
    },
    {
      icon: "waterproof",
      title: "IP67 წყალგამძლეობა",
      description:
        "დაპროექტებულია აქტიური ცხოველებისთვის, გამძლეობა წვიმის, ტალახისა და ბანაობის მიმართ.",
    },
    {
      icon: "battery",
      title: "7-დან 14 დღემდე ავტონომია",
      description:
        "ერთი სრული დამუხტვა Type C პორტით ან უსადენო დამტენით საშუალოდ 7-დან 14 დღემდე გამოგდგებათ.",
    },
    {
      icon: "sync",
      title: "Bluetooth / WiFi სინქრონიზაცია + LTE GPS",
      description:
        "მონაცემები ავტომატურად სინქრონიზდება AylopetAI-სთან; ზოგიერთი ფუნქცია ხელმისაწვდომია ოფლაინ რეჟიმშიც.",
    },
  ],
  howEyebrow: "როგორ მუშაობს",
  howTitle: "სამი ნაბიჯი · ყელსაბამიდან პერსონალურ გეგმამდე",
  steps: [
    {
      title: "ატარეთ და დააკავშირეთ",
      description:
        "ჩააცვით ყელსაბამი და დააკავშირეთ Aylopet აპლიკაციასთან Bluetooth ან WiFi საშუალებით.",
    },
    {
      title: "ავტომატური მონიტორინგი",
      description:
        "Aylopet Smart Collar უწყვეტად აკვირდება ლოკაციას, მოძრაობასა და აქტივობას და მონაცემებს უგზავნის AylopetAI-ს.",
    },
    {
      title: "„ცოცხალი“ კვების გეგმა",
      description:
        "AylopetAI რეალურ დროში ითვლის კალორიულ საჭიროებას და აკორექტირებს რაციონს ფაქტობრივი აქტივობის მიხედვით.",
    },
  ],
  specsEyebrow: "სპეციფიკაციები",
  specsTitle: "ტექნიკური მონაცემები",
  specs: [
    { label: "კავშირი", value: "Bluetooth / WiFi სინქრონიზაცია, LTE GPS" },
    { label: "ავტონომია", value: "7-დან 14 დღე ერთ დამუხტვაზე" },
    { label: "დამუხტვა", value: "USB C ან უსადენო დამტენი" },
    { label: "წყალგამძლეობა", value: "IP67" },
    { label: "AI ინტეგრაცია", value: "AylopetAI რეალურ დროში კალორიების გამოთვლა" },
  ],
  faqEyebrow: "კითხვები?",
  faqTitle: "ყველა პასუხი Aylopet Smart Collar-ს შესახებ",
  faqSubtitle:
    "დამუხტვიდან წყალგამძლეობამდე, შეამოწმეთ სრული FAQ Aylopet Smart Collar-ს კატეგორია.",
  faqCta: "ნახე ხშირი კითხვები",
  finalCtaTitle: "იყავი პირველი, ვინც მიიღებს Aylopet Smart Collar-ს",
  finalCtaBody:
    "შემოუერთდი waitlist-ს და გაიცანი, როდის ხდება ჭკვიანი ყელსაბამის გამოშვება.",
  finalCta: "შემოუერთდი waitlist-ს",
};

export const SMART_COLLAR_EN: SmartCollarCopy = {
  eyebrow: "Aylopet Smart Collar · Coming soon",
  title: "Aylopet Smart Collar · Smart Collar",
  subtitle:
    "GPS location, activity monitoring, and AI calculated, live updating calorie needs, in one device.",
  comingSoonBadge: "Coming soon",
  ctaWaitlist: "Join the waitlist",
  ctaFaq: "Aylopet Smart Collar FAQ",
  intro:
    "Aylopet Smart Collar is a smart collar used to monitor your dog in real time, keeping them safe and their activity in check. The device precisely measures location and distance traveled, which helps us calculate real energy expenditure. Based on data from Aylopet Smart Collar, AylopetAI determines exactly how many calories your companion needs, so they get exactly what they need, nothing more, nothing less.",
  featuresEyebrow: "Why Aylopet Smart Collar",
  featuresTitle: "GPS, activity, and AI, in one collar",
  features: [
    {
      icon: "gps",
      title: "Real time GPS location",
      description:
        "Always know where your dog is, precise location and distance traveled, right in the app.",
    },
    {
      icon: "activity",
      title: "Health & activity monitoring",
      description:
        "Unlike a regular GPS tracker, Aylopet Smart Collar tracks sleep phases, heart rate, calories burned, and stress levels.",
    },
    {
      icon: "ai",
      title: "Precise AI calorie calculation",
      description:
        "Based on data from the device, AylopetAI automatically calculates and adjusts your dog's daily nutrition needs.",
    },
    {
      icon: "waterproof",
      title: "IP67 water resistance",
      description:
        "Built for active dogs, durable against rain, mud, and swims.",
    },
    {
      icon: "battery",
      title: "7 to 14 days of battery life",
      description:
        "One full charge via USB C or wireless charging lasts 7 to 14 days on average.",
    },
    {
      icon: "sync",
      title: "Bluetooth / WiFi sync + LTE GPS",
      description:
        "Data syncs automatically with AylopetAI; some features remain available even offline.",
    },
  ],
  howEyebrow: "How it works",
  howTitle: "Three steps, from collar to personalized plan",
  steps: [
    {
      title: "Wear it and connect",
      description:
        "Put the collar on your dog and pair it with the Aylopet app via Bluetooth or WiFi.",
    },
    {
      title: "Automatic monitoring",
      description:
        "Aylopet Smart Collar continuously tracks location, movement, and activity, and streams the data to AylopetAI.",
    },
    {
      title: "A living nutrition plan",
      description:
        "AylopetAI calculates calorie needs in real time and adjusts the ration based on actual activity.",
    },
  ],
  specsEyebrow: "Specifications",
  specsTitle: "Technical details",
  specs: [
    { label: "Connectivity", value: "Bluetooth / WiFi sync, LTE GPS" },
    { label: "Battery life", value: "7 to 14 days per charge" },
    { label: "Charging", value: "USB C or wireless charger" },
    { label: "Water resistance", value: "IP67" },
    { label: "AI integration", value: "AylopetAI real time calorie engine" },
  ],
  faqEyebrow: "Questions?",
  faqTitle: "Every answer about Aylopet Smart Collar",
  faqSubtitle:
    "From charging to water resistance, check the full Aylopet Smart Collar FAQ category.",
  faqCta: "View FAQ",
  finalCtaTitle: "Be first to get Aylopet Smart Collar",
  finalCtaBody:
    "Join the waitlist to find out when the smart collar launches.",
  finalCta: "Join the waitlist",
};

export function getSmartCollarContent(locale: "ka" | "en"): SmartCollarCopy {
  return locale === "ka" ? SMART_COLLAR_KA : SMART_COLLAR_EN;
}
