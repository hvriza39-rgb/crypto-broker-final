import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // 👈 Fixed import

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, asset, amount, price } = body;

    // Record the trade in the transaction history
    const trade = await prisma.transaction.create({
      data: {
        userId,
        type: type === 'buy' ? 'Buy' : 'Sell',
        asset: asset,
        amount: parseFloat(amount),
        status: 'Completed'
      }
    });

    // NOTE: In a real app, you would also update the User's balance here!

    return NextResponse.json({ success: true, trade });

  } catch (error) {
    return NextResponse.json({ error: "Trade failed" }, { status: 500 });
  }
}