import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    const { value } = body;

    if (!value) {
      return NextResponse.json({ error: "Value harus diisi." }, { status: 400 });
    }

    const updatedContact = await prisma.contactSetting.update({
      where: { id },
      data: { value },
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ error: "Gagal memperbarui kontak" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;

    await prisma.contactSetting.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kontak berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Gagal menghapus kontak" }, { status: 500 });
  }
}
