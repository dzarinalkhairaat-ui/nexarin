"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import { WalletIcon, ContactIcon, WriteIcon, SuccessIcon, LeftArrowIcon, DatabaseIcon, DeleteIcon, WarningIcon } from "@/components/shared/MenuIcons";
import Image from "next/image";

const makeSvg = (text, color, isItalic = false, size = 22) => 
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="50%" y="55%" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-style="${isItalic ? 'italic' : 'normal'}" font-size="${size}" fill="%23${color}" text-anchor="middle" letter-spacing="-0.5">${text}</text></svg>`;

const PAYMENT_METHODS = [
  { id: 'bca', name: 'BCA', type: 'bank', logo: makeSvg('BCA', '005AA9', true, 26) },
  { id: 'mandiri', name: 'Mandiri', type: 'bank', logo: makeSvg('mandiri', '003D79', false, 24) },
  { id: 'bni', name: 'BNI', type: 'bank', logo: makeSvg('BNI', 'F15A23', true, 26) },
  { id: 'bri', name: 'BRI', type: 'bank', logo: makeSvg('BRI', '00529C', false, 26) },
  { id: 'bsi', name: 'BSI', type: 'bank', logo: makeSvg('BSI', '00A29A', false, 26) },
  { id: 'gopay', name: 'GoPay', type: 'ewallet', logo: makeSvg('gopay', '00AED6', false, 24) },
  { id: 'ovo', name: 'OVO', type: 'ewallet', logo: makeSvg('OVO', '4C3494', true, 26) },
  { id: 'dana', name: 'DANA', type: 'ewallet', logo: makeSvg('DANA', '108EE9', false, 26) },
  { id: 'shopeepay', name: 'ShopeePay', type: 'ewallet', logo: makeSvg('ShopeePay', 'EE4D2D', false, 18) },
  { id: 'linkaja', name: 'LinkAja', type: 'ewallet', logo: makeSvg('LinkAja', 'E31837', true, 22) },
  { id: 'qris', name: 'QRIS', type: 'qris', logo: makeSvg('QRIS', 'ED1C24', true, 26) },
];

export default function AdminPaymentPage() {
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [qrisImage, setQrisImage] = useState(null); // stores file info for QRIS

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);

  const [editingPayment, setEditingPayment] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Data Dummy Payment Methods
  const [savedPayments, setSavedPayments] = useState([
    { id: 1, methodId: "bca", accountNumber: "1234567890", accountName: "Ahmad Fulan", createdAt: "2026-06-25T10:00:00Z" },
    { id: 2, methodId: "dana", accountNumber: "081234567890", accountName: "Ahmad Fulan", createdAt: "2026-06-25T10:05:00Z" }
  ]);

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === selectedMethodId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedMethodId) return;
    
    const isQris = selectedMethod?.type === 'qris';
    if (isQris && !qrisImage && !editingPayment?.qrisImage) return;
    if (!isQris && (!accountNumber || !accountName)) return;

    setConfirmAction({ type: 'save' });
  };

  const performSave = () => {
    const isQris = selectedMethod?.type === 'qris';
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (editingPayment) {
        setSavedPayments(prev => prev.map(p => {
          if (p.id === editingPayment.id) {
            return { 
              ...p, 
              methodId: selectedMethodId, 
              accountNumber: isQris ? '' : accountNumber,
              accountName: isQris ? '' : accountName,
              qrisImage: isQris ? (qrisImage ? qrisImage.name : p.qrisImage) : null
            };
          }
          return p;
        }));
        setSuccessMsg("Perubahan metode pembayaran berhasil disimpan!");
      } else {
        const newPayment = {
          id: Date.now(),
          methodId: selectedMethodId,
          accountNumber: isQris ? '' : accountNumber,
          accountName: isQris ? '' : accountName,
          qrisImage: isQris ? qrisImage?.name : null,
          createdAt: new Date().toISOString()
        };
        setSavedPayments([newPayment, ...savedPayments]);
        setSuccessMsg("Metode pembayaran berhasil ditambahkan!");
      }

      resetForm();
      setIsSubmitting(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  const resetForm = () => {
    setSelectedMethodId("");
    setAccountNumber("");
    setAccountName("");
    setQrisImage(null);
    setEditingPayment(null);
  };

  const executeConfirmAction = () => {
    if (confirmAction.type === 'delete') {
      setIsDeleting(confirmAction.payment.id);
      setTimeout(() => {
        setSavedPayments(savedPayments.filter((p) => p.id !== confirmAction.payment.id));
        setIsDeleting(null);
      }, 600);
    } else if (confirmAction.type === 'edit') {
      const payment = confirmAction.payment;
      setEditingPayment(payment);
      setSelectedMethodId(payment.methodId);
      setAccountNumber(payment.accountNumber || "");
      setAccountName(payment.accountName);
      // Simulate existing qris image name if it was qris
      if (payment.qrisImage) {
        setQrisImage({ name: payment.qrisImage });
      } else {
        setQrisImage(null);
      }
    } else if (confirmAction.type === 'save') {
      performSave();
      return; // prevent setting confirmAction to null here since performSave resets it during its flow, wait no, we just let it fall through to setConfirmAction(null) below
    }
    setConfirmAction(null);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-amber-400/30">
      <AdminTopbar />

      <section className="relative overflow-hidden px-5 pb-12 pt-8 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-400/[0.04] blur-[100px]" />
        
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          
          {/* Header */}
          <div className="flex flex-col border-b border-white/5 pb-8 gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.05em] text-white sm:text-4xl">
                Pengaturan <span className="text-amber-400">Pembayaran.</span>
              </h1>
              
              <Link
                href="/admin/settings"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
              >
                <LeftArrowIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Kembali
              </Link>
            </div>
            
            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-400">
              Kelola rekening bank atau E-Wallet yang dapat digunakan oleh pelanggan untuk melakukan pembayaran pesanan.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1.5fr]">
            
            {/* Form Tambah Pembayaran */}
            <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-inner shadow-amber-400/10">
                  <WalletIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{editingPayment ? "Edit Rekening" : "Tambah Rekening"}</h2>
                  <p className="text-xs font-medium text-slate-400">{editingPayment ? "Ubah detail rekening yang dipilih." : "Daftarkan rekening / e-wallet baru."}</p>
                </div>
              </div>

              {successMsg && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-400">
                  <SuccessIcon className="h-5 w-5" />
                  <p className="text-xs font-bold">{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                
                {/* Dropdown Nama Bank/E-Wallet */}
                <div className="relative" ref={dropdownRef}>
                  <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                    Pilih Bank / E-Wallet / QRIS
                  </label>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 text-sm font-medium text-white outline-none transition focus:border-amber-400/50 focus:bg-amber-400/5 focus:ring-1 focus:ring-amber-400/50 disabled:opacity-50"
                  >
                    {selectedMethod ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-12 items-center justify-center rounded bg-white p-1">
                          <img src={selectedMethod.logo} alt={selectedMethod.name} className="h-full w-full object-contain" />
                        </div>
                        <span>{selectedMethod.name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-600">Pilih Metode Pembayaran...</span>
                    )}
                    <svg className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl">
                      <div className="max-h-60 overflow-y-auto p-1">
                        {PAYMENT_METHODS.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => {
                              setSelectedMethodId(method.id);
                              setDropdownOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-white/5"
                          >
                            <div className="flex h-8 w-14 shrink-0 items-center justify-center rounded bg-white p-1.5 shadow-sm">
                              <img src={method.logo} alt={method.name} className="h-full w-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-white">{method.name}</span>
                              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{method.type}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Conditional Input: Rekening vs QRIS */}
                {selectedMethod?.type === 'qris' ? (
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                      Upload Barcode QRIS
                    </label>
                    <div className="relative flex h-12 w-full items-center rounded-xl border border-white/10 bg-slate-950/50 px-4 text-sm font-medium text-white outline-none transition focus-within:border-blue-400/50 focus-within:bg-blue-400/5 focus-within:ring-1 focus-within:ring-blue-400/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setQrisImage(e.target.files[0])}
                        disabled={isSubmitting}
                        className="w-full file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-400/10 file:px-4 file:py-1 file:text-xs file:font-bold file:text-blue-400 hover:file:bg-blue-400/20"
                      />
                    </div>
                    {qrisImage && <p className="mt-2 text-[10px] text-slate-400">File terpilih: {qrisImage.name}</p>}
                    {!qrisImage && editingPayment?.qrisImage && <p className="mt-2 text-[10px] text-slate-400">File tersimpan: {editingPayment.qrisImage}</p>}
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                      Nomor Rekening / No HP
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-blue-400">
                        <WriteIcon className="h-5 w-5 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                      </div>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="1234567890"
                        disabled={isSubmitting || !selectedMethodId}
                        className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50 focus:bg-blue-400/5 focus:ring-1 focus:ring-blue-400/50 disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod?.type !== 'qris' && (
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wide text-slate-400">
                      Atas Nama (A.N)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-400">
                        <ContactIcon className="h-5 w-5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      </div>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Nama Lengkap Pemilik Rekening"
                        disabled={isSubmitting}
                        className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition focus:border-emerald-400/50 focus:bg-emerald-400/5 focus:ring-1 focus:ring-emerald-400/50 disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-2 flex gap-3">
                  {editingPayment && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex h-12 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || 
                      !selectedMethodId || 
                      (selectedMethod?.type !== 'qris' && (!accountNumber || !accountName)) ||
                      (selectedMethod?.type === 'qris' && !qrisImage && !editingPayment?.qrisImage)
                    }
                    className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-amber-400 px-8 text-sm font-black text-slate-950 transition hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-amber-400/20"
                  >
                    {isSubmitting ? "Menyimpan..." : (editingPayment ? "Simpan Perubahan" : "Simpan Rekening")}
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Rekening Tersimpan */}
            <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-indigo-400/10 text-indigo-400 border border-indigo-400/20 shadow-inner shadow-indigo-400/10">
                  <DatabaseIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Metode Terdaftar</h2>
                  <p className="text-xs font-medium text-slate-400">Daftar metode pembayaran yang aktif saat ini.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-4 py-4">Metode</th>
                      <th className="px-4 py-4">Detail</th>
                      <th className="px-4 py-4">Atas Nama</th>
                      <th className="px-4 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {savedPayments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400 font-medium">
                          Belum ada metode pembayaran yang terdaftar.
                        </td>
                      </tr>
                    ) : (
                      savedPayments.map((payment) => {
                        const method = PAYMENT_METHODS.find(m => m.id === payment.methodId);
                        
                        return (
                          <tr key={payment.id} className="transition-colors hover:bg-white/[0.01]">
                            <td className="px-4 py-4">
                              <div className="flex h-8 w-14 items-center justify-center rounded bg-white p-1.5 shadow-sm">
                                {method ? (
                                  <img src={method.logo} alt={method.name} className="h-full w-full object-contain" />
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400">?</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-mono font-medium text-slate-300">
                              {method?.type === 'qris' ? (
                                <span className="inline-flex items-center gap-1 rounded bg-blue-400/10 px-2 py-1 text-[10px] font-bold text-blue-400">
                                  {payment.qrisImage || "Terdapat QRIS"}
                                </span>
                              ) : (
                                payment.accountNumber
                              )}
                            </td>
                            <td className="px-4 py-4 font-medium text-slate-400">
                              {payment.accountName}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setConfirmAction({ type: 'edit', payment })}
                                  disabled={isDeleting === payment.id}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-400 transition hover:bg-amber-400 hover:text-white disabled:opacity-50"
                                  title="Edit Rekening"
                                >
                                  <WriteIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setConfirmAction({ type: 'delete', payment })}
                                  disabled={isDeleting === payment.id}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-400 transition hover:bg-red-400 hover:text-white disabled:opacity-50"
                                  title="Hapus Rekening"
                                >
                                  {isDeleting === payment.id ? "..." : <DeleteIcon className="h-4 w-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-400/5 blur-2xl" />
            
            <div className={`mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${confirmAction.type === 'delete' ? 'border-red-400/20 bg-red-400/10 text-red-400' : confirmAction.type === 'save' ? 'border-blue-400/20 bg-blue-400/10 text-blue-400' : 'border-amber-400/20 bg-amber-400/10 text-amber-400'}`}>
              <WarningIcon className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-black text-white">
              Konfirmasi {confirmAction.type === 'delete' ? 'Penghapusan' : confirmAction.type === 'save' ? 'Penyimpanan' : 'Perubahan'}
            </h3>
            
            <p className="mt-2 text-sm font-medium text-slate-400 leading-relaxed">
              {confirmAction.type === 'save' ? (
                <>Apakah Anda yakin ingin menyimpan data ini? Pastikan detail {selectedMethod?.type === 'qris' ? 'QRIS' : 'rekening'} yang Anda inputkan sudah <strong className="text-blue-400">benar dan valid</strong> sebelum melanjutkan.</>
              ) : (
                <>
                  Apakah Anda yakin ingin {confirmAction.type === 'delete' ? 'menghapus' : 'mengedit'} rekening 
                  <span className="text-slate-200 font-bold"> {PAYMENT_METHODS.find(m => m.id === confirmAction.payment.methodId)?.name} </span>?
                  {confirmAction.type === 'delete' && ' Tindakan ini tidak dapat dibatalkan.'}
                </>
              )}
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
                className={`flex-1 rounded-xl py-2.5 text-xs font-black text-slate-950 transition shadow-lg ${confirmAction.type === 'delete' ? 'bg-red-400 hover:bg-red-300 shadow-red-400/20' : confirmAction.type === 'save' ? 'bg-blue-400 hover:bg-blue-300 shadow-blue-400/20' : 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20'}`}
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
