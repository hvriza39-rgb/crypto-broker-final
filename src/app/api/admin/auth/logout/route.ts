import { NextResponse } from 'next/server';

export async function POST() {
  // In a real app, you would delete the session cookie here.
  // For now, we return success so the frontend redirects you to login.
  const response = NextResponse.json({ success: true, message: "Logged out" });
  
  // If you decide to use cookies later, you can uncomment this:
  // response.cookies.delete('admin_session');
  
  return response;
}