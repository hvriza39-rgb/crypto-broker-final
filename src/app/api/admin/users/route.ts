import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Force dynamic so it doesn't cache old data
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all users sorted by newest first
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,      // <--- We need this for the Admin Badge
        createdAt: true,
        // You can add 'balance' or 'isVerified' here if you want to see those too
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}