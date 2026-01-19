import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getAdminAccessToken } from '@lib/cookies';
import { getDb } from '@lib/db';

function serialize(u: any) {
  return {
    id: String(u._id),
    fullName: u.fullName,
    email: u.email,
    phone: u.phone || '',
    country: u.country || '',
    balance: Number(u.balance ?? 0),
    kycStatus: u.kycStatus || 'pending',
    accountStatus: u.accountStatus || 'active',
    createdAt: u.createdAt || new Date().toISOString(),
  };
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const token = getAdminAccessToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = await getDb();
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(params.id) });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ user: serialize(user) });
  } catch (e: any) {
    console.error('Failed to load user:', e);
    return NextResponse.json({ error: e?.message || 'Failed to load user' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const token = getAdminAccessToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const patch = await req.json();
    const allowed = ['fullName', 'email', 'phone', 'country', 'accountStatus', 'kycStatus', 'balance'];
    const update: any = {};
    for (const k of allowed) {
      if (patch[k] !== undefined) update[k] = patch[k];
    }

    const db = await getDb();
    const users = db.collection('users');
    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: update },
      { returnDocument: 'after' },
    );

    if (!result.value) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ user: serialize(result.value) });
  } catch (e: any) {
    console.error('Failed to update user:', e);
    return NextResponse.json({ error: e?.message || 'Update failed' }, { status: 400 });
  }
}
