"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/utils/supabase/client";

type PetCheck = "pending" | "none" | "has-pet";

/**
 * Ambassador / waitlist entry guard.
 *
 * Someone who already signed up should never be shown the application form
 * again. Rather than branch every one of the ~15 CTAs that point here, the
 * destination itself decides: a signed-in owner who already has a pet profile
 * is sent straight to their dashboard.
 *
 * A signed-in user with no pet yet still sees the form — they are mid-flow and
 * need to finish creating the profile.
 */
export function OnboardingRedirectGuard({ children }: { children: ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const router = useRouter();
  const [petCheck, setPetCheck] = useState<PetCheck>("pending");

  // Created once, outside the effect, so the "not configured" case can be a
  // derived value rather than a synchronous setState in an effect body.
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!authReady || !user || !supabase) return;

    let cancelled = false;

    void supabase
      .from("pets")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .then(({ data }) => {
        if (cancelled) return;
        setPetCheck(data && data.length > 0 ? "has-pet" : "none");
      });

    return () => {
      cancelled = true;
    };
  }, [authReady, user, supabase]);

  useEffect(() => {
    if (petCheck === "has-pet") router.replace("/dashboard");
  }, [petCheck, router]);

  // Derived rather than stored, so no state is set synchronously in an effect.
  const checking =
    !authReady || (Boolean(user) && supabase !== null && petCheck !== "none");

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-400">
        იტვირთება...
      </div>
    );
  }

  return <>{children}</>;
}
