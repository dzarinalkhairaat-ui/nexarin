import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const product = await productService.getById(productId) || await productService.getBySlug(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan." }, { status: 404 });
    }

    const downloadToken = `DL-TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const latestVersion = product.versions[0];
    const response = {
      productName: product.name,
      version: product.currentVersion,
      downloadToken,
      downloadUrl: latestVersion?.downloadUrl || `/downloads/${product.slug}.zip`,
      fileSize: latestVersion?.fileSize || "15.4 MB",
      expiresIn: "3600s"
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghasilkan token unduhan." }, { status: 500 });
  }
}
