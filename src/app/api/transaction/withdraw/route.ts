import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // 👈 Fixed import

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, address, asset } = body;

    // 1. Check if user has enough balance
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user || (user.portfolioBalance || 0) < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // 2. Create Withdrawal Request
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'Withdrawal',
        amount: parseFloat(amount),
        asset: asset || 'USD',
        status: 'Pending' // Needs admin approval
      }
    });

    // 3. Deduct balance immediately (optional, depends on your logic)
    await prisma.user.update({
      where: { id: userId },
      data: {
        portfolioBalance: { decrement: parseFloat(amount) }
      }
    });

    return NextResponse.json({ success: true, transaction });

  } catch (error) {
    console.error("Withdraw Error:", error);
    return NextResponse.json({ error: "Withdrawal failed" }, { status: 500 });
  }
}