import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Get the User ID from the secure cookie
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    // 2. Fetch notifications for this user (newest first)
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to last 20 messages
    });

    return NextResponse.json(notifications);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}