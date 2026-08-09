import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import {
  OG_DESCRIPTION,
  OG_IMAGE,
  OG_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE,
  SITE_URL,
  BRAND_NAME,
  organizationSchema,
  webSiteSchema,
} from "@/lib/seo";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME, url: SITE_URL }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: BRAND_NAME,
    locale: "ka_GE",
    alternateLocale: ["en_US"],
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ka"
      suppressHydrationWarning
      className={`${nunitoSans.variable} ${lora.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          // `<` is escaped so schema strings can never terminate the script tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, webSiteSchema]).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        <AuthProvider>
          <LocaleProvider>
            <GlobalHeader />
            {children}
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
