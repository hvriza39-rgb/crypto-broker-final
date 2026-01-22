import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  return logout(req);
}

export async function GET(req) {
  return logout(req);
}

async function logout(req) {
  // 1. Add ?logout=true to the URL
  // This tells the middleware "Allow this user to see the login page, even if they have a cookie"
  const url = new URL("/auth/login?logout=true", req.url);
  
  const res = NextResponse.redirect(url);

  // 2. Try to kill the cookie normally
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", 
    maxAge: 0,
  });

  return res;
}