import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // Redirect destination
  const url = new URL("/auth/login", req.url);
  const res = NextResponse.redirect(url);

  // 💥 THE SHOTGUN APPROACH 💥
  // We send 3 different delete commands. One of them WILL work.

  // 1. Delete as HTTPS / Secure (Production Standard)
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // 2. Delete as HTTP / Non-Secure (Localhost Fallback)
  // Sometimes Vercel preview environments act like this
  res.cookies.set("token.legacy", "", {
    path: "/",
    maxAge: 0,
  });

  // 3. Raw Header Append (The "Belt and Suspenders" fix)
  // This bypasses Next.js helpers and speaks directly to the browser
  res.headers.append(
    "Set-Cookie",
    "token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure"
  );

  return res;
}

// Handle GET requests too (in case of direct navigation)
export async function GET(req) {
  return POST(req);
}