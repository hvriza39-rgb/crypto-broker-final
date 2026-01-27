import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // Adjust path as needed

export async function POST(req: Request) {
  try {
    const { userId, title, message } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title: title || 'Admin Message',
        message,
      },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Message Error:", error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}