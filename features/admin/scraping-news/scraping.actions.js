"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/features/admin/admin.helpers";
import crypto from "crypto";
import { runScraperTask } from "./scraper";
import { executeWithRotatedKey } from "@/lib/ai/aiKeyRuntime";

export async function runManualScraper(targetUrl) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false, message: "Akses ditolak: " + (adminSession.message || "Sesi tidak valid.") };
  }

  const result = await runScraperTask(targetUrl);
  if (result.ok) {
    revalidatePath("/admin/scraping-news");
  }
  return result;
}

function generateSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const randomSuffix = crypto.randomBytes(3).toString("hex");
  return `${baseSlug}-${randomSuffix}`;
}

export async function getScrapedNews() {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false, message: "Akses ditolak.", data: [] };
  }

  try {
    const data = await prisma.scrapedNewsArticle.findMany({
      orderBy: { scrapedAt: "desc" },
    });
    return { ok: true, data };
  } catch (error) {
    console.error("Gagal mengambil data scraping:", error);
    return { ok: false, message: "Terjadi kesalahan server.", data: [] };
  }
}

export async function deleteScrapedNews(id) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false, message: "Akses ditolak." };
  }

  try {
    await prisma.scrapedNewsArticle.delete({
      where: { id },
    });
    revalidatePath("/admin/scraping-news");
    return { ok: true, message: "Kandidat berita berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus data scraping:", error);
    return { ok: false, message: "Gagal menghapus kandidat berita." };
  }
}

export async function pickScrapedNews(id) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false, message: "Akses ditolak." };
  }

  try {
    // Gunakan transaksi untuk memastikan data aman dipindah
    const result = await prisma.$transaction(async (tx) => {
      const scrapedArticle = await tx.scrapedNewsArticle.findUnique({
        where: { id },
      });

      if (!scrapedArticle) {
        throw new Error("Kandidat berita tidak ditemukan.");
      }

      // Cari kategori default atau pertama
      let category = await tx.newsCategory.findFirst({
        where: { slug: "berita-umum" },
      });

      if (!category) {
        category = await tx.newsCategory.findFirst();
      }

      if (!category) {
        // Jika benar-benar kosong, buat satu kategori darurat
        category = await tx.newsCategory.create({
          data: {
            name: "Berita Umum",
            slug: "berita-umum",
            description: "Kategori default untuk hasil scraping",
          },
        });
      }

      // Buat slug unik
      const uniqueSlug = generateSlug(scrapedArticle.title);

      // Simpan ke NewsArticle utama sebagai DRAFT
      await tx.newsArticle.create({
        data: {
          title: scrapedArticle.aiTitle || scrapedArticle.title,
          slug: uniqueSlug,
          summary: scrapedArticle.aiSummary || scrapedArticle.excerpt || "Ringkasan belum tersedia",
          content: scrapedArticle.aiContent || scrapedArticle.content || "",
          status: "DRAFT",
          coverImageUrl: scrapedArticle.imageUrl,
          coverImageProvider: scrapedArticle.imageUrl ? "EXTERNAL" : null,
          sourceType: "ARTICLE_WEBSITE",
          sourceName: scrapedArticle.sourceName,
          sourceUrl: scrapedArticle.sourceUrl,
          categoryId: category.id,
          // Jangan set publishedAt karena ini masih DRAFT
        },
      });

      // Hapus dari penampungan
      await tx.scrapedNewsArticle.delete({
        where: { id },
      });

      return true;
    });

    revalidatePath("/admin/scraping-news");
    return { ok: true, message: "Berita berhasil dipindah ke Draf." };
  } catch (error) {
    console.error("Gagal memindahkan data scraping:", error);
    return { ok: false, message: error.message || "Gagal memindah kandidat berita." };
  }
}

export async function getScrapingStats() {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { pickedToday: 0 };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pickedToday = await prisma.newsArticle.count({
      where: {
        sourceType: "ARTICLE_WEBSITE",
        createdAt: {
          gte: today,
        },
      },
    });

    return { pickedToday };
  } catch (error) {
    return { pickedToday: 0 };
  }
}

export async function getScraperLogs() {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return [];

  try {
    const logs = await prisma.scraperLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return logs;
  } catch (error) {
    return [];
  }
}

export async function clearScraperLogs() {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false, message: "Akses ditolak." };
  }

  try {
    await prisma.scraperLog.deleteMany();
    revalidatePath("/admin/scraping-news");
    return { ok: true, message: "Log berhasil dibersihkan." };
  } catch (error) {
    console.error("Gagal menghapus log:", error);
    return { ok: false, message: "Terjadi kesalahan saat membersihkan log." };
  }
}

// BULK ACTIONS
export async function deleteMultipleScrapedNews(ids) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };

  try {
    await prisma.scrapedNewsArticle.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    revalidatePath("/admin/scraping-news");
    return { ok: true, message: `${ids.length} berita berhasil dihapus.` };
  } catch (error) {
    console.error("Gagal menghapus banyak berita:", error);
    return { ok: false, message: "Gagal menghapus berita terpilih." };
  }
}

