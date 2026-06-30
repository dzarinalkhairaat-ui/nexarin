import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

// Daftar kata kunci User-Agent yang dicurigai sebagai bot scraper/crawler berbahaya
const BLOCKED_USER_AGENTS = [
  "python", "curl", "wget", "scraper", "crawl", "spider", "headless",
  "puppeteer", "playwright", "selenium", "postman", "insomnia", "axios",
  "node-fetch", "got", "urllib", "ruby", "java", "php"
];

// Daftar bot yang diizinkan (Google, Bing, dll untuk keperluan SEO)
const ALLOWED_BOTS = [
  "googlebot", "bingbot", "yandex", "baiduspider", "slurp", "duckduckbot"
];

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const isNewsRoute = pathname === "/news" || pathname.startsWith("/news/");

  // Hanya terapkan blokir anti-bot/scraper jika BUKAN halaman /news
  if (!isNewsRoute) {
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase();
    
    // 1. ANTI-SCRAPING: Blokir jika tidak ada User-Agent (biasanya script otomatis)
    if (!userAgent || userAgent.trim() === "") {
      return new NextResponse("Access Denied: Missing User-Agent", { status: 403 });
    }

    // 2. ANTI-BOT: Deteksi bot berbahaya berdasarkan User-Agent
    const isMaliciousBot = BLOCKED_USER_AGENTS.some(bot => userAgent.includes(bot));
    const isAllowedBot = ALLOWED_BOTS.some(bot => userAgent.includes(bot));

    // Jika terdeteksi sebagai bot dan bukan bot mesin pencari yang diizinkan
    if (isMaliciousBot && !isAllowedBot) {
      return new NextResponse("Access Denied: Bots and Scrapers are strictly prohibited", { status: 403 });
    }
  }

  // 3. AUTHENTICATION & AUTHORIZATION: Cek akses /admin via Supabase
  // Fungsi ini sudah memiliki pengecekan ekstensif (signed cookie, valid email, dll)
  const response = await updateSession(request);

  // 4. SECURITY HEADERS: Pengamanan tingkat lanjut untuk semua halaman
  // Mencegah Clickjacking (tidak bisa di-embed di iframe)
  response.headers.set("X-Frame-Options", "DENY");
  // Mencegah MIME-sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Mencegah XSS (Cross-Site Scripting)
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // Referrer Policy yang ketat
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // HSTS: Memaksa koneksi selalu menggunakan HTTPS
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // Content Security Policy (Basic) - Mencegah eksekusi script tidak dikenal
  // response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");

  return response;
}

export const config = {
  // Terapkan middleware ke semua route KECUALI file statis (_next/static, gambar, dll)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};