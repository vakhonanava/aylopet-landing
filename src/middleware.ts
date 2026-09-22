import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// /admin needs a session like /dashboard (see PROTECTED_PREFIXES); the admin
// page itself then checks the account against public.admin_users.
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
