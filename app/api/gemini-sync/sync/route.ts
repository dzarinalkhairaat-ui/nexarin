import { NextResponse } from "next/server";
import { geminiSyncService } from "@/lib/services/geminiSyncService";

export async function POST() {
  try {
    const res = await geminiSyncService.triggerSync();
    return NextResponse.json({ success: true, data: res });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal sinkronisasi Gemini." }, { status: 500 });
  }
}
