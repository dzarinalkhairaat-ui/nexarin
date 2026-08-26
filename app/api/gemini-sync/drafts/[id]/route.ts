import { NextResponse } from "next/server";
import { geminiSyncService } from "@/lib/services/geminiSyncService";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await geminiSyncService.rejectDraft(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Draft tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Draft berhasil dihapus dari database dan staging." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghapus draft." }, { status: 500 });
  }
}
