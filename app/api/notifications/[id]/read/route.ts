import { NextResponse } from "next/server";
import { notificationService } from "@/lib/services/notificationService";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await notificationService.markAsRead(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menandai notifikasi." }, { status: 500 });
  }
}
