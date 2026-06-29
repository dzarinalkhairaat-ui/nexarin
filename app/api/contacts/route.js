import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contactSetting.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Gagal mengambil kontak" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { platform, value } = body;

    if (!platform || !value) {
      return NextResponse.json({ error: "Platform dan value harus diisi." }, { status: 400 });
    }

    const newContact = await prisma.contactSetting.create({
      data: { platform, value, isActive: true },
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: "Gagal menyimpan kontak" }, { status: 500 });
  }
}
