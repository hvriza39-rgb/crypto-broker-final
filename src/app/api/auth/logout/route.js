import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  return logout(req);
}

export async function GET(req) {
  return logout(req);
}

async function logout(req) {
  const url = new URL("/auth/login", req.url);
  const res = NextResponse.redirect(url);

  // 1. Standard Cookie Deletion
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", 
    maxAge: 0,
  });

  // 2. Fallback: Try deleting with an empty path (sometimes fixes legacy cookies)
  res.cookies.delete("token");

  // 3. Prevent Caching of this response
  res.headers.set("Cache-Control", "no-store, max-age=0");

  return res;
}