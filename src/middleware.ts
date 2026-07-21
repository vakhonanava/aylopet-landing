import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.next();
  }

  const token =
    request.nextUrl.searchParams.get("token") ??
    request.cookies.get("aylopet_admin")?.value;

  if (token === adminSecret) {
    const response = NextResponse.next();
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

export const config = {
  matcher: ["/admin/:path*"],
};
