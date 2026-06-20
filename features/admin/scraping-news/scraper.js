import { prisma } from "@/lib/prisma";
import * as cheerio from "cheerio";

// Fungsi bantu sederhana untuk parse RSS XML
function extractMatch(regex, text) {
  const match = regex.exec(text);
  return match ? match[1].trim() : "";
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1");
}

export async function runScraperTask(targetUrl) {
  const RSS_URL = targetUrl || "https://www.antaranews.com/rss/tekno.xml"; 
  let SOURCE_NAME = "Website Berita";

  try {
    const urlObj = new URL(RSS_URL);
    SOURCE_NAME = urlObj.hostname.replace("www.", "");
  } catch (e) {
    SOURCE_NAME = "Sumber Tidak Valid";
  }

  try {
    console.log(`[Scraper] Memulai proses fetch RSS dari ${RSS_URL}`);
    const response = await fetch(RSS_URL, {
      headers: {
        "User-Agent": "Nexarin-Scraper/1.0",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Gagal fetch RSS, status: ${response.status}`);
    }

    const xml = await response.text();
    
    // Pecah menjadi item-item
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let items = [];
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      items.push(match[1]);
    }

    let successCount = 0;
    let skippedCount = 0;

    // Iterasi seluruh item di RSS, target 10 berita baru
    for (const itemXml of items) {
      if (successCount >= 10) break; // Batas maksimal 10 data per proses

      const rawTitle = extractMatch(/<title>([\s\S]*?)<\/title>/, itemXml);
      const rawLink = extractMatch(/<link>([\s\S]*?)<\/link>/, itemXml);
      const rawDesc = extractMatch(/<description>([\s\S]*?)<\/description>/, itemXml);
      const rawPubDate = extractMatch(/<pubDate>([\s\S]*?)<\/pubDate>/, itemXml);

      const title = decodeHtmlEntities(rawTitle);
      const sourceUrl = decodeHtmlEntities(rawLink).trim();
      const excerpt = decodeHtmlEntities(rawDesc).replace(/<[^>]+>/g, "").substring(0, 250); 
      const publishedAt = rawPubDate ? new Date(rawPubDate) : null;

      if (!title || !sourceUrl) {
        skippedCount++;
        continue;
      }

      // Filter: Hanya ambil berita maksimal 7 hari terakhir
      if (publishedAt) {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (publishedAt < sevenDaysAgo) {
          skippedCount++;
          continue;
        }
      }

      // Cek apakah URL sudah pernah di-scrape (Mencegah duplikasi)
      const exists = await prisma.scrapedNewsArticle.findUnique({
        where: { sourceUrl }
      });

      if (exists) {
        skippedCount++;
        continue;
      }

      // Cek juga apakah url sudah ada di database utama (NewsArticle)
      const existsInMain = await prisma.newsArticle.findFirst({
        where: { sourceUrl }
      });

      if (existsInMain) {
        skippedCount++;
        continue;
      }

      // -- Fitur Baru: Scrape Konten & Gambar Aktual dari sourceUrl --
      let articleContent = "";
      let imageUrl = null;
      try {
        const articleRes = await fetch(sourceUrl, {
          headers: { "User-Agent": "Nexarin-Scraper/1.0" },
          next: { revalidate: 0 },
        });
        
        if (articleRes.ok) {
          const articleHtml = await articleRes.text();
          const $ = cheerio.load(articleHtml);
          
          // Cari og:image
          imageUrl = $('meta[property="og:image"]').attr('content') || null;
          
          // Cari paragraf untuk konten
          const paragraphs = [];
          $('p').each((i, el) => {
            const text = $(el).text().trim();
            // Hindari paragraf terlalu pendek (biasanya navigasi/copyright)
            if (text.length > 50) {
              paragraphs.push(text);
            }
          });
          
          // Gabungkan seluruh paragraf dengan baris baru ganda agar rapi
          articleContent = paragraphs.join("\n\n");
        }
      } catch (err) {
        console.warn(`[Scraper] Gagal fetch detail konten dari ${sourceUrl}`, err.message);
      }

      // Simpan ke tabel sementara
      await prisma.scrapedNewsArticle.create({
        data: {
          title,
          sourceName: SOURCE_NAME,
          sourceUrl,
          excerpt,
          content: articleContent || null,
          imageUrl: imageUrl,
          sourcePublishedAt: isNaN(publishedAt?.getTime()) ? null : publishedAt,
        }
      });
      
      successCount++;
    }

    const waktuLokal = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    console.log(`[Scraper - ${waktuLokal}] Selesai. Berhasil: ${successCount}, Dilewati/Duplikat: ${skippedCount}`);
    
    // Simpan log sukses
    await prisma.scraperLog.create({
      data: {
        status: "SUCCESS",
        message: `Scraping Selesai (${waktuLokal}). Mendapatkan ${successCount} berita baru (Mengecualikan ${skippedCount} duplikat). Sumber: ${SOURCE_NAME}`,
        count: successCount
      }
    });
    
    return {
      ok: true,
      message: `Scraping selesai. Mendapatkan ${successCount} berita baru.`,
      count: successCount
    };

  } catch (error) {
    const waktuLokal = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    console.error(`[Scraper Error - ${waktuLokal}]`, error);
    
    // Simpan log error
    await prisma.scraperLog.create({
      data: {
        status: "ERROR",
        message: `Error (${waktuLokal}): ${error.message}`,
        count: 0
      }
    });

    return {
      ok: false,
      message: "Terjadi kesalahan saat memproses data scraping.",
      error: error.message
    };
  }
}
