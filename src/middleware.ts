import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Let ALL API routes pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // 2) ---- Admin Page Guard ----
  if (pathname.startsWith("/admin")) {
    // Allow admin login page
    if (pathname === "/admin/login") return NextResponse.next();

    // Block protected admin pages if no token
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // 3) ---- User Page Guard ----
  const isProtected = ["/dashboard", "/deposit", "/withdrawal", "/trade", "/settings"].some(
    (p) => pathname.startsWith(p)
  );

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login"; // ✅ match your real login route
    return NextResponse.redirect(url);
  }

  // 4) ---- Prevent Logged-in Users from seeing Login Page ----
  const isLoginPage =
    pathname === "/auth/login" || pathname === "/login" || pathname === "/admin/login";

  if (isLoginPage && token) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.startsWith("/admin") ? "/admin/users" : "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to everything EXCEPT static files and images
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
