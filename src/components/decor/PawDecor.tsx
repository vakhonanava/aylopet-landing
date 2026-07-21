import Image from "next/image";

const PAW_SRC = "/images/paw-print.svg";

export type PawDecorDensity = "light" | "medium" | "trail";

interface PawMark {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate: number;
  opacity: number;
}

const LAYOUTS: Record<PawDecorDensity, PawMark[]> = {
  light: [
    { top: "6%", right: "5%", size: 44, rotate: 22, opacity: 0.1 },
    { bottom: "12%", left: "4%", size: 52, rotate: -14, opacity: 0.08 },
    { top: "42%", left: "2%", size: 36, rotate: 8, opacity: 0.07 },
  ],
  medium: [
    { top: "4%", right: "6%", size: 48, rotate: 18, opacity: 0.11 },
    { top: "28%", left: "3%", size: 40, rotate: -12, opacity: 0.09 },
    { top: "55%", right: "4%", size: 56, rotate: -24, opacity: 0.1 },
    { bottom: "10%", left: "5%", size: 44, rotate: 10, opacity: 0.08 },
    { bottom: "32%", right: "8%", size: 32, rotate: 32, opacity: 0.07 },
  ],
  trail: [
    { top: "8%", left: "12%", size: 34, rotate: -28, opacity: 0.1 },
    { top: "14%", left: "22%", size: 38, rotate: -18, opacity: 0.11 },
    { top: "20%", left: "32%", size: 42, rotate: -8, opacity: 0.12 },
    { top: "26%", left: "42%", size: 46, rotate: 4, opacity: 0.11 },
    { bottom: "18%", right: "14%", size: 40, rotate: 20, opacity: 0.09 },
    { bottom: "10%", right: "24%", size: 36, rotate: 30, opacity: 0.08 },
    { top: "48%", right: "3%", size: 50, rotate: -16, opacity: 0.08 },
  ],
};

interface PawDecorProps {
  density?: PawDecorDensity;
  className?: string;
}

/** Playful scattered paw prints for empty whitespace · pointer-events-none, decorative only. */
export function PawDecor({ density = "medium", className = "" }: PawDecorProps) {
  const marks = LAYOUTS[density];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {marks.map((mark, i) => (
        <Image
          key={i}
          src={PAW_SRC}
          alt=""
          width={mark.size}
          height={mark.size}
          className="absolute select-none paw-float"
          style={{
            top: mark.top,
            bottom: mark.bottom,
            left: mark.left,
            right: mark.right,
            opacity: mark.opacity,
            ["--paw-rotate" as string]: `${mark.rotate}deg`,
            animationDelay: `${i * 0.45}s`,
          }}
          draggable={false}
        />
      ))}
    </div>
  );
}
