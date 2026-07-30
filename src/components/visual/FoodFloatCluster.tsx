"use client";

import { motion } from "framer-motion";
import {
  AppleIcon,
  BroccoliIcon,
  ChickenBreastIcon,
  SalmonIcon,
  SteakIcon,
  SweetPotatoIcon,
} from "@/components/visual/FoodIcons";

interface FoodEntry {
  Icon: typeof SteakIcon;
  top: string;
  left: string;
  width: string;
  rotate: number;
  duration: number;
  delay: number;
}

const FOODS: FoodEntry[] = [
  { Icon: SteakIcon, top: "34%", left: "6%", width: "34%", rotate: -6, duration: 6.5, delay: 0 },
  { Icon: AppleIcon, top: "4%", left: "4%", width: "20%", rotate: 8, duration: 5.5, delay: 0.6 },
  { Icon: ChickenBreastIcon, top: "8%", left: "58%", width: "26%", rotate: -5, duration: 7, delay: 1.2 },
  { Icon: BroccoliIcon, top: "60%", left: "2%", width: "24%", rotate: 5, duration: 6, delay: 1.8 },
  { Icon: SweetPotatoIcon, top: "64%", left: "34%", width: "28%", rotate: -4, duration: 6.8, delay: 0.9 },
  { Icon: SalmonIcon, top: "44%", left: "62%", width: "32%", rotate: 7, duration: 7.4, delay: 0.3 },
];

/** Flat 2D still-life · steak, chicken, broccoli, salmon, sweet potato, apple · gently floating cluster. */
export function FoodFloatCluster() {
  return (
    <div className="relative h-full w-full">
      {FOODS.map(({ Icon, top, left, width, rotate, duration, delay }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top,
            left,
            width,
            filter: "drop-shadow(0 8px 12px rgba(60,40,20,0.18))",
          }}
          initial={{ rotate }}
          animate={{ y: [0, -10, 0], rotate: [rotate, rotate + 4, rotate] }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Icon className="h-auto w-full" />
        </motion.div>
      ))}
    </div>
  );
}
