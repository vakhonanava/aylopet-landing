"use client";

import { FoodFloatCluster } from "@/components/visual/FoodFloatCluster";
import { FloatingOrb, ScenePedestal } from "@/components/visual/FloatingOrb";

interface FreshFruitSceneProps {
  className?: string;
  locale?: "ka" | "en";
  badgeLabel?: string;
  captionLabel?: string;
}

const DEFAULT_BADGE: Record<"ka" | "en", string> = {
  ka: "100% ბუნებრივი",
  en: "100% Natural",
};

const DEFAULT_CAPTION: Record<"ka" | "en", string> = {
  ka: "ხორცი, თევზი და ბოსტნეული",
  en: "Meat, fish and vegetables",
};

/** Flat ingredient still-life · steak, chicken, broccoli, salmon, sweet potato, apple · for fresh-food brand moments. */
export function FreshFruitScene({
  className = "",
  locale = "ka",
  badgeLabel,
  captionLabel,
}: FreshFruitSceneProps) {
  const badge = badgeLabel ?? DEFAULT_BADGE[locale];
  const caption = captionLabel ?? DEFAULT_CAPTION[locale];
  return (
    <div
      className={`scene-3d-root relative aspect-square w-full max-w-md ${className}`}
      style={{ perspective: "1200px" }}
    >
      <FloatingOrb
        className="-left-6 top-4 opacity-50"
        color="var(--brand-accent)"
        size="130px"
        delay={0.3}
      />
      <FloatingOrb
        className="-right-4 bottom-10 opacity-45"
        color="var(--terracotta)"
        size="100px"
        delay={1.4}
      />

      <div className="relative h-full w-full">
        <div
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-bento)] border border-white/60 bg-gradient-to-b from-[var(--background-main)] via-[#f7f4ef] to-[var(--background-secondary)] shadow-organic"
          style={{ transform: "translateZ(20px)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 65% 45% at 50% 30%, rgba(232,160,122,0.14), transparent 60%), radial-gradient(ellipse 50% 40% at 65% 75%, rgba(107,143,113,0.12), transparent 55%)",
            }}
          />

          {badge ? (
            <span className="absolute right-3 top-3 z-30 rounded-full border border-white/50 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-primary)] shadow-soft backdrop-blur-sm sm:right-4 sm:top-4 sm:text-[11px]">
              {badge}
            </span>
          ) : null}

          <div className="relative min-h-0 flex-1">
            <FoodFloatCluster />
          </div>

          {caption ? (
            <div className="glass absolute bottom-3 left-3 right-3 z-30 flex items-center rounded-xl px-3 py-2 sm:bottom-4 sm:left-4 sm:right-4 sm:px-4 sm:py-2.5">
              <span className="text-[11px] font-semibold text-[var(--text-primary)] sm:text-xs">
                {caption}
              </span>
            </div>
          ) : null}
        </div>

        <ScenePedestal className="bottom-[-6%] w-full" />
      </div>
    </div>
  );
}
