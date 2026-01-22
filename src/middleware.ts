import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. ALLOW API & STATIC FILES
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // 2. THE LOGOUT TRAP (The Fix)
  // If the URL has ?logout=true, we FORCE the login page to show
  // and we manually delete the cookie in the response.
  if (searchParams.get('logout') === 'true') {
    const response = NextResponse.next();
    response.cookies.delete('token'); 
    return response;
  }

  const token = req.cookies.get('token')?.value;

  // 3. ADMIN GUARD
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 4. USER GUARD (Protect Dashboard)
  const isProtected = [
    '/dashboard', '/deposit', '/withdrawal', '/trade', '/settings'
  ].some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // 5. LOGIN PAGE GUARD
  // If user has a token (and NO logout flag), kick them to dashboard
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