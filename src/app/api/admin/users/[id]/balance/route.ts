import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getAdminAccessToken } from '@lib/cookies';
import { getDb } from '@lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const token = getAdminAccessToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const operation = body?.operation as 'add' | 'subtract';
    const amount = Number(body?.amount);

    if (!operation || !['add', 'subtract'].includes(operation)) {
      return NextResponse.json({ error: 'Operation must be "add" or "subtract"' }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const user: any = await users.findOne({ _id: new ObjectId(params.id) });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const current = Number(user.balance ?? 0);
    const next = operation === 'add' ? current + amount : current - amount;
    if (next < 0) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { balance: next } },
      { returnDocument: 'after' },
    );

    const u: any = result.value;
    return NextResponse.json({
      user: {
        id: String(u._id),
        fullName: u.fullName,
        email: u.email,
        phone: u.phone || '',
        country: u.country || '',
        balance: Number(u.balance ?? 0),
        kycStatus: u.kycStatus || 'pending',
        accountStatus: u.accountStatus || 'active',
        createdAt: u.createdAt || new Date().toISOString(),
      },
    });
  } catch (e: any) {
    console.error('Balance update failed:', e);
    return NextResponse.json({ error: e?.message || 'Balance update failed' }, { status: 400 });
  }
}
