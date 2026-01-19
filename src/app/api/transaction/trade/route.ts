import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const { action, asset, amount, price } = await req.json(); // action = 'BUY' or 'SELL'
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const db = await getDb();
    const userId = new ObjectId(decoded.id);

    // 1. Get User Balance
    const user = await db.collection('users').findOne({ _id: userId });
    const currentBalance = user?.balance || 0;

    // 2. Logic for BUY vs SELL
    let newBalance = currentBalance;

    if (action === 'BUY') {
      if (currentBalance < numAmount) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }
      newBalance -= numAmount; // Deduct money
    } else {
      // For SELL, we simulate adding money back (In a real app, you'd check asset balance first)
      newBalance += numAmount; 
    }

    // 3. Update Balance
    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { balance: newBalance } }
    );

    // 4. Record Transaction
    await db.collection('transactions').insertOne({
      userId: userId,
      type: 'trade',
      action,        // BUY or SELL
      asset,         // BTC, ETH, etc.
      amount: numAmount,
      priceAtTrade: price,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date()
    });

    return NextResponse.json({ success: true, newBalance });

  } catch (error) {
    console.error("Trade Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}