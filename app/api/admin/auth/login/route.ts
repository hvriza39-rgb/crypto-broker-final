import { NextResponse } from 'next/server';
import { setAdminAuthCookies } from '@lib/adminAuth';
import { apiFetch } from '@lib/fetcher';
import { mockLogin } from '@lib/mock/admin';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const hasBackend = !!(process.env.ADMINAPIBASE_URL || process.env.ADMIN_API_BASE_URL || process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL);

  try {
    const data: any = hasBackend
      ? await apiFetch('/admin/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
      : mockLogin(email, password);

    const accessToken: string = data.accessToken || data.access_token || data.token;
    const refreshToken: string = data.refreshToken || data.refresh_token || data.refresh;

    if (!accessToken || !refreshToken) {
      // Backend contract mismatch
      return NextResponse.json(
        { error: 'Login response missing access/refresh tokens' },
        { status: 502 },
      );
    }

    const admin = data.admin || data.user || data.profile || null;

    const res = NextResponse.json({ admin });
    setAdminAuthCookies(res, accessToken, refreshToken);
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Login failed' }, { status: 401 });
  }
}
