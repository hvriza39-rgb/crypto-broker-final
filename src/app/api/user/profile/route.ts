import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma'; // Adjust this path to your prisma helper

export async function GET() {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Decode the token to get the user ID
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Fetch real data from MongoDB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { email: true, role: true, name: true } // Don't send the password!
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}