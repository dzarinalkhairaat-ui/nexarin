import { Product } from "@/types/product";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-absensi-sekolah",
    name: "Nexarin Sistem Absensi Sekolah Digital",
    slug: "nexarin-sistem-absensi-sekolah",
    tagline: "Solusi Presensi Sekolah Cerdas dengan Geolocation, QR Dinamis, dan Rekapitulasi Otomatis.",
    shortDescription: "Aplikasi web & mobile lengkap untuk manajemen kehadiran siswa, guru, dan staf sekolah. Dilengkapi validasi radius GPS, integrasi WhatsApp notification, dan ekspor laporan instan.",
    description: `Nexarin Sistem Absensi Sekolah Digital dirancang khusus untuk memodernisasi tata kelola presensi pada sekolah dasar, menengah, hingga perguruan tinggi. 

### Fitur Unggulan Sistem:
- **Validasi Geolocation Granular**: Mencegah kecurangan presensi di luar area perimeter sekolah.
- **Dynamic QR Code Scanner**: QR code berganti setiap 10 detik untuk mencegah foto/screenshot dibagikan.
- **Portal Siswa, Guru & Admin**: Tiga level otorisasi dengan hak akses terpisah dan aman.
- **Laporan Otomatis Excel & PDF**: Rekapitulasi bulanan siap cetak dalam satu klik.
- **Integrasi Notifikasi WhatsApp**: Orang tua menerima pemberitahuan instan saat anak tiba di sekolah.

### Yang Anda Dapatkan:
1. Full Source Code (Next.js App Router + Supabase PostgreSQL).
2. Panduan Instalasi Langkah-demi-Langkah (Video & Dokumentasi Markdown).
3. Hak Lisensi Lifetime (Bebas kustomisasi & update berkala).`,
    price: 349000,
    originalPrice: 750000,
    currency: "IDR",
    category: "applications",
    licenseType: "lifetime",
    trialEnabled: true,
    trialDurationDays: 3,
    status: "published",
    currentVersion: "v2.1.0",
    featuredImage: "/assets/product-absensi.svg",
    galleryImages: [
      "/assets/product-absensi.svg",
      "/assets/default-cover.svg"
    ],
    features: [
      "Geolocation & Radius GPS Perimeter Checking",
      "Dynamic Rotating QR Scanner (Anti-Titip Absen)",
      "Multi-Role: Administrator, Wali Kelas, Guru, Siswa",
      "Automated Monthly Attendance Analytics & Export",
      "WhatsApp & Email Alert Integration",
      "Dark Cyan Responsive UI",
      "Database Supabase / PostgreSQL Ready",
      "Dokumentasi & Video Tutorial Lengkap"
    ],
    requirements: {
      platform: ["Web Browser (Chrome, Safari, Firefox, Edge)", "Mobile Responsive (Android / iOS)"],
      runtime: "Node.js 18+ / Next.js 14+",
      database: "PostgreSQL / Supabase",
      minimumSpecs: "1 Core CPU, 1GB RAM (Vercel / VPS / Shared Hosting)",
    },
    rating: 4.9,
    ratingCount: 86,
    salesCount: 245,
    versions: [
      {
        id: "v-abs-210",
        productId: "prod-absensi-sekolah",
        version: "v2.1.0",
        releaseNotes: [
          "Dukungan mode offline temporary dengan sync otomatis saat online",
          "Optimalisasi algoritma penghitungan jarak radius GPS Haversine",
          "Pembaruan modul ekspor rekapitulasi format Kurikulum Merdeka",
          "Patch keamanan token autentikasi sesi ganda"
        ],
        releaseDate: "2026-08-15",
        downloadFileName: "nexarin-absensi-v2.1.0.zip",
        fileSize: "18.4 MB",
        isLatest: true,
      },
      {
        id: "v-abs-200",
        productId: "prod-absensi-sekolah",
        version: "v2.0.0",
        releaseNotes: [
          "Migrasi penuh ke Next.js App Router dan Tailwind CSS",
          "Integrasi gateway notifikasi WhatsApp via Fonnte API",
          "Pembaruan antarmuka portal guru dan wali murid"
        ],
        releaseDate: "2026-05-10",
        downloadFileName: "nexarin-absensi-v2.0.0.zip",
        fileSize: "16.8 MB",
        isLatest: false,
      }
    ],
    faqs: [
      {
        question: "Apakah aplikasi ini bisa dipasang di hosting sendiri (Self-hosted)?",
        answer: "Ya! Anda mendapatkan full source code yang dapat dideploy di VPS pribadi, Vercel, Railway, cPanel Node.js, atau server lokal sekolah."
      },
      {
        question: "Bagaimana cara kerja lisensi Lifetime?",
        answer: "Sekali beli, Anda dapat menggunakan source code selamanya untuk sekolah atau instansi Anda tanpa biaya bulanan tersembunyi, termasuk mendapatkan update versi baru secara gratis di Customer Dashboard."
      },
      {
        question: "Bagaimana jika saya memerlukan bantuan setup?",
        answer: "Tersedia dokumentasi teks dan panduan video instalasi lengkap di Customer Dashboard. Anda juga dapat membuka tiket dukungan langsung ke tim teknis Nexarin."
      }
    ],
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-08-15T00:00:00Z",
  },
  {
    id: "prod-admin-pro",
    name: "Nexarin Admin Dashboard Pro Kit",
    slug: "nexarin-admin-dashboard-pro-kit",
    tagline: "Template Dashboard Enterprise dengan 40+ Komponen UI, Manajemen Role, dan Integrasi Supabase.",
    shortDescription: "Boilerplate dashboard admin premium siap pakai dengan Tailwind CSS, chart visualisasi analitik interaktif, autentikasi terisolasi, dan audit log otomatis.",
    description: `Nexarin Admin Dashboard Pro Kit mempercepat pembuatan panel administrasi SaaS, e-commerce, atau sistem internal perusahaan Anda hingga 80%.

### Fitur Utama:
- **Komponen UI Lengkap**: Tabel data dengan filter, sorting, pagination, form generator, modal dialog, dan kartu metrik KPI.
- **Visualisasi Data Interaktif**: Grafik statistik pendapatan, user activity, dan server health.
- **Keamanan Tingkat Tinggi**: Otentikasi sesi ganda, sanitasi input, dan log jejak audit immutable.`,
    price: 249000,
    originalPrice: 499000,
    currency: "IDR",
    category: "templates",
    licenseType: "lifetime",
    trialEnabled: true,
    trialDurationDays: 3,
    status: "published",
    currentVersion: "v1.4.0",
    featuredImage: "/assets/product-dashboard.svg",
    galleryImages: [
      "/assets/product-dashboard.svg",
      "/assets/default-cover.svg"
    ],
    features: [
      "40+ Reusable UI Dashboard Components",
      "Chart.js & Recharts Ready Visualizations",
      "Dark Cyan Theme Engine",
      "Role-Based Access Control (Superadmin, Editor, Viewer)",
      "Supabase Database Hooks & State Management",
      "Audit Log Tracking System"
    ],
    requirements: {
      platform: ["Web Browser"],
      runtime: "Node.js 18+ / React 19 / Next.js",
      database: "Supabase / PostgreSQL",
      minimumSpecs: "512MB RAM",
    },
    rating: 5.0,
    ratingCount: 42,
    salesCount: 151,
    versions: [
      {
        id: "v-adm-140",
        productId: "prod-admin-pro",
        version: "v1.4.0",
        releaseNotes: [
          "Pembaruan komponen Chart dengan rendering lebih mulus",
          "Penambahan layout collapsible multi-level sidebar",
          "Optimasi bundle size hingga 35%"
        ],
        releaseDate: "2026-08-01",
        downloadFileName: "nexarin-admin-pro-v1.4.0.zip",
        fileSize: "12.2 MB",
        isLatest: true,
      }
    ],
    faqs: [
      {
        question: "Apakah sudah termasuk modul autentikasi?",
        answer: "Ya, modul autentikasi lengkap dengan session handling dan proteksi rute sudah terkonfigurasi secara out-of-the-box."
      }
    ],
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "prod-guru-murid",
    name: "Sistem Manajemen Guru & Murid Terpadu",
    slug: "sistem-manajemen-guru-dan-murid",
    tagline: "Manajemen Nilai, Rapor Digital, Penjadwalan Kelas, dan Komunikasi Edukatif.",
    shortDescription: "Aplikasi tata kelola akademik sekolah untuk penginputan nilai harian, pembagian rapor otomatis, pemantauan tugas siswa, dan komunikasi terpadu guru-wali murid.",
    description: `Digitalisasi menyeluruh proses administrasi akademik sekolah dengan alur pengisian nilai terstruktur, rekapitulasi otomatis kurikulum nasional, dan cetak lembar rapor.`,
    price: 299000,
    originalPrice: 599000,
    currency: "IDR",
    category: "applications",
    licenseType: "lifetime",
    trialEnabled: true,
    trialDurationDays: 3,
    status: "published",
    currentVersion: "v1.1.0",
    featuredImage: "/assets/product-school.svg",
    galleryImages: [
      "/assets/product-school.svg",
      "/assets/default-cover.svg"
    ],
    features: [
      "Input Nilai Tugas, UTS & UAS Otomatis",
      "Generate PDF Rapor Siswa Siap Cetak",
      "Jadwal Pelajaran & Ruangan Interaktif",
      "Portal Catatan Perkembangan Karakter Siswa",
      "Akses Akun Terpisah untuk Siswa & Guru"
    ],
    requirements: {
      platform: ["Web Browser & Mobile Web"],
      runtime: "Node.js 18+",
      database: "PostgreSQL / Supabase",
      minimumSpecs: "1GB RAM",
    },
    rating: 4.8,
    ratingCount: 31,
    salesCount: 112,
    versions: [
      {
        id: "v-gm-110",
        productId: "prod-guru-murid",
        version: "v1.1.0",
        releaseNotes: [
          "Format rapor Kurikulum Merdeka terbaru",
          "Kalkulator konversi bobot penilaian otomatis",
          "Peningkatan performa cetak PDF batch massal"
        ],
        releaseDate: "2026-07-20",
        downloadFileName: "sistem-guru-murid-v1.1.0.zip",
        fileSize: "14.5 MB",
        isLatest: true,
      }
    ],
    faqs: [
      {
        question: "Apakah bisa disesuaikan dengan format sekolah kami?",
        answer: "Tentu! Full source code diberikan sehingga Anda bebas menyesuaikan logo, kop surat, dan rumus penilaian rapor."
      }
    ],
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-07-20T00:00:00Z",
  },
  {
    id: "prod-saas-starter",
    name: "Next.js SaaS Starter Kit Boilerplate",
    slug: "nextjs-saas-starter-kit-boilerplate",
    tagline: "Fondasi Produksi SaaS Siap Luncur dengan Supabase Auth, Mayar Payment & Tailwind.",
    shortDescription: "Hemat waktu pengembangan 200+ jam. Dilengkapi sistem langganan/pembelian digital, landing page SEO-optimized, dashboard pelanggan, dan webhook payment otomatis.",
    description: `Boilerplate komprehensif bagi Anda yang ingin meluncurkan bisnis digital, tools micro-SaaS, atau portal template sendiri dalam hitungan hari.`,
    price: 199000,
    originalPrice: 399000,
    currency: "IDR",
    category: "starter-kits",
    licenseType: "lifetime",
    trialEnabled: false,
    trialDurationDays: 0,
    status: "published",
    currentVersion: "v1.0.0",
    featuredImage: "/assets/product-starterkit.svg",
    galleryImages: [
      "/assets/product-starterkit.svg",
      "/assets/default-cover.svg"
    ],
    features: [
      "Next.js 16 App Router & React 19 Architecture",
      "Supabase Auth & Database Schema Preconfigured",
      "Mayar / Midtrans Payment Webhook Handlers",
      "Customer Dashboard & Protected File Downloads",
      "SEO Metadata & OpenGraph Generators",
      "TypeScript Strict Type Safety"
    ],
    requirements: {
      platform: ["Web Browser"],
      runtime: "Node.js 18+ / Next.js 16",
      database: "Supabase PostgreSQL",
      minimumSpecs: "Vercel Hobby / VPS 512MB",
    },
    rating: 4.9,
    ratingCount: 55,
    salesCount: 198,
    versions: [
      {
        id: "v-saas-100",
        productId: "prod-saas-starter",
        version: "v1.0.0",
        releaseNotes: [
          "Rilis perdana SaaS Starter Kit Boilerplate",
          "Modul webhook payment siap pakai",
          "Dokumentasi arsitektur database lengkap"
        ],
        releaseDate: "2026-08-01",
        downloadFileName: "nextjs-saas-starter-v1.0.0.zip",
        fileSize: "9.8 MB",
        isLatest: true,
      }
    ],
    faqs: [
      {
        question: "Apakah boleh digunakan untuk project klien komersial?",
        answer: "Ya! Lisensi mencakup penggunaan komersial tanpa batas untuk project internal maupun project klien."
      }
    ],
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  }
];
