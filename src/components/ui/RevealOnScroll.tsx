"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

const variants: Variants = {
  hidden: (custom: { y: number }) => ({
    opacity: 0,
    y: custom.y,
  }),
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 20,
}: RevealOnScrollProps) {
  return (
    <motion.div
      className={className}
      custom={{ y }}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
