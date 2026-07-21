"use client";

import { motion } from "framer-motion";

interface FloatingOrbProps {
  className?: string;
  color?: string;
  delay?: number;
  size?: string;
}

export function FloatingOrb({
  className = "",
  color = "var(--brand-accent)",
  delay = 0,
  size = "120px",
}: FloatingOrbProps) {
  return (
    <motion.span
      aria-hidden
      className={`floating-orb pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
      }}
      animate={{ y: [0, -14, 0], x: [0, 8, 0], scale: [1, 1.06, 1] }}
      transition={{
        duration: 7,
        repeat: Infinity,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  );
}

interface ScenePedestalProps {
  className?: string;
}

export function ScenePedestal({ className = "" }: ScenePedestalProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${className}`}
      style={{ transform: "translateX(-50%) translateZ(-40px)" }}
    >
      <div
        className="h-4 w-[72%] rounded-[100%] opacity-40 blur-md"
        style={{
          background:
            "radial-gradient(ellipse, rgba(13,46,39,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="mx-auto -mt-1 h-2 w-[55%] rounded-[100%] opacity-25"
        style={{
          background:
            "radial-gradient(ellipse, rgba(13,46,39,0.5) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