export async function pickMultipleScrapedNews(ids) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };

  try {
    // Jalankan dalam transaksi agar aman
    await prisma.$transaction(async (tx) => {
      const articles = await tx.scrapedNewsArticle.findMany({
        where: { id: { in: ids } }
      });

      if (articles.length === 0) throw new Error("Data tidak ditemukan.");

      // Cari kategori default atau pertama
      let category = await tx.newsCategory.findFirst({
        where: { slug: "berita-umum" },
      });

      if (!category) {
        category = await tx.newsCategory.findFirst();
      }

      if (!category) {
        // Jika benar-benar kosong, buat satu kategori darurat
        category = await tx.newsCategory.create({
          data: {
            name: "Berita Umum",
            slug: "berita-umum",
            description: "Kategori default untuk hasil scraping",
          },
        });
      }

      for (const scraped of articles) {
        let finalSlug = scraped.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
          
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;

        await tx.newsArticle.create({
          data: {
            title: scraped.aiTitle || scraped.title,
            slug: finalSlug,
            summary: scraped.aiSummary || scraped.excerpt || "Ringkasan belum tersedia",
            content: scraped.aiContent || scraped.content || "",
            status: "DRAFT",
            coverImageUrl: scraped.imageUrl,
            coverImageProvider: scraped.imageUrl ? "EXTERNAL" : null,
            sourceType: "ARTICLE_WEBSITE",
            sourceName: scraped.sourceName,
            sourceUrl: scraped.sourceUrl,
            categoryId: category.id,
            // Jangan set publishedAt karena ini masih DRAFT
          },
        });

        await tx.scrapedNewsArticle.delete({
          where: { id: scraped.id },
        });
      }
    });

    revalidatePath("/admin/scraping-news");
    return { ok: true, message: `${ids.length} berita berhasil dipindah ke Draf.` };
  } catch (error) {
    console.error("Gagal pick multiple:", error);
    return { ok: false, message: error.message || "Gagal memindah kandidat berita." };
  }
}

export async function applyAiPolishToScrapedNews(id) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };

  try {
    const article = await prisma.scrapedNewsArticle.findUnique({ where: { id } });
    if (!article) return { ok: false, message: "Artikel tidak ditemukan." };

    const prompt = `Anda adalah seorang jurnalis senior dan editor profesional dari media berita terkemuka. Tugas Anda adalah mengembangkan dan menulis ulang artikel berita berikut menjadi sangat komprehensif, panjang, detail, dan mendalam. 
Gunakan bahasa jurnalistik tingkat tinggi yang profesional, mengalir, dan memikat pembaca. 
Eksplorasi setiap fakta secara mendetail, berikan konteks tambahan yang relevan dan logis jika diperlukan, serta susun alur cerita berita secara runtut dari awal hingga akhir. Jangan menghilangkan fakta penting.
Berikan output dalam format JSON murni dengan key:
- "title" (judul berita click-worthy, profesional, dan kuat)
- "summary" (ringkasan inti berita 2-4 kalimat)
- "content" (Isi artikel berita yang PANJANG dan MENDETAIL (minimal 7-10 paragraf). JANGAN GUNAKAN TAG HTML SAMA SEKALI. Gunakan format plain text biasa, dan gunakan karakter newline/enter ganda (\\n\\n) murni untuk memisahkan antar paragraf agar sangat rapi untuk dibaca).

Judul Asli: ${article.title}
Kutipan Asli: ${article.excerpt || ""}
Konten Asli: ${article.content || ""}`;

    const executorFn = async (plainKey, provider) => {
      if (provider === "GEMINI") {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${plainKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        
        if (!res.ok) {
          const error = new Error("Gemini API Error");
          error.status = res.status;
          throw error;
        }
        
        const data = await res.json();
        return { provider: "GEMINI", result: JSON.parse(data.candidates[0].content.parts[0].text) };
      } 
      else if (provider === "GROQ") {
        const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${plainKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          })
        });
        
        if (!res.ok) {
          const error = new Error("Groq API Error");
          error.status = res.status;
          throw error;
        }
        
        const data = await res.json();
        return { provider: "GROQ", result: JSON.parse(data.choices[0].message.content) };
      }
    };

    const { provider, result } = await executeWithRotatedKey(executorFn);

    if (!result.title || !result.content) {
      throw new Error("Hasil AI tidak memiliki format JSON yang benar (hilang title/content).");
    }

    await prisma.scrapedNewsArticle.update({
      where: { id },
      data: {
        aiTitle: result.title,
        aiSummary: result.summary,
        aiContent: result.content,
        aiProvider: provider,
        aiProcessedAt: new Date(),
        aiError: null
      }
    });

    revalidatePath("/admin/scraping-news");
    return { ok: true, message: "Artikel berhasil dipoles menggunakan " + provider };
  } catch (error) {
    console.error("Gagal AI Polish:", error);
    await prisma.scrapedNewsArticle.update({
      where: { id },
      data: { aiError: error.message }
    });
    return { ok: false, message: error.message || "Gagal memoles artikel dengan AI." };
  }
}
