import { NextResponse } from "next/server";
import { customerService } from "@/lib/services/customerService";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email wajib diisi." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const customer = await customerService.getByEmail(normalizedEmail);

    // 1. Check if customer was deleted by administrator
    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Akun pelanggan tidak terdaftar atau telah dihapus oleh administrator. Silakan lakukan registrasi ulang untuk membuat akun baru."
        },
        { status: 404 }
      );
    }

    // 2. Check if customer account is suspended / deactivated
    if (customer.status === "suspended") {
      return NextResponse.json(
        {
          success: false,
          error: "Akun Anda saat ini dinonaktifkan oleh administrator. Silakan hubungi tim dukungan resmi Nexarin."
        },
        { status: 403 }
      );
    }

    const user = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      avatar: customer.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: "customer",
      company: customer.company,
      joinedAt: customer.joinedAt
    };

    return NextResponse.json({ success: true, data: { user } });
  } catch (error) {
    console.error("POST /api/auth/customer/login error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server saat login." }, { status: 500 });
  }
}
