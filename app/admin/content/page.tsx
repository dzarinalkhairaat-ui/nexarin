"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { useNotification } from "@/context/NotificationContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmModal } from "@/components/feedback/ConfirmModal";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatDate } from "@/lib/utils";
import { Article } from "@/types/content";
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
  AlertTriangle,
  FileSpreadsheet,
  X,
  Save,
  Tag,
  Globe,
  UploadCloud,
  HelpCircle
} from "lucide-react";

export default function AdminContentPage() {
  const {
    drafts,
    articles,
    deleteDraft,
    deleteArticle,
    deleteMultipleDrafts,
    deleteMultipleArticles,
    syncGeminiSpark,
    updateArticle
  } = useContent();

  const { showToast } = useNotification();

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

  // Google Sheets Sync Modal State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncTab, setSyncTab] = useState<"auto" | "manual">("auto");
  const [isSyncing, setIsSyncing] = useState(false);
  const [sheetIdInput, setSheetIdInput] = useState("1ydN7GW0tkRNpdwigw1IAupPaG0MNL9GXtVF-75pf7JU");

  // Manual Import State
  const [manualTitle, setManualTitle] = useState("");
  const [manualCategory, setManualCategory] = useState("ai");
  const [manualExcerpt, setManualExcerpt] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [manualOpinion, setManualOpinion] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Edit Published Article Modal State
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("technology");
  const [isSavingArticle, setIsSavingArticle] = useState(false);

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
  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "draft") {
      await deleteDraft(deleteTarget.id);
      setSelectedDraftIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    } else {
      await deleteArticle(deleteTarget.id);
      setSelectedArticleIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  // Bulk Delete Handler
  const handleConfirmBulkDelete = async () => {
    if (activeTab === "drafts") {
      await deleteMultipleDrafts(selectedDraftIds);
      setSelectedDraftIds([]);
    } else {
      await deleteMultipleArticles(selectedArticleIds);
      setSelectedArticleIds([]);
    }
    setIsBulkDeleteModalOpen(false);
  };

  // Trigger Sync with Sheet
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/gemini-sync/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetId: sheetIdInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        await syncGeminiSpark();
        if (data.data?.syncedCount > 0) {
          showToast({
            type: "success",
            title: "Sinkronisasi Berhasil",
            message: `Berhasil mengimpor ${data.data.syncedCount} draft dari spreadsheet.`
          });
        } else {
          showToast({
            type: "info",
            title: "Spreadsheet Belum Memiliki Baris Baru",
            message: "Tidak ada baris draft baru, atau pastikan Spreadsheet diset ke 'Siapa saja yang memiliki link: Pelihat'."
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
      setIsSyncModalOpen(false);
    }
  };

  // Direct Manual Import
  const handleManualImport = async () => {
    if (!manualTitle.trim()) {
      showToast({ type: "error", title: "Judul Wajib Diisi", message: "Silakan masukkan judul artikel." });
      return;
    }

    setIsImporting(true);
    try {
      const res = await fetch("/api/gemini-sync/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualTitle,
          category: manualCategory,
          summary: manualExcerpt,
          content: manualContent,
          opinion: manualOpinion,
          sourceName: "DATABASE PORTAL INFO NEXARIN TECH"
        })
      });
      const data = await res.json();
      if (data.success) {
        await syncGeminiSpark();
        showToast({
          type: "success",
          title: "Draft Berhasil Diimpor",
          message: "Data artikel berhasil dimasukkan ke antrean review Supabase."
        });
        setManualTitle("");
        setManualExcerpt("");
        setManualContent("");
        setManualOpinion("");
        setIsSyncModalOpen(false);
      }
    } finally {
      setIsImporting(false);
    }
  };

  // Open Edit Modal for Published Article
  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setEditTitle(art.title);
    setEditExcerpt(art.excerpt);
    setEditContent(art.content);
    setEditCategory(art.category?.slug || "technology");
  };

  // Save Edited Article
  const handleSaveArticle = async () => {
    if (!editingArticle) return;
    setIsSavingArticle(true);
    try {
      await updateArticle(editingArticle.id, {
        title: editTitle,
        excerpt: editExcerpt,
        content: editContent,
        category: {
          id: editCategory,
          name: editCategory === "ai" ? "Artificial Intelligence" : editCategory === "gadget" ? "Gadget" : editCategory === "automotive" ? "Automotive" : editCategory === "digital" ? "Digital" : "Technology",
          slug: editCategory,
          description: `Kanal ${editCategory}`
        }
      });
      setEditingArticle(null);
    } finally {
      setIsSavingArticle(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <AdminPageHeader
        title="Pusat Editorial & Manajemen Konten"
        description="Pipeline kurasi artikel terstruktur: Gemini Spark AI (Google Sheets) → Review & Modifikasi Manual → Live Portal Supabase."
        badge={`${pendingDrafts.length} Menunggu Review`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSyncModalOpen(true)}
              className="border-white/10 hover:border-cyan-500/30 text-xs font-bold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-[#2DD4F5]" />
              Sync Spreadsheet
            </Button>
            <Link href="/admin/gemini-sync">
              <Button variant="primary" size="sm" className="text-xs font-bold shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Pipeline AI
              </Button>
            </Link>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id)} />

      {/* DRAFTS TAB */}
      {activeTab === "drafts" && (
        <div className="space-y-4">
          {/* Action Bar */}
          {pendingDrafts.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleSelectAllDrafts}
                  className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white"
                >
                  {selectedDraftIds.length === pendingDrafts.length ? (
                    <CheckSquare className="w-4 h-4 text-[#2DD4F5]" />
                  ) : selectedDraftIds.length > 0 ? (
                    <MinusSquare className="w-4 h-4 text-[#2DD4F5]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                  <span>Centang Semua ({selectedDraftIds.length}/{pendingDrafts.length})</span>
                </button>
              </div>

              {selectedDraftIds.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Hapus {selectedDraftIds.length} Draft Terpilih
                </Button>
              )}
            </div>
          )}

          {/* Draft List */}
          {pendingDrafts.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="w-7 h-7 text-[#2DD4F5]" />}
              title="Antrean Draft Kosong"
              description="Belum ada draft artikel baru dari Google Sheets 'DATABASE PORTAL INFO NEXARIN TECH'."
              actionText={isSyncing ? "Menyinkronkan..." : "Tarik Data dari Spreadsheet"}
              onAction={() => setIsSyncModalOpen(true)}
            />
          ) : (
            pendingDrafts.map((d) => {
              const isSelected = selectedDraftIds.includes(d.id);
              return (
                <div
                  key={d.id}
                  className={`p-6 rounded-3xl bg-[#0F172A]/80 border transition-all space-y-4 backdrop-blur-xl ${
                    isSelected ? "border-[#2DD4F5]/50 bg-[#0F172A]" : "border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleDraft(d.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#2DD4F5]" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Menunggu Review Editor
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#2DD4F5]/10 text-[#2DD4F5] border border-[#2DD4F5]/20">
                        {d.category}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {d.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {d.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {d.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteTarget({ id: d.id, type: "draft", title: d.title })}
                        className="text-xs font-bold h-8 px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Hapus Draft
                      </Button>

                      {d.sourceUrl && (
                        <a
                          href={d.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Sumber Asli ({d.sourceName || "Web"})</span>
                        </a>
                      )}
                    </div>

                    <Link href={`/admin/content/${d.id}/review`}>
                      <Button variant="primary" size="sm" className="text-xs font-bold h-8 px-4 shadow-md shadow-cyan-500/20">
                        <span>Review &amp; Edit Publikasi</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* PUBLISHED TAB */}
      {activeTab === "published" && (
        <div className="space-y-4">
          {/* Action Bar */}
          {articles.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleSelectAllArticles}
                  className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white"
                >
                  {selectedArticleIds.length === articles.length ? (
                    <CheckSquare className="w-4 h-4 text-[#2DD4F5]" />
                  ) : selectedArticleIds.length > 0 ? (
                    <MinusSquare className="w-4 h-4 text-[#2DD4F5]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                  <span>Centang Semua ({selectedArticleIds.length}/{articles.length})</span>
                </button>
              </div>

              {selectedArticleIds.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Hapus {selectedArticleIds.length} Artikel Terpilih
                </Button>
              )}
            </div>
          )}

          {/* Published Articles List */}
          {articles.length === 0 ? (
            <EmptyState
              icon={<Layers className="w-7 h-7 text-[#2DD4F5]" />}
              title="Belum Ada Artikel Publik"
              description="Belum ada artikel yang dipublikasikan ke database Supabase."
            />
          ) : (
            articles.map((art) => {
              const isSelected = selectedArticleIds.includes(art.id);
              const catSlug = art.category?.slug || "technology";
              return (
                <div
                  key={art.id}
                  className={`p-6 rounded-3xl bg-[#0F172A]/80 border transition-all space-y-4 backdrop-blur-xl ${
                    isSelected ? "border-[#2DD4F5]/50 bg-[#0F172A]" : "border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleArticle(art.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#2DD4F5]" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Live Published
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#2DD4F5]/10 text-[#2DD4F5] border border-[#2DD4F5]/20">
                        {art.category?.name || "Tech"}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {art.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteTarget({ id: art.id, type: "article", title: art.title })}
                        className="text-xs font-bold h-8 px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Hapus Artikel
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditArticle(art)}
                        className="text-xs font-bold h-8 px-3 border-white/10"
                      >
                        <FileEdit className="w-3.5 h-3.5 mr-1 text-[#2DD4F5]" />
                        Edit Artikel
                      </Button>
                    </div>

                    <Link
                      href={`/tech-info/${catSlug}/article/${art.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2DD4F5] hover:underline"
                    >
                      <span>Lihat di Portal Tech Info</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODAL: Single Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title={`Hapus ${deleteTarget.type === "draft" ? "Draft" : "Artikel"}?`}
          description={`Apakah Anda yakin ingin menghapus "${deleteTarget.title}" secara permanen dari database Supabase? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus Permanen"
          cancelText="Batal"
          variant="danger"
          onConfirm={handleConfirmSingleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* MODAL: Bulk Delete Confirmation */}
      {isBulkDeleteModalOpen && (
        <ConfirmModal
          isOpen={true}
          title={`Hapus ${activeTab === "drafts" ? selectedDraftIds.length + " Draft" : selectedArticleIds.length + " Artikel"} Terpilih?`}
          description={`Apakah Anda yakin ingin menghapus semua item yang dicentang secara permanen dari database Supabase?`}
          confirmText="Hapus Semua Terpilih"
          cancelText="Batal"
          variant="danger"
          onConfirm={handleConfirmBulkDelete}
          onClose={() => setIsBulkDeleteModalOpen(false)}
        />
      )}

      {/* MODAL: Sync Google Sheets Staging */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-[#0F172A] border border-white/[0.12] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#2DD4F5]" />
                <h3 className="text-base font-bold text-white">Sinkronisasi Database Spreadsheet</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sync Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setSyncTab("auto")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  syncTab === "auto" ? "bg-[#2DD4F5] text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Tarik Otomatis (URL/ID Sheet)
              </button>
              <button
                type="button"
                onClick={() => setSyncTab("manual")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  syncTab === "manual" ? "bg-[#2DD4F5] text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Impor Langsung Data Sheet
              </button>
            </div>

            {syncTab === "auto" ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Spreadsheet ID / URL:</label>
                  <input
                    type="text"
                    value={sheetIdInput}
                    onChange={(e) => setSheetIdInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5]"
                    placeholder="1ydN7GW0tkRNpdwigw1IAupPaG0MNL9GXtVF-75pf7JU"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2 text-[11px] text-slate-300 font-sans">
                  <div className="flex items-center gap-1.5 text-[#2DD4F5] font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>Petunjuk Akses Google Sheets:</span>
                  </div>
                  <p className="leading-relaxed">
                    Pastikan Google Sheet Anda diatur ke: <strong>Bagikan (Share) → "Siapa saja yang memiliki link: Pelihat"</strong> agar sistem dapat membaca baris data yang diisi oleh Gemini Spark.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                  <Button variant="outline" size="sm" onClick={() => setIsSyncModalOpen(false)}>
                    Tutup
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleTriggerSync}
                    disabled={isSyncing}
                    className="font-bold shadow-md shadow-cyan-500/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Menyinkronkan..." : "Mulai Tarik Data"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs font-mono max-h-[60vh] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Judul Artikel (title):</label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5]"
                    placeholder="Judul dari spreadsheet..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Kategori:</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5]"
                  >
                    <option value="ai">AI</option>
                    <option value="technology">Technology</option>
                    <option value="digital">Digital</option>
                    <option value="gadget">Gadget</option>
                    <option value="automotive">Automotive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Ringkasan (excerpt):</label>
                  <textarea
                    rows={2}
                    value={manualExcerpt}
                    onChange={(e) => setManualExcerpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5]"
                    placeholder="Ringkasan 2-3 kalimat..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Isi Naskah Markdown (content):</label>
                  <textarea
                    rows={5}
                    value={manualContent}
                    onChange={(e) => setManualContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5] font-sans"
                    placeholder="Naskah artikel lengkap dari spreadsheet..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <Button variant="outline" size="sm" onClick={() => setIsSyncModalOpen(false)}>
                    Tutup
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleManualImport}
                    disabled={isImporting}
                    className="font-bold shadow-md shadow-cyan-500/20"
                  >
                    <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                    {isImporting ? "Mengimpor..." : "Impor ke Draft Supabase"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Edit Published Article */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0F172A] border border-white/[0.12] p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-[#2DD4F5]" />
                <h3 className="text-base font-bold text-white">Edit Artikel Published</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Judul Artikel:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Kategori:</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5]"
                >
                  <option value="ai">Artificial Intelligence</option>
                  <option value="technology">Technology</option>
                  <option value="digital">Digital</option>
                  <option value="gadget">Gadget</option>
                  <option value="automotive">Automotive</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Ringkasan (Excerpt):</label>
                <textarea
                  rows={3}
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Naskah Artikel (Markdown):</label>
                <textarea
                  rows={8}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.10] text-white focus:outline-none focus:border-[#2DD4F5] font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <Button variant="outline" size="sm" onClick={() => setEditingArticle(null)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveArticle}
                disabled={isSavingArticle}
                className="font-bold shadow-md shadow-cyan-500/20"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isSavingArticle ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
