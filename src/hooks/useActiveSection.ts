"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Picks the section whose vertical center is closest to the viewport center.
 * Reliable for tall sticky scrollytelling blocks.
 */
export function useActiveSection(refs: RefObject<HTMLElement | null>[]): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const viewportCenter = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDistance = Infinity;

      refs.forEach((ref, idx) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIdx = idx;
        }
      });

      setActive(bestIdx);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [refs]);

  return active;
}
