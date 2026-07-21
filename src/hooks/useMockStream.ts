"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseMockStreamOptions {
  text: string;
  charDelayMs?: number;
  autoStart?: boolean;
}

export function useMockStream({
  text,
  charDelayMs = 18,
  autoStart = false,
}: UseMockStreamOptions) {
  const [displayed, setDisplayed] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsStreaming(false);
  }, []);

  const start = useCallback(
    (overrideText?: string) => {
      stop();
      const target = overrideText ?? text;
      indexRef.current = 0;
      setDisplayed("");
      setIsStreaming(true);

      const tick = () => {
        const nextIndex = indexRef.current + 1;
        indexRef.current = nextIndex;
        setDisplayed(target.slice(0, nextIndex));

        if (nextIndex < target.length) {
          timerRef.current = setTimeout(tick, charDelayMs);
        } else {
          setIsStreaming(false);
        }
      };

      timerRef.current = setTimeout(tick, charDelayMs);
    },
    [charDelayMs, stop, text],
  );

  useEffect(() => {
    if (!autoStart) return;
    const frame = requestAnimationFrame(() => start());
    return () => {
      cancelAnimationFrame(frame);
      stop();
    };
  }, [autoStart, start, stop]);

  return { displayed, isStreaming, start, stop };
}
