// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PATHS = ["/auth/login", "/auth/signup"];
const PUBLIC_HOME_PATH = "/";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  if (!token) {
    if (AUTH_PATHS.includes(pathname) || pathname === PUBLIC_HOME_PATH) {
      return NextResponse.next();
    }
    // Otherwise, redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user IS logged in
  if (token) {
    // If trying to access auth paths, redirect to home (or dashboard)
    if (AUTH_PATHS.includes(pathname)) {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }
    // Otherwise, allow access
    return NextResponse.next();
  }
}

// Apply this middleware to all pages except api/_next (static files)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
