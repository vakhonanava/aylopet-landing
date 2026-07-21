"use client";

import {
  AnimatePresence,
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AylopetLogo } from "@/components/brand/AylopetLogo";
import { useTilt } from "@/hooks/useTilt";
import { useMounted } from "@/hooks/useMounted";
import { FloatingOrb, ScenePedestal } from "@/components/visual/FloatingOrb";
import { FOOD_LAYERS, type FoodLayer } from "@/lib/content/food-layers";

export type { FoodLayer };

const TOSS_LAYERS = FOOD_LAYERS.filter((l) => l.id !== "base");
const BASE_LAYER = FOOD_LAYERS.find((l) => l.id === "base")!;

/** Per-slice toss arc: start x%, peak y offset, settle stack index (0 = top) */
const TOSS_ARCS = [
  { startX: -28, peakX: -8, peakY: -42, rotate: -18, delay: 0 },
  { startX: 22, peakX: 10, peakY: -48, rotate: 14, delay: 0.18 },
  { startX: -12, peakX: -2, peakY: -55, rotate: -8, delay: 0.36 },
  { startX: 18, peakX: 6, peakY: -38, rotate: 22, delay: 0.52 },
] as const;

const CYCLE_MS = 9000;
const SLASH_AT = 2.4;
const SETTLE_AT = 3.1;

type Phase = "toss" | "slash" | "settle" | "hold";

interface FoodLayersVisualProps {
  locale?: "ka" | "en";
  /** 0 to 1 scroll boost · lifts the settled stack while scrolling */
  scrollBoost?: number | MotionValue<number>;
  compact?: boolean;
  fill?: boolean;
  className?: string;
  tilt?: boolean;
  showLabels?: boolean;
  play?: boolean;
}

function layerBackground(layer: FoodLayer): string {
  const tint = `linear-gradient(145deg, ${layer.highlight}e6, ${layer.color}d9)`;
  return `${tint}, url("${layer.image}")`;
}

function useScrollBoostMv(
  scrollBoost: number | MotionValue<number> | undefined,
): MotionValue<number> {
  return useMemo(
    () =>
      typeof scrollBoost === "object" && scrollBoost
        ? scrollBoost
        : motionValue(typeof scrollBoost === "number" ? scrollBoost : 0),
    [scrollBoost],
  );
}

function GentlyCookedBadge() {
  return (
    <div className="glass absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between rounded-xl px-3 py-2 sm:bottom-4 sm:left-4 sm:right-4 sm:px-4 sm:py-2.5">
      <span className="text-[11px] font-semibold text-[var(--text-primary)] sm:text-xs">
        Gently Cooked · Aylopet
      </span>
      <span className="rounded-full bg-[var(--brand-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
        GC
      </span>
    </div>
  );
}

function PersonalizedBadge({ compact }: { compact: boolean }) {
  if (compact) return null;
  return (
    <div className="absolute right-3 top-3 z-30 rounded-full border border-white/50 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-primary)] shadow-soft backdrop-blur-sm sm:right-4 sm:top-4 sm:text-[11px]">
      100% personalized
    </div>
  );
}

/** Diagonal blade trail · forest/terracotta, brand-safe */
function SlashTrail({ active, compact }: { active: boolean; compact: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              width: compact ? "140%" : "160%",
              height: 3,
              marginLeft: compact ? "-70%" : "-80%",
              marginTop: -1.5,
              background:
                "linear-gradient(90deg, transparent 0%, var(--terracotta) 22%, #f5efe3 48%, var(--brand-accent) 72%, transparent 100%)",
              boxShadow:
                "0 0 12px rgba(198,123,92,0.45), 0 0 28px rgba(107,143,113,0.25)",
              borderRadius: 2,
            }}
            initial={{ rotate: -28, scaleX: 0, opacity: 0 }}
            animate={{ rotate: -28, scaleX: 1, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.38, times: [0, 0.2, 0.7, 1], ease: "easeOut" }}
          />
          {/* Soft afterglow streak */}
          <motion.div
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              width: compact ? "120%" : "140%",
              height: 18,
              marginLeft: compact ? "-60%" : "-70%",
              marginTop: -9,
              background:
                "linear-gradient(90deg, transparent, rgba(198,123,92,0.18), rgba(107,143,113,0.12), transparent)",
              filter: "blur(6px)",
              rotate: -28,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SliceProps {
  layer: FoodLayer;
  arc: (typeof TOSS_ARCS)[number];
  phase: Phase;
  index: number;
  compact: boolean;
  locale: "ka" | "en";
  showLabels: boolean;
  cycle: number;
}

