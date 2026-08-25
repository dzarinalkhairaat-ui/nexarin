import { NextResponse } from "next/server";
import { affiliateService } from "@/lib/services/affiliateService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await affiliateService.recordClick(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mencatat klik affiliate." }, { status: 500 });
  }
}
