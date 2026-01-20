import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const token = cookies().get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 1. Update User Balance
    // 2. Create Transaction Record
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: decoded.id },
        data: {
          availableBalance: { increment: parseFloat(amount) },
          portfolioBalance: { increment: parseFloat(amount) }
        }
      }),
      prisma.transaction.create({
        data: {
          userId: decoded.id,
          type: 'DEPOSIT',
          amount: parseFloat(amount),
          status: 'COMPLETED',
          description: 'Deposit via Wallet'
        }
      })
    ]);

    return NextResponse.json({ success: true, balance: updatedUser.availableBalance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Deposit failed' }, { status: 500 });
  }
}