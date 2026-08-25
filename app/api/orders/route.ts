import { NextResponse } from "next/server";
import { orderService } from "@/lib/services/orderService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (email) {
      const customerOrders = await orderService.getByCustomer(email);
      return NextResponse.json({ success: true, data: customerOrders });
    }
    const allOrders = await orderService.getAll();
    return NextResponse.json({ success: true, data: allOrders });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat pesanan." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await orderService.create(body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memproses pesanan." }, { status: 500 });
  }
}
