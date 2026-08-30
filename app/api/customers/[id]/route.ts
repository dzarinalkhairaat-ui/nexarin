import { NextResponse } from "next/server";
import { customerService } from "@/lib/services/customerService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await customerService.getById(id);
    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: customer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Gagal mengambil data customer." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await customerService.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Customer tidak ditemukan atau gagal diperbarui." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT /api/customers/[id] error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Gagal memperbarui data customer." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await customerService.delete(id);
    if (!success) {
      return NextResponse.json({ success: false, error: "Gagal menghapus customer dari database." }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Customer berhasil dihapus permanen dari sistem." });
  } catch (error: any) {
    console.error("DELETE /api/customers/[id] error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Gagal menghapus customer." }, { status: 500 });
  }
}
