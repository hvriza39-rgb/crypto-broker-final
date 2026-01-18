import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@lib/db';
import { ObjectId } from 'mongodb';

const USER_COOKIE = 'user_session';

export async function GET() {
  const userId = cookies().get(USER_COOKIE)?.value;
  if (!userId) return NextResponse.json({ user: null });

  const db = await getDb();
  const user: any = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      balance: user.balance ?? 0,
    },
  });
}
