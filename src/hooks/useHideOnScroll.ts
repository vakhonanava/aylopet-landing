"use client";

import { useEffect, useRef, useState } from "react";

/** Hides the header when scrolling down; shows when scrolling up or near top. */
export function useHideOnScroll(threshold = 12) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      if (y <= 64) {
        setHidden(false);
      } else if (y > lastY.current + threshold) {
        setHidden(true);
      } else if (y < lastY.current - threshold) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
