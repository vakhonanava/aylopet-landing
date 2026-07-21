"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { saveAdopterSession } from "@/lib/adopter-session";
import { useAuth } from "@/components/auth/AuthProvider";

/** Persists adopter session + auth after early-access redirect. */
export function AdopterSessionSync() {
  const params = useSearchParams();
  const { register } = useAuth();

  useEffect(() => {
    const name = params.get("name");
    const email = params.get("email");
    const dog = params.get("dog");
    const position = params.get("position");
    if (!name || !email || !dog) return;

    queueMicrotask(() => {
      saveAdopterSession({
        ownerName: name,
        email: email.toLowerCase(),
        dogName: dog,
        position: position ? Number(position) : undefined,
        registeredAt: new Date().toISOString(),
      });
      register({ name, email: email.toLowerCase() });
    });
  }, [params, register]);

  return null;
}
