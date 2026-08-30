import { NextResponse } from "next/server";
import { geminiSyncService } from "@/lib/services/geminiSyncService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sheetId = body.sheetId || process.env.GOOGLE_SHEETS_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
    const result = await geminiSyncService.triggerSync(sheetId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menyinkronkan Gemini Spark." }, { status: 500 });
  }
}
