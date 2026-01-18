import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

// FIX: Force this route to be dynamic so it never caches old data
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const db = await getDb();
    // Use 'as any' to match the custom ID
    const settings = await db.collection('settings').findOne({ _id: 'global_settings' as any });
    
    return NextResponse.json({ 
      btcAddress: settings?.btcAddress || '',
      evmAddress: settings?.evmAddress || ''
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { btcAddress, evmAddress } = await req.json();
    const db = await getDb();

    await db.collection('settings').updateOne(
      { _id: 'global_settings' as any },
      { 
        $set: { 
          btcAddress, 
          evmAddress, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}