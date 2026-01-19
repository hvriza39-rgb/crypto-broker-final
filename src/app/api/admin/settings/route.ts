import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // 👈 Fixed import

export async function GET() {
  try {
    // Get the first settings row, or create one if it doesn't exist
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          btcAddress: '',
          evmAddress: ''
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { btcAddress, evmAddress } = body;

    // Update the first settings found
    // (In a real app, you might want a more specific ID, but this works for single-config)
    const firstSetting = await prisma.settings.findFirst();
    
    if (firstSetting) {
      const updated = await prisma.settings.update({
        where: { id: firstSetting.id },
        data: { btcAddress, evmAddress }
      });
      return NextResponse.json(updated);
    } else {
      // Create if missing
      const newSettings = await prisma.settings.create({
        data: { btcAddress, evmAddress }
      });
      return NextResponse.json(newSettings);
    }

  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}