import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. GLOBAL API PASS-THROUGH (Crucial Fix)
  // We let ALL API requests pass through. The API routes will handle 
  // their own verification (jwt.verify). This prevents CORS and Logout issues.
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  // 2. ---- Admin Page Guard ----
  if (pathname.startsWith('/admin')) {
    // Allow login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    // Block protected admin pages
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 3. ---- User Page Guard ----
  // Protect dashboard and settings pages
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

  // 4. ---- Prevent Logged-in Users from seeing Login Page ----
  if ((pathname === '/login' || pathname === '/admin/login') && token) {
    const url = req.nextUrl.clone();
    // Redirect based on where they are trying to go
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
    // Apply to everything EXCEPT static files and images
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};