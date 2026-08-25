import { NextResponse } from "next/server";
import { licenseService } from "@/lib/services/licenseService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "ahmad.fadillah@example.com";
    const licenses = await licenseService.getByCustomer(email);
    return NextResponse.json({ success: true, data: licenses });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat lisensi." }, { status: 500 });
  }
}
