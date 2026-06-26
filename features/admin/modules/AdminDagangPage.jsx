"use client";

import { useState } from "react";
import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import { dagangData } from "@/features/dagang/dagang.data";
import { DagangIcon, DashboardIcon, SparkleIcon, DatabaseIcon, WriteIcon, DeleteIcon, WarningIcon } from "@/components/shared/MenuIcons";
const dagangAdminStats = [
  {
    label: "Total Produk",
    value: dagangData.products.length.toString(),
    note: "Jumlah produk aktif di katalog.",
    icon: <DagangIcon className="h-6 w-6 text-emerald-300" />,
  },
  {
    label: "Penjualan (Dummy)",
    value: "128",
    note: "Total transaksi bulan ini.",
    icon: <DashboardIcon className="h-6 w-6 text-emerald-300" />,
  },
  {
    label: "Pendapatan",
    value: "Rp 12.5M",
    note: "Estimasi pendapatan kotor.",
    icon: <SparkleIcon className="h-6 w-6 text-emerald-300" />,
  },
  {
    label: "Status Integrasi",
    value: "Offline",
    note: "Belum terhubung ke database.",
    icon: <DatabaseIcon className="h-6 w-6 text-emerald-300" />,
  },
];

const dagangAdminTasks = [
  "Menyiapkan skema database produk dagang.",
  "Membuat form CRUD (Create, Read, Update, Delete) produk.",
  "Integrasi API untuk memonitor klik tombol Pesan WhatsApp.",
  "Menyiapkan dashboard analitik penjualan nyata.",
  "Mengamankan route dengan autentikasi admin.",
];

function StatCard({ item }) {
  const safeItem = item || {};

  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.05]">
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {safeItem.label || "Status"}
            </p>

            <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
              {safeItem.value || "Preview"}
            </p>
          </div>

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-lg">
            {safeItem.icon || "⚙️"}
          </span>
        </div>

        <p className="mt-4 text-sm font-medium leading-6 text-slate-400">
          {safeItem.note || "Status admin module akan ditampilkan di sini."}
        </p>
      </div>
    </article>
  );
}

function formatProductId(id) {
  // Mengubah "prod-01" menjadi "NXR-01A7X" (kombinasi unik huruf dan angka)
  const num = id.split("-")[1] || "00";
  const randomChar = String.fromCharCode(65 + (parseInt(num) % 26)); // Huruf A-Z
  return `NXR-${num}${randomChar}7X`;
}

function formatPrice(priceStr) {
  const numStr = priceStr.replace(/\D/g, "");
  if (!numStr) return priceStr;
  const num = parseInt(numStr, 10);
  // Using id-ID to get '.' as thousands separator, like Rp.2.000.000
  return `Rp.${num.toLocaleString("id-ID")}`; 
}

