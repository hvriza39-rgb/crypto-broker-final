import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getAdminAccessToken } from '@lib/cookies';
import { getDb } from '@lib/db';

// Learning-mode reset: set a temporary password.
// In production you'd send an email with a reset link.
const TEMP_PASSWORD = 'Temp123!';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const token = getAdminAccessToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = await getDb();
    const users = db.collection('users');

    const passwordHash = await bcrypt.hash(TEMP_PASSWORD, 10);
    const result = await users.updateOne({ _id: new ObjectId(params.id) }, { $set: { passwordHash } });

    if (!result.matchedCount) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, tempPassword: TEMP_PASSWORD });
  } catch (e: any) {
    console.error('Reset failed:', e);
    return NextResponse.json({ error: e?.message || 'Reset failed' }, { status: 400 });
  }
}
