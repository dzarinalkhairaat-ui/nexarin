import { NextResponse } from "next/server";
import { auditService } from "@/lib/services/auditService";

export async function GET() {
  try {
    const logs = await auditService.getAll();
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat log audit." }, { status: 500 });
  }
}
