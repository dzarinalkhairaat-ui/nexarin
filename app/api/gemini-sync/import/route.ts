import { NextResponse } from "next/server";
import { geminiSyncService } from "@/lib/services/geminiSyncService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: "Judul artikel wajib diisi." }, { status: 400 });
    }

    const draft = await geminiSyncService.importDirectDraft({
      id: body.id,
      title: body.title,
      slug: body.slug,
      category: body.category,
      summary: body.summary || body.excerpt || body.title,
      content: body.content || body.draftContent || body.summary || body.title,
      opinion: body.opinion,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(",").map((t: string) => t.trim()) : ["AI"]),
      sourceName: body.sourceName || body.source_name || "DATABASE PORTAL INFO NEXARIN TECH",
      sourceUrl: body.sourceUrl || body.source_url || "https://gemini.google.com"
    });

    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengimpor draft." }, { status: 500 });
  }
}
