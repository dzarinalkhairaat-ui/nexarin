import { NextResponse } from "next/server";
import { geminiSyncService } from "@/lib/services/geminiSyncService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const published = await geminiSyncService.approveAndPublish(id, body);
    if (!published) {
      return NextResponse.json({ success: false, error: "Draft tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: published });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menerbitkan artikel." }, { status: 500 });
  }
}
