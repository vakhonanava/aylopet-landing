"use client";

import { useCallback, useRef } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
}

export function useTilt(intensity = 12): {
  ref: React.RefObject<HTMLDivElement | null>;
  style: React.CSSProperties;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
} {
  const ref = useRef<HTMLDivElement>(null);
  const tilt = useRef<TiltState>({ rotateX: 0, rotateY: 0 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tilt.current = {
        rotateX: -y * intensity,
        rotateY: x * intensity,
      };
      el.style.transform = `rotateX(${tilt.current.rotateX}deg) rotateY(${tilt.current.rotateY}deg)`;
    },
    [intensity],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
  }, []);

  return {
    ref,
    style: { transformStyle: "preserve-3d", transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)" },
    onMouseMove,
    onMouseLeave,
  };
}
