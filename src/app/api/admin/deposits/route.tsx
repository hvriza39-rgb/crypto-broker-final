import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // 👈 Fixed import

export async function GET() {
  try {
    // Fetch all transactions that are deposits
    const deposits = await prisma.transaction.findMany({
      where: {
        type: 'Deposit' 
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ deposits });
  } catch (error) {
    console.error("Deposits Error:", error);
    return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 });
  }
}