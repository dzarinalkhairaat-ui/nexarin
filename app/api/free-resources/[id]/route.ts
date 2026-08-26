import { NextResponse } from "next/server";
import { freeResourceService } from "@/lib/services/freeResourceService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await freeResourceService.getById(id);
    if (!res) {
      return NextResponse.json({ success: false, error: "Resource tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: res });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat resource." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await freeResourceService.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Resource tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui resource." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await freeResourceService.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Resource tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Resource berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghapus resource." }, { status: 500 });
  }
}
