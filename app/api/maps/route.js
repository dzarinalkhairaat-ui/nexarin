import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const maps = await prisma.mapSetting.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(maps);
  } catch (error) {
    console.error("Error fetching maps:", error);
    return NextResponse.json({ error: "Gagal mengambil lokasi" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { addressText, mapsLink } = body;

    if (!addressText || !mapsLink) {
      return NextResponse.json({ error: "Alamat dan Tautan Maps harus diisi." }, { status: 400 });
    }

    const newMap = await prisma.mapSetting.create({
      data: { addressText, mapsLink, isActive: true },
    });

    return NextResponse.json(newMap, { status: 201 });
  } catch (error) {
    console.error("Error creating map location:", error);
    return NextResponse.json({ error: "Gagal menyimpan lokasi" }, { status: 500 });
  }
}
