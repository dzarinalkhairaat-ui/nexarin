"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmModal } from "@/components/feedback/ConfirmModal";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatDate } from "@/lib/utils";
import {
  FileEdit,
  Sparkles,
  Trash2,
  Eye,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  CheckSquare,
  Square,
  MinusSquare,
  AlertTriangle
} from "lucide-react";

export default function AdminContentPage() {
  const {
    drafts,
    articles,
    deleteDraft,
    deleteArticle,
    deleteMultipleDrafts,
    deleteMultipleArticles,
    syncGeminiSpark
  } = useContent();

  const [activeTab, setActiveTab] = useState<string>("drafts");

  // Single Item Delete Target
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: "draft" | "article";
    title: string;
  } | null>(null);

  // Bulk Selection State
  const [selectedDraftIds, setSelectedDraftIds] = useState<string[]>([]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const pendingDrafts = drafts.filter((d) => d.status === "draft");

  const tabs = [
    { id: "drafts", label: "Drafts Staging (Gemini Spark)", count: pendingDrafts.length },
    { id: "published", label: "Artikel Published (Live Portal)", count: articles.length }
  ];

  // Helper: Draft selection toggle
  const handleToggleDraft = (id: string) => {
    setSelectedDraftIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper: Select all / Deselect all Drafts
  const handleToggleSelectAllDrafts = () => {
    if (selectedDraftIds.length === pendingDrafts.length) {
      setSelectedDraftIds([]);
    } else {
      setSelectedDraftIds(pendingDrafts.map((d) => d.id));
    }
  };

  // Helper: Article selection toggle
  const handleToggleArticle = (id: string) => {
    setSelectedArticleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper: Select all / Deselect all Articles
  const handleToggleSelectAllArticles = () => {
    if (selectedArticleIds.length === articles.length) {
      setSelectedArticleIds([]);
    } else {
      setSelectedArticleIds(articles.map((a) => a.id));
    }
  };

  // Single Delete Handler
  const handleConfirmSingleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "draft") {
      deleteDraft(deleteTarget.id);
      setSelectedDraftIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    } else {
      deleteArticle(deleteTarget.id);
      setSelectedArticleIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  // Bulk Delete Handler
  const handleConfirmBulkDelete = () => {
    if (activeTab === "drafts") {
      deleteMultipleDrafts(selectedDraftIds);
      setSelectedDraftIds([]);
    } else {
      deleteMultipleArticles(selectedArticleIds);
      setSelectedArticleIds([]);
    }
    setIsBulkDeleteModalOpen(false);
  };

  const currentSelectedCount =
    activeTab === "drafts" ? selectedDraftIds.length : selectedArticleIds.length;
  const currentTotalCount =
    activeTab === "drafts" ? pendingDrafts.length : articles.length;
  const isAllSelected =
    currentTotalCount > 0 && currentSelectedCount === currentTotalCount;

  return (
    <div suppressHydrationWarning className="space-y-8 max-w-7xl">
      {/* 1. Page Header */}
      <AdminPageHeader
        title="Pusat Editorial & Manajemen Konten"
        description="Pipeline kurasi artikel terstruktur: Gemini Spark AI (Google Sheets) → Review & Modifikasi Manual → Live Portal Supabase."
        badge={`${pendingDrafts.length} Menunggu Review`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={syncGeminiSpark}
              className="text-xs border-white/[0.10] text-[#94A3B8] hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Sync Staging
            </Button>
            <Link href="/admin/gemini-sync">
              <Button variant="mint" size="sm" className="font-bold text-xs text-slate-950">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Pipeline AI
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />

      {/* 3. Bulk Action & Selection Toolbar */}
      {currentTotalCount > 0 && (
        <div
          suppressHydrationWarning
          className="p-3 sm:p-4 rounded-2xl bg-[#0F172A]/90 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md"
        >
          {/* Left: Select All Checkbox & Count */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={
                activeTab === "drafts"
                  ? handleToggleSelectAllDrafts
                  : handleToggleSelectAllArticles
              }
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1120] border border-white/[0.10] hover:border-cyan-400 text-xs font-semibold text-white transition-colors"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-[#2DD4F5]" />
              ) : currentSelectedCount > 0 ? (
                <MinusSquare className="w-4 h-4 text-[#2DD4F5]" />
              ) : (
                <Square className="w-4 h-4 text-[#64748B]" />
              )}
              <span>{isAllSelected ? "Batalkan Semua" : "Centang Semua"}</span>
            </button>

            <span className="text-xs font-mono text-[#94A3B8]">
              {currentSelectedCount > 0 ? (
                <strong className="text-[#2DD4F5]">
                  {currentSelectedCount} dari {currentTotalCount} {activeTab === "drafts" ? "draft" : "artikel"} terpilih
                </strong>
              ) : (
                <span>Total {currentTotalCount} {activeTab === "drafts" ? "draft artikel" : "artikel rilis"}</span>
              )}
            </span>
          </div>

          {/* Right: Bulk Delete Button */}
          {currentSelectedCount > 0 && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="font-bold text-xs shadow-lg shadow-rose-500/20 animate-in fade-in"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Hapus ({currentSelectedCount}) {activeTab === "drafts" ? "Draft" : "Artikel"} Terpilih
            </Button>
          )}
        </div>
      )}

      {/* 4. DRAFTS TAB CONTENT */}
      {activeTab === "drafts" && (
        <div suppressHydrationWarning className="space-y-4">
          {pendingDrafts.length > 0 ? (
            pendingDrafts.map((draft) => {
              const isSelected = selectedDraftIds.includes(draft.id);

              return (
                <AdminCard
                  key={draft.id}
                  className={`space-y-4 transition-all duration-200 ${
                    isSelected
                      ? "border-cyan-400/60 bg-cyan-500/[0.04] shadow-lg shadow-cyan-500/5"
                      : "border-amber-500/30 hover:border-amber-500/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Individual Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleDraft(draft.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[#2DD4F5] text-slate-950 shadow-md shadow-[#2DD4F5]/30"
                            : "bg-[#0B1120] border border-white/20 text-transparent hover:border-cyan-400"
                        }`}
                        title={isSelected ? "Batalkan pilihan" : "Pilih draft ini"}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>

                      <Badge variant="warning" size="sm">
                        Menunggu Review Editor
                      </Badge>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {draft.category}
                      </span>
                      <span className="text-xs font-mono text-[#64748B]">
                        Sumber: <strong className="text-[#F8FAFC]">{draft.sourceName}</strong>
                      </span>
                    </div>

                    <span className="text-xs text-[#64748B] font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Sinkron: {formatDate(draft.syncDate)}
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-0 sm:pl-9">
                    <h3 className="text-base font-bold text-white leading-snug">
                      {draft.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                      {draft.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08] pl-0 sm:pl-9">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          setDeleteTarget({
                            id: draft.id,
                            type: "draft",
                            title: draft.title
                          })
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Hapus Draft
                      </Button>
                      <a
                        href={draft.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08]"
                      >
                        <span>Sumber Asli</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <Link href={`/admin/content/${draft.id}/review`}>
                      <Button variant="primary" size="sm" className="font-extrabold text-xs">
                        <FileEdit className="w-3.5 h-3.5 mr-1.5" />
                        Review &amp; Edit Publikasi →
                      </Button>
                    </Link>
                  </div>
                </AdminCard>
              );
            })
          ) : (
            <EmptyState
              title="Semua Draft Telah Direview"
              description="Tidak ada draft artikel yang menunggu review saat ini. Klik tombol 'Sync Staging' untuk menarik artikel baru dari pipeline Gemini Spark."
              actionText="Sinkronkan Gemini Spark"
              onAction={syncGeminiSpark}
            />
          )}
        </div>
      )}

      {/* 5. PUBLISHED TAB CONTENT */}
      {activeTab === "published" && (
        <div suppressHydrationWarning className="space-y-4">
          {articles.length > 0 ? (
            articles.map((art) => {
              const isSelected = selectedArticleIds.includes(art.id);

              return (
                <AdminCard
                  key={art.id}
                  className={`space-y-4 transition-all duration-200 ${
                    isSelected
                      ? "border-cyan-400/60 bg-cyan-500/[0.04] shadow-lg shadow-cyan-500/5"
                      : "border-white/[0.08] hover:border-cyan-500/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      {/* Individual Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleArticle(art.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[#2DD4F5] text-slate-950 shadow-md shadow-[#2DD4F5]/30"
                            : "bg-[#0B1120] border border-white/20 text-transparent hover:border-cyan-400"
                        }`}
                        title={isSelected ? "Batalkan pilihan" : "Pilih artikel ini"}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>

                      <Badge variant="mint" size="sm">
                        LIVE PUBLISHED
                      </Badge>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {art.category.name}
                      </span>
                      <span className="text-xs font-mono text-[#64748B]">
                        Views: <strong className="text-[#2DD4F5]">{art.views.toLocaleString()}</strong>
                      </span>
                    </div>

                    <span className="text-xs text-[#64748B] font-mono">
                      Rilis: {formatDate(art.publishedAt)}
                    </span>
                  </div>

                  <div className="space-y-1 pl-0 sm:pl-9">
                    <h3 className="text-base font-bold text-white">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] pl-0 sm:pl-9">
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        setDeleteTarget({
                          id: art.id,
                          type: "article",
                          title: art.title
                        })
                      }
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Hapus Artikel
                    </Button>

                    <Link href={`/article/${art.slug}`} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-white/[0.10] text-[#94A3B8] hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                        Lihat di Portal Publik <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </AdminCard>
              );
            })
          ) : (
            <div className="p-12 rounded-3xl bg-[#0F172A]/70 border border-white/[0.08] text-center space-y-3">
              <Layers className="w-10 h-10 text-[#64748B] mx-auto" />
              <h3 className="text-base font-bold text-white">Belum Ada Artikel Rilis</h3>
              <p className="text-xs text-[#94A3B8]">
                Belum ada artikel yang dipublikasikan ke portal publik.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 6. Single Item Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmSingleDelete}
        title={deleteTarget?.type === "draft" ? "Hapus Draft Artikel?" : "Hapus Artikel Live?"}
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Permanen"
        variant="danger"
      />

      {/* 7. Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div
          suppressHydrationWarning
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md bg-[#0F172A] border border-rose-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white">
                Hapus {currentSelectedCount} {activeTab === "drafts" ? "Draft Artikel" : "Artikel Rilis"}?
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Anda akan menghapus secara massal{" "}
                <strong className="text-white">{currentSelectedCount} {activeTab === "drafts" ? "draft" : "artikel"} terpilih</strong>. Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-mono">
              ⚠️ Item yang dihapus akan segera dihilangkan dari antrean database.
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="text-xs border-white/[0.12]"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmBulkDelete}
                className="text-xs font-bold shadow-lg shadow-rose-500/20"
              >
                Ya, Hapus ({currentSelectedCount}) Item Terpilih
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
