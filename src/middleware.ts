// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without authentication
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Read your auth token cookie name here (adjust accordingly)
  const token = request.cookies.get("token")?.value;

  // If token missing, redirect to login
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise continue request
  return NextResponse.next();
}

// Apply this middleware to all pages except api/_next (static files)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
