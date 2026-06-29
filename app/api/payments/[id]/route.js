import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const updatedPayment = await prisma.paymentSetting.update({
      where: { id: params.id },
      data: {
        methodId: data.methodId,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        qrisImage: data.qrisImage,
        isActive: data.isActive,
      }
    });
    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json({ error: "Gagal memperbarui data pembayaran" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.paymentSetting.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json({ error: "Gagal menghapus data pembayaran" }, { status: 500 });
  }
}
