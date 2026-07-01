"use server"; 

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/features/admin/admin.helpers";
import { executeWithRotatedKey } from "@/lib/ai/aiKeyRuntime";

export async function getPublishedArticlesForSocialMedia() {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak.", data: [] };

  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        sourceUrl: true,
        sourceName: true,
        socialCaptions: {
          select: { platform: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return { ok: true, data: articles };
  } catch (error) {
    console.error("Gagal mengambil artikel:", error);
    return { ok: false, message: "Terjadi kesalahan server.", data: [] };
  }
}

async function executeAiCaption(articleId, platform) {
  const article = await prisma.newsArticle.findUnique({ where: { id: articleId } });
  if (!article) return { ok: false, message: "Artikel tidak ditemukan." };
  if (article.status !== "PUBLISHED") return { ok: false, message: "Artikel belum di-publish." };

  const articleLink = `https://nexarin.my.id/news/artikel/${article.slug}`;

  const prompt = `Anda adalah seorang Jurnalis Senior dan Social Media Manager profesional di sebuah portal berita ternama kelas nasional (seperti Kompas, Detik, atau CNN Indonesia). Tugas Anda adalah membuat caption/postingan untuk platform ${platform} berdasarkan artikel berita berikut.
Instruksi SANGAT PENTING:
1. Gaya bahasa HARUS profesional, kredibel, tajam, dan memikat layaknya jurnalis atau admin portal berita ternama. BUKAN bahasa robot AI, BUKAN bahasa gaul kekanak-kanakan, dan BUKAN bahasa puitis/bertele-tele.
2. DILARANG KERAS menggunakan frasa klise AI seperti: "Tentu, berikut adalah...", "Mari kita bahas...", "Di era digital ini...", "Apakah Anda tahu...", atau "Selamat datang di...". Langsung masuk ke fakta utama berita dengan gaya 'hook' jurnalistik yang kuat (seperti lead berita).
3. Jangan gunakan emoji berlebihan. Cukup 1-2 emoji resmi/profesional (contoh: 🚨, 📰, 📌) jika memang sangat diperlukan, atau tidak sama sekali.
4. Tulis dalam 2 paragraf singkat saja. Paragraf pertama berisi intisari berita yang padat dan jelas (memuat fakta terpenting). Paragraf kedua untuk Call-To-Action (CTA).
5. KARENA INI ADALAH KONTEN BERITA, DILARANG MENGGUNAKAN KATA "Cerita" atau kata-kata kasual berlebihan. Gunakan kata "Berita", "Informasi", atau "Kabar" (misal: "Baca berita selengkapnya di tautan berikut 👇" atau "Simak detail selengkapnya di website kami.").
6. Sertakan link artikel ini secara persis: ${articleLink} tepat di bawah kalimat CTA.
7. Sertakan minimal 5 dan maksimal 10 hashtag yang sangat relevan dengan topik berita dan sedang tren di ${platform} pada akhir caption.

Judul Artikel: ${article.title}
Ringkasan Artikel: ${article.summary}
Isi Artikel: ${article.content.substring(0, 1500)}...

Berikan output murni teks caption saja (tanpa basa-basi, tanpa tanda kutip di awal/akhir, dan tanpa format JSON).`;

  const executorFn = async (plainKey, aiProvider) => {
    if (aiProvider === "GEMINI") {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${plainKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      if (!res.ok) {
        const error = new Error("Gemini API Error");
        error.status = res.status;
        throw error;
      }
      
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    } 
    else if (aiProvider === "GROQ") {
      const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${plainKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }]
        })
      });
      
      if (!res.ok) {
        const error = new Error("Groq API Error");
        error.status = res.status;
        throw error;
      }
      
      const data = await res.json();
      return data.choices[0].message.content;
    }
  };

  const captionText = await executeWithRotatedKey(executorFn);
  return { ok: true, caption: captionText };
}

export async function generateSocialMediaCaption(articleId, platform) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };

  try {
    const existing = await prisma.newsSocialCaption.findUnique({
      where: {
        articleId_platform: {
          articleId,
          platform
        }
      }
    });

    if (existing) {
      return { ok: false, message: `Caption untuk ${platform} sudah ada. Tidak bisa dibuat ulang.` };
    }

    const aiResult = await executeAiCaption(articleId, platform);
    if (!aiResult.ok) return aiResult;

    const savedCaption = await prisma.newsSocialCaption.create({
      data: {
        articleId,
        platform,
        caption: aiResult.caption
      }
    });

    revalidatePath("/admin/news/social-media");
    revalidatePath("/admin/news/artikel");

    return { ok: true, message: "Caption berhasil di-generate!", caption: savedCaption.caption };
  } catch (error) {
    console.error("Gagal generate caption:", error);
    return { ok: false, message: error.message || "Terjadi kesalahan saat generate AI." };
  }
}

export async function generateTemporarySocialMediaCaption(articleId, platform) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };

  try {
    const aiResult = await executeAiCaption(articleId, platform);
    if (!aiResult.ok) return aiResult;

    return { ok: true, message: "Caption draft berhasil di-generate!", caption: aiResult.caption };
  } catch (error) {
    console.error("Gagal generate temporary caption:", error);
    return { ok: false, message: error.message || "Terjadi kesalahan saat generate AI sementara." };
  }
}

export async function updateSocialMediaCaption(id, newCaption) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };

  try {
    await prisma.newsSocialCaption.update({
      where: { id },
      data: { caption: newCaption }
    });

    revalidatePath("/admin/news/social-media");
    revalidatePath("/admin/news/artikel");
    return { ok: true, message: "Caption berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal update caption:", error);
    return { ok: false, message: "Terjadi kesalahan saat memperbarui caption." };
  }
}

export async function getGeneratedSocialMediaCaptions() {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak.", data: [] };

  try {
    const captions = await prisma.newsSocialCaption.findMany({
      include: {
        article: {
          select: { title: true, slug: true, sourceUrl: true, sourceName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return { ok: true, data: captions };
  } catch (error) {
    console.error("Gagal mengambil daftar caption:", error);
    return { ok: false, message: "Terjadi kesalahan server saat mengambil daftar caption.", data: [] };
  }
}

export async function deleteSocialMediaCaption(id) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };

  try {
    await prisma.newsSocialCaption.delete({
      where: { id }
    });
    revalidatePath("/admin/news/social-media");
    revalidatePath("/admin/news/artikel");
    return { ok: true, message: "Caption berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus caption:", error);
    return { ok: false, message: "Terjadi kesalahan saat menghapus caption." };
  }
}

export async function toggleSocialMediaCaptionPostedAction(id, isPosted) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };

  try {
    await prisma.newsSocialCaption.update({
      where: { id },
      data: { isPosted }
    });
    revalidatePath("/admin/news/social-media");
    return { ok: true, message: isPosted ? "Status diubah ke Di-Post" : "Status diubah ke Draft" };
  } catch (error) {
    console.error("Gagal mengubah status caption:", error);
    return { ok: false, message: "Terjadi kesalahan saat mengubah status caption." };
  }
}
