export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 1. Use the new Prisma client
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    // 2. Authentication Logic
    // We try to get the token from the Header OR the Cookie (for better compatibility)
    const authHeader = req.headers.get('Authorization');
    const cookieHeader = req.headers.get('cookie');
    
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (cookieHeader) {
      token = cookieHeader.split('token=')[1]?.split(';')[0];
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Verify Token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id; // Handle both cases just to be safe

    // 4. Get User Data using Prisma
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 5. Get Transactions using Prisma
    const transactions = await prisma.transaction.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' } // Prisma uses 'createdAt', not 'date'
    });

    // 6. Calculate Stats (Your original logic)
    // Sum only COMPLETED deposits
    // Note: ensure your database uses "Deposit" or "deposit" consistently (case sensitive)
    const totalDeposited = transactions
      .filter(t => (t.type === 'deposit' || t.type === 'Deposit') && t.status === 'Completed')
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    // Logic: Profit = Current Balance - Total Deposited
    // Mapping 'availableBalance' from schema to 'balance' for your frontend
    const currentBalance = user.availableBalance || 0;
    
    const rawProfit = currentBalance - totalDeposited;
    const safeProfit = Math.max(0, rawProfit);

    // Calculate Percentage
    const profitPercent = totalDeposited > 0 
      ? ((safeProfit / totalDeposited) * 100).toFixed(2) 
      : '0.00';

    // 7. Return Data
    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        // verified: user.emailVerified ? true : false // Uncomment if you use emailVerified
      },
      balances: {
        available: currentBalance,
        profit: safeProfit,
        profitPercent: profitPercent
      },
      transactions
    });

  } catch (error) {
    console.error("DASHBOARD_ERROR:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}