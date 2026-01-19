import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // This imports your fixed client
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, country } = body;

    // 1. Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 3. Hash the password (Security best practice)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the user in MongoDB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword, // ensure your schema.prisma has this field (or 'password')
        phone,
        country,
      },
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}