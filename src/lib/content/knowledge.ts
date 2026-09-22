export const KNOWLEDGE = {
  hub: {
    title: "Pet Wellness Insights",
    subtext:
      "Evidence-based guidance for your dog's whole wellbeing · nutrition is just one chapter. Explore food science today, with grooming, behavior, and preventive care categories launching soon.",
    articleLink: {
      label: "Fresh food science & diet technologies",
      href: "/knowledge/scientific-overview",
    },
    categories: [
      { label: "Nutrition & fresh food", href: "/knowledge/scientific-overview", live: true },
      { label: "Preventive wellness", href: "/knowledge", live: false },
      { label: "Behavior & enrichment", href: "/knowledge", live: false },
      { label: "Grooming & skin health", href: "/knowledge", live: false },
    ],
  },
  article: {
    title:
      "ძაღლის კვების ტექნოლოგიების მეცნიერული მიმოხილვა: საერთაშორისო კვლევებისა და დიეტოლოგიური ანალიზის რეზიუმე",
    introduction:
      "შინაური ცხოველების კვების ინდუსტრია ბოლო წლებში მნიშვნელოვანი ტრანსფორმაციის გზას გადის. დღეს მომხმარებელი სულ უფრო მრავალფეროვანი არჩევანის წინაშე დგას და აღარ შემოიფარგლება მხოლოდ ერთი სტანდარტით. წინამდებარე მიმოხილვა წარმოადგენს დამოუკიდებელი სამეცნიერო ინსტიტუტების, ვეტერინარული უნივერსიტეტებისა და კვების ლაბორატორიების მიერ ჩატარებული კვლევების შეჯამებას. სრულყოფილი და ობიექტური სურათის შესაქმნელად, სტატიაში დეტალურად გავაანალიზებთ კვების ძირითად ტიპებს: ექსტრუდირებულ მშრალ საკვებს (Kibble), დაუმუშავებელ ნედლ კვებას (Raw/BARF), სტერილიზებულ კონსერვებს (Canned) და ნაზად მომზადებულ, ცოცხალ საკვებს (Fresh food).",
    sections: [
      {
        id: "kibble",
        title: "მშრალი საკვები (Kibble)",
        blocks: [
          {
            label: "განმარტება",
            text: '"Kibble" (ქიბელი) გულისხმობს საკვებს, რომელიც მზადდება მარცვლეულის, ცხიმებისა და ვიტამინ-მინერალების ერთგვაროვან მასად (ცომად) შერევით. ეს მასა მუშავდება მაღალი წნევისა და მაღალი ტემპერატურის პირობებში (ძირითადად 150°C-ზე ზემოთ). პროცესი ცნობილია როგორც ექსტრუზია.',
          },
          {
            label: "გამჭვირვალობის პრობლემა",
            text: "წარმოების სპეციფიკიდან გამომდინარე, მომხმარებლისთვის პრაქტიკულად შეუძლებელია ინგრედიენტების პირვანდელი სახის, ხარისხისა და ზუსტი პროპორციების იდენტიფიცირება (AAFCO-ს სტანდარტების კრიტიკული მიმოხილვები მიუთითებს ამაზე).",
          },
          {
            label: "ნუტრიენტების გავლენა",
            text: "ნუტრიენტების დეგრადაცია (150°C+ სიცხე ანადგურებს ვიტამინებს, საჭიროებს სინთეზურ დანამატებს); მაიარის რეაქცია (Maillard Reaction) ქმნის ანთებით ნაერთებს; ნახშირწყლების ჭარბი შემცველობა იწვევს სიმსუქნეს; 10% დაბალი ტენიანობა ტვირთავს თირკმელებს (ქრონიკული დეჰიდრატაცია).",
          },
        ],
        pros: [
          "პრაქტიკულობა და კომფორტი",
          "ხელმისაწვდომობა (ბიუჯეტური)",
          "ჰიგიენა და უსაფრთხოება",
          "კვებითი ბალანსის სტანდარტი (AAFCO ნორმები)",
        ],
        cons: [
          "დაბალი გამჭვირვალობა",
          "ხელოვნური დანამატები, სინთეზური კონსერვანტები და ემულგატორები (BHA, BHT, Ethoxyquin)",
          "წყლის ბალანსის დარღვევა",
          "ჯანმრთელობის რისკები (ალერგიები)",
          "გემოვნური ერთფეროვნება",
        ],
      },
      {
        id: "fresh",
        title: "ცოცხალი საკვები (Fresh Food)",
        blocks: [
          {
            label: "განმარტება",
            text: '"ოქროს შუალედი" ვეტერინარულ დიეტოლოგიაში. მინიმალურად დამუშავებული, მთლიან პროდუქტებზე (Whole-food) დაფუძნებული რაციონი, დამზადებული Human-grade ინგრედიენტებისგან. არ შეიცავს ხელოვნურ კონსერვანტებს.',
          },
          {
            label: "ტექნოლოგიური უპირატესობები",
            text: "ნაზი თერმული დამუშავება (Gently Cooked). ილინოისის უნივერსიტეტის კლინიკური კვლევა (Algya et al., 2018) ადასტურებს 90%-ზე მაღალ მონელებადობას და ბიოშეღწევადობას.",
          },
        ],
        pros: [
          "მაღალი ბიოშეღწევადობა",
          "ინდივიდუალური პერსონალიზაცია (Waltham Petcare Science Institute-ის მონაცემებით 30%-ით ზრდის ცხოვრების ხარისხს)",
          "ნატურალური მთლიანი პროდუქტები",
          "ნატურალური ჰიდრატაცია (~70% ტენიანობა, Metabolic Water ხელს უწყობს თირკმელების მუშაობას)",
          "უნაკლო გემოვნური თვისებები",
          "სუფთა შემადგენლობა (Clean Label)",
        ],
        cons: [
          "შენახვის მკაცრი პირობები (საყინულეში 1 წელი, მაცივარში გალღობიდან მხოლოდ 5 დღე)",
          "ბალანსის დაცვის სირთულე ბაზარზე",
          "ბაქტერიული უსაფრთხოების რისკები (საჭიროებს ცივი ჯაჭვის დაცვას -18°C-ზე FDA-ს მიხედვით)",
          "დიეტური ადაპტაცია",
          "მაღალი ღირებულება და ლოჯისტიკა",
        ],
      },
      {
        id: "raw",
        title: "ნედლი კვება (Raw / RMBD)",
        blocks: [
          {
            label: "განმარტება",
            text: "აკადემიურად ცნობილია როგორც RMBD (Raw Meat-Based Diets). ეყრდნობა თერმული დამუშავების სრულ არარსებობას.",
          },
          {
            label: "არგუმენტები და რისკები",
            text: "მაღალი ბიოშეღწევადობა (DogRisk პროექტი ჰელსინკის უნივერსიტეტში აღნიშნავს ატოპიური დერმატიტის პრევენციას). თუმცა შეიცავს კლინიკურ რისკებს (FDA და AVMA-ს მიხედვით Salmonella და Listeria-ს პათოგენური წყაროა). UC Davis დიეტოლოგები მიუთითებენ ნუტრიციულ დისბალანსზე სახლის პირობებში დამზადებისას.",
          },
          {
            label: "ალტერნატივა",
            text: "ნაზი პასტერიზაცია (75-80°C) Aylopet-ში ხსნის ამ დილემას · ანადგურებს პათოგენებს, მაგრამ ინარჩუნებს ბიოშეღწევადობას.",
          },
        ],
      },
      {
        id: "canned",
        title: "კონსერვირებული საკვები (Wet Food / Canned)",
        blocks: [
          {
            label: "განმარტება",
            text: 'გადის "რეტორტულ სტერილიზაციას" (Retort Processing) ავტოკლავში 121-135°C-ზე.',
          },
        ],
        pros: [
          "მაღალი ტენიანობა (75%-84%)",
          "ხელს უშლის შარდკენჭოვან დაავადებებს",
          "ნაკლები ნახშირწყალი (რეკომენდებულია დიაბეტის დროს)",
        ],
        cons: [
          "ვიტამინების თერმული დეგრადაცია (განსაკუთრებით B1 თიამინი, JAVMA-ს მიხედვით)",
          "ტექსტურული დანამატები (კარაგინანი იწვევს ნაწლავის გაღიზიანებას)",
          "პირის ღრუს ჰიგიენის პრობლემები (AVDC მონაცემებით რბილი ტექსტურა აჩქარებს ნადების დაგროვებას)",
        ],
      },
    ],
    bibliography: [
      "AAFCO (Association of American Feed Control Officials) Official Publication.",
      "Petfood Industry Technical Study: Extrusion and nutrient stability.",
      "Journal of Veterinary Medicine & Science: Safety assessment of BHA/BHT.",
      "NCBI / PubMed: Maillard reaction products in pet foods.",
      "Journal of Animal Physiology and Animal Nutrition: Carbohydrates and starch digestibility.",
      "University of Illinois (Algya et al., 2018): Digestibility of human-grade vs. extruded food.",
      "UC Davis School of Veterinary Medicine: Analysis of home-prepared diets.",
      "Waltham Petcare Science Institute: Research on canine longevity.",
      "Journal of Animal Science: Gut microbiota and clean fresh food labels.",
      "BMC Veterinary Research: Canine gut microbiome matching processed vs fresh.",
      "FDA Center for Veterinary Medicine: Evaluation of Pathogens in Raw Diets.",
      "University of Helsinki: DogRisk study.",
      "AVMA & JAVMA: Thiamine deficiency risks and hydration roles in small animals.",
      "American Veterinary Dental College (AVDC): Periodontal health and diet texture.",
    ],
  },
} as const;

