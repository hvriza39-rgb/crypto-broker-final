import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // FIXED: Uses Prisma instead of db.ts

// Force this route to be dynamic so it never caches old data
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Try to find the "Admin Settings" in the database
    let settings = await prisma.settings.findFirst();

    // 2. If no settings exist yet, return defaults
    if (!settings) {
      return NextResponse.json({
        btcAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", 
        evmAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
      });
    }

    return NextResponse.json(settings);

  } catch (error) {
    console.error("SETTINGS_API_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}