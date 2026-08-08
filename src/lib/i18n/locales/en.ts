import type { Dictionary } from "@/lib/i18n/types";
import {
  dnaPortalEn,
  onboardingEn,
  quizGateEn,
  reviewsEn,
} from "@/lib/i18n/locales/onboarding-en";

export const en: Dictionary = {
  locale: "en",
  languageName: "English",
  common: {
    promoText: "Get 40% OFF! Join our waitlist now.",
    joinWaitlist: "Join Waitlist",
    joinWaitlistPromo: "Add to waiting list",
    joinWaitlistOffer: "Register and get an exclusive offer",
    charityMessage: "5% of revenue supports charity, join us.",
    login: "Log in",
    myPanel: "My dashboard",
    menuOpen: "Menu",
    menuClose: "Close",
    joinPetParents: "Join {count}+ pet parents already on the waitlist!",
    verifiedAdopters: "verified early adopters registered",
    earlyAdopterBadge: "Early Adopter · 40% OFF",
    tryAiAssistant: "AylopetAI",
    openFullChat: "Open full AylopetAI chat",
    backHome: "Home",
  },
  platformHub: {
    eyebrow: "Interactive platform",
    title: "Explore the Aylopet modules",
    description:
      "From waitlist signup to DNA insights, every tool built for your dog's health journey.",
    homeTitle: "Join now, start with AI care",
    homeDescription:
      "Waitlist and AylopetAI, two steps that put you first in line for access.",
    statusLive: "Live",
    statusWaitlist: "Waitlist",
    statusSoon: "Soon",
    features: [
      {
        label: "Early Adopter",
        title: "Join the waitlist",
        description: "Register · 40% off + free consultation.",
        open: "Open",
        status: "waitlist",
      },
      {
        label: "AylopetAI",
        title: "Interactive consultation",
        description: "Dynamic Q&A · personalized nutrition advice.",
        open: "Open",
        status: "waitlist",
      },
      {
        label: "DNA Platform",
        title: "Ultimate end product",
        description: "Genomic pipeline · health records, labs, and AI.",
        open: "Open",
        status: "soon",
      },
      {
        label: "B2B Partnerships",
        title: "Grow with Aylopet",
        description: "Clinics, retailers, and corporate programs.",
        open: "Open",
        status: "live",
      },
    ],
  },
  dnaScroll: {
    ariaLabel: "DNA genome experience",
    scrollHint: "scroll",
    portalCta: "DNA Platform",
    phases: [
      {
        eyebrow: "Phase 3 · Coming soon",
        title: "Your dog's genetics",
        body: "One simple cheek swab, Aylopet AI reads 230,000+ genetic markers for your companion.",
        stat: "230,000+",
        statLabel: "genetic markers",
      },
      {
        eyebrow: "AI analysis",
        title: "Metabolism, allergens, breed",
        body: "The genome becomes practical guidance, what to feed and what to watch for.",
        stat: "98.2%",
        statLabel: "breed confidence",
      },
      {
        eyebrow: "Personal ration",
        title: "Nutrition aligned with DNA",
        body: "Genetic profile + fresh food = a ration made only for your dog.",
        stat: "100%",
        statLabel: "personalized",
      },
    ],
  },
  landing: {
    hero: {
      titleLine1: "More years,",
      titleHighlight: "more love",
      titleLine2: "",
      emotionalLine:
        "Help your dog live longer, healthier with Aylopet.",
      identityTag: "For pet parents who expect more",
      subtitle:
        "Aylopet unites AI nutrition, genomic insights, and fresh food, data driven care, not just a ration.",
      techPlatform: "Tech platform",
      ctaNote: "Reserve your spot · no payment required now",
      metrics: [
        { value: "230K+", label: "genetic markers" },
        { value: "AI", label: "personal insights" },
        { value: "6", label: "step nutrition" },
        { value: "24/7", label: "digital monitoring" },
      ],
    },
    waitlist: {
      badge: "Waitlist · Reserve your spot",
      title: "Join the Early Adopter waitlist",
      description:
        "Help shape the product, get an exclusive discount and first access to the tech platform.",
    },
    chatbot: {
      eyebrow: "AylopetAI",
      title: "Talk to your pet's nutrition expert",
      description:
        "A living conversation, not a rigid quiz. Ask questions, share context, and get dynamic guidance in real time.",
      assistantName: "AylopetAI",
      online: "● Online",
      opening:
        "Hi! I'm AylopetAI, your personal nutritionist. Tell me about your dog, breed, age, and health goals, and I'll walk you through a personalized plan.",
      inputPlaceholder: "Ask about nutrition, allergies, portions...",
      sendLabel: "Send",
      ctaLabel: "Try AylopetAI For Your Dog",
      ctaGiftLabel: "Create My Nutrition Plan",
      ctaGiftAria: "Go to registration and create a personalized nutrition plan",
      suggestions: [
        "My dog is a 3yo Golden Retriever",
        "Help with weight management",
        "Check for chicken allergies",
      ],
      replies: {
        default:
          "Based on what you shared, I'd start with a gentle protein rotation and track stool quality for 10 days. Want me to estimate daily calories?",
        weight:
          "For weight goals, I'd calculate MER from current weight and activity, then split portions 55/45 morning/evening. Shall I draft a sample week?",
        allergy:
          "I'll cross check chicken, wheat, and beef triggers and suggest novel proteins like turkey or venison.",
        dna:
          "DNA insights layer on top, MDR1 status and breed metabolism can change portions by 8 to 15%. We gather records incrementally as you're ready.",
      },
    },
    b2b: {
      eyebrow: "B2B Partnerships",
      title: "Grow with Aylopet",
      description:
        "From veterinary clinics to retail networks, a pet health tech platform that drives loyalty and outcomes.",
      vetTitle: "Vet clinics",
      vetDescription:
        "White label tech, referral programs, and co branded nutrition plans.",
      shelterTitle: "Shelters & rescues",
      shelterDescription:
        "Subsidized rations, group health profiles, and post adoption support.",
      retailTitle: "Retail & ecommerce",
      retailDescription:
        "In store and online distribution, joint campaigns, and stock support.",
      corporateTitle: "Corporate & breeders",
      corporateDescription:
        "Employee pet benefits, bulk DNA screening, and breed specific programs.",
      cta: "Start B2B partnership inquiry",
    },
    dnaUnified: {
      badge: "Ultimate End Product",
      title: "DNA Platform · Journey & Portal, Unified",
      intro:
        "This is the ultimate end product we are building toward. To launch it fully, we gather information incrementally, you can share your dog's health history, vet records, and lab test analysis as you are ready.",
      stepLabel: "Step",
      backendNote:
        "Backend process validated for clinical grade traceability and transparency.",
      readyTitle: "Ready to start?",
      readyBody:
        "Join the waitlist to be first in line, early adopters get 40% OFF.",
      joinWaitlist: "Join Waitlist",
      tryAssistant: "Try AylopetAI",
      steps: [
        {
          title: "Share health history incrementally",
          body: "You can share your dog's health history, vet records, and lab test analysis with us, one step at a time, at your pace.",
        },
        {
          title: "Genomic sequencing & QC",
          body: "Cheek swab DNA is sequenced against 230,000+ markers. Our backend validates sample quality and breed specific risk alleles.",
        },
        {
          title: "AI fusion engine",
          body: "Clinical notes, lab values, and genomic data merge into a living digital pet profile.",
        },
        {
          title: "Nutrition & wellness modeling",
          body: "MER/RER, allergy filters, and breed metabolism models produce personalized food plans.",
        },
        {
          title: "Actionable output",
          body: "You receive a unified dashboard: genomic insights, vet ready reports, portion plans, and ongoing AI assistant guidance.",
        },
      ],
    },
  },
  b2b: {
    eyebrow: "For Business",
    title: "B2B Partnerships",
    subtitle:
      "Collaborate with Aylopet to bring AI nutrition, DNA insights, and fresh food to your customers.",
    backLabel: "Home",
  },
  b2bForm: {
    title: "What type of B2B partnership are you looking for with Aylopet?",
    subtitle:
      "Tell us about your organization and goals, we'll tailor a collaboration plan for you.",
    companyName: "Company name *",
    contactName: "Contact name *",
    workEmail: "Work email *",
    phone: "Phone *",
    partnershipType: "Partnership type *",
    customType: "Describe the partnership type *",
    customTypePlaceholder: "e.g. boarding facility, training centre...",
    partnershipGoals: "Partnership goals *",
    goalsPlaceholder:
      "Describe your audience, volume, and what you hope to achieve with Aylopet...",
    submit: "Submit partnership request",
    successTitle: "Thank you, we received your inquiry",
    successEmailed: "Our partnerships team will reach out within 2 business days.",
    successSaved: "Your request was saved securely. Our team will contact you soon.",
    partnershipTypes: {
      "vet-clinic": "Veterinary clinic / hospital",
      shelter: "Shelter or rescue organization",
      retail: "Pet retail or ecommerce",
      corporate: "Corporate employee benefits",
      breeder: "Breeder or kennel",
      manufacturer: "Manufacturer / supplier",
      other: "Other partnership",
    },
  },
  knowledgeHub: {
    title: "Pet Wellness Insights",
    subtext:
      "Evidence based guidance for your dog's whole wellbeing, nutrition is just one chapter. Explore food science today, with grooming, behavior, and preventive care launching soon.",
    categoriesTitle: "Wellness categories",
    readNow: "Read now",
    comingSoon: "Coming soon",
    articleDescription:
      "International research and dietological analysis, fresh food as one pillar of pet wellness.",
    categoryLabels: {
      nutrition: "Nutrition & fresh food",
      preventive: "Preventive wellness",
      behavior: "Behavior & enrichment",
      grooming: "Grooming & skin health",
    },
  },
  footer: {
    resources: "Resources",
    platform: "Platform",
    legal: "Legal",
    taglineSuffix: "AI nutrition and human grade fresh food.",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    cookies: "Cookie Policy",
    accessibility: "Accessibility",
  },
  waitlistForm: {
    quickTitle: "Join in 30 seconds",
    quickSubtitle: "Name, email, and phone, lock in your 40% discount.",
    name: "Your name *",
    namePlaceholder: "Your name",
    dogName: "Dog's name (optional)",
    dogNamePlaceholder: "e.g. Coco",
    city: "City",
    consent: "I agree to Aylopet terms and data processing",
    privacy: "No spam. Your data is used only for the waitlist.",
    submit: "Join waitlist · 40% OFF",
    fullProfileLink: "Full profile (dog details)",
    familiesJoined: "{count} families already on the waitlist",
    featureWishlist: "What features or products would you love to see added?",
    featureWishlistPlaceholder:
      "e.g. mobile app, multi dog profiles, vet record import...",
    email: "Email *",
    phone: "Phone *",
    invalidEmail: "Enter a valid email address",
    invalidPhone: "Phone must include at least 9 digits",
    successTitle: "You're on the list!",
    successRedirect: "Redirecting...",
  },
  valueComparison: {
    eyebrow: "Monthly value",
    title: "₾10 a month · same price, completely different impact",
    description:
      "One cup of coffee is ₾10 a day, one month of AylopetAI costs the same. The difference is what it gives your dog.",
    perDay: "per day",
    perMonth: "per month",
    coffee: {
      label: "Coffee",
      detail: "A 15 minute pick me up",
      duration: "~15 min",
      imageAlt: "Cup of coffee",
    },
    product: {
      label: "AylopetAI",
      detail: "Personal nutritionist · personalized plan 24/7",
      badge: "Health",
      bullets: [
        "Personal MER/RER and portions",
        "24/7 AI nutrition guidance",
      ],
      imageAlt: "Dog with AylopetAI platform",
    },
    punchline: "Your dog's health matters more than a cup of coffee.",
    cta: "Register and get an exclusive offer",
    priceNote:
      "Coffee ₾10/day · AylopetAI ₾10/month, full access for your dog.",
    lossTitle: "What you lose by waiting",
    lossItems: [
      "Locking in 40% off",
      "First AI consultation slot",
      "Limited Early Adopter spot",
    ],
    vetAnchor: "One vet visit ~80 to 150 ₾ · AylopetAI ~₾10/month",
  },
  scarcity: {
    filled: "{count}/{cap} Early Adopter spots filled",
    priceLocked: "40% price locked when you sign up",
    urgency: "Spots are filling, don't wait",
  },
  trustStrip: {
    items: [
      {
        title: "Vet backed nutrition",
        description: "Plans built on veterinary nutrition standards",
      },
      {
        title: "No payment now",
        description: "Joining the waitlist is completely free",
      },
      {
        title: "Data privacy",
        description: "Your and your dog's information stays protected",
      },
    ],
  },
  socialProof: {
    eyebrow: "Reviews",
    title: "Pet parents who trust Aylopet",
    description:
      "Early Adopter cohort experiences, real stories, real outcomes.",
    stats: [
      { value: "230K+", label: "genetic markers (DNA)" },
      { value: "AI", label: "AylopetAI" },
      { value: "40%", label: "Early Adopter discount" },
    ],
    testimonials: [
      {
        name: "Nino K.",
        dog: "Bella · Golden Retriever",
        quote:
          "Rex's energy and coat quality really changed. Portions are exactly matched to his weight.",
        imageKey: "storyPekingese",
      },
      {
        name: "Giorgi M.",
        dog: "Luka · French Bulldog",
        quote:
          "I love that everything is in one app, food, vaccines, and AI advice.",
        imageKey: "storyCaneCorso",
      },
      {
        name: "Mariam T.",
        dog: "Chipi · Mixed breed",
        quote:
          "Early Adopter gave us a midday consultation. The first week already shows results.",
        imageKey: "healthDog3D",
      },
    ],
  },
  earlyAccessSuccess: {
    title: "Thank you, {name}!",
    registered: "{dog} is registered in the Early Adopter program.",
    queuePosition: "You're #{position} in the queue. We'll email you soon.",
    nextTitle: "What happens next?",
    nextItems: [
      "We review your dog's profile",
      "You get a personalized ration plan",
      "40% off your first order",
    ],
    tryAi: "Try AylopetAI",
    backHome: "Back to home",
    shareTitle: "Share with friends",
    shareHint: "Invite another pet parent, when we launch, you both get a bonus.",
    shareButton: "Share",
    referralHint: "Your referral link will arrive by email soon.",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "3 steps, from waitlist to access",
    steps: [
      {
        title: "Join the waitlist",
        description: "30 second signup, lock in 40% off.",
      },
      {
        title: "Get Early Adopter status",
        description: "First access to AylopetAI and fresh food.",
      },
      {
        title: "Start personalized care",
        description: "AI nutrition, portions, and health tracking in one place.",
      },
    ],
    cta: "Register and get an exclusive offer",
  },
  homeFaq: {
    eyebrow: "Questions",
    title: "Common questions",
    viewAll: "All FAQs",
    items: [],
  },
  stickyCta: {
    label: "Register and get an exclusive offer",
  },
  projectStatus: {
    title: "Project status",
    subtitle: "Platform development stages · an emotional snapshot",
    phaseSoon: " · Soon",
    statusLive: "Live",
    statusActive: "Waitlist",
    statusSoon: "Soon",
    beAmongFirst: "Be among the first, registration is open now",
    phases: [
      {
        label: "Phase 1",
        title: "Gently Cooked fresh food",
        description: "Human grade meals · in production and early adopter delivery.",
        reaction: "Joy",
        reactionNote: "\"Finally, real food!\"",
        status: "live",
      },
      {
        label: "Phase 2",
        title: "AylopetAI & digital profile",
        description: "AI nutrition assistant and personal profile · on the waitlist.",
        reaction: "Excitement",
        reactionNote: "\"Can't wait for the first consultation!\"",
        status: "active",
      },
      {
        label: "Phase 3",
        title: "Aylopet Smart Collar",
        description: "GPS and health signals · integrated with Aylopet.",
        reaction: "Heartwarming delight",
        reactionNote: "\"I'd know where and how my dog is, every day.\"",
        status: "soon",
      },
      {
        label: "Phase 4 · Long term goal",
        title: "DNA Platform",
        description: "Genomic insights and health profile · the ultimate end product.",
        reaction: "Deep anticipation",
        reactionNote: "\"This will truly change everything.\"",
        status: "soon",
        horizonNote:
          "This is our most ambitious stage. It needs lab partnerships, regulatory approvals, and a large dataset, so it will take considerably longer than the other phases.",
      },
    ],
  },
  community: {
    waitlistTotal: "people on the waitlist",
    waitlistEmpty: "Be the first on the waitlist",
    waitlistNote:
      "Updates in real time · every signup helps us move the roadmap faster.",
    whatsappTitle: "Join the WhatsApp community",
    whatsappBody:
      "Talk to the team directly, get updates first, and swap notes with other dog parents.",
    whatsappCta: "Join WhatsApp group",
    whatsappSoon: "WhatsApp group link coming soon",
  },
  ambassador: {
    eyebrow: "Referral program",
    tierName: "Ambassadors",
    intro:
      "One status for everyone — no complicated ladder. You get the base package the moment you join.",
    basePointsLabel: "Base package",
    pointsSuffix: "points",
    upgradeRule:
      "Invite {count} active users and your status upgrades automatically.",
    progressLabel: "{count} invites to go",
    upgradedLabel: "Status upgraded",
  },
  userExpectations: {
    eyebrow: "Your voice",
    question: "What would you like added? What do you expect from Aylopet?",
    subtitle: "Pick one option and see what the community is waiting for",
    freshFood: "Fresh food",
    aylopetAi: "AylopetAI",
    dna: "DNA platform",
    smartCollar: "Aylopet Smart Collar",
    vetConsult: "Vet consultation",
    other: "Other",
    noteLabel: "What are you hoping for?",
    notePlaceholder: "Briefly share what you'd like or expect…",
    emailLabel: "Email",
    emailPlaceholder: "name@example.com",
    emailOptional: "(optional)",
    submit: "Cast vote",
    submitting: "Submitting…",
    voted: "Your vote is in!",
    resultsTitle: "Community expectations",
    totalVotes: "Total votes",
    voteCount: "{count} votes",
    alreadyVoted: "You've already voted",
    error: "Could not submit vote",
    selectOption: "Select an option",
  },
  onboarding: onboardingEn,
  quizGate: quizGateEn,
  reviews: reviewsEn,
  dnaPortal: dnaPortalEn,
};
