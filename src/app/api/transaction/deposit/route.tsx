import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db'; 
import { ObjectId } from 'mongodb'; 
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    // 1. Authenticate
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // 2. Get Data
    const { amount, asset, network, proof } = await req.json();
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const db = await getDb();
    const userId = new ObjectId(decoded.id);

    // 3. Save "Pending" Transaction
    await db.collection('transactions').insertOne({
      userId: userId,
      type: 'deposit',
      amount: numAmount,
      asset,
      network,
      proof: proof || '', 
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date()
    });

    return NextResponse.json({ success: true, message: 'Deposit submitted for approval' });

  } catch (error) {
    console.error('Deposit Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}