"use client";

import { useEffect } from "react";

/** Legacy URL · send users to the unified AylopetAI product chat. */
export default function ChatPortalPage() {
  useEffect(() => {
    window.location.replace("/products/aylopet-ai#chat");
  }, []);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--text-secondary)]">
      Redirecting to AylopetAI…
    </div>
  );
}
