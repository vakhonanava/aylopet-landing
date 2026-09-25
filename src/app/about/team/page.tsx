import type { Metadata } from "next";
import { TeamContent } from "@/components/about/TeamContent";
import { ABOUT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "ჩვენი გუნდი",
  description: ABOUT.team.body,
};

export default function TeamPage() {
  return <TeamContent />;
}
