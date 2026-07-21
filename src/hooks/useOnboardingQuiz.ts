"use client";

import { useCallback, useMemo, useState } from "react";
import {
  INITIAL_QUIZ_STATE,
  OPTIONAL_STEPS,
  TOTAL_STEPS,
  type OnboardingQuizState,
} from "@/lib/onboarding/quiz-steps";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isStepValid(step: number, state: OnboardingQuizState): boolean {
  if (OPTIONAL_STEPS.includes(step)) return true;

  switch (step) {
    case 1:
      return state.userName.trim().length > 0;
    case 2: {
      const emailOk = EMAIL_RE.test(state.email.trim());
      const phoneDigits = state.phone.replace(/\D/g, "");
      return emailOk && phoneDigits.length >= 9;
    }
    case 3:
      return state.city.trim().length > 0;
    case 4:
      return state.dogCount >= 1;
    case 5:
      return state.dogName.trim().length > 0;
    case 6:
      return (
        (state.ageYears !== null || state.ageMonths !== null) &&
        (state.ageYears ?? 0) * 12 + (state.ageMonths ?? 0) > 0
      );
    case 7:
      return state.gender !== null;
    case 8:
      return state.neutered !== null;
    case 9:
      return state.breed.trim().length > 0;
    case 10:
      return state.weightKg !== null && state.weightKg > 0;
    case 11:
      return state.bodyCondition !== null;
    case 12:
      return state.activity !== null;
    case 13:
      return state.appetite !== null;
    case 14:
      return state.currentDiet !== null;
    case 17:
      return state.primaryGoal !== null;
    default:
      return false;
  }
}

export function useOnboardingQuiz() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<OnboardingQuizState>(INITIAL_QUIZ_STATE);
  const [completed, setCompleted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const patch = useCallback((partial: Partial<OnboardingQuizState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const canAdvance = useMemo(() => isStepValid(step, state), [step, state]);

  const next = useCallback(() => {
    if (!isStepValid(step, state)) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setDirection(1);
    if (step >= TOTAL_STEPS) {
      setCompleted(true);
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [step, state]);

  const back = useCallback(() => {
    setTouched(false);
    setDirection(-1);
    if (completed) {
      setCompleted(false);
      return;
    }
    setStep((s) => Math.max(s - 1, 1));
  }, [completed]);

  const restart = useCallback(() => {
    setState(INITIAL_QUIZ_STATE);
    setStep(1);
    setCompleted(false);
    setTouched(false);
    setDirection(1);
  }, []);

  const progress = ((completed ? TOTAL_STEPS : step) / TOTAL_STEPS) * 100;

  return {
    step,
    totalSteps: TOTAL_STEPS,
    progress,
    state,
    canAdvance,
    touched,
    completed,
    direction,
    patch,
    next,
    back,
    restart,
  };
}
