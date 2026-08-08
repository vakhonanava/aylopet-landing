export type Locale = "ka" | "en";

export interface PlatformFeatureCopy {
  label: string;
  title: string;
  description: string;
  open: string;
  status: "live" | "waitlist" | "soon";
}

export interface PlatformHubCopy {
  eyebrow: string;
  title: string;
  description: string;
  homeTitle: string;
  homeDescription: string;
  statusLive: string;
  statusWaitlist: string;
  statusSoon: string;
  features: PlatformFeatureCopy[];
}

export interface DnaPhaseCopy {
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
}

export interface DnaScrollCopy {
  ariaLabel: string;
  scrollHint: string;
  portalCta: string;
  phases: DnaPhaseCopy[];
}

export interface OnboardingCopy {
  meta: {
    eyebrow: string;
    title: string;
    description: string;
  };
}

export interface QuizGateCopy {
  title: string;
  description: string;
  ctaRegister: string;
  ctaHome: string;
  waitingNote: string;
}

export interface ReviewsCopy {
  title: string;
  description: string;
  editTitle: string;
  editSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  dogInfo: string;
  dogInfoPlaceholder: string;
  quote: string;
  quotePlaceholder: string;
  rating: string;
  save: string;
  saved: string;
  submitReview: string;
  photoLabel: string;
  photoHint: string;
  addPhoto: string;
  removePhoto: string;
  photoTooLarge: string;
  loginPrompt: string;
  loginCta: string;
  noReviews: string;
  /** Explains what the comment area is for, shown above the collapsed trigger. */
  sectionHelper: string;
  /** Trigger that expands the collapsed comment form. */
  writeCta: string;
  /** Collapses the expanded comment form. */
  closeForm: string;
  /** Shown instead of the form when nobody is signed in. */
  authRequired: string;
  authLoginCta: string;
  authRegisterCta: string;
}

export interface DnaPortalCopy {
  badge: string;
  title: string;
  description: string;
  features: string[];
  ctaWaitlist: string;
  ctaNutrition: string;
  note: string;
}

export interface CommonCopy {
  promoText: string;
  joinWaitlist: string;
  /** Primary waitlist action · hero CTA and the mobile menu button. */
  joinWaitlistPromo: string;
  /** Secondary waitlist CTA · offer-led wording for sticky/section triggers */
  joinWaitlistOffer: string;
  charityMessage: string;
  login: string;
  myPanel: string;
  menuOpen: string;
  menuClose: string;
  joinPetParents: string;
  verifiedAdopters: string;
  earlyAdopterBadge: string;
  tryAiAssistant: string;
  openFullChat: string;
  backHome: string;
}

export interface LandingHeroCopy {
  titleLine1: string;
  titleHighlight: string;
  titleLine2: string;
  emotionalLine: string;
  identityTag: string;
  subtitle: string;
  techPlatform: string;
  ctaNote: string;
  metrics: { value: string; label: string }[];
}

export interface LandingWaitlistCopy {
  badge: string;
  title: string;
  description: string;
}

export interface WaitlistFormCopy {
  quickTitle: string;
  quickSubtitle: string;
  name: string;
  namePlaceholder: string;
  dogName: string;
  dogNamePlaceholder: string;
  city: string;
  consent: string;
  privacy: string;
  submit: string;
  fullProfileLink: string;
  familiesJoined: string;
  featureWishlist: string;
  featureWishlistPlaceholder: string;
  email: string;
  phone: string;
  invalidEmail: string;
  invalidPhone: string;
  successTitle: string;
  successRedirect: string;
}

export interface FooterCopy {
  resources: string;
  platform: string;
  legal: string;
  taglineSuffix: string;
  rights: string;
  privacy: string;
  terms: string;
  cookies: string;
  accessibility: string;
}

export interface LandingChatbotCopy {
  eyebrow: string;
  title: string;
  description: string;
  assistantName: string;
  online: string;
  opening: string;
  inputPlaceholder: string;
  sendLabel: string;
  ctaLabel: string;
  /** Pinned CTA label shown once the demo's gift-announcement card is reached. */
  ctaGiftLabel: string;
  /** Accessible label for the gift CTA link, mentioning the registration destination. */
  ctaGiftAria: string;
  suggestions: [string, string, string];
  replies: {
    default: string;
    weight: string;
    allergy: string;
    dna: string;
  };
}

export interface LandingB2bCopy {
  eyebrow: string;
  title: string;
  description: string;
  vetTitle: string;
  vetDescription: string;
  shelterTitle: string;
  shelterDescription: string;
  retailTitle: string;
  retailDescription: string;
  corporateTitle: string;
  corporateDescription: string;
  cta: string;
}

export interface DnaUnifiedCopy {
  badge: string;
  title: string;
  intro: string;
  details?: string[];
  stepLabel: string;
  backendNote: string;
  readyTitle: string;
  readyBody: string;
  joinWaitlist: string;
  tryAssistant: string;
  steps: { title: string; body: string }[];
}

export interface B2bFormCopy {
  title: string;
  subtitle: string;
  companyName: string;
  contactName: string;
  workEmail: string;
  phone: string;
  partnershipType: string;
  /** Shown only when partnership type is "other". */
  customType: string;
  customTypePlaceholder: string;
  partnershipGoals: string;
  goalsPlaceholder: string;
  submit: string;
  successTitle: string;
  successEmailed: string;
  successSaved: string;
  partnershipTypes: Record<string, string>;
}

