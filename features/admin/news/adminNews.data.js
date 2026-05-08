export const adminNewsStats = [
  {
    label: "Artikel",
    value: "3",
    note: "Data awal",
  },
  {
    label: "Status",
    value: "Draft",
    note: "Siap CRUD",
  },
  {
    label: "Database",
    value: "Next",
    note: "Tahap berikutnya",
  },
];

export const adminNewsCategories = [
  {
    label: "Semua",
    slug: "semua",
  },
  {
    label: "Teknologi",
    slug: "teknologi",
  },
  {
    label: "Digital",
    slug: "digital",
  },
  {
    label: "Produk",
    slug: "produk",
  },
  {
    label: "Update",
    slug: "update",
  },
  {
    label: "Insight",
    slug: "insight",
  },
];

export const adminNewsStatuses = [
  {
    label: "Semua Status",
    value: "semua",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Archived",
    value: "archived",
  },
];

export const adminNewsDashboardMenus = [
  {
    title: "Artikel",
    description: "Lihat, edit, hapus, dan pantau seluruh artikel News.",
    href: "/admin/news/artikel",
    badge: "Table",
    icon: "A",
  },
  {
    title: "Tulis Artikel",
    description: "Buat artikel baru lengkap dengan kategori, sumber, dan gambar.",
    href: "/admin/news/tulis-artikel",
    badge: "Editor",
    icon: "T",
  },
  {
    title: "Kategori",
    description: "Tambah dan kelola kategori untuk halaman News.",
    href: "/admin/news/kategori",
    badge: "Manage",
    icon: "K",
  },
  {
    title: "Pengaturan",
    description: "Area pengaturan News untuk update lanjutan.",
    href: "/admin/news/pengaturan",
    badge: "Soon",
    icon: "P",
  },
];

export const adminNewsArticles = [
  {
    id: "news-001",
    title: "Konten awal masih memakai data statis sebelum database News aktif.",
    slug: "konten-awal-data-statis-news",
    category: "Teknologi",
    categorySlug: "teknologi",
    status: "Draft",
    statusValue: "draft",
    headline: true,
    featured: false,
    views: 128,
    date: "2026-05-01",
    updatedAt: "Frontend",
    readTime: "2 min read",
  },
  {
    id: "news-002",
    title: "Struktur artikel, kategori, dan search disiapkan untuk Nexarin News.",
    slug: "struktur-artikel-kategori-search-nexarin-news",
    category: "Digital",
    categorySlug: "digital",
    status: "Published",
    statusValue: "published",
    headline: false,
    featured: true,
    views: 246,
    date: "2026-05-02",
    updatedAt: "Frontend",
    readTime: "4 min read",
  },
  {
    id: "news-003",
    title: "News Manager akan menjadi module pertama yang disambungkan ke backend.",
    slug: "news-manager-module-pertama-backend",
    category: "Update",
    categorySlug: "update",
    status: "Draft",
    statusValue: "draft",
    headline: false,
    featured: false,
    views: 75,
    date: "2026-05-03",
    updatedAt: "Roadmap",
    readTime: "3 min read",
  },
];