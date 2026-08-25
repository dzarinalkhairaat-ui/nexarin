import { NextResponse } from "next/server";
import { licenseService } from "@/lib/services/licenseService";

export async function POST(request: Request) {
  try {
    const { licenseKey, productId } = await request.json();
    if (!licenseKey) {
      return NextResponse.json({ success: false, error: "licenseKey wajib disertakan." }, { status: 400 });
    }
    const verification = await licenseService.verify(licenseKey, productId);
    return NextResponse.json({ success: verification.valid, data: verification });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan validasi lisensi." }, { status: 500 });
  }
}
