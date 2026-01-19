import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER_COOKIE = 'user_session';
const ADMIN_COOKIE_NAME = process.env.ADMINACCESSTOKENNAME || 'admin_access_token';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. ---- Admin Guard (Pages & API) ----
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow the login page and login API to be accessed without a token
    if (pathname === '/admin/login' || pathname === '/api/admin/auth/login') {
      return NextResponse.next();
    }

    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!adminToken) {
      // If it's an API call, return a JSON error instead of a redirect
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // If it's a page, redirect to login
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. ---- User Dashboard Guard ----
  const isProtected = [
    '/dashboard', '/deposit', '/withdrawal', '/trade', '/settings'
  ].some(path => pathname.startsWith(path));

  if (isProtected) {
    const session = req.cookies.get(USER_COOKIE)?.value;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Fixed Matcher: Added /api/admin to ensure API calls are also guarded
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/deposit/:path*',
    '/withdrawal/:path*',
    '/trade/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/api/admin/:path*', // Added this
  ],
};