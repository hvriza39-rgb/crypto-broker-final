import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    // Fetch all users
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        portfolioBalance: true,
        createdAt: true,
        country: true,
      }
    });

    // Format for the Admin Dashboard Table
    const formattedUsers = users.map(user => ({
      id: user.id,
      fullName: user.name,
      email: user.email,
      balance: user.portfolioBalance,
      status: 'Active', // Default
      joinedAt: user.createdAt,
      country: user.country || 'N/A'
    }));

    return NextResponse.json({ users: formattedUsers });

  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}