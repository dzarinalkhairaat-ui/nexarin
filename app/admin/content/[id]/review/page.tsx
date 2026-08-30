"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { useShop } from "@/context/ShopContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/constants";
import { ConfirmModal } from "@/components/feedback/ConfirmModal";
import { LessonMarkdownRenderer } from "@/components/tutorials/classroom/LessonMarkdownRenderer";
import { formatDate } from "@/lib/utils";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Share2,
  FileCode,
  Globe,
  Eye,
  Save,
  Tag
} from "lucide-react";

export default function AdminDraftReviewPage() {
  const params = useParams();
  const draftId = params.id as string;
  const router = useRouter();
  const { drafts, publishDraft, deleteDraft } = useContent();
  const { affiliates } = useShop();

  const draft = drafts.find((d) => d.id === draftId);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [opinion, setOpinion] = useState("");
  const [categorySlug, setCategorySlug] = useState("ai");
  const [tagsStr, setTagsStr] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedAffiliateId, setSelectedAffiliateId] = useState("");
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (draft) {
      setTitle(draft.title);
      setSlug(draft.suggestedSlug);
      setExcerpt(draft.summary);
      setContent(draft.draftContent);
      setOpinion(draft.opinionAnalysis);
      setCategorySlug(draft.category.toLowerCase());
      setTagsStr(draft.tags.join(", "));
      setMetaTitle(draft.suggestedSeoTitle);
      setMetaDescription(draft.suggestedMetaDescription);
    }
  }, [draft]);

  if (!draft) {
    return (
      <div suppressHydrationWarning className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <AdminCard className="p-8 space-y-4 border-amber-500/30">
          <h3 className="text-lg font-bold text-white">Draft Tidak Ditemukan</h3>
          <p className="text-xs text-[#64748B]">Draft mungkin telah dipublikasikan ke portal live atau telah dihapus.</p>
          <Link href="/admin/content">
            <Button variant="primary" size="sm">Kembali ke Editorial Hub</Button>
          </Link>
        </AdminCard>
      </div>
    );
  }

  const handlePublish = async () => {
    setIsPublishing(true);
    const selectedCat = CATEGORIES.find((c) => c.slug === categorySlug) || {
      id: categorySlug,
      name: categorySlug.toUpperCase(),
      slug: categorySlug,
      description: `Kategori ${categorySlug}`
    };

    try {
      await publishDraft(draft.id, {
        title,
        slug,
        excerpt,
        content: `${content}\n\n## Analisis Editorial Redaksi\n${opinion}`,
        category: selectedCat,
        tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
        metaTitle,
        metaDescription,
        affiliateId: selectedAffiliateId || undefined
      });
      router.push("/admin/content");
    } finally {
      setIsPublishing(false);
      setConfirmPublishOpen(false);
    }
  };

  const handleDelete = async () => {
    await deleteDraft(draft.id);
    setConfirmDeleteOpen(false);
    router.push("/admin/content");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <AdminPageHeader
        title="Review & Modifikasi Editorial"
        description="Verifikasi kualitas, periksa fakta, dan sesuaikan naskah sebelum artikel diterbitkan secara live ke Supabase."
        badge={`Draft ID: ${draft.id}`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmDeleteOpen(true)}
              className="text-xs font-bold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Hapus Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="text-xs font-bold border-white/10"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5 text-[#2DD4F5]" />
              {isPreviewMode ? "Mode Edit Form" : "Live Preview Artikel"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setConfirmPublishOpen(true)}
              disabled={isPublishing}
              className="text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              {isPublishing ? "Menerbitkan..." : "Setujui & Publikasikan"}
            </Button>
          </div>
        }
      />

      {isPreviewMode ? (
        /* LIVE PREVIEW MODE */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] border border-white/[0.12] space-y-8 backdrop-blur-2xl shadow-2xl">
          <div className="space-y-4 border-b border-white/[0.08] pb-6">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30">
              {categorySlug.toUpperCase()}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {title}
            </h1>
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {excerpt}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <LessonMarkdownRenderer content={content} />
          </div>

          {opinion && (
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <h3 className="text-sm font-bold text-[#2DD4F5] uppercase font-mono">
                Analisis Editorial Redaksi Nexarin
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {opinion}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* EDIT FORM MODE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <AdminCard className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Judul Artikel Editorial:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5] text-sm font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Slug URL:
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.10] text-slate-300 font-mono text-xs focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Ringkasan (Excerpt 2-3 Kalimat):
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.10] text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Naskah Artikel Lengkap (Markdown 900+ Kata):
                </label>
                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.10] text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Analisis Opini Redaksi:
                </label>
                <textarea
                  rows={3}
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.10] text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>
            </AdminCard>
          </div>

          {/* Sidebar Settings (1 Col) */}
          <div className="space-y-6">
            <AdminCard className="p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider pb-2 border-b border-white/[0.08]">
                Pengaturan Kanal &amp; Metadata
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">Kanal Kategori:</label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-white/[0.10] text-white text-xs font-bold focus:outline-none focus:border-[#2DD4F5]"
                >
                  <option value="ai">Artificial Intelligence (AI)</option>
                  <option value="technology">Technology</option>
                  <option value="digital">Digital</option>
                  <option value="gadget">Gadget</option>
                  <option value="automotive">Automotive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">Tag Topik (Koma):</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white text-xs focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">SEO Meta Title:</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white text-xs focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">SEO Meta Description:</label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white text-xs focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>
            </AdminCard>

            <AdminCard className="p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider pb-2 border-b border-white/[0.08]">
                Informasi Sumber Asli
              </h3>
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <p>Sumber: <span className="text-white font-bold">{draft.sourceName || "Gemini Spark"}</span></p>
                <p>Waktu Scrape: <span className="text-white">{formatDate(draft.scrapedAt)}</span></p>
                {draft.sourceUrl && (
                  <a
                    href={draft.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#2DD4F5] hover:underline pt-1"
                  >
                    <span>Buka URL Sumber</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </AdminCard>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {confirmPublishOpen && (
        <ConfirmModal
          isOpen={true}
          title="Publikasikan Artikel ke Portal Live?"
          description="Artikel akan disimpan ke database Supabase dan langsung tayang di portal publik Tech Info. Lanjutkan?"
          confirmText="Ya, Publikasikan Sekarang"
          cancelText="Batal"
          variant="primary"
          onConfirm={handlePublish}
          onClose={() => setConfirmPublishOpen(false)}
        />
      )}

      {confirmDeleteOpen && (
        <ConfirmModal
          isOpen={true}
          title="Hapus Draft Editorial?"
          description="Draft ini akan dihapus secara permanen dari antrean dan database Supabase. Lanjutkan?"
          confirmText="Hapus Permanen"
          cancelText="Batal"
          variant="danger"
          onConfirm={handleDelete}
          onClose={() => setConfirmDeleteOpen(false)}
        />
      )}
    </div>
  );
}
