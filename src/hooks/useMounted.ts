"use client";

import { useEffect, useState } from "react";

/** True after the component has mounted · use to gate client-only UI (motion, scroll). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  return mounted;
}
