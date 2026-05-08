export const adminHeroData = {
  eyebrow: "Admin Foundation",
  title: "Dashboard admin Nexarin disiapkan bertahap.",
  description:
    "Halaman ini masih foundation frontend. Login, database, CRUD, upload media, payment gateway, dan integrasi sistem akan dibuat setelah struktur admin dikunci.",
  primaryCta: {
    label: "Lihat Modul",
    href: "#admin-modules",
  },
  secondaryCta: {
    label: "Cek Support",
    href: "/support",
  },
};

export const adminStats = [
  {
    label: "Products",
    value: "Static",
    note: "Data produk masih dari file lokal.",
    icon: "🛒",
  },
  {
    label: "Portfolio",
    value: "Static",
    note: "Project portfolio masih dari data lokal.",
    icon: "📁",
  },
  {
    label: "News",
    value: "Static",
    note: "Artikel belum memakai database.",
    icon: "📰",
  },
  {
    label: "Support",
    value: "Manual",
    note: "Form support sementara diarahkan ke WhatsApp.",
    icon: "💚",
  },
];

export const adminModules = [
  {
    title: "Kelola Products",
    description:
      "Nanti dipakai untuk CRUD produk, harga, kategori, gambar, stok/status, checkout, dan produk digital.",
    status: "Belum backend",
    href: "/admin/products",
    previewHref: "/products",
    icon: "🛒",
  },
  {
    title: "Kelola Portfolio",
    description:
      "Nanti dipakai untuk CRUD project, studi kasus, tag teknologi, ringkasan, dan detail portfolio.",
    status: "Belum backend",
    href: "/admin/portfolio",
    previewHref: "/portfolio",
    icon: "📁",
  },
  {
    title: "Kelola News",
    description:
      "Nanti dipakai untuk CRUD artikel, kategori, headline, popular, draft, publish, dan detail artikel.",
    status: "Belum backend",
    href: "/admin/news",
    previewHref: "/news",
    icon: "📰",
  },
  {
    title: "Kelola Support",
    description:
      "Nanti dipakai untuk melihat data support, donasi manual, payment, invoice, dan status transaksi.",
    status: "Manual dulu",
    href: "/admin/support",
    previewHref: "/support",
    icon: "💚",
  },
  {
    title: "Settings",
    description:
      "Nanti dipakai untuk mengatur brand, logo, sosial media, SEO, sitemap, dan konfigurasi umum.",
    status: "Belum backend",
    href: "/admin/settings",
    previewHref: "/",
    icon: "⚙️",
  },
];

export const adminRoadmapItems = [
  "Login admin aman sebelum dashboard asli dibuka.",
  "Database untuk products, portfolio, news, media, support, dan settings.",
  "CRUD data dengan validasi agar tidak bikin blank putih.",
  "Upload media dan gambar setelah storage siap.",
  "Payment gateway dan Digiflazz dikerjakan setelah fondasi admin stabil.",
];

export const adminOverviewNotes = [
  {
    title: "Frontend dulu",
    description:
      "Dashboard saat ini masih preview statis supaya struktur UI aman sebelum backend dibuat.",
  },
  {
    title: "Noindex aman",
    description:
      "Route admin sudah disiapkan agar tidak di-index mesin pencari.",
  },
  {
    title: "Backend nanti",
    description:
      "Login, database, CRUD, upload media, dan payment akan masuk tahap berikutnya.",
  },
];

export const adminData = {
  status: "foundation-preview",
  phase: "frontend-static",
  isProtected: false,
  hasDatabase: false,
  hasLogin: false,
};