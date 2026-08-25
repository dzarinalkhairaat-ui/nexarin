import { NextResponse } from "next/server";
import { articleService } from "@/lib/services/articleService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await articleService.getById(id) || await articleService.getBySlug(id);
    if (!article) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat artikel." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await articleService.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui artikel." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await articleService.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Artikel berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghapus artikel." }, { status: 500 });
  }
}
