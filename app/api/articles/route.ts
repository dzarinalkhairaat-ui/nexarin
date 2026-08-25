import { NextResponse } from "next/server";
import { articleService } from "@/lib/services/articleService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const query = searchParams.get("q") || undefined;
    const articles = await articleService.getAll({ category, query });
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat artikel." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const article = await articleService.create(body);
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal membuat artikel." }, { status: 500 });
  }
}