export interface B2bPageCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  backLabel: string;
}

export interface KnowledgeHubCopy {
  title: string;
  subtext: string;
  categoriesTitle: string;
  readNow: string;
  comingSoon: string;
  articleDescription: string;
  categoryLabels: {
    nutrition: string;
    preventive: string;
    behavior: string;
    grooming: string;
  };
}

export interface HowItWorksCopy {
  eyebrow: string;
  title: string;
  steps: { title: string; description: string }[];
  cta: string;
}

export interface HomeFaqCopy {
  eyebrow: string;
  title: string;
  viewAll: string;
  items: { title: string; content: string }[];
}

export interface StickyCtaCopy {
  label: string;
}

export interface ValueComparisonCopy {
  eyebrow: string;
  title: string;
  description: string;
  perDay: string;
  perMonth: string;
  coffee: {
    label: string;
    detail: string;
    duration: string;
    imageAlt: string;
  };
  product: {
    label: string;
    detail: string;
    badge: string;
    bullets: string[];
    imageAlt: string;
  };
  lossTitle: string;
  lossItems: string[];
  vetAnchor: string;
  vetAnchorSecondary?: string;
  punchline: string;
  cta: string;
  priceNote: string;
}

export interface ScarcityCopy {
  filled: string;
  priceLocked: string;
  urgency: string;
}

export interface TrustStripCopy {
  items: { title: string; description: string }[];
}

export interface SocialProofCopy {
  eyebrow: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  testimonials: {
    name: string;
    dog: string;
    quote: string;
    imageKey: "storyPekingese" | "storyCaneCorso" | "healthDog3D";
  }[];
}

export interface EarlyAccessSuccessCopy {
  title: string;
  registered: string;
  queuePosition: string;
  nextTitle: string;
  nextItems: [string, string, string];
  tryAi: string;
  backHome: string;
  shareTitle: string;
  shareHint: string;
  shareButton: string;
  referralHint: string;
}

export interface ProjectPhaseCopy {
  label: string;
  title: string;
  description: string;
  reaction: string;
  reactionNote: string;
  status: "live" | "active" | "soon";
  /** Extra caveat rendered under the card · e.g. long-term horizon. */
  horizonNote?: string;
}

export interface ProjectStatusCopy {
  title: string;
  subtitle: string;
  phaseSoon: string;
  statusLive: string;
  statusActive: string;
  statusSoon: string;
  beAmongFirst: string;
  phases: ProjectPhaseCopy[];
}

export interface AmbassadorCopy {
  eyebrow: string;
  tierName: string;
  intro: string;
  basePointsLabel: string;
  pointsSuffix: string;
  upgradeRule: string;
  progressLabel: string;
  upgradedLabel: string;
}

export interface PetPricingCopy {
  eyebrow: string;
  title: string;
  firstPetLabel: string;
  firstPetNote: string;
  secondPetLabel: string;
  secondPetNote: string;
  totalLabel: string;
  lockedNote: string;
  limitNote: string;
  familySharingTag: string;
}

export interface CommunityCopy {
  waitlistTotal: string;
  /** Shown in place of the number while the waitlist total is still 0. */
  waitlistEmpty: string;
  waitlistNote: string;
  whatsappTitle: string;
  whatsappBody: string;
  whatsappCta: string;
  whatsappSoon: string;
}

export interface UserExpectationsCopy {
  eyebrow: string;
  question: string;
  subtitle: string;
  freshFood: string;
  aylopetAi: string;
  dna: string;
  smartCollar: string;
  vetConsult: string;
  other: string;
  noteLabel: string;
  notePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailOptional: string;
  submit: string;
  submitting: string;
  voted: string;
  resultsTitle: string;
  totalVotes: string;
  voteCount: string;
  alreadyVoted: string;
  error: string;
  selectOption: string;
}

export interface Dictionary {
  locale: Locale;
  languageName: string;
  common: CommonCopy;
  platformHub: PlatformHubCopy;
  dnaScroll: DnaScrollCopy;
  landing: {
    hero: LandingHeroCopy;
    waitlist: LandingWaitlistCopy;
    chatbot: LandingChatbotCopy;
    b2b: LandingB2bCopy;
    dnaUnified: DnaUnifiedCopy;
  };
  footer: FooterCopy;
  waitlistForm: WaitlistFormCopy;
  b2b: B2bPageCopy;
  b2bForm: B2bFormCopy;
  knowledgeHub: KnowledgeHubCopy;
  valueComparison: ValueComparisonCopy;
  scarcity: ScarcityCopy;
  trustStrip: TrustStripCopy;
  socialProof: SocialProofCopy;
  earlyAccessSuccess: EarlyAccessSuccessCopy;
  howItWorks: HowItWorksCopy;
  homeFaq: HomeFaqCopy;
  stickyCta: StickyCtaCopy;
  projectStatus: ProjectStatusCopy;
  community: CommunityCopy;
  ambassador: AmbassadorCopy;
  petPricing: PetPricingCopy;
  userExpectations: UserExpectationsCopy;
  onboarding: OnboardingCopy;
  quizGate: QuizGateCopy;
  reviews: ReviewsCopy;
  dnaPortal: DnaPortalCopy;
}
