import { NextResponse } from "next/server";
import { licenseService } from "@/lib/services/licenseService";

export async function GET() {
  try {
    const trials = await licenseService.getTrials();
    return NextResponse.json({ success: true, data: trials });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat data trial." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trial = await licenseService.requestTrial(body);
    return NextResponse.json({ success: true, data: trial }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengajukan trial." }, { status: 500 });
  }
}