export interface KnowledgeArticleCopy {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: ReadonlyArray<{
    id: string;
    title: string;
    blocks: ReadonlyArray<{ label: string; text: string }>;
    pros?: readonly string[];
    cons?: readonly string[];
  }>;
  bibliography: readonly string[];
  sourcesHeading: string;
  bibliographyLabel: string;
  tocLabel: string;
  prosLabel: string;
  consLabel: string;
}

const ARTICLE_KA: KnowledgeArticleCopy = {
  ...KNOWLEDGE.article,
  eyebrow: "მეცნიერული მიმოხილვა",
  sourcesHeading: "გამოყენებული სამეცნიერო წყაროები და ლიტერატურა",
  bibliographyLabel: "ბიბლიოგრაფია (14 წყარო)",
  tocLabel: "სარჩევი",
  prosLabel: "უპირატესობები",
  consLabel: "შეზღუდვები",
};

const ARTICLE_EN: KnowledgeArticleCopy = {
  eyebrow: "Scientific overview",
  title:
    "A scientific review of dog food technologies: a summary of international research and dietary analysis",
  introduction:
    "The pet food industry has gone through a major transformation in recent years. Today's consumers face an ever wider range of choices and are no longer limited to a single standard. This review summarizes research carried out by independent scientific institutes, veterinary universities and nutrition laboratories. To build a complete and objective picture, the article analyzes the main types of diet in detail: extruded dry food (Kibble), unprocessed raw feeding (Raw/BARF), sterilized canned food (Canned) and gently cooked fresh food (Fresh food).",
  sections: [
    {
      id: "kibble",
      title: "Dry food (Kibble)",
      blocks: [
        {
          label: "Definition",
          text: '"Kibble" is food made by mixing grains, fats, vitamins and minerals into a uniform mass (a dough). The mass is then processed under high pressure and high temperature (mostly above 150°C), a process known as extrusion.',
        },
        {
          label: "The transparency problem",
          text: "Because of the way it is manufactured, it is practically impossible for consumers to identify the original form, quality and exact proportions of the ingredients (critical reviews of AAFCO standards point this out).",
        },
        {
          label: "Impact on nutrients",
          text: "Nutrient degradation (heat above 150°C destroys vitamins, which then have to be replaced with synthetic additives); the Maillard reaction creates inflammatory compounds; excess carbohydrates contribute to obesity; low moisture of around 10% puts strain on the kidneys (chronic dehydration).",
        },
      ],
      pros: [
        "Practical and convenient",
        "Affordable (budget-friendly)",
        "Hygiene and safety",
        "A nutritional balance standard (AAFCO norms)",
      ],
      cons: [
        "Low transparency",
        "Artificial additives, synthetic preservatives and emulsifiers (BHA, BHT, Ethoxyquin)",
        "Disrupted water balance",
        "Health risks (allergies)",
        "Monotonous taste",
      ],
    },
    {
      id: "fresh",
      title: "Fresh food",
      blocks: [
        {
          label: "Definition",
          text: 'The "golden mean" of veterinary nutrition. A minimally processed diet based on whole foods and made from human-grade ingredients. It contains no artificial preservatives.',
        },
        {
          label: "Technological advantages",
          text: "Gentle thermal processing (Gently Cooked). A clinical study from the University of Illinois (Algya et al., 2018) confirms digestibility and bioavailability above 90%.",
        },
      ],
      pros: [
        "High bioavailability",
        "Individual personalization (according to the Waltham Petcare Science Institute, it improves quality of life by 30%)",
        "Natural whole foods",
        "Natural hydration (~70% moisture; metabolic water supports kidney function)",
        "Excellent palatability",
        "Clean composition (Clean Label)",
      ],
      cons: [
        "Strict storage requirements (1 year in the freezer, only 5 days in the fridge after thawing)",
        "Nutritional balance is hard to guarantee across the market",
        "Bacterial safety risks (requires an unbroken cold chain at -18°C, per the FDA)",
        "Dietary adjustment period",
        "Higher cost and logistics",
      ],
    },
    {
      id: "raw",
      title: "Raw feeding (Raw / RMBD)",
      blocks: [
        {
          label: "Definition",
          text: "Known academically as RMBD (Raw Meat-Based Diets). It relies on the complete absence of thermal processing.",
        },
        {
          label: "Arguments and risks",
          text: "High bioavailability (the DogRisk project at the University of Helsinki notes the prevention of atopic dermatitis). However, it carries clinical risks (according to the FDA and AVMA, it is a source of pathogenic Salmonella and Listeria). UC Davis nutritionists point to nutritional imbalances when it is prepared at home.",
        },
        {
          label: "The alternative",
          text: "Gentle pasteurization (75-80°C) at Aylopet resolves this dilemma · it destroys pathogens while preserving bioavailability.",
        },
      ],
    },
    {
      id: "canned",
      title: "Canned food (Wet Food / Canned)",
      blocks: [
        {
          label: "Definition",
          text: 'Goes through "retort sterilization" (Retort Processing) in an autoclave at 121-135°C.',
        },
      ],
      pros: [
        "High moisture (75%-84%)",
        "Helps prevent urinary stone disease",
        "Fewer carbohydrates (recommended for diabetes)",
      ],
      cons: [
        "Thermal degradation of vitamins (especially B1, thiamine, per JAVMA)",
        "Texture additives (carrageenan irritates the gut)",
        "Oral hygiene problems (according to AVDC data, the soft texture speeds up plaque buildup)",
      ],
    },
  ],
  // The sources are cited in English in both languages.
  bibliography: KNOWLEDGE.article.bibliography,
  sourcesHeading: "Scientific sources and literature",
  bibliographyLabel: "Bibliography (14 sources)",
  tocLabel: "Contents",
  prosLabel: "Advantages",
  consLabel: "Limitations",
};

export function getKnowledgeArticle(
  locale: "ka" | "en",
): KnowledgeArticleCopy {
  return locale === "ka" ? ARTICLE_KA : ARTICLE_EN;
}
