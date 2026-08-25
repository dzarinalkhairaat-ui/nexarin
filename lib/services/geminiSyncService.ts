import { db } from "@/lib/db/store";
import { GeminiSparkDraft, Article } from "@/types/content";
import { auditService } from "./auditService";

export const geminiSyncService = {
  async getDrafts(): Promise<GeminiSparkDraft[]> {
    return [...db.drafts];
  },

  async getDraftById(id: string): Promise<GeminiSparkDraft | null> {
    return db.drafts.find((d) => d.id === id) || null;
  },

  async approveAndPublish(
    draftId: string,
    editedData?: {
      title?: string;
      content?: string;
      category?: string;
      tags?: string[];
    }
  ): Promise<Article | null> {
    const draft = db.drafts.find((d) => d.id === draftId);
    if (!draft) return null;

    draft.status = "published";

    const title = editedData?.title || draft.title;
    const slug = (draft.suggestedSlug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      excerpt: draft.summary,
      content: editedData?.content || draft.draftContent,
      contentType: "news",
      category: {
        id: "ai",
        name: "Artificial Intelligence",
        slug: "ai",
        description: "Berita dan riset model AI terbaru"
      },
      tags: editedData?.tags || draft.tags,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        name: "Redaksi Nexarin (via Gemini Spark)",
        role: "Editorial Tech AI",
        avatar: "/assets/avatar-default.svg"
      },
      readingTimeMinutes: 5,
      views: 1,
      featuredImage: "/assets/article-ai.svg",
      status: "published",
      metaTitle: title,
      metaDescription: draft.summary
    };

    db.articles.unshift(newArticle);

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

  async rejectDraft(draftId: string): Promise<boolean> {
    const idx = db.drafts.findIndex((d) => d.id === draftId);
    if (idx === -1) return false;
    const deletedDraft = db.drafts[idx];
    db.drafts.splice(idx, 1);
    await auditService.log("usr-adm-001", "Rins", "delete_draft", "draft", draftId, deletedDraft.title, `Menolak dan menghapus draft editorial ${draftId}`);
    return true;
  },

  async triggerSync(): Promise<{ syncedCount: number; newDrafts: GeminiSparkDraft[] }> {
    const newDraft: GeminiSparkDraft = {
      id: `dft-${Date.now()}`,
      sourceId: `src-${Date.now()}`,
      sourceName: "TechCrunch AI Feed",
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
      sourceName: "Google Gemini 2.0 Pro API",
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
