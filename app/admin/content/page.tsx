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
  ArrowRight
} from "lucide-react";

export default function AdminContentPage() {
  const { drafts, articles, deleteDraft, deleteArticle, syncGeminiSpark } = useContent();
  const [activeTab, setActiveTab] = useState<string>("drafts");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "draft" | "article"; title: string } | null>(null);

  const pendingDrafts = drafts.filter((d) => d.status === "draft");

  const tabs = [
    { id: "drafts", label: "Drafts Staging (Gemini Spark)", count: pendingDrafts.length },
    { id: "published", label: "Artikel Published (Live Portal)", count: articles.length },
  ];

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "draft") {
      deleteDraft(deleteTarget.id);
    } else {
      deleteArticle(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
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

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Drafts Tab */}
      {activeTab === "drafts" && (
        <div className="space-y-4">
          {pendingDrafts.length > 0 ? (
            pendingDrafts.map((draft) => (
              <AdminCard key={draft.id} className="space-y-4 border-amber-500/30 hover:border-amber-500/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-2">
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

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white leading-snug">
                    {draft.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                    {draft.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-xs"
                      onClick={() => setDeleteTarget({ id: draft.id, type: "draft", title: draft.title })}
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
            ))
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

      {/* Published Tab */}
      {activeTab === "published" && (
        <div className="space-y-4">
          {articles.map((art) => (
            <AdminCard key={art.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
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

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  {art.title}
                </h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2">
                  {art.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                <Button
                  variant="danger"
                  size="sm"
                  className="text-xs"
                  onClick={() => setDeleteTarget({ id: art.id, type: "article", title: art.title })}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Hapus Artikel
                </Button>

                <Link href={`/article/${art.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="text-xs border-white/[0.10] text-[#94A3B8] hover:text-white">
                    <Eye className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                    Lihat di Portal Publik <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === "draft" ? "Hapus Draft Artikel?" : "Hapus Artikel Live?"}
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Permanen"
        variant="danger"
      />
    </div>
  );
}
