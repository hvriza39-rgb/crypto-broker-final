import { cookies } from 'next/headers';

export const ADMIN_ACCESS_COOKIE = process.env.ADMINACCESSTOKENNAME || 'admin_access_token';
export const ADMIN_REFRESH_COOKIE = process.env.ADMINREFRESHTOKENNAME || 'admin_refresh_token';

export function getAdminAccessToken(): string | null {
  return cookies().get(ADMIN_ACCESS_COOKIE)?.value || null;
}

export function getAdminRefreshToken(): string | null {
  return cookies().get(ADMIN_REFRESH_COOKIE)?.value || null;
}
