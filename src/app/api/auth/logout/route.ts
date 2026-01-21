import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // KILL COOKIE: Overwrite with immediate expiration
  // Must match the Login settings exactly (Path, Secure, SameSite)
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',       // <--- CRITICAL
    maxAge: 0        // <--- EXPIRES INSTANTLY
  });

  return response;
}