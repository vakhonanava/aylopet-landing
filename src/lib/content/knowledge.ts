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
            text: "ნაზი პასტერიზაცია (70-75°C) Aylopet-ში ხსნის ამ დილემას · ანადგურებს პათოგენებს, მაგრამ ინარჩუნებს ბიოშეღწევადობას.",
          },
        ],
      },
      {
        id: "canned",
        title: "კონსერვირებული საკვები (Wet Food / Canned)",
        blocks: [
          {
            label: "განმარტება",
            text: 'გადის "რეტორტულ სტერილიზაციას" (Retort Processing) ავტოკლავში 121°C - 135°C-ზე.',
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
