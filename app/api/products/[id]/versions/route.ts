import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedProduct = await productService.addVersion(id, body);
    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal merilis versi baru." }, { status: 500 });
  }
}
