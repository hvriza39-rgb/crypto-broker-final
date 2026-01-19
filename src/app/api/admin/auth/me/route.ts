import { NextResponse } from 'next/server';
// 👇 FIX: Import 'prisma' instead of 'getDb'
import { prisma } from '../../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 👇 Use 'prisma' here
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        portfolioBalance: true,
        country: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}