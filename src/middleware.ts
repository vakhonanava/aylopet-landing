import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

function protectAdmin(request: NextRequest, response: NextResponse) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return response;
  }

  // Fail closed: without a configured secret the leads table (names, emails)
  // would be public, which is exactly what production served while it was unset.
  const adminSecret = process.env.ADMIN_SECRET?.trim();
  if (!adminSecret) {
    return new NextResponse("Admin access is not configured.", {
      status: 503,
    });
  }

  const token =
    request.nextUrl.searchParams.get("token") ??
    request.cookies.get("aylopet_admin")?.value;

  if (token === adminSecret) {
    if (request.nextUrl.searchParams.get("token")) {
      response.cookies.set("aylopet_admin", adminSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }
    return response;
  }

  return new NextResponse("Unauthorized · admin access required.", {
    status: 401,
  });
}

export async function middleware(request: NextRequest) {
  const sessionResponse = await updateSession(request);
  return protectAdmin(request, sessionResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
