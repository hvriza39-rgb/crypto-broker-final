import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 👇 FIX 1: Change this to match the cookie name we set in the Login Page
const COOKIE_NAME = 'token';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve the token (ticket) from the user's browser
  const token = req.cookies.get(COOKIE_NAME)?.value;

  // 1. ---- Admin Guard (Pages & API) ----
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow the login page and login API to be accessed without a token
    if (pathname === '/admin/login' || pathname === '/api/admin/auth/login') {
      return NextResponse.next();
    }

    // Check if the token exists
    if (!token) {
      // If it's an API call, return a JSON error instead of a redirect
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // If it's a page, redirect to admin login
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 2. ---- User Dashboard Guard ----
  const isProtected = [
    '/dashboard', '/deposit', '/withdrawal', '/trade', '/settings'
  ].some(path => pathname.startsWith(path));

  if (isProtected) {
    // If trying to visit dashboard without a token, kick them out
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // 3. ---- Prevent Logged-in Users from seeing Login Page ----
  // If they HAVE a token but visit /login, send them to dashboard
  if ((pathname === '/login' || pathname === '/admin/login') && token) {
     const url = req.nextUrl.clone();
     if (pathname.startsWith('/admin')) {
        url.pathname = '/admin/users';
     } else {
        url.pathname = '/dashboard';
     }
     return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/deposit/:path*',
    '/withdrawal/:path*',
    '/trade/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/login',
    '/admin/login'
  ],
};