import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // This helper explicitly deletes the cookie with all correct flags
  cookies().delete('token');

  return NextResponse.json({ success: true });
}