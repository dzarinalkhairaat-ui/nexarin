import { NextResponse } from "next/server";
import { customerService } from "@/lib/services/customerService";

export async function POST(request: Request) {
  try {
    const { name, email, password, company } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Nama, email, dan password wajib diisi." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password minimal 6 karakter." }, { status: 400 });
    }

    const created = await customerService.create({
      name,
      email,
      company,
      status: "active"
    });

    const user = {
      id: created.id,
      name: created.name,
      email: created.email,
      avatar: created.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: "customer",
      company: created.company,
      joinedAt: created.joinedAt
    };

    return NextResponse.json({ success: true, data: { user } });
  } catch (error) {
    console.error("POST /api/auth/customer/register error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server saat registrasi." }, { status: 500 });
  }
}
