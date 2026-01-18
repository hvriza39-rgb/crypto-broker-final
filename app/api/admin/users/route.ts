import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { ObjectId } from 'mongodb';

// GET: Fetch all users
export async function GET(req: Request) {
  try {
    const db = await getDb();
    const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();

    const safeUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
      country: user.country || '',
      phone: user.phone || '',
      verified: user.verified || false,
      createdAt: user.createdAt
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// PUT: Update User Details (FIXED)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    // FIX: Extract '_id' separately so it is NOT included in 'updates'
    // MongoDB throws an error if you try to update the immutable '_id' field
    const { userId, _id, ...updates } = body; 

    if (!userId) return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });

    const db = await getDb();

    // Sanitize update data
    const finalUpdates: any = { ...updates };
    if (finalUpdates.balance !== undefined) {
      finalUpdates.balance = Number(finalUpdates.balance);
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: finalUpdates }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE: Remove a User
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const db = await getDb();
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}