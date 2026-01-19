import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, asset } = body;

    if (!userId || !amount) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'Deposit',
        amount: parseFloat(amount),
        asset: asset || 'USD',
        status: 'Pending' // Deposits usually start as Pending
      }
    });

    return NextResponse.json({ success: true, transaction });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}