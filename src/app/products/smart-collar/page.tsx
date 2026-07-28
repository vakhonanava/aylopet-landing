import type { Metadata } from "next";
import { SmartCollarPageContent } from "@/components/products/SmartCollarPageContent";

export const metadata: Metadata = {
  title: "Aylopet Smart Collar · ჭკვიანი ყელსაბამი",
  description:
    "Aylopet Smart Collar: GPS, activity tracking, and AI calculated real time calorie needs, the smart collar integrated with the Aylopet platform.",
};

export default function SmartCollarPage() {
  return <SmartCollarPageContent />;
}
