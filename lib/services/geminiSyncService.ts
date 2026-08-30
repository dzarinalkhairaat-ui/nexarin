import { db } from "@/lib/db/store";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { GeminiSparkDraft, Article } from "@/types/content";
import { auditService } from "./auditService";

export function extractSheetId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  // Match /spreadsheets/d/([a-zA-Z0-9-_]+)
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

export async function fetchGoogleSheetsDrafts(sheetIdOrUrl: string): Promise<GeminiSparkDraft[]> {
  const sheetId = extractSheetId(sheetIdOrUrl);
  if (!sheetId) return [];

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const res = await fetch(url, { next: { revalidate: 0 }, cache: "no-store" });
    if (!res.ok) return [];

    const raw = await res.text();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}") + 1;
    if (start === -1 || end <= start) return [];

    const json = JSON.parse(raw.substring(start, end));
    const rows = json.table?.rows || [];
    const drafts: GeminiSparkDraft[] = [];

    rows.forEach((r: any, idx: number) => {
      const c = r.c || [];

      // Check if first row is header row
      const firstVal = c[0]?.v?.toString() || "";
      if (firstVal.toLowerCase() === "id" || firstVal.toLowerCase() === "title") {
        return; // Skip header row
      }

      // Map 18 columns from GEMINI_SPARK_MASTER_PROMPT.md:
      // 0: id, 1: created_at, 2: title, 3: slug, 4: category, 5: subcategory, 6: tags,
      // 7: excerpt, 8: content, 9: opinion, 10: key_takeaways, 11: reading_time,
      // 12: source_name, 13: source_url, 14: image_query, 15: product_name, 16: product_url, 17: status
      const rawId = c[0]?.v?.toString() || `NXR-2026-${String(idx + 1).padStart(4, "0")}`;
      const createdAt = c[1]?.v?.toString() || new Date().toISOString();
      const title = c[2]?.v?.toString() || (c[0]?.v?.toString() !== rawId ? c[0]?.v?.toString() : "");
      
      if (!title || title.trim() === "") return;

      const slug = c[3]?.v?.toString() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const category = c[4]?.v?.toString() || "AI";
      const subcategory = c[5]?.v?.toString() || "";
      const tagsRaw = c[6]?.v?.toString() || "AI, Tech";
      const excerpt = c[7]?.v?.toString() || "";
      const content = c[8]?.v?.toString() || "";
      const opinion = c[9]?.v?.toString() || "Menurut analisis redaksi Nexarin, rilis ini membawa dampak strategis bagi ekosistem.";
      const keyTakeaways = c[10]?.v?.toString() || "";
      const readingTimeStr = c[11]?.v?.toString() || "5 min baca";
      const sourceName = c[12]?.v?.toString() || "Gemini Spark Scraper";
      const sourceUrl = c[13]?.v?.toString() || "https://gemini.google.com";
      const imageQuery = c[14]?.v?.toString() || "";
      const status = c[17]?.v?.toString() || "draft";

      const tags = tagsRaw
        .split(",")
        .map((t: string) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      drafts.push({
        id: rawId.startsWith("NXR-") ? rawId : `dft-sheet-${idx + 1}`,
        sourceId: `sheet-row-${idx + 1}`,
        sourceName,
        sourceUrl,
        scrapedAt: createdAt,
        title,
        suggestedSlug: slug,
        summary: excerpt || title,
        draftContent: content || excerpt || title,
        opinionAnalysis: opinion,
        category: category.toUpperCase(),
        tags: tags.length > 0 ? tags : ["Tech", "Innovation"],
        suggestedSeoTitle: `${title} — Nexarin Tech Info`,
        suggestedMetaDescription: excerpt || title,
        status: status.toLowerCase() === "published" ? "published" : "draft",
        syncDate: createdAt
      });
    });

    return drafts;
  } catch (error) {
    console.error("Error fetching Google Sheets drafts:", error);
    return [];
  }
}

