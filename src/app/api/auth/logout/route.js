import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  return logout(req);
}

export async function GET(req) {
  return logout(req);
}

async function logout(req) {
  // 1. Redirect to Login WITH the signal (?logout=true)
  // We use req.url to get the base domain automatically
  const url = new URL(req.url);
  url.pathname = "/auth/login";
  url.searchParams.set("logout", "true"); // <--- This triggers the Middleware Trap

  const res = NextResponse.redirect(url);

  // 2. Try to delete the cookie normally as well
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", 
    maxAge: 0,
  });

  // 3. Prevent caching so the browser doesn't remember the redirect
  res.headers.set("Cache-Control", "no-store, max-age=0");

  return res;
}