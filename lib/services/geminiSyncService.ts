import { db } from "@/lib/db/store";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { GeminiSparkDraft, Article } from "@/types/content";
import { auditService } from "./auditService";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);
const BUFFER_FILE = path.join(process.cwd(), "data", "runtime_drafts.json");

function loadBufferDrafts(): GeminiSparkDraft[] {
  try {
    if (fs.existsSync(BUFFER_FILE)) {
      const content = fs.readFileSync(BUFFER_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveBufferDrafts(drafts: GeminiSparkDraft[]) {
  try {
    const dir = path.dirname(BUFFER_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BUFFER_FILE, JSON.stringify(drafts, null, 2), "utf-8");
  } catch (e) {}
}

function clearBufferDrafts() {
  try {
    const dir = path.dirname(BUFFER_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BUFFER_FILE, "[]\n", "utf-8");
  } catch (e) {}
}

export function extractSheetId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

export async function fetchGoogleSheetsDrafts(sheetIdOrUrl: string): Promise<GeminiSparkDraft[]> {
  const sheetId = extractSheetId(sheetIdOrUrl) || process.env.GOOGLE_SHEETS_ID || "1ydNZGWOtkRNpdwigw1IAupPaG0MNL9GXfVE-75pfZjU";
  if (!sheetId) return [];

  const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  let raw = "";

  // 1. Try fetch with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(gvizUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      cache: "no-store"
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      raw = await res.text();
    }
  } catch (e) {}

  // 2. Try curl fallback
  if (!raw || !raw.includes("google.visualization.Query.setResponse")) {
    try {
      const { stdout } = await execAsync(`curl.exe -s "${gvizUrl}" || curl -s "${gvizUrl}"`);
      raw = stdout;
    } catch (e) {}
  }

  if (!raw || !raw.includes("google.visualization.Query.setResponse")) {
    return [];
  }

  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}") + 1;
    if (start === -1 || end <= start) return [];

    const json = JSON.parse(raw.substring(start, end));
    const rows = json.table?.rows || [];
    const drafts: GeminiSparkDraft[] = [];

    rows.forEach((r: any, idx: number) => {
      const c = r.c || [];
      const rawId = c[0]?.v?.toString() || `NXR-2026-${String(idx + 1).padStart(4, "0")}`;
      const firstVal = rawId.toLowerCase();
      if (firstVal === "id" || firstVal === "created_at") return;

      const createdAt = c[1]?.v?.toString() || new Date().toISOString();
      const title = c[2]?.v?.toString() || c[0]?.v?.toString() || "";
      if (!title || title.trim() === "" || title.toLowerCase() === "title") return;

      const slug = c[3]?.v?.toString() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const category = (c[4]?.v?.toString() || "AI").toUpperCase();
      const subcategory = c[5]?.v?.toString() || "";
      const tagsRaw = c[6]?.v?.toString() || "AI, Tech";
      const excerpt = c[7]?.v?.toString() || title;
      const content = c[8]?.v?.toString() || excerpt;
      const opinion = c[9]?.v?.toString() || "Menurut analisis redaksi Nexarin, rilis ini membawa dampak strategis bagi ekosistem.";
      const sourceName = c[12]?.v?.toString() || "Anthropic Newsroom";
      const sourceUrl = c[13]?.v?.toString() || "https://gemini.google.com";
      const status = c[17]?.v?.toString() || "draft";

      const tags = tagsRaw
        .split(",")
        .map((t: string) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      drafts.push({
        id: rawId.startsWith("NXR") ? rawId.replace(/\s+/g, "-") : `dft-sheet-${idx + 1}`,
        sourceId: `sheet-row-${idx + 1}`,
        sourceName,
        sourceUrl,
        scrapedAt: createdAt,
        title,
        suggestedSlug: slug,
        summary: excerpt,
        draftContent: content,
        opinionAnalysis: opinion,
        category,
        tags: tags.length > 0 ? tags : ["Tech", "AI"],
        suggestedSeoTitle: `${title} — Nexarin Tech`,
        suggestedMetaDescription: excerpt,
        status: "draft",
        syncDate: createdAt
      });
    });

    return drafts;
  } catch (error) {
    return [];
  }
}

export const geminiSyncService = {
  async getDrafts(): Promise<GeminiSparkDraft[]> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        // Query drafts from articles table with status='draft'
        const { data: artDrafts, error: artErr } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "draft")
          .order("created_at", { ascending: false });

        if (!artErr) {
          if (artDrafts && artDrafts.length > 0) {
            // Once confirmed present in Supabase, ensure runtime buffer is clean
            clearBufferDrafts();

            return artDrafts.map((a: any) => ({
              id: a.id,
              sourceId: `src-${a.id}`,
              sourceName: a.source_name || "DATABASE PORTAL INFO NEXARIN TECH",
              sourceUrl: a.source_url || "https://gemini.google.com",
              scrapedAt: a.created_at,
              title: a.title,
              suggestedSlug: a.slug,
              summary: a.excerpt,
              draftContent: a.content,
              opinionAnalysis: "Kurasi editorial otomatis siap review.",
              category: (a.category_id || "AI").toUpperCase(),
              tags: Array.isArray(a.tags) ? a.tags : ["AI", "Tech"],
              suggestedSeoTitle: a.meta_title || a.title,
              suggestedMetaDescription: a.meta_description || a.excerpt,
              status: "draft" as const,
              syncDate: a.created_at
            }));
          }

          // Check editorial_drafts as secondary table
          const { data: dftData, error: dftErr } = await supabase
            .from("editorial_drafts")
            .select("*")
            .eq("status", "draft_ready")
            .order("created_at", { ascending: false });

          if (!dftErr && dftData && dftData.length > 0) {
            clearBufferDrafts();
            return dftData.map((d: any) => ({
              id: d.id,
              sourceId: `src-${d.sheet_row_id || d.id}`,
              sourceName: d.source_name || "DATABASE PORTAL INFO NEXARIN TECH",
              sourceUrl: d.source_url || "https://gemini.google.com",
              scrapedAt: d.created_at,
              title: d.title,
              suggestedSlug: d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              summary: d.summary,
              draftContent: d.suggested_content,
              opinionAnalysis: "Kurasi editorial otomatis siap review.",
              category: (d.suggested_category || "AI").toUpperCase(),
              tags: Array.isArray(d.suggested_tags) ? d.suggested_tags : ["AI", "Tech"],
              suggestedSeoTitle: d.title,
              suggestedMetaDescription: d.summary,
              status: "draft" as const,
              syncDate: d.created_at
            }));
          }

          // Both Supabase tables are empty: ensure buffer is also empty and return []
          clearBufferDrafts();
          return [];
        }
      } catch (e) {
        console.error("Supabase drafts error:", e);
      }
    }

    // In case Supabase connection is temporarily unavailable, check buffer
    const bufferDrafts = loadBufferDrafts();
    if (bufferDrafts.length > 0) {
      return bufferDrafts;
    }

    return [...db.drafts];
  },

  async getDraftById(id: string): Promise<GeminiSparkDraft | null> {
    const drafts = await this.getDrafts();
    return drafts.find((d) => d.id === id || d.suggestedSlug === id) || null;
  },

  async updateDraft(id: string, updates: Partial<GeminiSparkDraft>): Promise<GeminiSparkDraft | null> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase
          .from("articles")
          .update({
            title: updates.title,
            excerpt: updates.summary,
            content: updates.draftContent,
            category_id: updates.category?.toLowerCase()
          })
          .eq("id", id);

        await supabase
          .from("editorial_drafts")
          .update({
            title: updates.title,
            summary: updates.summary,
            suggested_content: updates.draftContent,
            suggested_category: updates.category
          })
          .eq("id", id);
      } catch (e) {}
    }

    const drafts = await this.getDrafts();
    const idx = drafts.findIndex((d) => d.id === id);
    if (idx !== -1) {
      drafts[idx] = { ...drafts[idx], ...updates };
      return drafts[idx];
    }
    return null;
  },

  async rejectDraft(draftId: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("articles").delete().eq("id", draftId);
        await supabase.from("editorial_drafts").delete().eq("id", draftId);
      } catch (e) {}
    }

    // Clear from buffer as well
    clearBufferDrafts();

    const idx = db.drafts.findIndex((d) => d.id === draftId);
    if (idx !== -1) {
      db.drafts.splice(idx, 1);
    }

    await auditService.log(
      "usr-adm-001",
      "Rins",
      "delete_draft",
      "draft",
      draftId,
      draftId,
      `Menolak dan menghapus draft editorial ${draftId}`
    );
    return true;
  },

  async approveAndPublish(
    draftId: string,
    editedData?: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      category?: any;
      tags?: string[];
      metaTitle?: string;
      metaDescription?: string;
      affiliateId?: string;
    }
  ): Promise<Article | null> {
    const draft = await this.getDraftById(draftId);
    if (!draft) return null;

    const title = editedData?.title || draft.title;
    const rawSlug = editedData?.slug || draft.suggestedSlug || title;
    const slug = rawSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const catSlug = (typeof editedData?.category === "object" ? editedData?.category?.slug : editedData?.category) || draft.category.toLowerCase() || "ai";
    const catName = catSlug === "ai" ? "Artificial Intelligence" : catSlug === "gadget" ? "Gadget" : catSlug === "automotive" ? "Automotive" : catSlug === "digital" ? "Digital" : "Technology";

    const publishedArticle: Article = {
      id: draftId.startsWith("NXR") ? `art-${draftId}` : (draftId.startsWith("art-") ? draftId : `art-${Date.now()}`),
      title,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      excerpt: editedData?.excerpt || draft.summary,
      content: editedData?.content || draft.draftContent,
      contentType: "news",
      category: {
        id: catSlug,
        name: catName,
        slug: catSlug,
        description: `Kanal informasi ${catName}`
      },
      tags: editedData?.tags || draft.tags,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        name: "Redaksi Nexarin (via Gemini Spark)",
        role: "Lead Tech Architect",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
      },
      readingTimeMinutes: 6,
      views: 1,
      featuredImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1600&auto=format&fit=crop",
      status: "published",
      metaTitle: editedData?.metaTitle || title,
      metaDescription: editedData?.metaDescription || draft.summary,
      affiliateId: editedData?.affiliateId
    };

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        // 1. Insert/Update into Supabase articles as published
        await supabase.from("articles").upsert({
          id: publishedArticle.id,
          title: publishedArticle.title,
          slug: publishedArticle.slug,
          excerpt: publishedArticle.excerpt,
          content: publishedArticle.content,
          category_id: catSlug,
          featured_image: publishedArticle.featuredImage,
          meta_title: publishedArticle.metaTitle,
          meta_description: publishedArticle.metaDescription,
          status: "published",
          author_name: publishedArticle.author.name,
          author_avatar: publishedArticle.author.avatar,
          read_time_minutes: publishedArticle.readingTimeMinutes,
          views_count: 1,
          is_featured: false,
          is_trending: true,
          published_at: publishedArticle.publishedAt
        });

        // 2. Delete old draft entry from articles and editorial_drafts
        await supabase.from("articles").delete().eq("id", draftId).eq("status", "draft");
        await supabase.from("editorial_drafts").delete().eq("id", draftId);
      } catch (e) {
        console.error("Supabase publish error:", e);
      }
    }

    // Clean buffer file
    clearBufferDrafts();

    db.articles.unshift(publishedArticle);
    const dIdx = db.drafts.findIndex((d) => d.id === draftId);
    if (dIdx !== -1) {
      db.drafts.splice(dIdx, 1);
    }

    await auditService.log(
      "usr-adm-001",
      "Rins",
      "publish_article",
      "article",
      publishedArticle.id,
      publishedArticle.title,
      `Menerbitkan draft editorial [${draftId}] menjadi artikel publik di Supabase: ${publishedArticle.title}`
    );

    return publishedArticle;
  },

  async triggerSync(customSheetId?: string): Promise<{ syncedCount: number; newDrafts: GeminiSparkDraft[] }> {
    const sheetId = customSheetId || process.env.GOOGLE_SHEETS_ID || "1ydNZGWOtkRNpdwigw1IAupPaG0MNL9GXfVE-75pfZjU";
    
    // 1. Tarik baris data dari Google Sheet
    const sheetDrafts = await fetchGoogleSheetsDrafts(sheetId);

    if (sheetDrafts.length === 0) {
      clearBufferDrafts();
      return { syncedCount: 0, newDrafts: [] };
    }

    // 2. Simpan sementara di buffer runtime_drafts.json
    saveBufferDrafts(sheetDrafts);

    const supabase = getSupabaseAdminClient();
    let supabaseSuccess = false;

    // 3. Alihkan data sepenuhnya ke Database Supabase
    if (supabase) {
      try {
        for (const d of sheetDrafts) {
          await supabase.from("articles").upsert({
            id: d.id,
            title: d.title,
            slug: d.suggestedSlug,
            excerpt: d.summary,
            content: d.draftContent,
            category_id: d.category.toLowerCase(),
            status: "draft",
            author_name: "Redaksi Nexarin (via Gemini Spark)",
            author_avatar: "/assets/avatar-default.svg",
            read_time_minutes: 6,
            views_count: 1,
            is_featured: false,
            is_trending: false,
            created_at: d.scrapedAt
          });

          await supabase.from("editorial_drafts").upsert({
            id: d.id,
            source_name: d.sourceName,
            source_url: d.sourceUrl,
            title: d.title,
            summary: d.summary,
            suggested_content: d.draftContent,
            suggested_category: d.category,
            suggested_tags: d.tags,
            gemini_score: 9.8,
            status: "draft_ready"
          });
        }
        supabaseSuccess = true;
      } catch (e) {
        console.error("Supabase upsert error in sync:", e);
      }
    }

    // 4. Ketika Data benar-benar sudah masuk ke Supabase, bersihkan buffer runtime_drafts.json
    if (supabaseSuccess) {
      clearBufferDrafts();
    }

    db.drafts = [...sheetDrafts];
    return { syncedCount: sheetDrafts.length, newDrafts: sheetDrafts };
  },

  async importDirectDraft(draftData: {
    id?: string;
    title: string;
    slug?: string;
    category?: string;
    summary: string;
    content: string;
    opinion?: string;
    tags?: string[];
    sourceName?: string;
    sourceUrl?: string;
  }): Promise<GeminiSparkDraft> {
    const id = draftData.id || `NXR-2026-${Date.now()}`;
    const slug = draftData.slug || draftData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = (draftData.category || "AI").toUpperCase();
    const tags = draftData.tags || ["AI", "Tech"];

    const newDraft: GeminiSparkDraft = {
      id,
      sourceId: `direct-${Date.now()}`,
      sourceName: draftData.sourceName || "DATABASE PORTAL INFO NEXARIN TECH",
      sourceUrl: draftData.sourceUrl || "https://gemini.google.com",
      scrapedAt: new Date().toISOString(),
      title: draftData.title,
      suggestedSlug: slug,
      summary: draftData.summary,
      draftContent: draftData.content,
      opinionAnalysis: draftData.opinion || "Analisis editorial siap review.",
      category,
      tags,
      suggestedSeoTitle: `${draftData.title} — Nexarin Tech`,
      suggestedMetaDescription: draftData.summary,
      status: "draft",
      syncDate: new Date().toISOString()
    };

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("articles").upsert({
          id: newDraft.id,
          title: newDraft.title,
          slug: newDraft.suggestedSlug,
          excerpt: newDraft.summary,
          content: newDraft.draftContent,
          category_id: category.toLowerCase(),
          status: "draft",
          author_name: "Redaksi Nexarin",
          read_time_minutes: 6,
          views_count: 1,
          created_at: newDraft.scrapedAt
        });

        await supabase.from("editorial_drafts").upsert({
          id: newDraft.id,
          source_name: newDraft.sourceName,
          source_url: newDraft.sourceUrl,
          title: newDraft.title,
          summary: newDraft.summary,
          suggested_content: newDraft.draftContent,
          suggested_category: newDraft.category,
          suggested_tags: newDraft.tags,
          gemini_score: 9.8,
          status: "draft_ready"
        });
      } catch (e) {}
    }

    clearBufferDrafts();
    db.drafts.unshift(newDraft);
    return newDraft;
  },

  async generateWithGemini(topic: string): Promise<GeminiSparkDraft> {
    const title = `Eksplorasi Mendalam: ${topic}`;
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newDraft: GeminiSparkDraft = {
      id: `dft-${Date.now()}`,
      sourceId: `src-gemini-${Date.now()}`,
      sourceName: "Gemini Spark Curated Generator",
      sourceUrl: "https://gemini.google.com",
      scrapedAt: new Date().toISOString(),
      title,
      suggestedSlug: slug,
      summary: `Ulasan dan panduan komprehensif mengenai ${topic} untuk engineer dan profesional teknologi.`,
      draftContent: `# Eksplorasi: ${topic}\n\nArtikel ini menyajikan pembahasan mendalam mengenai implementasi dan strategi penerapan ${topic} dalam industri teknologi modern.\n\n## Ringkasan Eksekutif\nPerkembangan teknologi menuntut adopsi arsitektur yang tangguh dan teruji.\n\n## Langkah Implementasi\n1. Perencanaan dan audit kebutuhan.\n2. Integrasi bertahap dengan validasi berkala.\n3. Monitoring performa dan retensi pengguna.`,
      opinionAnalysis: `Adopsi ${topic} memberikan keunggulan kompetitif bagi startup dan enterprise.`,
      category: "Technology",
      tags: ["Technology", "Best Practices", "Innovation"],
      suggestedSeoTitle: `${title} — Nexarin Tech`,
      suggestedMetaDescription: `Panduan lengkap mengenai ${topic}.`,
      status: "draft",
      syncDate: new Date().toISOString()
    };

    db.drafts.unshift(newDraft);
    return newDraft;
  }
};
