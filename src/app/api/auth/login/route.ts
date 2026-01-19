import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // This will work after Step 1 is done
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Validate Input
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 2. Find User
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.hashedPassword) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // 3. Check Password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Create Token
    const secret = process.env.JWT_SECRET || "default_secret_key";
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '1d' }
    );

    // 5. Send Response
    const response = NextResponse.json({ 
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}