import { NextResponse } from "next/server";
import { freeResourceService } from "@/lib/services/freeResourceService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await freeResourceService.recordDownload(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mencatat download." }, { status: 500 });
  }
}
