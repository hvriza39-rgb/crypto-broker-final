import { NextResponse } from 'next/server';
import { getAdminAccessToken } from '@lib/cookies';
import { apiFetch } from '@lib/fetcher';
import { mockGetMe } from '@lib/mock/admin';

export async function GET() {
  const token = getAdminAccessToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasBackend = !!(process.env.ADMINAPIBASE_URL || process.env.ADMIN_API_BASE_URL || process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL);
  if (!hasBackend) {
    const admin = mockGetMe();
    return NextResponse.json({ admin });
  }

  try {
    const data: any = await apiFetch('/admin/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json({ admin: data.admin ?? data });
  } catch (e: any) {
    console.error('Failed to fetch admin profile:', e);
    return NextResponse.json({ error: e.message || 'Unauthorized' }, { status: 401 });
  }
}
