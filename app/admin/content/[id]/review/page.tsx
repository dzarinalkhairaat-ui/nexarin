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
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Share2,
  FileCode,
  Globe
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
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <AdminCard className="p-8 space-y-4 border-amber-500/30">
          <h3 className="text-lg font-bold text-white">Draft Tidak Ditemukan</h3>
          <p className="text-xs text-slate-400">Draft mungkin telah dipublikasikan ke portal live atau telah dihapus.</p>
          <Link href="/admin/content">
            <Button variant="primary" size="sm">Kembali ke Editorial Hub</Button>
          </Link>
        </AdminCard>
      </div>
    );
  }

  const handlePublish = () => {
    const selectedCat = CATEGORIES.find((c) => c.slug === categorySlug) || {
      id: categorySlug,
      name: categorySlug.toUpperCase(),
      slug: categorySlug,
      description: `Kategori ${categorySlug}`
    };

    publishDraft(draft.id, {
      title,
      slug,
      excerpt,
      content: `${content}\n\n### Analisis Editorial\n${opinion}`,
      category: selectedCat,
      tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
      metaTitle,
      metaDescription,
      affiliateId: selectedAffiliateId || undefined
    });

    router.push("/admin/content");
  };

  const handleDelete = () => {
    deleteDraft(draft.id);
    router.push("/admin/content");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back button */}
      <div>
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pusat Editorial</span>
        </Link>
      </div>

      {/* Page Header */}
      <AdminPageHeader
        title="Review & Modifikasi Draft Editorial"
        description="Verifikasi kualitas konten, periksa akurasi sintesis AI Gemini Spark, dan publikasikan ke portal live."
        badge="Staging Review"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmDeleteOpen(true)}
              className="text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Tolak &amp; Hapus
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setConfirmPublishOpen(true)}
              className="font-bold text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Publikasikan ke Portal
            </Button>
          </div>
        }
      />

      {/* Gemini Staging Context Info Banner */}
      <AdminCard className="p-4 bg-gradient-to-r from-purple-500/10 via-[#0B1120] to-cyan-500/10 border-purple-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-slate-300">
              Artikel disintesis oleh <strong className="text-purple-300">Gemini Spark AI</strong> dari sumber: <strong className="text-white">{draft.sourceName}</strong>
            </span>
          </div>
          <a
            href={draft.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px] shrink-0"
          >
            <span>Buka Sumber Asli</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </AdminCard>

      {/* Editorial Form */}
      <div className="space-y-6">
        {/* Basic Metadata */}
        <AdminCard className="space-y-5">
          <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Informasi Pokok Artikel
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Judul Artikel (Headline)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5] focus:border-transparent font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Slug URL
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-cyan-400 font-mono px-4 py-2 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Kategori Portal
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-3 py-2 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Ringkasan / Excerpt
            </label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-200 px-4 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>
        </AdminCard>

        {/* Content Body & Editorial Analysis */}
        <AdminCard className="space-y-5">
          <h3 className="text-xs font-mono uppercase text-[#7CF2C3] font-bold tracking-wider">
            Badan Konten &amp; Analisis Opini
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Isi Konten Artikel (Markdown Didukung)
            </label>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-200 font-mono px-4 py-3 text-xs leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Analisis Editorial &amp; Opini Spesialis (PRD Requirement)
            </label>
            <textarea
              rows={5}
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-200 font-mono px-4 py-2.5 text-xs leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>
        </AdminCard>

        {/* SEO & Affiliate Monetization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SEO Metadata */}
          <AdminCard className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              SEO &amp; Search Discovery
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Tags (Pisahkan Koma)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
          </AdminCard>

          {/* Affiliate Widget Binding */}
          <AdminCard className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-purple-400" />
              Tautkan Widget Affiliate (Monetasi)
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Pilih Rekomendasi Affiliate
              </label>
              <select
                value={selectedAffiliateId}
                onChange={(e) => setSelectedAffiliateId(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              >
                <option value="">-- Tanpa Widget Rekomendasi --</option>
                {affiliates.map((aff) => (
                  <option key={aff.id} value={aff.id}>
                    [{aff.marketplace}] {aff.productName} ({aff.priceEstimate})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 block mt-1">
                Widget produk ini akan disematkan secara otomatis di tengah artikel portal publik.
              </span>
            </div>
          </AdminCard>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
          <Button variant="secondary" size="md" onClick={() => router.push("/admin/content")}>
            Batal
          </Button>
          <Button variant="primary" size="md" className="font-extrabold text-sm shadow-md" onClick={() => setConfirmPublishOpen(true)}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Setujui &amp; Publikasikan Sekarang
          </Button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmPublishOpen}
        onClose={() => setConfirmPublishOpen(false)}
        onConfirm={handlePublish}
        title="Publikasikan Artikel ke Portal Live?"
        description="Artikel akan langsung muncul di halaman utama portal publik dan terindeks dalam kategori terkait."
        confirmText="Ya, Publikasikan Sekarang"
        variant="primary"
      />

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Draft Ini?"
        description="Draft ini akan dihapus permanen dari antrean staging review."
        confirmText="Ya, Hapus Permanen"
        variant="danger"
      />
    </div>
  );
}
