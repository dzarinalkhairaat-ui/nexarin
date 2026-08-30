import { NextResponse } from "next/server";
import { geminiSyncService } from "@/lib/services/geminiSyncService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const draft = await geminiSyncService.getDraftById(id);
    if (!draft) {
      return NextResponse.json({ success: false, error: "Draft tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil draft." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await geminiSyncService.updateDraft(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui draft." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await geminiSyncService.rejectDraft(id);
    return NextResponse.json({ success: true, message: `Draft ${id} berhasil dihapus.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghapus draft." }, { status: 500 });
  }
}
