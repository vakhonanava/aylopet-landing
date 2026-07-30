import type { Metadata } from "next";
import { VisionContent } from "@/components/about/VisionContent";
import { ABOUT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Aylopet · კომპანიის ხედვა",
  description: ABOUT.vision.body.slice(0, 160),
};

export default function VisionPage() {
  return <VisionContent />;
}
