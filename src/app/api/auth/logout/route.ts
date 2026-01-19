import { NextResponse } from 'next/server';

const USER_COOKIE = 'user_session';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
