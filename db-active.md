# Status Integrasi Backend Database (PostgreSQL via Prisma) 🚀

Dokumen ini berisi rekapitulasi halaman dan bagian dari sistem Nexarin yang **sudah terhubung sempurna** dengan database, yang **terhubung sebagian**, dan yang **belum terhubung** (masih menggunakan data statis lokal).

---

## ✅ SUDAH SELESAI (Terhubung Penuh ke Database)

Berikut adalah modul-modul yang 100% menggunakan data dari Database (baik Publik maupun Admin):

### 1. Modul Autentikasi & Keamanan (OTP)
- **`/admin/login`** (Halaman Login Admin)
  - *Database Model*: `AdminOtpChallenge`
  - *Status*: Sempurna. Menyimpan kode OTP sementara, limit percobaan login, dan validasi sesi keamanan admin.

### 2. Modul Berita & Publikasi (News & Categories)
- **`/news`**, **`/news/kategori/[slug]`**, **`/news/artikel/[slug]`** (Halaman Publik)
- **`/admin/news`**, **`/admin/news/categories`**, **`/admin/news/write`** (Dasbor Admin)
  - *Database Model*: `NewsCategory`, `NewsArticle`
  - *Status*: Sempurna. Operasi CRUD untuk artikel berita dan pengelompokan kategorinya.

### 3. Modul Bot Scraping Otomatis
- **`/admin/scraping-news`**
  - *Database Model*: `ScrapedNewsArticle`, `ScraperLog`
  - *Status*: Sempurna. Pengambilan berita dari web eksternal serta mencatat log (riwayat keberhasilan/kegagalan).

### 4. Modul Pengaturan Kunci API (AI)
- **`/admin/settings/api-key`**
  - *Database Model*: `AiApiAccount`, `AiApiKey`
  - *Status*: Sempurna. Penyimpanan token/kunci AI (Gemini, Groq) secara terenkripsi.

### 5. Modul Sistem Pembayaran & Dukungan (Donasi)
- **`/support`** (Halaman Dukungan Donasi Publik)
- **`/admin/settings/payment`** (Halaman Manajemen Rekening & QRIS)
  - *Database Model*: `PaymentSetting`
  - *Status*: Sempurna. Pengunjung Publik bisa memilih secara interaktif metode pembayaran dan melihat informasi Rekening / QRIS yang dikelola melalui Admin.

### 6. Modul Pengaturan Kontak & Peta
- **`/contact`** (Halaman Kontak Publik)
- **`/admin/settings/contact`** (Halaman Manajemen Kontak WhatsApp & Email)
- **`/admin/settings/maps`** (Halaman Manajemen Lokasi & Tautan Peta)
  - *Database Model*: `ContactSetting`, `MapSetting`
  - *Status*: Sempurna. Data kontak (Email, WA) dan peta yang ditampilkan di halaman publik secara dinamis dikelola sepenuhnya di Admin.

---

## 🟡 SELESAI SEBAGIAN (Perlu Penyempurnaan)

Berikut adalah modul yang sisi publiknya sudah membaca dari database, namun halaman Admin (CRUD) belum selesai dibangun:

### 1. Modul Portofolio & Proyek
- **`/portfolio`** (Halaman Publik) 
  - *Status*: **Sudah Terhubung**. Berhasil membaca data dari DB (tabel `PortfolioProject`), dan ada fungsi *auto-seed* jika DB kosong.
- **`/admin/portfolio`** (Halaman Admin)
  - *Status*: **Belum Terhubung**. Masih berupa UI statis (*placeholder*). Fitur tambah, edit, hapus (CRUD) project portfolio belum dibangun.

---

## ❌ BELUM SELESAI (Masih Menggunakan Data Statis)

Berikut adalah bagian yang sepenuhnya belum terhubung ke database dan masih menggunakan data palsu (*dummy*) atau file lokal statis (misal: `*.data.js`):

### 1. Modul Katalog Produk Digital (Dagang)
- **`/dagang`** (Halaman Publik)
- **`/admin/dagang`** (Halaman Admin)
  - *Status*: **Statis (Belum Terhubung DB)**. Seluruh data masih bersumber dari `dagang.data.js`. Dasbor admin hanya menampilkan UI statis dan *roadmap*.
  - *Target Database Model*: Perlu tabel baru untuk `Product`, `Category`, dll.

### 2. Halaman Beranda Utama (`/`)
- *Status*: **Selesai Sebagian (Mayoritas Statis)**.
  - Bagian **Berita/News** sudah mengambil dari DB.
  - Namun, konten lain seperti **Hero**, **Portfolio Preview**, **About Preview**, dan **Slendro AI** masih *hardcoded* atau membaca dari `home.data.js`.

### 3. Halaman Tentang Kami (`/about`)
- *Status*: **Statis (Belum Terhubung DB)**. Seluruh teks (Cerita, Visi, Misi, Prinsip) masih membaca dari `about.data.js`.

### 4. Dasbor Utama Admin (`/admin`)
- *Status*: **Statis**. Angka-angka statistik (seperti "Modul Aktif: 5", "Total Pendapatan", dll) belum dihitung secara dinamis dari database dan masih berupa data tertulis di *file*.

---

> **Tugas Selanjutnya:**
> Untuk menjadikan sistem ini 100% dinamis, antrean pengembangan berikutnya adalah membangun fungsi CRUD di Admin untuk **Portofolio** (`/admin/portfolio`) dan membuat struktur DB lengkap untuk fitur **Dagang/Produk** (`/admin/dagang`).
