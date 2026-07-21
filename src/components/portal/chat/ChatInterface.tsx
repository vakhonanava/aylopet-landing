"use client";

import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { TypingIndicator } from "@/components/portal/chat/TypingIndicator";
import {
  applyAnswer,
  EMPTY_PROFILE,
  getQuickOptions,
  getStepPrompt,
  nextStep,
  typingDelayMs,
  type NutritionProfile,
  type NutritionStepId,
} from "@/lib/chat/nutritionist-flow";
import type { ChatMessage } from "@/lib/chat/types";
import { fadeUp, motionEase } from "@/lib/motion";

function uid(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ChatInterface() {
  const { locale } = useLocale();
  const chatLocale = locale === "ka" ? "ka" : "en";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<NutritionStepId>("greeting");
  const [profile, setProfile] = useState<NutritionProfile>(EMPTY_PROFILE);
  const [complete, setComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const speakTimerRef = useRef<number | null>(null);

  const appendAssistant = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "assistant",
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const speak = useCallback(
    (content: string) => {
      if (speakTimerRef.current != null) {
        window.clearTimeout(speakTimerRef.current);
      }
      setIsTyping(true);
      const delay = typingDelayMs();
      speakTimerRef.current = window.setTimeout(() => {
        speakTimerRef.current = null;
        setIsTyping(false);
        appendAssistant(content);
        busyRef.current = false;
      }, delay);
    },
    [appendAssistant],
  );

  // Strict Mode remounts cancel the first rAF; do not gate with a ref that
  // survives cleanup, or the greeting never appears.
  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    setStep("greeting");
    setProfile(EMPTY_PROFILE);
    setComplete(false);
    setInput("");
    busyRef.current = true;
    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      speak(getStepPrompt("greeting", EMPTY_PROFILE, chatLocale));
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (speakTimerRef.current != null) {
        window.clearTimeout(speakTimerRef.current);
        speakTimerRef.current = null;
      }
    };
  }, [speak, chatLocale]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping || busyRef.current || complete) return;

    busyRef.current = true;
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content: trimmed, timestamp: new Date() },
    ]);
    setInput("");

    const updated = applyAnswer(step, trimmed, profile);
    setProfile(updated);

    const upcoming = nextStep(step);
    setStep(upcoming);

    if (upcoming === "complete") {
      setComplete(true);
    }

    speak(getStepPrompt(upcoming, updated, chatLocale));
  };

  const quickOptions = complete ? [] : getQuickOptions(step, chatLocale);
  const typingLabel =
    chatLocale === "ka" ? "AylopetAI წერს…" : "AylopetAI is typing";

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-[var(--oat-soft)] bg-[var(--bone-alabaster)] shadow-[0_8px_40px_rgba(13,46,39,0.08)]">
      <header className="flex items-center gap-3 border-b border-[var(--oat-soft)] bg-[var(--forest-deep)] px-5 py-4 text-[var(--bone-alabaster)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">AylopetAI</p>
          <p className="text-xs text-white/60">
            {chatLocale === "ka"
              ? "პირადი ნუტრიციოლოგი · ერთი კითხვა ერთდროულად"
              : "Personal nutritionist · one question at a time"}
          </p>
        </div>
        {isTyping ? (
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--status-emerald)]">
            {chatLocale === "ka" ? "წერს…" : "Typing…"}
          </span>
        ) : (
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
            Online
          </span>
        )}
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                msg.role === "user"
                  ? "rounded-tr-sm bg-[var(--forest-deep)] text-[var(--bone-alabaster)]"
                  : "rounded-tl-sm bg-white text-[var(--forest-deep)]/85 shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: motionEase }}
            className="flex justify-start"
          >
            <TypingIndicator label={typingLabel} />
          </motion.div>
        )}
      </div>

      <div className="border-t border-[var(--oat-soft)] bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6">
        {quickOptions.length > 0 && !isTyping && (
          <div className="mb-3 flex flex-wrap gap-2">
            {quickOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSubmit(option.value)}
                className="rounded-full border border-[var(--oat-soft)] bg-[var(--bone-alabaster)] px-3 py-1.5 text-xs font-medium text-[var(--forest-deep)]/75 transition-colors duration-300 hover:border-[var(--terracotta)]/40 hover:text-[var(--terracotta)]"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping || complete}
            placeholder={
              complete
                ? chatLocale === "ka"
                  ? "პროფილი შეგროვებულია"
                  : "Profile complete"
                : chatLocale === "ka"
                  ? "შენი პასუხი…"
                  : "Your answer…"
            }
            className="flex-1 rounded-xl border border-[var(--oat-soft)] bg-[var(--bone-alabaster)] px-4 py-3 text-sm text-[var(--forest-deep)] outline-none transition-all duration-300 placeholder:text-[var(--forest-deep)]/35 focus:border-[var(--terracotta)]/40 focus:ring-2 focus:ring-[var(--terracotta)]/10 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || complete}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--terracotta)] text-white transition-colors duration-300 hover:bg-[var(--terracotta)]/90 disabled:opacity-40"
            aria-label={chatLocale === "ka" ? "გაგზავნა" : "Send message"}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
