/**
 * Central SEO constants and Schema.org builders.
 *
 * Brand discovery note: Georgian users search the brand phonetically as
 * "ეილოფეთი" and (mis-spelled) "ელიოფეთი". Both transliterations are carried in
 * the metadata keywords and in `alternateName` on the Organization/WebSite
 * entities so Google can resolve them to the same brand.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://aylopet.com";

export const BRAND_NAME = "Aylopet";
export const BRAND_LEGAL_NAME = "Aylopet LLC";

/** Georgian phonetic spellings of the brand, used for alternateName + keywords. */
export const BRAND_ALTERNATE_NAMES = ["ეილოფეთი", "ელიოფეთი"] as const;

export const SITE_TITLE =
  "Aylopet (ეილოფეთი) | AI & DNA Pet Health Tech Platform";

export const SITE_DESCRIPTION =
  "Aylopet (ეილოფეთი) არის ინოვაციური Pet Health Tech პლატფორმა, რომელიც AI-ისა და დნმ ანალიზის მეშვეობით ზრუნავს თქვენი ოთხფეხა მეგობრის ჯანმრთელობასა და ხანგრძლივ სიცოცხლეზე.";

export const OG_TITLE = "Aylopet (ეილოფეთი) - AI & DNA Pet Health Tech";

export const OG_DESCRIPTION =
  "AI-ზე და დნმ ანალიზზე დაფუძნებული პლატფორმა თქვენი ოთხფეხა მეგობრების ჯანმრთელობისთვის.";

export const SITE_KEYWORDS = [
  "Aylopet",
  "ეილოფეთი",
  "ელიოფეთი",
  "Pet Health Tech",
  "Dog DNA Test",
  "Pet AI Assistant",
  "Pet Wellness",
];

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Aylopet (ეილოფეთი) — AI & DNA Pet Health Tech",
};

export const LOGO_URL = `${SITE_URL}/logo.png`;

/** Social profiles — add URLs here as they go live so Google can link the entity. */
export const SOCIAL_PROFILES: string[] = [];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND_NAME,
  legalName: BRAND_LEGAL_NAME,
  alternateName: [...BRAND_ALTERNATE_NAMES],
  url: SITE_URL,
  logo: LOGO_URL,
  image: `${SITE_URL}${OG_IMAGE.url}`,
  description: "Pet Health Tech platform utilizing AI & DNA insights for pets.",
  email: "support@aylopet.com",
  telephone: "+995595885625",
  address: {
    "@type": "PostalAddress",
    streetAddress: "David Aghmashenebeli Avenue, No. 200",
    addressLocality: "Samtredia",
    addressCountry: "GE",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@aylopet.com",
      telephone: "+995595885625",
      availableLanguage: ["ka", "en"],
    },
  ],
  sameAs: SOCIAL_PROFILES,
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: BRAND_NAME,
  alternateName: [...BRAND_ALTERNATE_NAMES],
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: ["ka-GE", "en"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};
