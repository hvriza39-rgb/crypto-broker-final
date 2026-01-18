import { NextResponse } from 'next/server';
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE } from './cookies';

export function setAdminAuthCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  const domain = process.env.ADMINCOOKIEDOMAIN;
  const secure = process.env.ADMINCOOKIESECURE === 'true';
  const maxAgeAccess = 60 * 15; // 15 minutes
  const maxAgeRefresh = 60 * 60 * 24 * 7; // 7 days

  res.cookies.set(ADMIN_ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeAccess,
    ...(domain ? { domain } : {}),
  });

  res.cookies.set(ADMIN_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeRefresh,
    ...(domain ? { domain } : {}),
  });
}

export function clearAdminAuthCookies(res: NextResponse) {
  const domain = process.env.ADMINCOOKIEDOMAIN;
  const secure = process.env.ADMINCOOKIESECURE === 'true';

  res.cookies.set(ADMIN_ACCESS_COOKIE, '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    ...(domain ? { domain } : {}),
  });

  res.cookies.set(ADMIN_REFRESH_COOKIE, '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    ...(domain ? { domain } : {}),
  });
}
