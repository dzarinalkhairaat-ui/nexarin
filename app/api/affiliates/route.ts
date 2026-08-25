import { NextResponse } from "next/server";
import { affiliateService } from "@/lib/services/affiliateService";

export async function GET() {
  try {
    const affiliates = await affiliateService.getAll();
    return NextResponse.json({ success: true, data: affiliates });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat affiliate." }, { status: 500 });
  }
}
