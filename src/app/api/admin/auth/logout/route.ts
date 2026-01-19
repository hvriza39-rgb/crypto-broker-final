import { NextResponse } from 'next/server';
import { clearAdminAuthCookies } from '@lib/adminAuth';
import { getAdminAccessToken } from '@lib/cookies';
import { apiFetch } from '@lib/fetcher';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAdminAuthCookies(res);

  // Best-effort notify backend (optional)
  const hasBackend = !!(process.env.ADMINAPIBASE_URL || process.env.ADMIN_API_BASE_URL || process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL);
  if (hasBackend) {
    const token = getAdminAccessToken();
    if (token) {
      apiFetch('/admin/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  }

  return res;
}
