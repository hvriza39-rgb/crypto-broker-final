import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma'; // ✅ Always use @/lib/prisma

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { operation, amount } = body;

    console.log(`Updating balance for User ${id}: ${operation} ${amount}`); // Debug Log

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 1. Get current user
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Calculate new balance
    // Ensure we treat existing balance as a number (0 if null)
    const currentBalance = Number(user.portfolioBalance) || 0;
    const changeAmount = Number(amount);
    
    let newBalance = currentBalance;
    
    if (operation === 'add') {
      newBalance += changeAmount;
    } else if (operation === 'subtract') {
      newBalance -= changeAmount;
    }

    // 3. Save to Database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        portfolioBalance: newBalance,
        // Update availableBalance too if you want them synced
        availableBalance: newBalance 
      }
    });

    console.log(`New Balance Saved: ${updatedUser.portfolioBalance}`); // Debug Log

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Balance Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}