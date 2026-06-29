"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import { MapIcon, SuccessIcon, LeftArrowIcon, DatabaseIcon, DeleteIcon, WriteIcon, WarningIcon } from "@/components/shared/MenuIcons";

export default function AdminMapsPage() {
  const [addressText, setAddressText] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  
  const [editingLocation, setEditingLocation] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Data Lokasi Database
  const [savedLocations, setSavedLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/maps')
      .then(res => res.json())
      .then(data => {
        setSavedLocations(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil lokasi:", err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!addressText && !mapsLink) return;

    setIsSubmitting(true);
    
    try {
      if (editingLocation) {
        const res = await fetch(`/api/maps/${editingLocation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addressText, mapsLink })
        });
        
        if (res.ok) {
          const updated = await res.json();
          setSavedLocations(prev => prev.map(loc => loc.id === updated.id ? updated : loc));
          setSuccessMsg("Perubahan lokasi berhasil disimpan!");
        }
      } else {
        const res = await fetch('/api/maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addressText, mapsLink })
        });
        
        if (res.ok) {
          const newLoc = await res.json();
          setSavedLocations(prev => [newLoc, ...prev]);
          setSuccessMsg("Lokasi berhasil ditambahkan!");
        }
      }

      setAddressText("");
      setMapsLink("");
      setEditingLocation(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const executeConfirmAction = async () => {
    if (confirmAction.type === 'delete') {
      setIsDeleting(confirmAction.location.id);
      try {
        await fetch(`/api/maps/${confirmAction.location.id}`, { method: 'DELETE' });
        setSavedLocations(savedLocations.filter((l) => l.id !== confirmAction.location.id));
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(null);
      }
    } else if (confirmAction.type === 'edit') {
      const loc = confirmAction.location;
      setEditingLocation(loc);
      setAddressText(loc.addressText);
      setMapsLink(loc.mapsLink);
    }
    setConfirmAction(null);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-indigo-400/30">
      <AdminTopbar />

      <section className="relative overflow-hidden px-5 pb-12 pt-8 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-400/[0.04] blur-[100px]" />
        
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          
          {/* Header */}
          <div className="flex flex-col border-b border-white/5 pb-8 gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.05em] text-white sm:text-4xl">
                Pengaturan <span className="text-indigo-400">Peta.</span>
              </h1>
              
              <Link
                href="/admin/settings"
                className="group flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 sm:px-5 text-xs sm:text-sm font-bold text-slate-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
              >
                <LeftArrowIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Kembali
              </Link>
            </div>
            
            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-400">
              Kelola Teks Alamat dan Tautan Google Maps untuk keperluan informasi kontak dan petunjuk arah pelanggan Nexarin.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]">
            
            {/* Form Tambah Lokasi */}
            <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-indigo-400/10 text-indigo-400 border border-indigo-400/20 shadow-inner shadow-indigo-400/10">
                  <MapIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{editingLocation ? "Edit Lokasi" : "Tambah Lokasi"}</h2>
                  <p className="text-xs font-medium text-slate-400">{editingLocation ? "Ubah detail lokasi yang dipilih." : "Daftarkan alamat / tautan maps baru."}</p>
                </div>
              </div>

              {successMsg && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-4 text-indigo-400">
                  <SuccessIcon className="h-5 w-5" />
                  <p className="text-xs font-bold">{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                    Teks Alamat Lengkap
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-indigo-400">
                      <MapIcon className="h-5 w-5 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                    </div>
                    <textarea
                      value={addressText}
                      onChange={(e) => setAddressText(e.target.value)}
                      placeholder="Contoh: Desa Tirtanagaya..."
                      disabled={isSubmitting}
                      rows={3}
                      className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-11 pr-4 py-3 text-sm font-medium text-white placeholder-slate-600 outline-none transition focus:border-indigo-400/50 focus:bg-indigo-400/5 focus:ring-1 focus:ring-indigo-400/50 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                    Tautan Google Maps
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-blue-400">
                      <MapIcon className="h-5 w-5 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                    </div>
                    <input
                      type="url"
                      value={mapsLink}
                      onChange={(e) => setMapsLink(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50 focus:bg-blue-400/5 focus:ring-1 focus:ring-blue-400/50"
                    />
                  </div>
                </div>

                <div className="mt-2 flex gap-3">
                  {editingLocation && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLocation(null);
                        setAddressText("");
                        setMapsLink("");
                      }}
                      className="flex h-12 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || (!addressText && !mapsLink)}
                    className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-indigo-400 px-8 text-sm font-black text-slate-950 transition hover:bg-indigo-300 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-400/20"
                  >
                    {isSubmitting ? "Menyimpan..." : (editingLocation ? "Simpan Perubahan" : "Simpan Lokasi")}
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Lokasi Tersimpan */}
            <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-slate-800/50 text-slate-300 border border-white/10 shadow-inner">
                  <DatabaseIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Lokasi Terdaftar</h2>
                  <p className="text-xs font-medium text-slate-400">Daftar pengaturan peta yang aktif.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-4 py-4">Teks Alamat</th>
                      <th className="px-4 py-4">Tautan Maps</th>
                      <th className="px-4 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-400 font-medium">
                          Memuat lokasi...
                        </td>
                      </tr>
                    ) : savedLocations.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-400 font-medium">
                          Belum ada lokasi yang terdaftar.
                        </td>
                      </tr>
                    ) : (
                      savedLocations.map((loc) => (
                        <tr key={loc.id} className="transition-colors hover:bg-white/[0.01]">
                          <td className="px-4 py-4 font-medium text-white max-w-[200px] truncate" title={loc.addressText}>
                            {loc.addressText}
                          </td>
                          <td className="px-4 py-4 text-blue-400 max-w-[200px] truncate" title={loc.mapsLink}>
                            <a href={loc.mapsLink} target="_blank" rel="noopener noreferrer" className="hover:underline">{loc.mapsLink}</a>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setConfirmAction({ type: 'edit', location: loc })}
                                disabled={isDeleting === loc.id}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-400/10 text-indigo-400 transition hover:bg-indigo-400 hover:text-white disabled:opacity-50"
                                title="Edit Lokasi"
                              >
                                <WriteIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmAction({ type: 'delete', location: loc })}
                                disabled={isDeleting === loc.id}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-400 transition hover:bg-red-400 hover:text-white disabled:opacity-50"
                                title="Hapus Lokasi"
                              >
                                {isDeleting === loc.id ? "..." : <DeleteIcon className="h-4 w-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-400/5 blur-2xl" />
            
            <div className={`mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${confirmAction.type === 'delete' ? 'border-red-400/20 bg-red-400/10 text-red-400' : 'border-indigo-400/20 bg-indigo-400/10 text-indigo-400'}`}>
              <WarningIcon className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-black text-white">
              Konfirmasi {confirmAction.type === 'delete' ? 'Penghapusan' : 'Perubahan'}
            </h3>
            
            <p className="mt-2 text-sm font-medium text-slate-400 leading-relaxed">
              Apakah Anda yakin ingin {confirmAction.type === 'delete' ? 'menghapus' : 'mengedit'} lokasi ini?
              {confirmAction.type === 'delete' && <span className="block mt-2 font-bold text-slate-200">"{confirmAction.location.addressText}"</span>}
              {confirmAction.type === 'delete' && <span className="block mt-2">Tindakan ini tidak dapat dibatalkan.</span>}
            </p>

            <div className="mt-6 flex w-full gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Batal
              </button>
              <button 
                onClick={executeConfirmAction}
                className={`flex-1 rounded-xl py-2.5 text-xs font-black text-slate-950 transition shadow-lg ${confirmAction.type === 'delete' ? 'bg-red-400 hover:bg-red-300 shadow-red-400/20' : 'bg-indigo-400 hover:bg-indigo-300 shadow-indigo-400/20'}`}
              >
                Ya, {confirmAction.type === 'delete' ? 'Hapus' : 'Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
