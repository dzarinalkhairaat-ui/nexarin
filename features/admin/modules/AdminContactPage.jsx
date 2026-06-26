"use client";

import { useState } from "react";
import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import { ContactIcon, WhatsappIcon, EmailIcon, SuccessIcon, LeftArrowIcon, DatabaseIcon, DeleteIcon, WriteIcon, WarningIcon } from "@/components/shared/MenuIcons";

export default function AdminContactPage() {
  const [waNumber, setWaNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  
  const [editingContact, setEditingContact] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Data Dummy Kontak
  const [savedContacts, setSavedContacts] = useState([
    { id: 1, type: "WhatsApp", value: "6281234567890", createdAt: "2026-06-25T10:00:00Z" },
    { id: 2, type: "Email", value: "admin@nexarin.com", createdAt: "2026-06-25T10:05:00Z" }
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!waNumber && !email) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (editingContact) {
        setSavedContacts(prev => prev.map(c => {
          if (c.id === editingContact.id) {
            return { ...c, value: c.type === 'WhatsApp' ? waNumber : email };
          }
          return c;
        }));
        setSuccessMsg("Perubahan kontak berhasil disimpan!");
      } else {
        const newContacts = [];
        if (waNumber) {
          newContacts.push({ id: Date.now(), type: "WhatsApp", value: waNumber, createdAt: new Date().toISOString() });
        }
        if (email) {
          newContacts.push({ id: Date.now() + 1, type: "Email", value: email, createdAt: new Date().toISOString() });
        }
        setSavedContacts([...newContacts, ...savedContacts]);
        setSuccessMsg("Kontak berhasil ditambahkan!");
      }

      setWaNumber("");
      setEmail("");
      setEditingContact(null);
      setIsSubmitting(false);
      
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  const executeConfirmAction = () => {
    if (confirmAction.type === 'delete') {
      setIsDeleting(confirmAction.contact.id);
      setTimeout(() => {
        setSavedContacts(savedContacts.filter((c) => c.id !== confirmAction.contact.id));
        setIsDeleting(null);
      }, 600);
    } else if (confirmAction.type === 'edit') {
      const contact = confirmAction.contact;
      setEditingContact(contact);
      if (contact.type === 'WhatsApp') {
        setWaNumber(contact.value);
        setEmail("");
      } else {
        setEmail(contact.value);
        setWaNumber("");
      }
    }
    setConfirmAction(null);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
      <AdminTopbar />

      <section className="relative overflow-hidden px-5 pb-12 pt-8 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/[0.04] blur-[100px]" />
        
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          
          {/* Header */}
          <div className="flex flex-col border-b border-white/5 pb-8 gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.05em] text-white sm:text-4xl">
                Kontak <span className="text-emerald-400">Admin.</span>
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
              Kelola nomor WhatsApp dan alamat Email untuk keperluan transaksi, dukungan, dan komunikasi dengan pelanggan Nexarin.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]">
            
            {/* Form Tambah Kontak */}
            <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 shadow-inner shadow-emerald-400/10">
                  <ContactIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{editingContact ? "Edit Kontak" : "Tambah Kontak"}</h2>
                  <p className="text-xs font-medium text-slate-400">{editingContact ? "Ubah detail kontak yang dipilih." : "Daftarkan nomor / email baru."}</p>
                </div>
              </div>

              {successMsg && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-400">
                  <SuccessIcon className="h-5 w-5" />
                  <p className="text-xs font-bold">{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-400">
                      <WhatsappIcon className="h-5 w-5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    </div>
                    <input
                      type="text"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      placeholder="Contoh: 62812..."
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition focus:border-emerald-400/50 focus:bg-emerald-400/5 focus:ring-1 focus:ring-emerald-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-blue-400">
                      <EmailIcon className="h-5 w-5 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@domain.com"
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50 focus:bg-blue-400/5 focus:ring-1 focus:ring-blue-400/50"
                    />
                  </div>
                </div>

                <div className="mt-2 flex gap-3">
                  {editingContact && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingContact(null);
                        setWaNumber("");
                        setEmail("");
                      }}
                      className="flex h-12 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || (!waNumber && !email)}
                    className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-emerald-400 px-8 text-sm font-black text-slate-950 transition hover:bg-emerald-300 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-400/20"
                  >
                    {isSubmitting ? "Menyimpan..." : (editingContact ? "Simpan Perubahan" : "Simpan Kontak")}
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Kontak Tersimpan */}
            <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-indigo-400/10 text-indigo-400 border border-indigo-400/20 shadow-inner shadow-indigo-400/10">
                  <DatabaseIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Kontak Terdaftar</h2>
                  <p className="text-xs font-medium text-slate-400">Daftar kontak yang aktif saat ini.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-4 py-4">Tipe</th>
                      <th className="px-4 py-4">Detail Kontak</th>
                      <th className="px-4 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {savedContacts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-400 font-medium">
                          Belum ada kontak yang terdaftar.
                        </td>
                      </tr>
                    ) : (
                      savedContacts.map((contact) => (
                        <tr key={contact.id} className="transition-colors hover:bg-white/[0.01]">
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${
                              contact.type === "WhatsApp"
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400 shadow-emerald-400/5"
                                : "border-blue-400/20 bg-blue-400/10 text-blue-400 shadow-blue-400/5"
                            }`}>
                              {contact.type === "WhatsApp" ? <WhatsappIcon className="h-3 w-3" /> : <EmailIcon className="h-3 w-3" />}
                              {contact.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-medium text-white">
                            {contact.value}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setConfirmAction({ type: 'edit', contact })}
                                disabled={isDeleting === contact.id}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-400 transition hover:bg-emerald-400 hover:text-white disabled:opacity-50"
                                title="Edit Kontak"
                              >
                                <WriteIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmAction({ type: 'delete', contact })}
                                disabled={isDeleting === contact.id}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-400 transition hover:bg-red-400 hover:text-white disabled:opacity-50"
                                title="Hapus Kontak"
                              >
                                {isDeleting === contact.id ? "..." : <DeleteIcon className="h-4 w-4" />}
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
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-400/5 blur-2xl" />
            
            <div className={`mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${confirmAction.type === 'delete' ? 'border-red-400/20 bg-red-400/10 text-red-400' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400'}`}>
              <WarningIcon className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-black text-white">
              Konfirmasi {confirmAction.type === 'delete' ? 'Penghapusan' : 'Perubahan'}
            </h3>
            
            <p className="mt-2 text-sm font-medium text-slate-400 leading-relaxed">
              Apakah Anda yakin ingin {confirmAction.type === 'delete' ? 'menghapus' : 'mengedit'} kontak 
              <span className="text-slate-200 font-bold"> {confirmAction.contact.value}</span>?
              {confirmAction.type === 'delete' && ' Tindakan ini tidak dapat dibatalkan.'}
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
                className={`flex-1 rounded-xl py-2.5 text-xs font-black text-slate-950 transition shadow-lg ${confirmAction.type === 'delete' ? 'bg-red-400 hover:bg-red-300 shadow-red-400/20' : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-400/20'}`}
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
