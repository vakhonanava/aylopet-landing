import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

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
  title: "Aylopet · ძაღლის ცოცხალი საკვები",
  description:
    "აღმოაჩინე ნაზად მომზადებული რაციონის ძალა. Aylopet · ევოლუციური ხიდი ველურ ინსტინქტებსა და თანამედროვე უსაფრთხოებას შორის.",
  openGraph: {
    title: "Aylopet · ძაღლის ცოცხალი საკვები",
    description:
      "ნაზი დამუშავების (Gently Cooked) მეთოდით მომზადებული, ბიოლოგიურად აქტიური რაციონი.",
    locale: "ka_GE",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

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
