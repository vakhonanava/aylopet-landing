import type { Metadata } from "next";
import { B2BPageContent } from "@/components/b2b/B2BPageContent";

export const metadata: Metadata = {
  title: "Aylopet · B2B პარტნიორობა",
  description:
    "გახდი Aylopet-ის პარტნიორი: ვეტკლინიკები, პეტ-მაღაზიები, თავშესაფრები და ბიზნესები ოთხფეხა მეგობრების უკეთესი მომავლისთვის.",
};

export default function B2BPage() {
  return <B2BPageContent />;
}
