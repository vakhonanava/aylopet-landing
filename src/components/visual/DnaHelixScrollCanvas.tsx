"use client";

import { useMotionValueEvent, motionValue, type MotionValue } from "framer-motion";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DnaHelix3D } from "@/components/visual/DnaHelix3D";
import { DnaDataStream } from "@/components/visual/DnaDataStream";

interface DnaHelixScrollCanvasProps {
  progress: number | MotionValue<number>;
  className?: string;
  flowSpeed?: number;
  interactive?: boolean;
  showDataStream?: boolean;
}

function useProgressValue(progress: number | MotionValue<number>): number {
  const mv = useMemo(
    () =>
      typeof progress === "object" && progress
        ? progress
        : motionValue(typeof progress === "number" ? progress : 0),
    [progress],
  );
  const [value, setValue] = useState(() =>
    typeof progress === "number" ? progress : mv.get(),
  );

  useMotionValueEvent(mv, "change", setValue);

  return typeof progress === "number" ? progress : value;
}

export function DnaHelixScrollCanvas({
  progress,
  className = "",
  flowSpeed = 0.035,
  interactive = false,
  showDataStream = true,
}: DnaHelixScrollCanvasProps) {
  const p = useProgressValue(progress);
  const { locale } = useLocale();
  const scanTop = `${8 + p * 78}%`;

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,#0a1f2e_0%,#030b12_70%)] ${className}`}
    >
      <DnaHelix3D
        progress={p}
        highlightRatio={p}
        interactive={interactive}
        autoRotate={false}
        flowSpeed={flowSpeed}
        variant="dark"
        config={{ rungs: 72, radius: 88, spacing: 10.2, digitalStart: 0.42 }}
      />

      {showDataStream && <DnaDataStream progress={p} locale={locale} />}

      <div
        className="pointer-events-none absolute left-[10%] right-[10%] z-[3] h-px rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.7)]"
        style={{ top: scanTop }}
      />

      <div className="pointer-events-none absolute inset-[9%] z-[1] rounded-full border border-cyan-400/10" />
    </div>
  );
}
