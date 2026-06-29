import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.paymentSetting.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Gagal mengambil data pembayaran" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const newPayment = await prisma.paymentSetting.create({
      data: {
        methodId: data.methodId,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        qrisImage: data.qrisImage,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });
    return NextResponse.json(newPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Gagal menambah data pembayaran" }, { status: 500 });
  }
}
