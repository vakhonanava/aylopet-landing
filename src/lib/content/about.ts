import type { IconType } from "@/components/japandi/LineArtIcons";

export interface AboutValue {
  title: string;
  body: string;
  icon: IconType;
}

export interface AboutCopy {
  backLabel: string;
  whatIs: {
    title: string;
    body: string;
    missionTitle: string;
    missionBody: string;
  };
  vision: {
    title: string;
    body: string;
  };
  values: AboutValue[];
  story: {
    title: string;
    body: string;
  };
  process: {
    title: string;
    subInfo: string;
    steps: string[];
    pasteurizationNote: string;
  };
  team: {
    title: string;
    status: string;
    body: string;
  };
}

export const ABOUT_KA: AboutCopy = {
  backLabel: "ჩვენს შესახებ",
  whatIs: {
    title: "რა არის Aylopet",
    body: "Aylopet არის ინოვაციური ცხოველთა კეთილდღეობის (Pet-Wellness) პლატფორმა, რომელიც პერსონალიზებულ მონაცემებზე დაყრდნობით გეხმარებათ, გამოავლინოთ თქვენი ოთხფეხა მეგობრის ჯანმრთელობის მაქსიმალური პოტენციალი და გაუუმჯობესოთ ყოველდღიური ცხოვრების ხარისხი.\n\nხელოვნური ინტელექტისა და ინდივიდუალური მონაცემების სინთეზით, ჩვენ ვქმნით ერთიან ეკოსისტემას, რომელიც მოიცავს:\n• პერსონალიზებულ კვებას, ორგანიზმზე ზუსტად მორგებულს ინდივიდუალურ მოთხოვნებს\n• ყოველდღიურ პრაქტიკულ მხარდაჭერას, რეკომენდაციებს საკვებ დანამატებსა და ვიტამინებზე, მოვლისა და ჰიგიენის ნივთების შერჩევაზე, პარაზიტების პრევენციასა და ცხოვრების წესის სწორ დაგეგმვაზე\n• დაავადებების პრევენციას, ჯანმრთელობის რისკების ადრეულ გამოვლენასა და პრევენციულ მართვას.\n\nAylopet არ არის უბრალოდ სერვისი, ეს არის მონაცემებზე დამყარებული ზრუნვა, რომელიც გეხმარებათ, აჩუქოთ თქვენი ოჯახის ოთხფეხა წევრს ხანგრძლივი, ჯანსაღი და ბედნიერი ცხოვრება.",
    missionTitle: "ჩვენი მისია",
    missionBody:
      "Aylopet-ის მისია მარტივია: ვაჩუქოთ ჩვენ ოთხფეხა ოჯახის წევრებს მეტი ჯანსაღი და ბედნიერი წელი AI ასისტენტისა და ადამიანისთვის განკუთვნილი საკვები ინგრედიენტების სინთეზის საშუალებით.",
  },
  vision: {
    title: "კომპანიის ხედვა",
    body: "ჩვენი ხედვაა დავამკვიდროთ ცხოველთა მოვლისა და კეთილდღეობის ახალი, უმაღლესი სტანდარტი, სადაც მოწინავე ტექნოლოგიები და პერსონალიზებული ზრუნვა სრულ ჰარმონიაშია.\nჩვენ მივისწრაფვით შევქმნათ მომავალი, სადაც ოთხფეხა ოჯახის წევრები იღებენ ზუსტად მათზე მორგებულ, ყოვლისმომცველ ყურადღებას, ინდივიდუალურ მონაცემებზე დამყარებული კვებიდან და ყოველდღიური მზრუნველობიდან დაიწყებული, დაავადებების ადრეული პრევენციით დამთავრებული. ეს მათ საშუალებას მისცემს, სრულად გამოავლინონ საკუთარი გენეტიკური შესაძლებლობები და გაატარონ უფრო მეტი, ხარისხიანი და ჯანსაღი წელი ჩვენს გვერდით.\nჩვენი მიზანია, მონაცემებზე დამყარებული ინოვაციური მეცნიერება ვაქციოთ ყოველდღიურ რეალობად მათთვის, ვისთვისაც ოთხფეხა მეგობრების ჯანმრთელობაში კომპრომისი არ არსებობს.",
  },
  values: [
    {
      title: "პერსონალიზაცია",
      body: "თითოეული ძაღლი ინდივიდია, შესაბამისად, მის ჯანმრთელობაზე ზრუნვაც ასეთივე უნიკალური და პერსონალიზებული უნდა იყოს.",
      icon: "personalize",
    },
    {
      title: "მეცნიერული გამჭვირვალობა",
      body: "ჩვენ ვენდობით მხოლოდ დადასტურებულ მონაცემებს და არა ვარაუდებს.",
      icon: "science",
    },
    {
      title: "უპირობო ერთგულება",
      body: "ჩვენ ვქმნით მათთვის, ვინც ჩვენი ოჯახის სრულუფლებიანი წევრია.",
      icon: "loyalty",
    },
  ],
  story: {
    title: "ჩვენი ისტორია",
    body: "Aylopet-ის იდეა ლუკას ოჯახში პეკინესის, კოკოს გამოჩენიდან მალევე ჩაისახა, ხოლო კანე კორსოს, დანტეს მოსვლით ურყევ მისიად გარდაიქმნა.\nვისაც პატარა ჯიშის ძაღლი ჰყავს, იცის, რომ მათზე ზრუნვა და კვება დიდ გამოწვევასთანაა დაკავშირებული. ლუკა ყოველდღე უყურებდა კოკოს ბრძოლას: მშრალი საკვების მძიმე მონელება, მუდმივი დისკომფორტი და ალერგია მათი ყოველდღიურობის ნაწილი იყო. წლების შემდეგ ლუკას ცხოვრებაში დანტე გამოჩნდა, რომელიც თავისი გამორჩეული გემოვნების გამო უარს ამბობდა დამუშავებულ, მშრალ რაციონზე. თუმცა ნამდვილი დარტყმა მაშინ მიიღეს, როდესაც დანტეს ბრტყელუჯრედოვანი კარცინომის აგრესიული სიმსივნე დაუდგინდა.\nამ უმძიმესმა რეალობამ ლუკას დაანახა, რომ დაავადებები ხშირად გენეტიკის, არასწორი კვებისა და გარემო ფაქტორების ერთობლივი შედეგია. მან გააცნობიერა, რომ მხოლოდ საკვების შეცვლა საკმარისი არ იყო, საჭირო გახდა სრულიად ახალი, ყოვლისმომცველი სისტემა.\nლუკას სურდა შეექმნა ისეთი საკვები და მიდგომა, რომელიც ძაღლებს სიცოცხლეს გაუხანგრძლივებდა, რადგან კარგად იცოდა, თუ რა ზიანი მოჰქონდა არსებულ საკვებს. მან ეს იდეა თავის კურსელს, ვახოს, გაუზიარა — ის აქტიურად იყო ჩართული სტარტაპ სამყაროში.\nამასთან, ვახოსთვის ეს თემა პირად ტკივილთან იყო დაკავშირებული: 14 წლის ასაკში ოჯახმა მას პატარა ფრანგული ბულდოგი, პეპი, აჩუქა. მომდევნო 12 წლის განმავლობაში პეპი ვახოს ყოველდღიურობის, საუკეთესო მოგონებებისა და უპირობო ერთგულების სიმბოლო გახდა. 10 წლის ასაკში პეპის მკერდის სიმსივნე დაუდგინდა. ოპერაციისა და მკურნალობის შემდეგ პეპიმ კიდევ ორი წელი მამაცურად იბრძოლა, თუმცა ამ გამოცდილებამ ვახოს ცხოვრებაშიც უდიდესი კვალი დატოვა.\nვახომ პროექტს დაამატა ინოვაციური იდეა, ხელოვნური ინტელექტის გაწვრთნა მონაცემთა (Data) შესაგროვებლად, რაც შემდგომში დაავადებების ადრეული პრევენციისა და ახალი მედიკამენტებისა და ვაქცინების მიგნების საშუალებას მოგვცემდა.\nასე გავერთიანდით, რათა შეგვექმნა პროდუქტი, რომელიც ჩვენს საერთო გულისტკივილს სხვას არ გამოაცდევინებდა. ასე შეიქმნა Aylopet-ის ეკოსისტემა, რომელიც აერთიანებს პერსონალიზებულ კვებას, გენეტიკურ დიაგნოსტიკასა და ჯანმრთელობის AI-მართვას.\nჩვენი მიზანია, არცერთ პატრონს არ მოუწიოს იმ ტკივილის განცდა, რაც ჩვენ გამოვიარეთ. ერთი წელი დასჭირდება ამას თუ ათი, ჩვენი გუნდი მაინც მიაღწევს იმას, რომ თითოეულ ოთხფეხა მეგობარს ჰქონდეს შესაძლებლობა, იცხოვროს ჯანსაღად, გამოავლინოს თავისი მაქსიმალური პოტენციალი და იცოცხლოს რაც შეიძლება დიდხანს ჩვენს გვერდით.",
  },
  process: {
    title: "წარმოების პროცესი და ხარისხი",
    subInfo:
      "წარმოების პროცესს შეგიძლიათ გაეცნოთ ვიდეოში, რომელიც გადაღებულია ექსკლუზიურად ჩვენთვის, ისრაელში მდებარე პარტნიორი კომპანიის, Natural Selection-ის მიერ. სწორედ მათ შექმნეს Aylopet-ისთვის მორგებული ექსკლუზიური რეცეპტურა, რომელიც მზადდება ადამიანის კვების სტანდარტის (Human-Grade) ინგრედიენტებით.\nეს არის მარცვლეულის გარეშე შექმნილი (Grain-Free) და გენმოდიფიცირებული პროდუქტებისგან თავისუფალი (Non-GMO) ფორმულა.",
    steps: [
      "ვარჩევთ უმაღლესი ხარისხის პროდუქტებს.",
      "ვასუფთავებთ.",
      "ვაქცევთ ფარშად.",
      "ვფუთავთ.",
      "შეგვაქვს პასტერიზაციის აპარატში.",
      "გადავდივართ ბოლო ეტაპზე · გაყინვაზე.",
    ],
    pasteurizationNote:
      "ეს არის დაბალი ტემპერატურის თერმული დამუშავების მეთოდი, რომლის დროსაც ხორცი 75-80°C-ზე ჩერდება პასტერიზაციის ღუმელში 1-6 სთ. მისი მიზანია მავნე ბაქტერიების სრული განადგურება (სალმონელა, ლისტერია, ე. კოლი). ეს პროცესი სრულად ანადგურებს მავნე ბაქტერიებს, თუმცა ინარჩუნებს ხორცის ყველა სასარგებლო თვისებას: ამინომჟავებს, ვიტამინებს, მინერალებსა და კოლაგენს. შედეგად ვიღებთ უსაფრთხო, ნოყიერ და წვნიან საკვებს.",
  },
  team: {
    title: "ჩვენი გუნდი",
    status: "მალე დაგვემატება",
    body: "ჩვენი პროფესიონალების გუნდი ამჟამად ფორმირების პროცესშია. მალე გაგაცნობთ იმ ადამიანებს, რომლებიც დგანან Aylopet-ის უკან.",
  },
};

