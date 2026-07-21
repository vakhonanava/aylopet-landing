"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSimulationFlow,
  type SimulationSender,
  type SimulationStep,
} from "@/lib/chat/simulation-script";

export interface SimulatedMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  isFinalRecommendation?: boolean;
}

export interface UseChatSimulationOptions {
  locale: "ka" | "en";
  /** Characters revealed per tick during stream */
  charsPerTick?: number;
  /** Delay between character ticks */
  charTickMs?: number;
  autoStart?: boolean;
  /** How long to hold on the completed final recommendation before looping, in ms. */
  pauseAfterCompleteMs?: number;
  /** Duration of the fade-out transition before the feed resets, in ms. */
  fadeOutDurationMs?: number;
}

export interface UseChatSimulationResult {
  messages: SimulatedMessage[];
  /** Partial text currently being streamed into the bubble */
  streamingText: string;
  isTyping: boolean;
  currentTypingSender: SimulationSender | null;
  isStreaming: boolean;
  isSimulationComplete: boolean;
  isStreamingFinalRecommendation: boolean;
  /** True while the completed conversation is fading out ahead of a loop reset. */
  isFadingOut: boolean;
  /** Increments every time the scripted conversation restarts from step 1. */
  cycleCount: number;
  restart: () => void;
}

function roleOf(sender: SimulationSender): "assistant" | "user" {
  return sender === "ai" ? "assistant" : "user";
}

const DEFAULT_PAUSE_AFTER_COMPLETE_MS = 6000;
const DEFAULT_FADE_OUT_DURATION_MS = 500;

export function useChatSimulation({
  locale,
  charsPerTick = 3,
  charTickMs = 22,
  autoStart = true,
  pauseAfterCompleteMs = DEFAULT_PAUSE_AFTER_COMPLETE_MS,
  fadeOutDurationMs = DEFAULT_FADE_OUT_DURATION_MS,
}: UseChatSimulationOptions): UseChatSimulationResult {
  const [messages, setMessages] = useState<SimulatedMessage[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingSender, setCurrentTypingSender] =
    useState<SimulationSender | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [isStreamingFinalRecommendation, setIsStreamingFinalRecommendation] =
    useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [runId, setRunId] = useState(0);

  const timersRef = useRef<number[]>([]);
  const cancelledRef = useRef(false);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const restart = useCallback(() => {
    clearTimers();
    cancelledRef.current = false;
    setMessages([]);
    setStreamingText("");
    setIsTyping(false);
    setCurrentTypingSender(null);
    setIsStreaming(false);
    setIsSimulationComplete(false);
    setIsStreamingFinalRecommendation(false);
    setIsFadingOut(false);
    setRunId((n) => n + 1);
  }, [clearTimers]);

  useEffect(() => {
    if (!autoStart) return;

    cancelledRef.current = false;
    clearTimers();
    setMessages([]);
    setStreamingText("");
    setIsTyping(false);
    setCurrentTypingSender(null);
    setIsStreaming(false);
    setIsSimulationComplete(false);
    setIsStreamingFinalRecommendation(false);
    setIsFadingOut(false);

    const flow = getSimulationFlow(locale);

    // Runs every step in `flow` strictly sequentially (no skipping). Once the
    // final step (index === flow.length) has fully rendered, it pauses so the
    // reader can absorb the final recommendation, fades the feed out, resets
    // simulation state, and loops back to step 1 · indefinitely, for as long
    // as this effect stays mounted (i.e. while the widget remains in view).
    const runStep = (index: number) => {
      if (cancelledRef.current) return;

      if (index >= flow.length) {
        setIsSimulationComplete(true);

        schedule(() => {
          if (cancelledRef.current) return;
          setIsFadingOut(true);

          schedule(() => {
            if (cancelledRef.current) return;
            setMessages([]);
            setStreamingText("");
            setIsTyping(false);
            setCurrentTypingSender(null);
            setIsStreaming(false);
            setIsSimulationComplete(false);
            setIsStreamingFinalRecommendation(false);
            setIsFadingOut(false);
            setCycleCount((n) => n + 1);
            runStep(0);
          }, fadeOutDurationMs);
        }, pauseAfterCompleteMs);
        return;
      }

      const step: SimulationStep = flow[index]!;

      schedule(() => {
        if (cancelledRef.current) return;
        setIsTyping(true);
        setCurrentTypingSender(step.sender);
        setStreamingText("");
        setIsStreaming(false);

        schedule(() => {
          if (cancelledRef.current) return;
          setIsTyping(false);
          setIsStreaming(true);
          setIsStreamingFinalRecommendation(Boolean(step.isFinalRecommendation));

          let cursor = 0;
          // Steps can override the global reveal pace (e.g. the long final
          // recommendation) so they don't block the UI or cause layout jank.
          const tickSize = step.revealCharsPerTick ?? charsPerTick;
          const streamTick = () => {
            if (cancelledRef.current) return;
            cursor = Math.min(step.content.length, cursor + tickSize);
            setStreamingText(step.content.slice(0, cursor));

            if (cursor < step.content.length) {
              schedule(streamTick, charTickMs);
            } else {
              setIsStreaming(false);
              setCurrentTypingSender(null);
              setStreamingText("");
              setIsStreamingFinalRecommendation(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: step.id,
                  role: roleOf(step.sender),
                  content: step.content,
                  isFinalRecommendation: step.isFinalRecommendation,
                },
              ]);
              // Brief beat before next step
              schedule(() => runStep(index + 1), 280);
            }
          };

          streamTick();
        }, step.typingDurationMs);
      }, step.delayBeforeTypingMs);
    };

    runStep(0);

    return () => {
      cancelledRef.current = true;
      clearTimers();
    };
  }, [
    autoStart,
    locale,
    runId,
    charsPerTick,
    charTickMs,
    pauseAfterCompleteMs,
    fadeOutDurationMs,
    clearTimers,
    schedule,
  ]);

  return {
    messages,
    streamingText,
    isTyping,
    currentTypingSender,
    isStreaming,
    isSimulationComplete,
    isStreamingFinalRecommendation,
    isFadingOut,
    cycleCount,
    restart,
  };
}
