import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // "Nuclear" Option: Overwrite the cookie explicitly
  // We set the value to empty string and maxAge to 0
  cookies().set({
    name: 'token',
    value: '',
    httpOnly: true, 
    path: '/',      // CRITICAL: Must match the path where it was set
    maxAge: 0,      // Expire immediately
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json({ success: true });
}