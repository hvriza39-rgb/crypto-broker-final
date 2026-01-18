import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET: Fetch User Details
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const db = await getDb();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } }
    );

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Debugging: See what the DB actually holds
    console.log("Fetching Profile for:", user.email, "Name is:", user.name);

    return NextResponse.json({ 
      // If name is missing in DB, send empty string so the input field isn't "uncontrolled"
      name: user.name || '', 
      email: user.email || '',
      phone: user.phone || '',
      country: user.country || ''
    });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// PUT: Update User Details
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const { name, phone, country } = await req.json();

    const db = await getDb();
    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: { name, phone, country } }
    );

    return NextResponse.json({ success: true, message: 'Profile updated' });

  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}