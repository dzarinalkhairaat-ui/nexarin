import { NextResponse } from "next/server";
import { customerService } from "@/lib/services/customerService";

export async function GET() {
  try {
    const customers = await customerService.getAll();
    return NextResponse.json({ success: true, data: customers });
  } catch (error: any) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memuat data pelanggan." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Nama dan Email wajib diisi." },
        { status: 400 }
      );
    }

    const created = await customerService.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menambahkan pelanggan baru." },
      { status: 500 }
    );
  }
}
