import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    // 1. Get data sent from the frontend
    const { name, email, password, phone, country } = await req.json();

    // 2. Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    
    // 3. Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 4. Encrypt the password for security
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Save the new user to the database
    await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',       
      country: country || '',   
      balance: 0,
      verified: false,
      role: 'user',
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}