import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET: Fetch a single user's details
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      // Select only what we need (security best practice)
      select: {
        id: true,
        name: true, // If your schema uses 'fullName', change this to fullName
        email: true,
        phone: true,
        country: true,
        portfolioBalance: true,
        createdAt: true,
        // If you have status fields in your schema, add them here:
        // accountStatus: true,
        // kycStatus: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Map Prisma fields to the frontend expected format if needed
    const formattedUser = {
      ...user,
      fullName: user.name, // Mapping 'name' to 'fullName' for the frontend
      balance: user.portfolioBalance,
      accountStatus: 'active', // Defaulting if not in schema yet
      kycStatus: 'verified'    // Defaulting if not in schema yet
    };

    return NextResponse.json({ user: formattedUser });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update user details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    
    // Extract fields to update
    const { fullName, email, phone, country } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: fullName, // Update 'name' in DB using 'fullName' from form
        email,
        phone,
        country,
      }
    });

    // Format response back to frontend
    const formattedUser = {
      ...updatedUser,
      fullName: updatedUser.name,
      balance: updatedUser.portfolioBalance,
      accountStatus: 'active',
      kycStatus: 'verified'
    };

    return NextResponse.json({ user: formattedUser });

  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}