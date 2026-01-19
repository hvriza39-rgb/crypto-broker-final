import { NextResponse } from 'next/server';
// 👇 FIX: Going up 6 levels to find 'src', then into 'lib/prisma'
import { prisma } from '../../../../../../lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { operation, amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let newBalance = user.portfolioBalance || 0;
    
    if (operation === 'add') {
      newBalance += amount;
    } else if (operation === 'subtract') {
      newBalance -= amount;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        portfolioBalance: newBalance,
        availableBalance: newBalance 
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Balance Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}