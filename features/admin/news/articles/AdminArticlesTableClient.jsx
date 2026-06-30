"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteNewsArticleAction, updateArticleQuickAction, deleteMultipleNewsArticlesAction, updateMultipleArticlesQuickAction } from "./adminNewsArticle.actions";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { QuestionIcon, SuccessIcon, ErrorIcon } from "@/components/shared/MenuIcons";

const adminArticleStatusLabels = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

function formatBoolean(value) {
  return value ? "Ya" : "Tidak";
}

function formatArticleStatus(status) {
  return adminArticleStatusLabels?.[status] || "Draft";
}

function getPlatformBadgeColor(platform) {
  switch(platform) {
    case "FACEBOOK": return "bg-blue-600/20 text-blue-400 border-blue-600/30";
    case "INSTAGRAM": return "bg-pink-600/20 text-pink-400 border-pink-600/30";
    case "TWITTER": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
    case "TIKTOK": return "bg-slate-800/80 text-slate-300 border-slate-700";
    case "LINKEDIN": return "bg-blue-800/30 text-blue-300 border-blue-800/50";
    case "YOUTUBE": return "bg-red-600/20 text-red-400 border-red-600/30";
    default: return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";
  }
}

export default function AdminArticlesTableClient({ articles, errorMessage, isSearchActive, categories }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditForm, setBulkEditForm] = useState({
    categoryId: "",
    status: "",
    isHeadline: "",
    isFeatured: ""
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", isError: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: "", onConfirm: null });

  const showAlert = (message, isError = true) => setAlertModal({ isOpen: true, message, isError });
  const showConfirm = (message, onConfirm) => setConfirmModal({ isOpen: true, message, onConfirm });

  const safeArticles = Array.isArray(articles) ? articles : [];
  const hasArticles = safeArticles.length > 0;

  const [isPublishedOpen, setIsPublishedOpen] = useState(true);
  const [isDraftOpen, setIsDraftOpen] = useState(true);

  const publishedArticles = safeArticles.filter(a => {
    const s = a.rawStatus || a.status;
    return s === "PUBLISHED" || s === "Published";
  });
  
  const draftArticles = safeArticles.filter(a => {
    const s = a.rawStatus || a.status;
    return !(s === "PUBLISHED" || s === "Published");
  });

  const renderTableGroup = (title, items, isOpen, toggleOpen, badgeColor) => {
    if (items.length === 0) return null;

    const hasSelectedInThisTable = items.some(a => selectedIds.includes(a.id));
    const allSelectedInThisTable = items.length > 0 && items.every(i => selectedIds.includes(i.id));

    const handleSelectAllGroup = (e) => {
      if (e.target.checked) {
        const newIds = new Set([...selectedIds, ...items.map(i => i.id)]);
        setSelectedIds(Array.from(newIds));
      } else {
        setSelectedIds(selectedIds.filter(id => !items.find(i => i.id === id)));
      }
    };

    return (
      <div className="mb-8 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div 
          onClick={toggleOpen}
          className="flex cursor-pointer items-center justify-between border-b border-white/10 bg-slate-950/40 px-6 py-4 transition hover:bg-slate-950/60"
        >
          <div className="flex items-center gap-3">
            <span className={`h-6 w-1.5 rounded-full ${badgeColor}`} />
            <h3 className="text-lg font-black text-white">{title} <span className="ml-2 text-sm font-bold text-slate-500">({items.length})</span></h3>
          </div>
          <button className="text-slate-400 hover:text-white transition-transform duration-300">
            <svg className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="border-b border-white/10 bg-slate-950/55">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/10 bg-white/5 text-emerald-400 focus:ring-emerald-400 focus:ring-offset-slate-950 cursor-pointer"
                      onChange={handleSelectAllGroup}
                      checked={allSelectedInThisTable}
                    />
                  </th>
                  {["Judul", "Kategori", "Status", "Headline", "Featured", "Tanggal"].map((head) => (
                    <th key={head} className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                      {head}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                    <div className="flex items-center justify-end gap-2">
                      <span>AKSI</span>
                      <button 
                        onClick={() => {
                          if (selectedIds.length === 0) return showAlert("Silakan centang minimal 1 artikel terlebih dahulu di sebelah kiri untuk menggunakan Edit Cepat.", true);
                          if (isBulkEditing || editingId) return cancelEdit();
                          
                          if (selectedIds.length === 1) {
                            startEdit(safeArticles.find(a => a.id === selectedIds[0]));
                          } else {
                            setIsBulkEditing(true);
                            setBulkEditForm({ categoryId: "", status: "", isHeadline: "", isFeatured: "" });
                          }
                        }}
                        className="inline-flex items-center rounded border border-blue-400/20 bg-blue-400/10 px-2 py-1 text-[9px] font-black tracking-wider text-blue-300 transition hover:bg-blue-400/20"
                      >
                        {editingId || isBulkEditing ? "BATAL" : "EDIT CEPAT"}
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isBulkEditing && hasSelectedInThisTable && (
                  <tr className="border-b border-blue-400/20 bg-blue-400/[0.08]">
                    <td className="px-4 py-4 text-center"></td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-blue-300">Edit {selectedIds.length} Artikel</p>
                      <p className="text-[10px] font-bold text-blue-300/60 mt-1 uppercase">Opsi Massal</p>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={bulkEditForm.categoryId} 
                        onChange={(e) => setBulkEditForm({...bulkEditForm, categoryId: e.target.value})}
                        className="w-full min-w-[120px] bg-slate-900 border border-blue-400/30 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="">(Tidak Diubah)</option>
                        <option value="null">Tanpa Kategori</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={bulkEditForm.status} 
                        onChange={(e) => setBulkEditForm({...bulkEditForm, status: e.target.value})}
                        className="w-full bg-slate-900 border border-blue-400/30 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="">(Tidak Diubah)</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={bulkEditForm.isHeadline} 
                        onChange={(e) => setBulkEditForm({...bulkEditForm, isHeadline: e.target.value})}
                        className="bg-slate-900 border border-blue-400/30 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="">(Tidak Diubah)</option>
                        <option value="true">Ya</option>
                        <option value="false">Tidak</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={bulkEditForm.isFeatured} 
                        onChange={(e) => setBulkEditForm({...bulkEditForm, isFeatured: e.target.value})}
                        className="bg-slate-900 border border-blue-400/30 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="">(Tidak Diubah)</option>
                        <option value="true">Ya</option>
                        <option value="false">Tidak</option>
                      </select>
                    </td>
                    <td className="px-4 py-4"></td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={cancelEdit} className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-black text-white hover:bg-slate-700">
                          Batal
                        </button>
                        <button onClick={handleBulkSave} disabled={loadingId === "bulk"} className="flex items-center justify-center rounded-xl bg-blue-400 px-3 py-2 text-xs font-black text-slate-950 hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed">
                          {loadingId === "bulk" ? <><LoadingSpinner className="h-3 w-3 mr-1.5" /> Loading...</> : "Simpan Massal"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {items.map((article) => {
                  const isEditing = editingId === article.id;

                  return (
                    <tr key={article.id} className={`border-b border-white/10 last:border-b-0 ${loadingId === article.id ? "opacity-50" : ""} hover:bg-white/[0.02]`}>
                      <td className="px-4 py-4 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-white/10 bg-white/5 text-emerald-400 focus:ring-emerald-400 focus:ring-offset-slate-950 cursor-pointer"
                          checked={selectedIds.includes(article.id)}
                          onChange={() => handleToggleSelect(article.id)}
                        />
                      </td>

                      <td className="max-w-[320px] px-4 py-4">
                        <p className="line-clamp-2 text-sm font-black leading-5 text-white">{article.title}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">/{article.slug}</p>
                        {article.socialCaptions?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {article.socialCaptions.map(platform => (
                              <span key={platform} className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${getPlatformBadgeColor(platform)}`}>
                                {platform}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {isEditing ? (
                          <select 
                            value={editForm.categoryId} 
                            onChange={(e) => setEditForm({...editForm, categoryId: e.target.value})}
                            className="w-full min-w-[120px] bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          >
                            <option value="">Tanpa Kategori</option>
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                            {article.category}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {isEditing ? (
                          <select 
                            value={editForm.status} 
                            onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          >
                            <option value="PUBLISHED">Published</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300">
                            {article.status}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm font-black text-slate-300">
                        {isEditing ? (
                          <select 
                            value={editForm.isHeadline} 
                            onChange={(e) => setEditForm({...editForm, isHeadline: e.target.value})}
                            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          >
                            <option value="true">Ya</option>
                            <option value="false">Tidak</option>
                          </select>
                        ) : formatBoolean(article.headline)}
                      </td>

                      <td className="px-4 py-4 text-sm font-black text-slate-300">
                        {isEditing ? (
                          <select 
                            value={editForm.isFeatured} 
                            onChange={(e) => setEditForm({...editForm, isFeatured: e.target.value})}
                            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          >
                            <option value="true">Ya</option>
                            <option value="false">Tidak</option>
                          </select>
                        ) : formatBoolean(article.featured)}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-slate-400">
                        {article.date || "-"}
                        <div className="mt-1 text-[10px] text-emerald-300/60 font-black">{article.views} views</div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button onClick={cancelEdit} className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-black text-white hover:bg-slate-700">
                                Batal
                              </button>
                              <button onClick={() => handleSaveEdit(article.id)} disabled={loadingId === article.id} className="flex items-center justify-center min-w-[70px] rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loadingId === article.id ? <LoadingSpinner className="h-3.5 w-3.5" /> : "Simpan"}
                              </button>
                            </>
                          ) : (
                            <>
                              <Link href={`/admin/news/edit-artikel/${article.slug}`} className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200">
                                Edit
                              </Link>
                              <button onClick={() => handleDeleteSingle(article.id)} disabled={loadingId === article.id} className="flex items-center justify-center min-w-[65px] rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-400/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loadingId === article.id ? <LoadingSpinner className="h-3.5 w-3.5 text-red-400" /> : "Hapus"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Handler for Quick Edit
  const startEdit = (article) => {
    setEditingId(article.id);
    setEditForm({
      categoryId: article.categoryId || "",
      status: article.rawStatus || "DRAFT",
      isHeadline: article.headline,
      isFeatured: article.featured
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setIsBulkEditing(false);
    setBulkEditForm({ categoryId: "", status: "", isHeadline: "", isFeatured: "" });
  };

  const handleSaveEdit = async (articleId) => {
    setLoadingId(articleId);
    const result = await updateArticleQuickAction(articleId, {
      categoryId: editForm.categoryId,
      status: editForm.status,
      isHeadline: editForm.isHeadline === "true" || editForm.isHeadline === true,
      isFeatured: editForm.isFeatured === "true" || editForm.isFeatured === true
    });
    setLoadingId(null);

    if (result.ok) {
      setEditingId(null);
      startTransition(() => {
        router.refresh();
      });
    } else {
      showAlert(result.message);
    }
  };

  const handleBulkSave = async () => {
    if (selectedIds.length === 0) return;
    setLoadingId("bulk");
    
    const result = await updateMultipleArticlesQuickAction(selectedIds, bulkEditForm);
    setLoadingId(null);

    if (result.ok) {
      setIsBulkEditing(false);
      setSelectedIds([]); // Opsional: kosongkan pilihan setelah edit massal
      startTransition(() => {
        router.refresh();
      });
    } else {
      showAlert(result.message);
    }
  };

  // Handler for Select All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(safeArticles.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    showConfirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} artikel yang dipilih? Data tidak bisa dikembalikan.`, async () => {
      setLoadingId("bulk");
      const result = await deleteMultipleNewsArticlesAction(selectedIds);
      setLoadingId(null);

      if (result.ok) {
        setSelectedIds([]);
        startTransition(() => {
          router.refresh();
        });
      } else {
        showAlert(result.message);
      }
    });
  };

  const handleDeleteSingle = async (articleId) => {
    showConfirm("Apakah Anda yakin ingin menghapus artikel ini?", async () => {
      setLoadingId(articleId);
      
      const formData = new FormData();
      formData.append("articleId", articleId);
      await deleteNewsArticleAction(formData);
      
      setLoadingId(null);
    });
  };

  if (!hasArticles) {
    return (
      <section className="relative px-5 pb-10 pt-3 text-white sm:px-6 sm:pb-12 lg:px-8">
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400" />
            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">Tabel Artikel</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">Data artikel dari database News.</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
                {isSearchActive ? "Pencarian Kosong" : "Belum Ada Artikel"}
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.045em] text-white">
                {isSearchActive ? "Artikel tidak ditemukan." : "Database artikel masih kosong."}
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-400">
                {isSearchActive
                  ? "Coba sesuaikan kata kunci pencarian, atau hapus filter status dan kategori untuk melihat semua artikel."
                  : "Setelah artikel pertama dibuat dari halaman Tulis Artikel, data akan tampil otomatis di tabel ini."}
              </p>
              {errorMessage ? (
                <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-xs font-bold leading-6 text-red-200">
                  {errorMessage}
                </p>
              ) : null}
              {!isSearchActive && (
                <Link
                  href="/admin/news/tulis-artikel"
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
                >
                  Tulis Artikel
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
    <section className="relative px-5 pb-10 pt-3 text-white sm:px-6 sm:pb-12 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400" />
            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white flex items-center gap-2">
                Tabel Artikel
                {isPending && <span className="text-xs text-emerald-400 font-normal animate-pulse">Menyimpan...</span>}
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Data artikel dari database News.
              </p>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <span className="text-xs font-bold text-slate-400">{selectedIds.length} Terpilih</span>
              {!(isBulkEditing || editingId) && (
                <button
                  onClick={handleBulkDelete}
                  disabled={loadingId === "bulk"}
                  className="inline-flex items-center px-4 py-2 border border-red-400/20 bg-red-400/10 text-red-400 hover:bg-red-400/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingId === "bulk" ? <><LoadingSpinner className="h-3 w-3 mr-2" /> Menghapus...</> : "Hapus Terpilih"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* TABLE VIEWS (Published & Draft) */}
        {renderTableGroup("Artikel Published", publishedArticles, isPublishedOpen, () => setIsPublishedOpen(!isPublishedOpen), "bg-emerald-400")}
        {renderTableGroup("Artikel Draft / Archived", draftArticles, isDraftOpen, () => setIsDraftOpen(!isDraftOpen), "bg-amber-400")}
      </div>
    </section>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 text-center transform transition-all">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${alertModal.isError ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'} mb-4`}>
              {alertModal.isError ? <ErrorIcon className="h-6 w-6" /> : <SuccessIcon className="h-6 w-6" />}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{alertModal.isError ? 'Terjadi Kesalahan' : 'Berhasil'}</h3>
            <p className="text-sm text-slate-400 mb-6">{alertModal.message}</p>
            <button 
              onClick={() => setAlertModal({ isOpen: false, message: "", isError: false })}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 text-center transform transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 mb-4">
              <QuestionIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Konfirmasi Aksi</h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, message: "", onConfirm: null })}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ isOpen: false, message: "", onConfirm: null });
                }}
                className="flex-1 rounded-xl bg-cyan-500/20 border border-cyan-500/30 px-4 py-3 text-sm font-bold text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