export const ABOUT_EN: AboutCopy = {
  backLabel: "About us",
  whatIs: {
    title: "What is Aylopet",
    body: "Aylopet is an innovative Pet-Wellness platform that uses personalized data to help you unlock your four-legged friend's full health potential and improve their everyday quality of life.\n\nBy combining artificial intelligence with individual data, we're building a single ecosystem that covers:\n• Personalized nutrition, precisely tailored to your dog's individual needs\n• Everyday practical support, including recommendations on supplements and vitamins, choosing grooming and hygiene products, parasite prevention, and planning the right lifestyle\n• Disease prevention, early detection of health risks, and preventive management.\n\nAylopet isn't just a service — it's data-driven care that helps you give the four-legged member of your family a longer, healthier, and happier life.",
    missionTitle: "Our mission",
    missionBody:
      "Aylopet's mission is simple: give our four-legged family members more healthy, happy years through the synthesis of an AI assistant and human-grade food ingredients.",
  },
  vision: {
    title: "Company vision",
    body: "Our vision is to set a new, higher standard for animal care and wellness, where advanced technology and personalized care exist in complete harmony.\nWe strive to build a future where four-legged family members receive attention precisely tailored to them — comprehensive care that starts with nutrition based on individual data and everyday support, and ends with early prevention of disease. This lets them fully realize their genetic potential and spend more quality, healthy years by our side.\nOur goal is to turn data-driven, innovative science into an everyday reality for those for whom there's no compromise when it comes to their four-legged friend's health.",
  },
  values: [
    {
      title: "Personalization",
      body: "Every dog is an individual, so the care for their health should be just as unique and personalized.",
      icon: "personalize",
    },
    {
      title: "Scientific transparency",
      body: "We trust only validated data, never assumptions.",
      icon: "science",
    },
    {
      title: "Unconditional commitment",
      body: "We build for those who are full members of our family.",
      icon: "loyalty",
    },
  ],
  story: {
    title: "Our story",
    body: "The idea for Aylopet was born soon after a Pekingese named Koko joined Luka's family, and it became an unwavering mission the moment his Cane Corso, Dante, came into his life.\nAnyone with a small-breed dog knows how real the challenge of caring for and feeding them can be. Every day, Luka watched Koko struggle: difficulty digesting dry food, constant discomfort, and allergies were simply part of their daily life. Years later, Dante came into Luka's life — a dog who, because of his particular taste, refused processed, dry rations. But the real blow came when Dante was diagnosed with an aggressive squamous cell carcinoma.\nThat devastating reality showed Luka that disease is often the combined result of genetics, poor nutrition, and environmental factors. He realized that simply changing the food wasn't enough — what was needed was an entirely new, comprehensive system.\nLuka wanted to build a food and an approach that could genuinely extend dogs' lives, since he knew firsthand the harm existing food could do. He shared this idea with a university classmate, Vakho, who was already active in the startup world.\nFor Vakho, the subject was personal. At fourteen, his family gave him a French Bulldog puppy named Pepi. For the next twelve years, Pepi was the thread through his everyday life, his best memories, and the most unconditional loyalty he'd known. At ten, she was diagnosed with a mammary tumor. After surgery, Pepi fought on bravely for two more years — an experience that left a lasting mark on Vakho's life too.\nVakho brought an innovative idea to the project: training AI on the data they gathered, to eventually help catch disease earlier and discover new medications and vaccines.\nThat's how we joined forces, to build a product that would spare others the same heartbreak we'd been through. That's how the Aylopet ecosystem was born — one that brings together personalized nutrition, genetic diagnostics, and AI-driven health management.\nOur goal is that no pet parent has to go through the pain we went through. Whether it takes one year or ten, our team will get there: making sure every four-legged friend has the chance to live healthy, reach their full potential, and stay by our side for as long as possible.",
  },
  process: {
    title: "Production process and quality",
    subInfo:
      "You can see our production process in the video below, filmed exclusively for us by our partner facility in Israel, Natural Selection. They're the ones who created the exclusive recipes built for Aylopet, made with Human-Grade ingredients — the same standard used for human food.\nIt's a Grain-Free formula, free of genetically modified ingredients (Non-GMO).",
    steps: [
      "We select the highest-quality products.",
      "We clean them.",
      "We turn them into mince.",
      "We package them.",
      "We load them into the pasteurization chamber.",
      "We move to the final stage · freezing.",
    ],
    pasteurizationNote:
      "This is a low-temperature thermal processing method, where the meat is held at 75-80°C in the pasteurization chamber for 1 to 6 hours. Its purpose is to fully eliminate harmful bacteria (Salmonella, Listeria, E. coli). This process fully destroys harmful bacteria while preserving every beneficial property of the meat: amino acids, vitamins, minerals, and collagen. The result is safe, nutrient-rich, and moist food.",
  },
  team: {
    title: "Our team",
    status: "Coming soon",
    body: "Our team of professionals is currently being formed. We'll introduce you soon to the people behind Aylopet.",
  },
};

/** Locale-agnostic default, used only for static page metadata. Use getAbout(locale) for rendered content. */
export const ABOUT = ABOUT_KA;

export function getAbout(locale: "ka" | "en"): AboutCopy {
  return locale === "ka" ? ABOUT_KA : ABOUT_EN;
}
