import { NextResponse } from "next/server";
import { runScraperTask } from "@/features/admin/scraping-news/scraper";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // Dalam lingkungan produksi nyata, Anda bisa mengecek header seperti 'Authorization' atau 'x-vercel-cron'
  // untuk memastikan hanya cron runner yang bisa memanggil endpoint ini.
  
  const authHeader = request.headers.get("authorization");
  
  // Opsional: Implementasi pengaman sederhana via environment variable
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  try {
    const result = await runScraperTask();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Terjadi kesalahan sistem.", error: error.message },
      { status: 500 }
    );
  }
}
