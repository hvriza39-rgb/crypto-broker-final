import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma'; 

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { operation, amount } = body;

    console.log(`Processing balance for User ${id}: ${operation} $${amount}`);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 1. Get current user to check existing balance
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Calculate the new balance safely
    const currentBalance = user.portfolioBalance || 0;
    const changeAmount = Number(amount);
    
    let newBalance = currentBalance;
    
    if (operation === 'add') {
      newBalance += changeAmount;
    } else if (operation === 'subtract') {
      newBalance -= changeAmount;
    }

    // 3. SAVE to Database (Updating BOTH fields ensures it shows up everywhere)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        portfolioBalance: newBalance,
        availableBalance: newBalance 
      }
    });

    console.log("Database updated successfully:", updatedUser.portfolioBalance);

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Balance Update Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}