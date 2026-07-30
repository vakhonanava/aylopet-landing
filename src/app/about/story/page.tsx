import type { Metadata } from "next";
import { StoryContent } from "@/components/about/StoryContent";
import { ABOUT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Aylopet · ჩვენი ისტორია",
  description: ABOUT.story.body.slice(0, 160),
};

export default function StoryPage() {
  return <StoryContent />;
}
