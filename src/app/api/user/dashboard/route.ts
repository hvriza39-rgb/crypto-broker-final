import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // 1. Fetch User Data
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        portfolioBalance: true,
        availableBalance: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Fetch Recent Transactions (Last 5)
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // 3. Calculate Simulated Profit (Optional Demo Logic)
    // In a real app, you would sum up deposits vs current balance.
    // For now, let's assume 15% of the balance is profit if balance > 0.
    const currentBalance = user.portfolioBalance || 0;
    const estimatedProfit = currentBalance > 0 ? currentBalance * 0.15 : 0; 
    const profitPercent = currentBalance > 0 ? "15.0" : "0";

    // 4. Send Everything
    return NextResponse.json({
      user,
      balances: {
        available: user.availableBalance || user.portfolioBalance,
        profit: estimatedProfit,
        profitPercent: profitPercent
      },
      transactions: transactions || []
    });

  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}