"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ClipboardCheck, MessageCircle, Send, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { TypingIndicator } from "@/components/portal/chat/TypingIndicator";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useChatSimulation } from "@/hooks/useChatSimulation";
import { fadeUp, staggerContainer } from "@/lib/motion";

function uid(): string {
  return `live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

interface LiveTurn {
  id: string;
  role: "assistant" | "user";
  content: string;
}

function liveReply(text: string, locale: "ka" | "en"): string {
  const lower = text.toLowerCase();
  if (locale === "ka") {
    if (lower.includes("წონ") || lower.includes("კალორ"))
      return "როკისთვის ~12 კგ და აქტიური ცხოვრების წესით, დღიური ენერგოსაჭიროება დაახლოებით 700 to 850 კკალ-ია. გსურთ დეტალური რაციონის შედგენა AylopetAI-ში?";
    if (lower.includes("ალერგ") || lower.includes("ქათამ"))
      return "თუ როკის აქვს მგრძნობელობა, ვიწყებთ ნოველ პროტეინით და ვაკონტროლებთ 10 to 14 დღეს. გახსენით სრული ჩატი პერსონალური გეგმისთვის.";
    return "როკის პროფილი და კვების რეკომენდაცია უკვე ჩაიწერა სიმულაციიდან. დასვით კითხვა კვებაზე ან გახსენით სრული AylopetAI ჩატი დეტალური კითხვარისთვის.";
  }
  if (lower.includes("weight") || lower.includes("calor"))
    return "For Rocky at ~12 kg with an active lifestyle, daily energy needs are roughly 700 to 850 kcal. Want a full ration plan in AylopetAI?";
  if (lower.includes("allerg") || lower.includes("chicken"))
    return "If Rocky has sensitivities, we start with a novel protein and monitor for 10 to 14 days. Open the full chat for a personalized plan.";
  return "Rocky's demo profile and nutrition recommendation are ready. Ask about nutrition, or open the full AylopetAI chat for the complete questionnaire.";
}

export function LandingChatbot() {
  const { dict, locale } = useLocale();
  const copy = dict.landing.chatbot;
  const chatLocale = locale === "ka" ? "ka" : "en";

  const sectionRef = useRef<HTMLElement>(null);
  // Start when the section enters view (generous threshold). A tight
  // negative margin on the tall widget left the empty chat visibly on
  // screen while autoStart stayed false · the demo looked broken.
  const isSectionInView = useInView(sectionRef, {
    once: true,
    amount: 0.25,
    margin: "120px 0px",
  });

  const {
    messages,
    streamingText,
    isTyping,
    currentTypingSender,
    isStreaming,
    isSimulationComplete,
    isStreamingFinalRecommendation,
    isFadingOut,
    cycleCount,
  } = useChatSimulation({
    locale: chatLocale,
    autoStart: isSectionInView,
    pauseAfterCompleteMs: 18000,
  });

  const [liveTurns, setLiveTurns] = useState<LiveTurn[]>([]);
  const [input, setInput] = useState("");
  const [liveTyping, setLiveTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [
    messages,
    streamingText,
    isTyping,
    currentTypingSender,
    isStreaming,
    liveTurns,
    liveTyping,
    isSimulationComplete,
    isFadingOut,
  ]);

  useEffect(() => {
    if (!isSimulationComplete) return;
    // preventScroll · a plain focus() yanks the page back to the widget when
    // the demo finishes, which read as "it sent me back to the homepage".
    const t = window.setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      400,
    );
    return () => window.clearTimeout(t);
  }, [isSimulationComplete]);

  // Reset live turns whenever the locale changes or the scripted demo loops
  // back to step 1, so a stray live reply never lingers across a reset.
  useEffect(() => {
    setLiveTurns([]);
    setInput("");
    setLiveTyping(false);
  }, [chatLocale, cycleCount]);

  const sendLive = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !isSimulationComplete || liveTyping) return;

    setLiveTurns((prev) => [
      ...prev,
      { id: uid(), role: "user", content: trimmed },
    ]);
    setInput("");
    setLiveTyping(true);

    window.setTimeout(() => {
      const reply = liveReply(trimmed, chatLocale);
      setLiveTyping(false);
      setLiveTurns((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: reply },
      ]);
    }, 1100 + Math.floor(Math.random() * 400));
  };

  const typingLabel =
    currentTypingSender === "user"
      ? chatLocale === "ka"
        ? "მომხმარებელი წერს…"
        : "User is typing…"
      : chatLocale === "ka"
        ? "AylopetAI წერს…"
        : "AylopetAI is typing";

  const unlockedHint =
    chatLocale === "ka"
      ? "ჩატი ღიაა, დასვით კითხვა როკის შესახებ"
      : "Chat unlocked, ask anything about Rocky";

  return (
    <section
      id="ai-assistant"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#030b12] py-16 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(34,211,238,0.12),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={copy.eyebrow}
              title={copy.title}
              description={copy.description}
              align="center"
              className="[&_h2]:text-cyan-50 [&_p]:text-cyan-100/70 [&_span]:text-cyan-300"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-t-2xl border border-b-0 border-cyan-400/20 bg-[#071018] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-cyan-400/15 bg-[#0a1622] px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-[#030b12]">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-cyan-50">
                  AylopetAI
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
                </p>
                <p className="text-xs text-cyan-300/80">
                  {isTyping || isStreaming || liveTyping
                    ? chatLocale === "ka"
                      ? "● წერს…"
                      : "● Typing…"
                    : copy.online}
                </p>
              </div>
              {!isSimulationComplete && (
                <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                  {chatLocale === "ka" ? "დემო" : "Demo"}
                </span>
              )}
            </div>

            {/* Messages · scrollable feed only; the CTA footer below lives
                outside this container so it never scrolls, fades, or resets
                with the looping demo. */}
            <div
              ref={scrollRef}
              className="flex max-h-[420px] min-h-[320px] flex-col overflow-y-auto px-4 py-4"
            >
              <div
                className={`flex flex-col gap-3 transition-opacity duration-500 ease-out ${
                  isFadingOut ? "opacity-0" : "opacity-100"
                }`}
              >
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    isFinalRecommendation={msg.isFinalRecommendation}
                    locale={chatLocale}
                  />
                ))}

                {/* Streaming bubble (fixed min-height avoids jump) */}
                {isStreaming && streamingText && currentTypingSender && (
                  <MessageBubble
                    role={currentTypingSender === "ai" ? "assistant" : "user"}
                    content={streamingText}
                    streaming
                    isFinalRecommendation={isStreamingFinalRecommendation}
                    locale={chatLocale}
                  />
                )}

                {/* Typing dots */}
                {isTyping && (
                  <div
                    className={`flex ${currentTypingSender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <TypingIndicator
                      label={typingLabel}
                      className={
                        currentTypingSender === "user"
                          ? "rounded-tr-sm rounded-tl-2xl bg-cyan-500/20 [&_.typing-dot]:bg-cyan-200"
                          : "rounded-tl-sm bg-[#122033] [&_.typing-dot]:bg-cyan-300/80"
                      }
                    />
                  </div>
                )}

                {liveTurns.map((turn) => (
                  <MessageBubble key={turn.id} role={turn.role} content={turn.content} />
                ))}

                {liveTyping && (
                  <div className="flex justify-start">
                    <TypingIndicator
                      label={
                        chatLocale === "ka"
                          ? "AylopetAI წერს…"
                          : "AylopetAI is typing"
                      }
                      className="rounded-tl-sm bg-[#122033] [&_.typing-dot]:bg-cyan-300/80"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Input · locked until simulation completes */}
            <AnimatePresence>
              <motion.div
                initial={false}
                animate={{
                  opacity: isSimulationComplete ? 1 : 0.55,
                }}
                transition={{ duration: 0.45 }}
                className="border-t border-cyan-400/15 bg-[#0a1622] p-4"
              >
                {isSimulationComplete && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2 text-center text-[11px] font-medium text-cyan-300/80"
                  >
                    {unlockedHint}
                  </motion.p>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendLive(input);
                  }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!isSimulationComplete || liveTyping}
                    placeholder={
                      isSimulationComplete
                        ? copy.inputPlaceholder
                        : chatLocale === "ka"
                          ? "დაელოდეთ დემოს დასრულებას…"
                          : "Waiting for demo to finish…"
                    }
                    className="min-h-[44px] flex-1 rounded-xl border border-cyan-400/20 bg-[#071018] px-4 text-sm text-cyan-50 outline-none placeholder:text-cyan-100/35 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={
                      !isSimulationComplete || !input.trim() || liveTyping
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#030b12] disabled:opacity-40"
                    aria-label={copy.sendLabel}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Pinned CTA footer stays outside the scrolling conversation. */}
          <motion.div
            variants={fadeUp}
            className="mx-auto max-w-2xl overflow-hidden rounded-b-2xl border border-t-0 border-cyan-400/20 bg-[#0a1622] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          >
            <Link
              href={isSimulationComplete ? "/onboarding/platform" : "/products/aylopet-ai#chat"}
              className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-transform active:scale-[0.98] ${
                isSimulationComplete
                  ? "bg-gradient-to-br from-[var(--terracotta)] to-[var(--terracotta-bright)] text-white"
                  : "bg-gradient-to-br from-cyan-400 to-violet-500 text-[#030b12]"
              }`}
              aria-label={
                isSimulationComplete ? copy.ctaGiftAria : dict.common.openFullChat
              }
            >
              {isSimulationComplete ? (
                <ClipboardCheck className="h-4 w-4" aria-hidden />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden />
              )}
              {isSimulationComplete ? copy.ctaGiftLabel : copy.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function renderRecommendationContent(content: string) {
  return content.split("\n").map((line, index) => {
    const isSectionTitle =
      line.startsWith("დღიური ნორმა") ||
      line.startsWith("კვებითი ღირებულება") ||
      line.startsWith("Daily allowance") ||
      line.startsWith("Nutritional value");
    const isRecommendation =
      line.startsWith("ნუტრიციოლოგის რეკომენდაცია:") ||
      line.startsWith("Nutritionist recommendation:");

    if (!line) return <span key={index} className="block h-3" />;

    return (
      <span
        key={index}
        className={`block ${
          isSectionTitle
            ? "mt-1 font-semibold text-cyan-100"
            : isRecommendation
              ? "mt-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] p-3 font-medium text-emerald-50"
              : ""
        }`}
      >
        {line}
      </span>
    );
  });
}

function MessageBubble({
  role,
  content,
  streaming = false,
  isFinalRecommendation = false,
  locale = "en",
}: {
  role: "assistant" | "user";
  content: string;
  streaming?: boolean;
  isFinalRecommendation?: boolean;
  locale?: "ka" | "en";
}) {
  const isUser = role === "user";

  if (isFinalRecommendation) {
    return (
      <div className="flex justify-start" data-final-recommendation>
        <div className="relative max-w-[96%] overflow-hidden rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/[0.1] via-white/[0.04] to-emerald-300/[0.06] px-5 py-5 text-sm leading-relaxed text-cyan-50/95 shadow-[0_16px_56px_rgba(34,211,238,0.14)] backdrop-blur-md">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-300/15 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.06)_45%,transparent_60%)]"
          />

          <p className="relative mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-cyan-200">
            <ClipboardCheck className="h-4 w-4" aria-hidden />
            {locale === "ka"
              ? "პერსონალური კვების რეკომენდაცია"
              : "Personal nutrition recommendation"}
          </p>
          <div className="relative">
            {renderRecommendationContent(content)}
            {streaming && (
              <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-cyan-300 align-middle" />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-gradient-to-br from-cyan-500 to-violet-600 text-white"
            : "rounded-bl-md border border-cyan-400/10 bg-[#122033] text-cyan-50/90"
        }`}
      >
        {content}
        {streaming && (
          <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-cyan-300 align-middle" />
        )}
      </div>
    </div>
  );
}
