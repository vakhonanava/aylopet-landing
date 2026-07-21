import type { Metadata } from "next";
import { FaqPageContent } from "@/components/marketing/FaqPageContent";

export const metadata: Metadata = {
  title: "Aylopet · FAQ",
  description:
    "ხშირად დასმული კითხვები AylopetAI-ს, AylopetPro-ს და ცოცხალი საკვების შესახებ.",
};

export default function FaqPage() {
  return <FaqPageContent />;
}
