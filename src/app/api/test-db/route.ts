import { NextResponse } from 'next/server';
// 👇 FIX: Import 'prisma' instead of 'db'
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    // Simple query to test connection
    const userCount = await prisma.user.count();
    return NextResponse.json({ 
      status: 'Database Connected', 
      userCount 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'Database Connection Failed', 
      error: String(error) 
    }, { status: 500 });
  }
}