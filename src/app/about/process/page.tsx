import type { Metadata } from "next";
import { ProcessContent } from "@/components/about/ProcessContent";
import { ABOUT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Aylopet · წარმოების პროცესი და ხარისხი",
  description: ABOUT.process.subInfo.slice(0, 160),
};

export default function ProcessPage() {
  return <ProcessContent />;
}
