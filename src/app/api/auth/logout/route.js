import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function clearToken(res) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // <--- MATCHES LOGIN EXACTLY
    expires: new Date(0),
    maxAge: 0,
  };

  // 1. Overwrite with empty value
  res.cookies.set("token", "", cookieOptions);
  
  // 2. Explicit delete command
  res.cookies.delete("token");
}

export async function POST(req) {
  // Redirect to your NEW login path
  const url = new URL("/auth/login", req.url);
  
  // Create the redirect response
  const res = NextResponse.redirect(url);
  
  // Attach the cookie-killing headers
  clearToken(res);
  
  return res;
}

// Handle GET requests (in case you link directly to it)
export async function GET(req) {
  const url = new URL("/auth/login", req.url);
  const res = NextResponse.redirect(url);
  clearToken(res);
  return res;
}