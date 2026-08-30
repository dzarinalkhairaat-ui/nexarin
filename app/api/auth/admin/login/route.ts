import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Read credentials directly from environment variables with fallback
    const expectedEmail = (process.env.ADMIN_EMAIL || "nexarintech@administrator.com").trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || "15September2006";

    if (
      email &&
      password &&
      email.trim().toLowerCase() === expectedEmail &&
      password === expectedPassword
    ) {
      const admin = {
        id: "usr-adm-001",
        name: "Rins (Administrator)",
        email: expectedEmail,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        role: "admin",
        joinedAt: "2026-01-01T00:00:00Z",
        company: "Nexarin Tech HQ",
        permissions: ["all", "editorial", "shop", "affiliate", "analytics"]
      };
      return NextResponse.json({ success: true, data: { admin } });
    }

    return NextResponse.json(
      { success: false, error: "Kredensial Administrator Tidak Valid." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat autentikasi admin." },
      { status: 500 }
    );
  }
}
