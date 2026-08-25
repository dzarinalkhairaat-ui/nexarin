import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";

export async function GET() {
  try {
    const products = await productService.getAll();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat produk." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await productService.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal membuat produk." }, { status: 500 });
  }
}
