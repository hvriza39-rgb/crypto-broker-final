export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify token
const verifyToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
};

// GET: Fetch User Details
export async function GET(req: Request) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
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
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id;
    const body = await req.json();
    const { name, phone, country } = body;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        country
      }
    });

    return NextResponse.json({ success: true, message: 'Profile updated' });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}