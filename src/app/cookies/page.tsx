import type { Metadata } from "next";
import { LegalPageContent } from "@/components/marketing/LegalPageContent";

export const metadata: Metadata = {
  title: "Aylopet · ქუქი პოლიტიკა",
  description: "How Aylopet uses cookies and similar technologies on aylopet.com.",
};

export default function CookiesPage() {
  return <LegalPageContent page="cookies" />;
}
