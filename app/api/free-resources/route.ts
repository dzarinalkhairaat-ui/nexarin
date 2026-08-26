import { NextResponse } from "next/server";
import { freeResourceService } from "@/lib/services/freeResourceService";

export async function GET() {
  try {
    const resources = await freeResourceService.getAll();
    return NextResponse.json({ success: true, data: resources });
  } catch (error: any) {
    console.error("GET /api/free-resources error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Gagal memuat free resources." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await freeResourceService.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/free-resources error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Gagal membuat free resource." }, { status: 500 });
  }
}
