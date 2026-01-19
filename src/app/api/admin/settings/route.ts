import { NextResponse } from 'next/server';
import { getAdminAccessToken } from '@lib/cookies';
import { getDb } from '@lib/db';

const COLLECTION = 'brokerSettings';

export async function GET() {
  const token = getAdminAccessToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = await getDb();
    const col = db.collection(COLLECTION);

    let doc: any = await col.findOne({});
    if (!doc) {
      await col.insertOne({ depositWallet: '', updatedAt: new Date().toISOString(), updatedBy: 'system' });
      doc = await col.findOne({});
    }

    return NextResponse.json({
      settings: {
        depositWallet: doc?.depositWallet || '',
        updatedAt: doc?.updatedAt || new Date().toISOString(),
        updatedBy: doc?.updatedBy || '',
      },
    });
  } catch (e: any) {
    console.error('Failed to fetch settings:', e);
    return NextResponse.json({ error: e?.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const token = getAdminAccessToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const depositWallet = body?.depositWallet;

    if (!depositWallet || typeof depositWallet !== 'string') {
      return NextResponse.json({ error: 'Valid deposit wallet address is required' }, { status: 400 });
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const updatedAt = new Date().toISOString();
    await col.updateOne({}, { $set: { depositWallet, updatedAt, updatedBy: 'admin' } }, { upsert: true });

    const doc: any = await col.findOne({});

    return NextResponse.json({
      settings: {
        depositWallet: doc?.depositWallet || depositWallet,
        updatedAt: doc?.updatedAt || updatedAt,
        updatedBy: doc?.updatedBy || 'admin',
      },
    });
  } catch (e: any) {
    console.error('Failed to update settings:', e);
    return NextResponse.json({ error: e?.message || 'Settings update failed' }, { status: 400 });
  }
}
