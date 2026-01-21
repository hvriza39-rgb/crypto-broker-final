import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'token';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 👇 NEW: Skip middleware entirely for logout endpoint
  if (pathname === '/api/auth/logout') {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  // 1. ---- Admin Guard (Pages & API) ----
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (pathname === '/admin/login' || pathname === '/api/admin/auth/login') {
      return NextResponse.next();
    }

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
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
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // 3. ---- Prevent Logged-in Users from seeing Login Page ----
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
    '/api/auth/logout', // 👈 Added this
    '/login',
    '/admin/login'
  ],
};