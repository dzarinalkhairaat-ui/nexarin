"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import { processManualAiKeys, processAiKeysUpload, getAiKeysStats, getActiveAiKeys, deleteAiKey } from "./aiKeys.actions";

export default function AdminAiKeysPage() {
  const [email, setEmail] = useState("");
  const [manualKeys, setManualKeys] = useState("");
  
  const [stats, setStats] = useState({ totalAccounts: 0, geminiKeys: 0, groqKeys: 0, totalKeys: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resultLogs, setResultLogs] = useState(null);

  const [activeKeys, setActiveKeys] = useState([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", isError: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: "", onConfirm: null });

  const showAlert = useCallback((message, isError = true) => {
    setAlertModal({ isOpen: true, message, isError });
  }, []);

  const showConfirm = useCallback((message, onConfirm) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  }, []);

  const loadData = useCallback(async () => {
    setIsLoadingStats(true);
    setIsLoadingKeys(true);
    try {
      const [statsRes, keysRes] = await Promise.all([
        getAiKeysStats(),
        getActiveAiKeys()
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (keysRes.success) setActiveKeys(keysRes.data);
    } catch (error) {
      console.error("Gagal meload data", error);
    } finally {
      setIsLoadingStats(false);
      setIsLoadingKeys(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleActionResponse(res) {
    if (res.success) {
      setResultLogs(res.data);
      setEmail("");
      setManualKeys("");
      loadData(); // refresh stats and table
    } else {
      showAlert(`Gagal: ${res.error || "Terjadi kesalahan"}`);
    }
  }

  async function handleManualSubmit() {
    if (!email || !manualKeys) {
      showAlert("Email dan API Keys wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await processManualAiKeys(email, manualKeys);
      handleActionResponse(res);
    } catch (error) {
      console.error(error);
      showAlert("Terjadi kesalahan server saat menyimpan manual.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const res = await processAiKeysUpload(text);
      handleActionResponse(res);
    } catch (error) {
      console.error(error);
      showAlert("Terjadi kesalahan saat mengupload dan memproses file.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  function handleDeleteKey(keyId) {
    showConfirm(
      "Apakah Anda yakin ingin menghapus API Key ini? Jika ini key terakhir milik akun tersebut, akun juga akan terhapus otomatis.",
      async () => {
        setIsDeleting(keyId);
        try {
          const res = await deleteAiKey(keyId);
          if (res.success) {
            loadData();
          } else {
            showAlert("Gagal menghapus: " + res.error);
          }
        } catch (error) {
          console.error(error);
          showAlert("Terjadi kesalahan server.");
        } finally {
          setIsDeleting(null);
        }
      }
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-cyan-400/30">
      <AdminTopbar />

      <section className="relative overflow-hidden px-5 pb-12 pt-8 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-400/[0.04] blur-[100px]" />
        
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          
          {/* Header */}
          <div className="flex flex-col border-b border-white/5 pb-8 gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.05em] text-white sm:text-4xl">
                API <span className="text-cyan-300">Keys.</span>
              </h1>
              
              <Link
                href="/admin/settings"
                className="group flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 sm:px-5 text-xs sm:text-sm font-bold text-slate-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
              >
                <svg className="h-4 w-4 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>
            </div>
            
            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-400">
              Kelola API Key Gemini dan Groq untuk digunakan di modul AI dan Scraping.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total Akun", value: isLoadingStats ? "-" : stats.totalAccounts, note: "Email terdaftar" },
              { label: "Gemini Key", value: isLoadingStats ? "-" : stats.geminiKeys, note: "Key aktif" },
              { label: "Groq Key", value: isLoadingStats ? "-" : stats.groqKeys, note: "Key aktif" },
              { label: "Total Key", value: isLoadingStats ? "-" : stats.totalKeys, note: "Seluruh provider" },
            ].map((stat, i) => (
              <div key={i} className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5 shadow-xl backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* Upload File Section */}
            <div className={`flex flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 transition-opacity ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  📄
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Upload File .txt</h2>
                  <p className="text-xs font-medium text-slate-400">Import banyak key sekaligus dari file teks</p>
                </div>
              </div>

              <div className="relative mt-2 flex flex-1 flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-white/10 bg-white/[0.01] p-8 text-center transition hover:border-emerald-400/30 hover:bg-emerald-400/5">
                <input 
                  type="file" 
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  disabled={isUploading}
                />
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-2xl mb-4">
                  {isUploading ? "⏳" : "📤"}
                </div>
                <p className="text-sm font-bold text-white">
                  {isUploading ? "Memproses File..." : "Klik atau drag file .txt ke sini"}
                </p>
                <p className="mt-2 max-w-[250px] text-xs font-medium leading-relaxed text-slate-500">
                  Format: Email di baris berawalan "-" diikuti dengan API key di baris bawahnya.
                </p>
              </div>
            </div>

            {/* Manual Input Section */}
            <div className={`flex flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 transition-opacity ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                  ✍️
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Input Manual</h2>
                  <p className="text-xs font-medium text-slate-400">Paste key langsung ke dalam sistem</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                    Email Pemilik Akun
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="namaemail@gmail.com"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:bg-cyan-400/5 focus:ring-1 focus:ring-cyan-400/50"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-xs font-bold tracking-wide text-slate-400">
                      API Keys (Gemini/Groq)
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) {
                            setManualKeys(prev => prev ? prev + '\n' + text : text);
                          }
                        } catch (err) {
                          alert("Gagal mengakses clipboard. Browser Anda mungkin memblokir akses clipboard atau butuh izin.");
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-cyan-400 uppercase transition hover:bg-cyan-400/20 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V7A2.5 2.5 0 0 0 10 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M3 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3Zm6 8.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5Zm0-1.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5Zm0-1.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5Zm0-1.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5Z" clipRule="evenodd" />
                      </svg>
                      Paste
                    </button>
                  </div>
                  <textarea
                    value={manualKeys}
                    onChange={(e) => setManualKeys(e.target.value)}
                    placeholder="Tulis Key Anda Disini..."
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:bg-cyan-400/5 focus:ring-1 focus:ring-cyan-400/50"
                  />
                </div>
                
                <button 
                  onClick={handleManualSubmit}
                  disabled={isSubmitting}
                  className="mt-2 flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Key Manual"}
                </button>
              </div>
            </div>

          </div>

          {/* Active Keys Table Section */}
          <div className="mt-10 mb-8 rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-indigo-400/10 text-indigo-400 border border-indigo-400/20">
                  🗄️
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Daftar Key Aktif</h2>
                  <p className="text-xs font-medium text-slate-400">Menampilkan semua API Key yang dapat digunakan oleh sistem.</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-4">Provider</th>
                    <th className="px-4 py-4">Email Akun</th>
                    <th className="px-4 py-4">Preview Key</th>
                    <th className="px-4 py-4">Ditambahkan</th>
                    <th className="px-4 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoadingKeys ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        <span className="inline-block animate-pulse">Memuat data...</span>
                      </td>
                    </tr>
                  ) : activeKeys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                        Belum ada API Key yang tersimpan.
                      </td>
                    </tr>
                  ) : (
                    activeKeys.map((key) => (
                      <tr key={key.id} className="transition-colors hover:bg-white/[0.01]">
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            key.provider === "GEMINI" 
                              ? "bg-blue-400/10 text-blue-400 border border-blue-400/20" 
                              : "bg-orange-400/10 text-orange-400 border border-orange-400/20"
                          }`}>
                            {key.provider}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium text-white">
                          {key.account?.email || "Unknown"}
                        </td>
                        <td className="px-4 py-4 font-mono text-slate-300">
                          {key.keyPreview}
                        </td>
                        <td className="px-4 py-4 text-slate-500">
                          {new Date(key.createdAt).toLocaleDateString("id-ID", {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleDeleteKey(key.id)}
                            disabled={isDeleting === key.id}
                            className="inline-flex items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-400 hover:text-white disabled:opacity-50"
                          >
                            {isDeleting === key.id ? "..." : "Hapus"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Result Logs Modal */}
      {resultLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
              <h2 className="text-xl font-black text-white">Laporan Pemrosesan API Key</h2>
              <button onClick={() => setResultLogs(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-400 font-bold mb-1">Total Dibaca</p>
                  <p className="text-2xl font-black text-white">{resultLogs.totalRead}</p>
                </div>
                <div className="bg-emerald-400/10 p-4 rounded-2xl border border-emerald-400/20">
                  <p className="text-xs text-emerald-400 font-bold mb-1">Disimpan</p>
                  <p className="text-2xl font-black text-emerald-300">{resultLogs.insertedCount}</p>
                </div>
                <div className="bg-amber-400/10 p-4 rounded-2xl border border-amber-400/20">
                  <p className="text-xs text-amber-400 font-bold mb-1">Duplikat</p>
                  <p className="text-2xl font-black text-amber-300">{resultLogs.duplicateCount}</p>
                </div>
                <div className="bg-rose-400/10 p-4 rounded-2xl border border-rose-400/20">
                  <p className="text-xs text-rose-400 font-bold mb-1">Tidak Valid</p>
                  <p className="text-2xl font-black text-rose-300">{resultLogs.invalidCount}</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-3">Rincian Log Eksekusi:</h3>
              <div className="space-y-3">
                {resultLogs.logs?.map((log, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    log.status === 'success' ? 'bg-emerald-400/5 border-emerald-400/20 text-emerald-300' :
                    log.status === 'warning' ? 'bg-amber-400/5 border-amber-400/20 text-amber-300' :
                    'bg-rose-400/5 border-rose-400/20 text-rose-300'
                  } text-sm font-medium leading-relaxed`}>
                    <span className="font-bold uppercase tracking-wider text-[10px] bg-black/20 px-2 py-1 rounded-md mr-2">
                      {log.status === 'success' ? '✅ Sukses' : log.status === 'warning' ? '⚠️ Duplikat' : '❌ Ditolak'}
                    </span>
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 text-center transform transition-all">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${alertModal.isError ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'} mb-4`}>
              {alertModal.isError ? '❌' : '⚠️'}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{alertModal.isError ? 'Terjadi Kesalahan' : 'Perhatian'}</h3>
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-400/10 text-red-400 mb-4">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Konfirmasi Hapus</h3>
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
                className="flex-1 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