function TossedSlice({
  layer,
  arc,
  phase,
  index,
  compact,
  locale,
  showLabels,
  cycle,
}: SliceProps) {
  const size = compact ? 72 : 96;
  const settleY = compact ? 28 + index * 10 : 36 + index * 14;
  const settleX = (index - 1.5) * (compact ? 4 : 6);
  const tossing = phase === "toss" || phase === "slash";
  const settling = phase === "settle" || phase === "hold";
  const split = phase === "slash" || phase === "settle";

  const halfStyle = {
    width: size / 2,
    height: size,
    backgroundImage: layerBackground(layer),
    backgroundSize: `${size}px ${size}px`,
  };

  return (
    <motion.div
      key={`${layer.id}-${cycle}`}
      className="absolute left-1/2 top-[42%] z-20"
      style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      initial={{
        x: `${arc.startX}%`,
        y: "55%",
        rotate: arc.rotate - 20,
        scale: 0.55,
        opacity: 0,
      }}
      animate={
        settling
          ? {
              x: settleX,
              y: settleY,
              rotate: 0,
              scale: compact ? 0.55 : 0.62,
              opacity: 0,
            }
          : tossing
            ? {
                x: [`${arc.startX}%`, `${arc.peakX}%`, `${arc.peakX * 0.4}%`],
                y: ["55%", `${arc.peakY}%`, `${arc.peakY + 12}%`],
                rotate: [arc.rotate - 20, arc.rotate, arc.rotate * 0.4],
                scale: [0.55, 1, 0.95],
                opacity: 1,
              }
            : { opacity: 0 }
      }
      transition={
        settling
          ? { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }
          : {
              duration: 1.65,
              delay: arc.delay,
              ease: [0.22, 0.8, 0.28, 1],
              times: [0, 0.45, 1],
            }
      }
    >
      {/* Whole slice before slash */}
      <AnimatePresence>
        {!split && (
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[42%] border border-white/40 shadow-[0_10px_28px_rgba(13,46,39,0.22)]"
            style={{
              backgroundImage: layerBackground(layer),
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.08 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/15" />
            {showLabels && !compact && (
              <span className="absolute bottom-2 left-0 right-0 text-center text-[9px] font-semibold uppercase tracking-wide text-white drop-shadow-md">
                {locale === "ka" ? layer.labelKa : layer.labelEn}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split halves after slash */}
      {split && (
        <>
          <motion.div
            className="absolute left-0 top-0 overflow-hidden rounded-l-[42%] border border-r-0 border-white/35 shadow-[0_8px_20px_rgba(13,46,39,0.18)]"
            style={{
              ...halfStyle,
              backgroundPosition: "left center",
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
            }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: settling ? settleX - 8 : -18 - index * 4,
              y: settling ? 24 : 8 + index * 3,
              rotate: settling ? -4 : -28,
              opacity: settling ? 0 : 1,
              scale: settling ? 0.7 : 1,
            }}
            transition={{ duration: settling ? 0.5 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute right-0 top-0 overflow-hidden rounded-r-[42%] border border-l-0 border-white/35 shadow-[0_8px_20px_rgba(13,46,39,0.18)]"
            style={{
              ...halfStyle,
              backgroundPosition: "right center",
              borderTopLeftRadius: 2,
              borderBottomLeftRadius: 2,
            }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: settling ? settleX + 8 : 18 + index * 4,
              y: settling ? 28 : 12 + index * 4,
              rotate: settling ? 6 : 32,
              opacity: settling ? 0 : 1,
              scale: settling ? 0.7 : 1,
            }}
            transition={{ duration: settling ? 0.5 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}
    </motion.div>
  );
}

interface SettledStackProps {
  phase: Phase;
  compact: boolean;
  locale: "ka" | "en";
  showLabels: boolean;
  scrollBoostMv: MotionValue<number>;
  cycle: number;
}

function SettledStack({
  phase,
  compact,
  locale,
  showLabels,
  scrollBoostMv,
  cycle,
}: SettledStackProps) {
  const visible = phase === "settle" || phase === "hold";
  const layers = [...FOOD_LAYERS].reverse();
  const stackStep = compact ? 11 : 15;
  const layerHeight = compact ? 44 : 58;
  const stackHeight =
    layerHeight + (layers.length - 1) * stackStep + (compact ? 20 : 28);
  const boostY = useTransform(scrollBoostMv, (b) => -(typeof b === "number" ? b : 0) * 18);

  return (
    <motion.div
      className="absolute inset-x-[10%] bottom-[18%] z-10 flex justify-center"
      style={{ y: boostY }}
    >
      <motion.div
        key={`stack-${cycle}`}
        className="relative w-full max-w-[280px]"
        style={{ height: stackHeight, perspective: 800 }}
        initial={{ opacity: 0, y: 36, scale: 0.92 }}
        animate={
          visible
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 28, scale: 0.94 }
        }
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay: visible ? 0.12 : 0,
        }}
      >
        {layers.map((layer, i) => {
          const isBase = layer.id === "base";
          return (
            <motion.div
              key={layer.id}
              className="absolute left-0 right-0 overflow-hidden rounded-2xl border border-white/35 shadow-[0_8px_24px_rgba(13,46,39,0.16)]"
              style={{
                height: layerHeight,
                top: i * stackStep,
                zIndex: 10 + i,
                backgroundImage: layerBackground(layer),
                backgroundSize: "cover",
                backgroundPosition: "center",
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, y: 40 + i * 8, rotateX: 12, scale: 0.9 }}
              animate={
                visible
                  ? {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      scale: 1,
                    }
                  : { opacity: 0, y: 24, scale: 0.95 }
              }
              transition={{
                duration: 0.55,
                delay: visible ? 0.08 + i * 0.09 : 0,
                ease: [0.34, 1.2, 0.64, 1],
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
              {showLabels && !compact && !isBase && (
                <span className="absolute bottom-2 left-3 text-[10px] font-semibold uppercase tracking-wider text-white drop-shadow-md">
                  {locale === "ka" ? layer.labelKa : layer.labelEn}
                </span>
              )}
              {isBase && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/90 p-1.5 shadow-soft sm:p-2">
                    <AylopetLogo
                      href={null}
                      showWordmark={false}
                      size="sm"
                      className="[&_span]:h-8 [&_span]:w-8 sm:[&_span]:h-9 sm:[&_span]:w-9"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Soft steam / warmth after settle */}
        {visible && phase === "hold" && (
          <motion.div
            className="pointer-events-none absolute -top-6 left-1/2 h-10 w-24 -translate-x-1/2 rounded-full bg-[var(--brand-accent)]/15 blur-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0.3, 0.55, 0.3], y: [8, 0, 8] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function FoodLayersStatic({
  locale,
  compact,
  showLabels,
  className,
  fill,
}: Pick<
  FoodLayersVisualProps,
  "locale" | "compact" | "showLabels" | "className" | "fill"
>) {
  const layers = [...FOOD_LAYERS].reverse();
  const stackStep = compact ? 11 : 15;
  const layerHeight = compact ? 44 : 58;
  const stackHeight =
    layerHeight + (FOOD_LAYERS.length - 1) * stackStep + (compact ? 40 : 56);

  return (
    <div
      className={`food-layers-root relative ${fill ? "h-full min-h-[280px]" : ""} ${className ?? ""}`}
    >
      <div
        className={`relative mx-auto w-full ${fill ? "h-full" : "aspect-square max-w-md"}`}
      >
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-bento)] border border-white/60 bg-gradient-to-b from-[var(--background-main)] to-[var(--background-secondary)] shadow-organic">
          <PersonalizedBadge compact={!!compact} />
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-[8%] py-[10%]">
            <div className="relative w-full" style={{ height: stackHeight }}>
              {layers.map((layer, i) => (
                <div
                  key={layer.id}
                  className="absolute left-0 right-0 overflow-hidden rounded-2xl border border-white/30 shadow-[0_8px_24px_rgba(13,46,39,0.14)]"
                  style={{
                    height: layerHeight,
                    top: i * stackStep,
                    backgroundImage: layerBackground(layer),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 10 + i,
                  }}
                >
                  {showLabels && !compact && layer.id !== "base" && (
                    <span className="absolute bottom-2 left-3 text-[10px] font-semibold uppercase tracking-wider text-white drop-shadow-md">
                      {locale === "ka" ? layer.labelKa : layer.labelEn}
                    </span>
                  )}
                  {layer.id === "base" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/90 p-2 shadow-soft">
                        <AylopetLogo
                          href={null}
                          showWordmark={false}
                          size="sm"
                          className="[&_span]:h-9 [&_span]:w-9"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <GentlyCookedBadge />
        </div>
      </div>
    </div>
  );
}

function useNinjaPhase(play: boolean, reduced: boolean | null) {
  const [phase, setPhase] = useState<Phase>("hold");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!play || reduced) {
      setPhase("hold");
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (ms: number, fn: () => void) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, ms),
      );
    };

    const runCycle = () => {
      if (cancelled) return;
      setPhase("toss");
      setCycle((c) => c + 1);
      schedule(SLASH_AT * 1000, () => setPhase("slash"));
      schedule(SETTLE_AT * 1000, () => setPhase("settle"));
      schedule(SETTLE_AT * 1000 + 400, () => setPhase("hold"));
      schedule(CYCLE_MS, runCycle);
    };

    runCycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [play, reduced]);

  return { phase, cycle };
}

export function FoodLayersVisual({
  locale = "ka",
  scrollBoost = 0,
  compact = false,
  fill = false,
  className = "",
  tilt = true,
  showLabels = true,
  play = true,
}: FoodLayersVisualProps) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const scrollBoostMv = useScrollBoostMv(scrollBoost);
  const { ref: tiltRef, style: tiltStyle, onMouseMove, onMouseLeave } = useTilt(8);
  const { phase, cycle } = useNinjaPhase(play && mounted, reduced);

  if (!mounted || reduced) {
    return (
      <FoodLayersStatic
        locale={locale}
        compact={compact}
        showLabels={showLabels}
        className={className}
        fill={fill}
      />
    );
  }

  return (
    <div
      className={`scene-3d-root food-layers-root relative ${fill ? "h-full min-h-[280px]" : ""} ${className}`}
      style={{ perspective: "1100px" }}
    >
      {!compact && (
        <>
          <FloatingOrb
            className="-left-4 top-6 opacity-50"
            color="var(--brand-accent)"
            size="120px"
            delay={0}
          />
          <FloatingOrb
            className="-right-2 bottom-8 opacity-40"
            color="var(--terracotta)"
            size="90px"
            delay={1}
          />
        </>
      )}

      <div
        className={`relative mx-auto w-full ${fill ? "h-full" : "aspect-square max-w-md"}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={tilt ? tiltRef : undefined}
          style={tilt ? tiltStyle : { transformStyle: "preserve-3d" }}
          onMouseMove={tilt ? onMouseMove : undefined}
          onMouseLeave={tilt ? onMouseLeave : undefined}
          className="relative h-full w-full"
        >
          <div
            className="relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-bento)] border border-white/60 bg-gradient-to-b from-[var(--background-main)] via-[#f7f4ef] to-[var(--background-secondary)] shadow-organic"
            style={{ transform: "translateZ(20px)" }}
          >
            {/* Soft kitchen atmosphere */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(232,160,122,0.12), transparent 60%), radial-gradient(ellipse 50% 40% at 70% 70%, rgba(107,143,113,0.1), transparent 55%)",
              }}
            />

            <PersonalizedBadge compact={compact} />

            <div className="relative min-h-0 flex-1 overflow-hidden">
              {/* Tossed ingredients */}
              {(phase === "toss" || phase === "slash" || phase === "settle") &&
                TOSS_LAYERS.map((layer, i) => (
                  <TossedSlice
                    key={`${layer.id}-${cycle}`}
                    layer={layer}
                    arc={TOSS_ARCS[i] ?? TOSS_ARCS[0]}
                    phase={phase}
                    index={i}
                    compact={compact}
                    locale={locale}
                    showLabels={showLabels}
                    cycle={cycle}
                  />
                ))}

              <SlashTrail active={phase === "slash"} compact={compact} />

              <SettledStack
                phase={phase}
                compact={compact}
                locale={locale}
                showLabels={showLabels}
                scrollBoostMv={scrollBoostMv}
                cycle={cycle}
              />

              {/* Idle hint of base bowl before first settle */}
              {phase === "toss" && (
                <motion.div
                  className="absolute inset-x-[18%] bottom-[22%] z-[5] mx-auto h-16 max-w-[200px] overflow-hidden rounded-[1.25rem] border border-white/25 opacity-30"
                  style={{
                    backgroundImage: layerBackground(BASE_LAYER),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.28 }}
                />
              )}
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-[var(--forest-deep)]/8 via-transparent to-white/25" />
            <GentlyCookedBadge />
          </div>
        </div>

        {!compact && <ScenePedestal className="bottom-[-6%] w-full" />}
      </div>
    </div>
  );
}
