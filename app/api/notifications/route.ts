import { NextResponse } from "next/server";
import { notificationService } from "@/lib/services/notificationService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "ahmad.fadillah@example.com";
    const notifications = await notificationService.getByRecipient(email);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat notifikasi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    await notificationService.markAllAsRead(email || "ahmad.fadillah@example.com");
    return NextResponse.json({ success: true, message: "Semua notifikasi ditandai telah dibaca." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menandai notifikasi." }, { status: 500 });
  }
}