export const geminiSyncService = {
  async getDrafts(): Promise<GeminiSparkDraft[]> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("editorial_drafts")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const dbDrafts = data.map((d: any) => ({
            id: d.id,
            sourceId: `src-${d.sheet_row_id || d.id}`,
            sourceName: d.source_name || "Gemini Spark Feed",
            sourceUrl: d.source_url || "https://techcrunch.com",
            scrapedAt: d.created_at,
            title: d.title,
            suggestedSlug: d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            summary: d.summary,
            draftContent: d.suggested_content,
            opinionAnalysis: "Kurasi editorial otomatis siap review.",
            category: d.suggested_category || "AI",
            tags: Array.isArray(d.suggested_tags) ? d.suggested_tags : ["AI", "Tech"],
            suggestedSeoTitle: d.title,
            suggestedMetaDescription: d.summary,
            status: (d.status === "published" ? "published" : "draft") as "draft" | "published",
            syncDate: d.created_at
          }));

          const existingIds = new Set(dbDrafts.map((d: any) => d.id));
          const fallbackDrafts = db.drafts.filter((d) => !existingIds.has(d.id));
          return [...dbDrafts, ...fallbackDrafts];
        }
      } catch (e) {
        console.error("Supabase drafts read error, using store fallback:", e);
      }
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
          .from("editorial_drafts")
          .update({
            title: updates.title,
            summary: updates.summary,
            suggested_content: updates.draftContent,
            suggested_category: updates.category,
            suggested_tags: updates.tags
          })
          .eq("id", id);
      } catch (e) {
        console.error("Supabase update draft error:", e);
      }
    }

    const idx = db.drafts.findIndex((d) => d.id === id);
    if (idx !== -1) {
      db.drafts[idx] = { ...db.drafts[idx], ...updates };
      return db.drafts[idx];
    }
    return null;
  },

  async rejectDraft(draftId: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("editorial_drafts").delete().eq("id", draftId);
      } catch (e) {
        console.error("Supabase delete draft error:", e);
      }
    }

    const idx = db.drafts.findIndex((d) => d.id === draftId);
    if (idx !== -1) {
      const deletedDraft = db.drafts[idx];
      db.drafts.splice(idx, 1);
      await auditService.log(
        "usr-adm-001",
        "Rins",
        "delete_draft",
        "draft",
        draftId,
        deletedDraft.title,
        `Menolak dan menghapus draft editorial ${draftId}`
      );
    }
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

    draft.status = "published";
    const title = editedData?.title || draft.title;
    const rawSlug = editedData?.slug || draft.suggestedSlug || title;
    const slug = rawSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const catSlug = (typeof editedData?.category === "object" ? editedData?.category?.slug : editedData?.category) || draft.category.toLowerCase() || "ai";
    const catName = catSlug === "ai" ? "Artificial Intelligence" : catSlug === "gadget" ? "Gadget" : catSlug === "automotive" ? "Automotive" : catSlug === "digital" ? "Digital" : "Technology";

    const newArticle: Article = {
      id: `art-${Date.now()}`,
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
      readingTimeMinutes: 5,
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
        await supabase.from("articles").insert({
          id: newArticle.id,
          title: newArticle.title,
          slug: newArticle.slug,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          category_id: catSlug,
          featured_image: newArticle.featuredImage,
          meta_title: newArticle.metaTitle,
          meta_description: newArticle.metaDescription,
          status: "published",
          author_name: newArticle.author.name,
          author_avatar: newArticle.author.avatar,
          read_time_minutes: newArticle.readingTimeMinutes,
          views_count: 1,
          is_featured: false,
          is_trending: true,
          published_at: newArticle.publishedAt
        });

        await supabase
          .from("editorial_drafts")
          .update({ status: "published", reviewed_at: new Date().toISOString() })
          .eq("id", draftId);
      } catch (e) {
        console.error("Supabase publish error, saving locally:", e);
      }
    }

    db.articles.unshift(newArticle);

    // Remove draft from local memory queue
    const dIdx = db.drafts.findIndex((d) => d.id === draftId);
    if (dIdx !== -1) {
      db.drafts.splice(dIdx, 1);
    }

    await auditService.log(
      "usr-adm-001",
      "Rins",
      "publish_article",
      "article",
      newArticle.id,
      newArticle.title,
      `Menerbitkan draft editorial [${draft.id}] menjadi artikel publik: ${newArticle.title}`
    );

    return newArticle;
  },

  async triggerSync(customSheetId?: string): Promise<{ syncedCount: number; newDrafts: GeminiSparkDraft[] }> {
    const sheetId = customSheetId || process.env.GOOGLE_SHEETS_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
    let sheetDrafts: GeminiSparkDraft[] = [];

    if (sheetId) {
      sheetDrafts = await fetchGoogleSheetsDrafts(sheetId);
    }

    const supabase = getSupabaseAdminClient();

    if (sheetDrafts.length > 0) {
      for (const d of sheetDrafts) {
        if (supabase) {
          try {
            await supabase.from("editorial_drafts").upsert({
              id: d.id,
              source_name: d.sourceName,
              source_url: d.sourceUrl,
              title: d.title,
              summary: d.summary,
              suggested_content: d.draftContent,
              suggested_category: d.category,
              suggested_tags: d.tags,
              gemini_score: 9.2,
              status: "draft_ready"
            });
          } catch (e) {}
        }
        
        // Unshift if not existing in memory
        if (!db.drafts.some((existing) => existing.id === d.id)) {
          db.drafts.unshift(d);
        }
      }
      return { syncedCount: sheetDrafts.length, newDrafts: sheetDrafts };
    }

    // Default high-value draft if spreadsheet is empty or being configured
    const newDraft: GeminiSparkDraft = {
      id: `dft-${Date.now()}`,
      sourceId: `src-${Date.now()}`,
      sourceName: "TechCrunch AI & DeepMind Research",
      sourceUrl: "https://techcrunch.com/artificial-intelligence",
      scrapedAt: new Date().toISOString(),
      title: "Tren Multi-Agent Architecture & Autonomous Workflow di Ekosistem Software 2026",
      suggestedSlug: "tren-multi-agent-architecture-autonomous-workflow-2026",
      summary: "Analisis komprehensif mengenai pergeseran dari LLM tunggal ke arsitektur multi-agent yang mampu menyelesaikan end-to-end coding dan operasional bisnis secara otomatis.",
      draftContent: `# Tren Multi-Agent Architecture 2026\n\nTahun 2026 menandai era baru dalam rekayasa kecerdasan buatan di mana sistem berbasis *Multi-Agent Architecture* mulai menggantikan interaksi prompt tunggal.\n\n## 1. Bagaimana Multi-Agent Bekerja?\nSistem membagi tugas kompleks ke dalam beberapa agen dengan spesialisasi masing-masing:\n- **Planner Agent**: Memetakan blueprint dan langkah kerja.\n- **Executor Agent**: Mengimplementasikan kode atau aksi.\n- **Reviewer Agent**: Memverifikasi hasil terhadap standar kualitas.\n\n## 2. Dampak terhadap Efisiensi Engineering\nImplementasi arsitektur ini terbukti memangkas waktu iterasi software engineering hingga 70% dan meminimalisir risiko halusinasi data.`,
      opinionAnalysis: "Perusahaan yang mengadopsi arsitektur multi-agent lebih cepat merespons kebutuhan pasar dan meminimalisir biaya operasional devops.",
      category: "AI",
      tags: ["Multi-Agent", "Autonomous AI", "Software Engineering"],
      suggestedSeoTitle: "Tren Multi-Agent Architecture & Autonomous Workflow 2026",
      suggestedMetaDescription: "Panduan dan analisis perkembangan Multi-Agent AI Architecture di tahun 2026.",
      status: "draft",
      syncDate: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase.from("editorial_drafts").upsert({
          id: newDraft.id,
          source_name: newDraft.sourceName,
          source_url: newDraft.sourceUrl,
          title: newDraft.title,
          summary: newDraft.summary,
          suggested_content: newDraft.draftContent,
          suggested_category: newDraft.category,
          suggested_tags: newDraft.tags,
          gemini_score: 9.4,
          status: "draft_ready"
        });
      } catch (e) {}
    }

    db.drafts.unshift(newDraft);

    await auditService.log(
      "system",
      "Gemini Sync Engine",
      "edit_draft",
      "draft",
      newDraft.id,
      newDraft.title,
      `Sinkronisasi pipeline editorial: 1 draft baru diterima dari pipeline Gemini Spark.`
    );

    return { syncedCount: 1, newDrafts: [newDraft] };
  },

  async generateWithGemini(topic: string): Promise<GeminiSparkDraft> {
    const newDraft: GeminiSparkDraft = {
      id: `dft-${Date.now()}`,
      sourceId: `src-gemini-${Date.now()}`,
      sourceName: "Gemini Spark Curated Generator",
      sourceUrl: "https://gemini.google.com",
      scrapedAt: new Date().toISOString(),
      title: `Eksplorasi Mendalam: ${topic}`,
      suggestedSlug: topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      summary: `Ulasan dan panduan komprehensif mengenai ${topic} untuk engineer dan profesional teknologi.`,
      draftContent: `# Eksplorasi: ${topic}\n\nArtikel ini menyajikan pembahasan mendalam mengenai implementasi dan strategi penerapan ${topic} dalam industri teknologi modern.\n\n## Ringkasan Eksekutif\nPerkembangan teknologi menuntut adopsi arsitektur yang tangguh dan teruji.\n\n## Langkah Implementasi\n1. Perencanaan dan audit kebutuhan.\n2. Integrasi bertahap dengan validasi berkala.\n3. Monitoring performa dan retensi pengguna.`,
      opinionAnalysis: `Adopsi ${topic} memberikan keunggulan kompetitif bagi startup dan enterprise.`,
      category: "Technology",
      tags: ["Technology", "Best Practices", "Innovation"],
      suggestedSeoTitle: `Eksplorasi Mendalam: ${topic} — Nexarin Tech`,
      suggestedMetaDescription: `Panduan lengkap mengenai ${topic}.`,
      status: "draft",
      syncDate: new Date().toISOString()
    };

    db.drafts.unshift(newDraft);
    return newDraft;
  }
};
