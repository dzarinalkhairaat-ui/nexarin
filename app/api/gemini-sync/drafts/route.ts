import { NextResponse } from "next/server";
import { geminiSyncService } from "@/lib/services/geminiSyncService";

export async function GET() {
  try {
    const drafts = await geminiSyncService.getDrafts();
    return NextResponse.json({ success: true, data: drafts });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat draft Gemini." }, { status: 500 });
  }
}
