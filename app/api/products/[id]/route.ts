import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productService.getById(id) || await productService.getBySlug(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat produk." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await productService.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui produk." }, { status: 500 });
  }
}
