import { NextResponse } from 'next/server';
// Ensure this path is correct for your project structure
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

    const { amount, asset, network, address } = await req.json();
    const numAmount = Number(amount);
    const userId = new ObjectId(decoded.id);

    console.log(`Processing Withdrawal: User ${userId}, Amount: ${numAmount}`);

    const db = await getDb();

    // 1. Check Balance
    const user = await db.collection('users').findOne({ _id: userId });
    const currentBalance = user?.balance || 0;

    if (currentBalance < numAmount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // 2. Perform the Deduction
    const updateResult = await db.collection('users').updateOne(
      { _id: userId },
      { $inc: { balance: -numAmount } }
    );

    console.log('Update Result:', updateResult);

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ error: 'Balance update failed. Please try again.' }, { status: 500 });
    }

    // 3. Save Transaction
    await db.collection('transactions').insertOne({
      userId: userId,
      type: 'withdrawal',
      amount: numAmount,
      asset,
      network,
      address,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date()
    });

    return NextResponse.json({ success: true, newBalance: currentBalance - numAmount });

  } catch (error) {
    console.error('Withdraw API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}