export default function AdminDagangPage() {
  const [showAll, setShowAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  const displayedProducts = showAll ? dagangData.products : dagangData.products.slice(0, 5);

  const toggleSelectAll = () => {
    if (selectedIds.length === displayedProducts.length && displayedProducts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />

      <section className="relative overflow-hidden px-4 pb-8 pt-6 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
            >
              ← Admin
            </Link>

            <Link
              href="/dagang"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300 transition hover:bg-emerald-400/15"
            >
              Preview Halaman Dagang
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-sm">
            <div className="relative z-10">
              <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">
                Admin Dagang
              </p>

              <h1 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                Dashboard Penjualan & Produk
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                Halaman ini adalah pratinjau (preview) untuk mengelola penjualan dan produk digital Nexarin Dagang. Nanti Anda bisa menambah produk, melihat grafik penjualan riil, dan mengatur data katalog dari sini.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dagangAdminStats.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </div>

          {/* Tabel Preview Produk */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm">
            <div className="p-5 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white">Daftar Produk</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                    <span className="text-xs font-bold text-slate-400">
                      {selectedIds.length} dipilih:
                    </span>
                    <button 
                      onClick={() => setConfirmAction({ type: 'edit-bulk', targetName: `${selectedIds.length} produk` })}
                      className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition"
                    >
                      Edit Masal
                    </button>
                    <button 
                      onClick={() => setConfirmAction({ type: 'delete-bulk', targetName: `${selectedIds.length} produk` })}
                      className="rounded-xl bg-red-400/20 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-400/30 transition"
                    >
                      Hapus
                    </button>
                  </div>
                )}
                <button disabled className="rounded-xl bg-emerald-400/20 px-4 py-2 text-xs font-black text-emerald-400 opacity-50 cursor-not-allowed border border-emerald-400/20">
                  + Tambah Produk (Nanti)
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 border-collapse">
                <thead className="bg-white/5 text-xs uppercase text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="w-12 px-4 py-4 text-center border-r border-white/10">
                      <input 
                        type="checkbox" 
                        className="rounded border-white/20 bg-slate-900 text-emerald-400 focus:ring-emerald-400/50" 
                        checked={selectedIds.length === displayedProducts.length && displayedProducts.length > 0} 
                        onChange={toggleSelectAll} 
                      />
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 font-black border-r border-white/10">ID</th>
                    <th className="px-6 py-4 font-black border-r border-white/10">Produk</th>
                    <th className="whitespace-nowrap px-6 py-4 font-black border-r border-white/10">Kategori</th>
                    <th className="whitespace-nowrap px-6 py-4 font-black border-r border-white/10">Harga</th>
                    <th className="whitespace-nowrap px-6 py-4 font-black text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {displayedProducts.map((product) => (
                    <tr key={product.id} className={`transition-colors ${selectedIds.includes(product.id) ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                      <td className="px-4 py-4 text-center border-r border-white/10">
                        <input 
                          type="checkbox" 
                          className="rounded border-white/20 bg-slate-900 text-emerald-400 focus:ring-emerald-400/50" 
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500 border-r border-white/10">
                        {formatProductId(product.id)}
                      </td>
                      <td className="px-6 py-4 font-bold text-white min-w-[200px] border-r border-white/10">
                        {product.title}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 border-r border-white/10">
                        <span className="inline-flex h-6 min-w-[80px] items-center justify-center rounded-full bg-white/10 px-3 text-[10px] font-black text-slate-300 border border-white/10">
                          {product.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-emerald-400 border-r border-white/10">
                        {formatPrice(product.price)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setConfirmAction({ type: 'edit', targetName: product.title })}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors" title="Edit Produk"
                          >
                            <WriteIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmAction({ type: 'delete', targetName: product.title })}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors" title="Hapus Produk"
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-white/10 text-center">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="inline-flex min-h-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua Produk"}
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-sm">
            <p className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-amber-300">
              Roadmap Dagang
            </p>

            <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
              Fokus Utama Backend Berikutnya
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {dagangAdminTasks.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950/55 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">
                    {index + 1}
                  </span>

                  <p className="text-sm font-semibold leading-6 text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-400/5 blur-2xl" />
            
            <div className={`mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${confirmAction.type.includes('delete') ? 'border-red-400/20 bg-red-400/10 text-red-400' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400'}`}>
              <WarningIcon className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-black text-white">
              Konfirmasi {confirmAction.type.includes('delete') ? 'Penghapusan' : 'Perubahan'}
            </h3>
            
            <p className="mt-2 text-sm font-medium text-slate-400 leading-relaxed">
              Apakah Anda yakin ingin {confirmAction.type.includes('delete') ? 'menghapus' : 'mengedit'} 
              <span className="text-slate-200 font-bold"> {confirmAction.targetName}</span>?
              {confirmAction.type.includes('delete') && ' Tindakan ini tidak dapat dibatalkan.'}
            </p>

            <div className="mt-6 flex w-full gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Batal
              </button>
              <button 
                onClick={() => setConfirmAction(null)}
                className={`flex-1 rounded-xl py-2.5 text-xs font-black text-slate-950 transition shadow-lg ${confirmAction.type.includes('delete') ? 'bg-red-400 hover:bg-red-300 shadow-red-400/20' : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-400/20'}`}
              >
                Ya, {confirmAction.type.includes('delete') ? 'Hapus' : 'Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
