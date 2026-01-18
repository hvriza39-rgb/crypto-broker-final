export const dynamic = 'force-dynamic';

// ... rest of your code ...
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const db = await getDb();
    const userId = new ObjectId(decoded.id);

    // 1. Get User Data (Balance)
    const user = await db.collection('users').findOne({ _id: userId });
    
    // 2. Get Transactions
    const transactions = await db.collection('transactions')
      .find({ userId: userId })
      .sort({ date: -1 })
      .toArray();

    // 3. Calculate Stats
    // Sum only COMPLETED deposits
    const totalDeposited = transactions
      .filter(t => t.type === 'deposit' && t.status === 'Completed')
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    // Logic: Profit = Current Balance - Total Deposited
    // Math.max(0, ...) ensures it never shows a negative number
    const rawProfit = (user?.balance || 0) - totalDeposited;
    const safeProfit = Math.max(0, rawProfit);

    // Calculate Percentage (Simple growth calc)
    const profitPercent = totalDeposited > 0 ? ((safeProfit / totalDeposited) * 100).toFixed(2) : '0.00';

    return NextResponse.json({
      user: {
        name: user?.name,
        email: user?.email,
        verified: user?.verified
      },
      balances: {
        available: user?.balance || 0,
        profit: safeProfit, // Sending the calculated profit
        profitPercent: profitPercent
      },
      transactions
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}