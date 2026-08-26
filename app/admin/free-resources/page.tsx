"use client";

import React, { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/feedback/ConfirmModal";
import { useNotification } from "@/context/NotificationContext";
import { FreeResource } from "@/types/resource";
import {
  DownloadCloud,
  Plus,
  Trash2,
  FileEdit,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  BarChart3
} from "lucide-react";

export default function AdminFreeResourcesPage() {
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FreeResource | null>(null);
  const [selectedResource, setSelectedResource] = useState<FreeResource | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [fileSize, setFileSize] = useState("2.5 MB");
  const [format, setFormat] = useState("ZIP / Source Code");
  const [badge, setBadge] = useState("Featured Kit");
  const [downloadUrl, setDownloadUrl] = useState("/downloads/resource.zip");

  const { showToast } = useNotification();

  const loadResources = async () => {
    try {
      const res = await fetch("/api/free-resources");
      const d = await res.json();
      if (d.success && d.data) {
        setResources(d.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/free-resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description,
          fileSize,
          format,
          badge,
          downloadUrl,
          isActive: true
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResources((prev) => [data.data, ...prev]);
        setCreateModalOpen(false);
        setTitle("");
        setSlug("");
        setDescription("");
        showToast({
          type: "success",
          title: "Free Resource Dibuat",
          message: `Resource "${title}" berhasil dipublikasikan ke portal gratis.`
        });
      }
    } catch (e) {
      showToast({ type: "error", title: "Gagal Membuat", message: "Terjadi kesalahan server." });
    }
  };

  const handleEdit = (resItem: FreeResource) => {
    setSelectedResource(resItem);
    setTitle(resItem.title);
    setSlug(resItem.slug);
    setDescription(resItem.description);
    setFileSize(resItem.fileSize);
    setFormat(resItem.format);
    setBadge(resItem.badge);
    setDownloadUrl(resItem.downloadUrl);
    setEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    try {
      const res = await fetch(`/api/free-resources/${selectedResource.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          fileSize,
          format,
          badge,
          downloadUrl
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResources((prev) => prev.map((r) => (r.id === selectedResource.id ? data.data : r)));
        setEditModalOpen(false);
        showToast({
          type: "success",
          title: "Resource Diperbarui",
          message: "Data Free Resource berhasil diperbarui di database."
        });
      }
    } catch (e) {
      showToast({ type: "error", title: "Gagal Update", message: "Terjadi kesalahan server." });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/free-resources/${deleteTarget.id}`, { method: "DELETE" });
      setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast({
        type: "warning",
        title: "Resource Dihapus",
        message: `Resource "${deleteTarget.title}" telah dihapus secara permanen.`
      });
    } catch (e) {
      showToast({ type: "error", title: "Gagal Hapus", message: "Terjadi kesalahan server." });
    }
    setDeleteTarget(null);
  };

  const totalDownloads = resources.reduce((acc, r) => acc + (r.downloadsCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminPageHeader
        title="Manajemen Free Resources &amp; Starter Kits"
        description="Kelola template gratis, UI starter kit, database snippets, dan pantau total unduhan publik."
        badge={`${resources.length} Resource Aktif • ${totalDownloads.toLocaleString()} Total Unduhan`}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setTitle("");
              setSlug("");
              setDescription("");
              setCreateModalOpen(true);
            }}
            className="font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Free Resource
          </Button>
        }
      />

      {/* Grid List */}
      <div className="space-y-4">
        {resources.map((res) => (
          <AdminCard key={res.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {res.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Format: <strong className="text-slate-200">{res.format}</strong></span>
                  <span className="text-xs text-slate-400 font-mono">Ukuran: <strong className="text-slate-200">{res.fileSize}</strong></span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {res.title}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="sm:text-right">
                  <span className="text-xs text-slate-400 font-mono block">Total Diunduh</span>
                  <span className="text-lg font-black text-[#7CF2C3] font-mono">
                    {res.downloadsCount.toLocaleString()}x
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {res.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
              <Button
                variant="danger"
                size="sm"
                className="text-xs"
                onClick={() => setDeleteTarget(res)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Hapus Resource
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-700 text-slate-300 hover:text-white"
                  onClick={() => handleEdit(res)}
                >
                  <FileEdit className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                  Edit Metadata
                </Button>

                <a href="/free-resources" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
                    Lihat Publik <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </a>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Tambah Free Resource Baru"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase">Nama Resource</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Nexarin Microservices Boilerplate"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase">Badge Label</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Featured Kit / Popular"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase">Ukuran File</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="2.4 MB"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase">Format</label>
              <input
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="ZIP / Source Code"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase">Download URL Path</label>
              <input
                type="text"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="/downloads/resource.zip"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase">Deskripsi Ringkas</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan isi dan kegunaan resource gratis ini..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" className="font-extrabold text-xs">
              Simpan &amp; Publikasikan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Free Resource"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase">Nama Resource</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase">Badge Label</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase">Ukuran File</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase">Format</label>
              <input
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase">Download URL Path</label>
              <input
                type="text"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase">Deskripsi</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-[#0F172A] text-white focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" className="font-extrabold text-xs">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Free Resource?"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title}"? Tindakan ini akan menghapus aset dari portal publik.`}
        confirmText="Ya, Hapus Permanen"
        variant="danger"
      />
    </div>
  );
}
