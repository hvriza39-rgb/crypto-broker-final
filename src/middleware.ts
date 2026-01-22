import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Skip API routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // 2. THE FIX: Check for the logout signal
  // If user is on /auth/login and has ?logout=true, FORCE DELETE the cookie and let them stay
  if (pathname === '/auth/login' && searchParams.get('logout') === 'true') {
    const response = NextResponse.next();
    response.cookies.delete('token'); // Kill it one last time
    return response;
  }

  const token = req.cookies.get('token')?.value;

  // 3. User Guard (Standard)
  // If no token and trying to access protected pages -> Login
  const isProtected = [
    '/dashboard', '/deposit', '/withdrawal', '/trade', '/settings'
  ].some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    // Check if it's admin or user
    if (pathname.startsWith('/admin')) {
      url.pathname = '/admin/login';
    } else {
      url.pathname = '/auth/login';
    }
    return NextResponse.redirect(url);
  }

  // 4. Admin Guard
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    if (!token) {
       return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // 5. Prevent Logged-in users from seeing Login
  const isLoginPage = pathname === '/auth/login' || pathname === '/login' || pathname === '/admin/login';
  
  if (isLoginPage && token) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.startsWith('/admin') ? '/admin/users' : '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};