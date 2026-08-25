import { NextResponse } from "next/server";
import { geminiSyncService } from "@/lib/services/geminiSyncService";

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    if (!topic) {
      return NextResponse.json({ success: false, error: "Topik artikel wajib diisi." }, { status: 400 });
    }
    const draft = await geminiSyncService.generateWithGemini(topic);
    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal generate konten AI." }, { status: 500 });
  }
}
