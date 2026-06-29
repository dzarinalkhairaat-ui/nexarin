import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    const { addressText, mapsLink } = body;

    if (!addressText || !mapsLink) {
      return NextResponse.json({ error: "Alamat dan Tautan Maps harus diisi." }, { status: 400 });
    }

    const updatedMap = await prisma.mapSetting.update({
      where: { id },
      data: { addressText, mapsLink },
    });

    return NextResponse.json(updatedMap);
  } catch (error) {
    console.error("Error updating map location:", error);
    return NextResponse.json({ error: "Gagal memperbarui lokasi" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;

    await prisma.mapSetting.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Lokasi berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting map location:", error);
    return NextResponse.json({ error: "Gagal menghapus lokasi" }, { status: 500 });
  }
}
