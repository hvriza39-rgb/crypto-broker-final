import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().set({
    name: 'token',
    value: '',
    httpOnly: true, 
    path: '/',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return NextResponse.json({ success: true });
}