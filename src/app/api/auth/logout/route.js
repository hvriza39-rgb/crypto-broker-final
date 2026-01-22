import { NextResponse } from "next/server";

function clearToken(res) {
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };

  // Clear cookie (set empty + expired)
  res.cookies.set("token", "", opts);

  // Also try delete (belt + suspenders)
  res.cookies.delete("token");
}

export async function POST(req) {
  const url = new URL("/auth/login", req.url);
  const res = NextResponse.redirect(url);
  clearToken(res);
  return res;
}

export async function GET(req) {
  const url = new URL("/auth/login", req.url);
  const res = NextResponse.redirect(url);
  clearToken(res);
  return res;
}

export const dynamic = "force-dynamic";
