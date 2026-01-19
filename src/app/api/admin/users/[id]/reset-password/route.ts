import { NextResponse } from 'next/server';
// 👇 FIX: Using the long relative path (6 levels up)
import { prisma } from '../../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Hash the default password
    const defaultPassword = "Password123!";
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    // 3. Update the user
    await prisma.user.update({
      where: { id },
      data: { hashedPassword }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Password reset to: ${defaultPassword}` 
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}