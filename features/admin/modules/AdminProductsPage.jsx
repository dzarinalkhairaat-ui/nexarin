import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";

const productAdminStats = [
  {
    label: "Data",
    value: "Static",
    note: "Produk masih dibaca dari file lokal.",
    icon: "📦",
  },
  {
    label: "CRUD",
    value: "Nanti",
    note: "Tambah, edit, hapus produk belum aktif.",
    icon: "🛠️",
  },
  {
    label: "Media",
    value: "Nanti",
    note: "Upload gambar produk belum terhubung storage.",
    icon: "🖼️",
  },
  {
    label: "Payment",
    value: "Nanti",
    note: "Checkout dan payment gateway belum aktif.",
    icon: "💳",
  },
];

const productAdminTasks = [
  "Menyiapkan struktur data produk.",
  "Membuat form tambah/edit produk.",
  "Menambahkan kategori produk.",
  "Menyiapkan upload gambar produk.",
  "Menghubungkan checkout ke payment gateway.",
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

export default function AdminProductsPage() {
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
              href="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300 transition hover:bg-emerald-400/15"
            >
              Public Products
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-sm">
            <div className="relative z-10">
              <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">
                Admin Products
              </p>

              <h1 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                Kelola produk digital Nexarin.
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                Halaman ini masih placeholder admin products. Nanti di sini akan
                ada fitur tambah produk, edit produk, kategori, harga, gambar,
                status, dan integrasi checkout.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
                >
                  Preview Products
                </Link>

                <Link
                  href="/admin"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
                >
                  Kembali Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productAdminStats.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-sm">
            <p className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-amber-300">
              Roadmap Products
            </p>

            <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
              CRUD produk dibuat setelah database siap.
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {productAdminTasks.map((item, index) => (
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
    </main>
  );
}