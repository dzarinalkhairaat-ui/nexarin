# PRD — Nexarin Tech Hub

## 1. Overview

### 1.1 Product Name

**Nexarin Tech Hub**

Brand utama:

**Nexarin by Rins**

Nexarin Tech Hub merupakan platform digital berbasis web yang menggabungkan:

1. Portal informasi teknologi.
2. Portal informasi AI.
3. Portal informasi digital.
4. Portal informasi gadget.
5. Portal informasi otomotif.
6. Tutorial dan artikel edukatif.
7. Review dan analisis produk/teknologi.
8. Rekomendasi produk melalui affiliate.
9. Shop produk digital buatan Nexarin.
10. Demo/trial produk selama 3 hari.
11. Customer dashboard.
12. Sistem distribusi dan update aplikasi digital.
13. Free resources seperti template dan source code.
14. Dashboard admin terpusat.
15. Workflow editorial otomatis menggunakan Gemini Spark dan Google Sheets.

Nexarin Tech Hub bukan hanya portal berita dan bukan hanya marketplace.

Platform ini dirancang sebagai **ekosistem digital** yang menghubungkan informasi, edukasi, rekomendasi produk, affiliate, dan produk digital buatan Nexarin.

---

## 2. Product Vision

Nexarin Tech Hub bertujuan menjadi platform teknologi yang:

* memberikan informasi yang bermanfaat;
* membantu pengguna memahami teknologi modern;
* memberikan edukasi mengenai AI dan perkembangan digital;
* menyediakan tutorial praktis;
* memberikan rekomendasi produk yang relevan;
* menyediakan produk digital siap pakai;
* memungkinkan pengguna mencoba produk sebelum membeli;
* memberikan pengalaman pembelian dan pengelolaan produk yang profesional;
* menyediakan update produk kepada pelanggan secara berkelanjutan.

Prinsip utama platform:

> **Informasi → Edukasi → Kepercayaan → Rekomendasi → Trial → Pembelian → Retensi**

---

# 3. Product Goals

## 3.1 Primary Goals

Sistem harus mampu:

* menarik traffic melalui konten berkualitas;
* menyediakan portal informasi yang mudah digunakan;
* mengotomatisasi proses pengumpulan dan pengolahan berita;
* mempertahankan kontrol editorial melalui review manual;
* menghasilkan traffic dari mesin pencari;
* menghasilkan pendapatan melalui affiliate;
* menghasilkan pendapatan melalui penjualan produk digital;
* menyediakan demo/trial sebelum pembelian;
* memberikan customer dashboard setelah pembelian;
* menyediakan update produk secara berkelanjutan;
* memiliki arsitektur yang mudah dikembangkan.

## 3.2 Secondary Goals

Platform juga harus dapat dikembangkan di masa depan untuk:

* newsletter;
* membership;
* produk SaaS;
* aplikasi mobile;
* layanan subscription;
* komunitas;
* kursus;
* layanan konsultasi;
* marketplace produk digital;
* integrasi pembayaran tambahan;
* sistem lisensi yang lebih kompleks.

---

# 4. Product Principles

Nexarin Tech Hub harus mengikuti prinsip berikut:

### 4.1 Professional

Website harus terlihat seperti produk teknologi profesional.

### 4.2 Human-Centered

Konten dan UI harus terasa dibuat untuk manusia, bukan sekadar hasil otomatisasi AI.

### 4.3 Not AI Slop

Website **tidak boleh terlihat seperti "AI slop"**.

Hindari:

* desain futuristik berlebihan;
* gradient berlebihan;
* glow berlebihan;
* penggunaan efek AI secara berlebihan;
* layout generik yang terasa dibuat otomatis;
* penggunaan icon dan elemen dekoratif yang tidak memiliki fungsi;
* animasi berlebihan;
* teks generik;
* konten otomatis tanpa editorial review.

AI digunakan sebagai alat bantu produktivitas, bukan sebagai identitas visual website.

### 4.4 Content First

Konten merupakan salah satu aset utama platform.

### 4.5 Product First

Produk Nexarin harus mendapatkan pengalaman penjualan dan delivery yang profesional.

### 4.6 Maintainable

Kode harus modular, mudah dipahami, dan mudah dikembangkan.

### 4.7 No Dead Files

Tidak boleh terdapat file atau folder yang dibuat tetapi tidak memiliki fungsi.

Setiap file dan folder harus memiliki tujuan yang jelas.

---

# 5. Target Users

## 5.1 Public Visitor

Pengunjung yang:

* membaca artikel;
* mencari informasi teknologi;
* mencari informasi AI;
* membaca tutorial;
* mencari rekomendasi produk;
* melihat produk Nexarin;
* mencoba demo;
* melihat free resources;
* menggunakan affiliate links.

Tidak wajib login untuk membaca konten publik.

---

## 5.2 Customer

Pengguna yang telah memiliki akun dan membeli produk Nexarin.

Customer dapat:

* melihat produk yang dimiliki;
* melihat detail lisensi;
* mengunduh produk;
* mengunduh versi terbaru;
* melihat changelog;
* melihat dokumentasi;
* melihat riwayat pembelian;
* menerima notifikasi update;
* mengelola profil.

---

## 5.3 Admin

Admin merupakan pengelola utama Nexarin Tech Hub.

Admin dapat:

* mengelola artikel;
* melakukan review artikel;
* publish artikel;
* menghapus draft;
* mengelola affiliate;
* mengelola produk;
* mengelola versi produk;
* mengelola demo;
* mengelola customer;
* melihat transaksi;
* mengelola update produk;
* melihat statistik;
* mengelola konfigurasi website.

---

# 6. High-Level Requirements

## 6.1 Accessibility

Platform harus:

* berjalan pada browser modern;
* responsive;
* mendukung desktop;
* mendukung tablet;
* mendukung mobile;
* memiliki navigasi yang jelas;
* memiliki semantic HTML;
* memiliki keyboard accessibility dasar;
* memiliki kontras warna yang baik.

---

## 6.2 Authentication

Sistem harus menyediakan:

* login;
* logout;
* register customer;
* password reset;
* session management;
* protected routes;
* role-based access.

Authentication menggunakan **Supabase Auth**.

---

# 7. Main Website Structure

Halaman publik minimal:

text
/
├── Home
├── News
├── AI
├── Technology
├── Digital
├── Gadget
├── Automotive
├── Tutorials
├── Reviews
├── Tools
├── Free Resources
├── Shop
├── About
├── Contact
├── Search
├── Login
└── Register


---

# 8. Home Page

Homepage harus menjadi pusat navigasi Nexarin Tech Hub.

Komponen utama:

1. Header/Navbar.
2. Hero section.
3. Featured article.
4. Latest articles.
5. Category navigation.
6. AI section.
7. Technology section.
8. Digital section.
9. Gadget section.
10. Automotive section.
11. Tutorial section.
12. Recommended tools.
13. Affiliate recommendations.
14. Nexarin products.
15. Free resources.
16. Newsletter.
17. Footer.

Homepage tidak boleh terlalu penuh.

Prioritas utama:

**Konten → Navigasi → Produk → Conversion**

---

# 9. Portal Informasi

Portal informasi merupakan salah satu fitur utama Nexarin Tech Hub.

Kategori utama:

* AI
* Technology
* Digital
* Gadget
* Automotive

Kategori dapat diperluas di masa depan.

---

# 10. Content Types

Sistem harus mendukung beberapa jenis konten:

### 10.1 News

Berita dan perkembangan terbaru.

### 10.2 Analysis

Analisis terhadap suatu berita atau perkembangan teknologi.

### 10.3 Opinion

Pandangan editorial terhadap suatu topik.

### 10.4 Tutorial

Konten edukatif step-by-step.

### 10.5 Review

Review produk, aplikasi, teknologi atau layanan.

### 10.6 Explainer

Artikel yang menjelaskan konsep secara sederhana.

Contoh:

* Bagaimana AI bekerja?
* Bagaimana LLM dibuat?
* Apa itu machine learning?
* Bagaimana chatbot AI memproses pertanyaan?
* Bagaimana aplikasi mobile dibuat?

### 10.7 Evergreen Content

Konten yang tetap relevan dalam jangka panjang.

---

# 11. Editorial Philosophy

AI boleh membantu proses produksi konten, tetapi hasil akhir harus memiliki kualitas editorial.

Konten harus:

* mudah dibaca;
* informatif;
* tidak bertele-tele;
* memiliki struktur yang jelas;
* menggunakan bahasa natural;
* memiliki konteks;
* tidak sekadar menerjemahkan artikel sumber;
* tidak melakukan copy-paste;
* memiliki nilai tambah;
* memiliki sumber yang jelas jika diperlukan.

Konten harus melalui review admin sebelum dipublikasikan.

---

# 12. Gemini Spark Editorial Workflow

## 12.1 Role Gemini Spark

**Gemini Spark** merupakan workflow AI yang digunakan untuk mengotomatisasi pipeline pengumpulan dan pengolahan informasi portal.

Gemini Spark bukan bagian dari UI publik.

Gemini Spark bekerja sebagai **automated editorial assistant**.

---

## 12.2 Gemini Spark Responsibilities

Gemini Spark menangani proses:

1. Mengambil/mengumpulkan informasi dari sumber yang telah ditentukan.
2. Melakukan scraping atau pengambilan data sesuai workflow.
3. Menganalisis informasi.
4. Mengidentifikasi topik.
5. Mengklasifikasikan kategori.
6. Membuat ringkasan.
7. Membuat draft artikel.
8. Membuat judul.
9. Membuat subjudul.
10. Membuat meta description.
11. Membuat slug.
12. Membuat tags.
13. Menghasilkan opini/analisis awal.
14. Menghasilkan konteks tambahan.
15. Menghasilkan ide artikel lanjutan.
16. Memberikan rekomendasi internal linking.
17. Memberikan rekomendasi produk yang relevan.
18. Memberikan rekomendasi affiliate yang relevan.
19. Menyimpan hasil ke Google Sheets.

Gemini Spark **tidak langsung melakukan publish ke website**.

---

# 13. AI Content Pipeline

Alur utama:

text
Source Websites
      ↓
Gemini Spark
      ↓
Scraping / Information Collection
      ↓
Content Analysis
      ↓
Summary
      ↓
Article Draft
      ↓
Opinion / Analysis
      ↓
SEO Metadata
      ↓
Category & Tags
      ↓
Product / Affiliate Recommendation
      ↓
Google Sheets
      ↓
Nexarin Admin Dashboard
      ↓
Manual Review
      ↓
┌───────────────┐
│               │
DELETE        PUBLISH
│               │
↓               ↓
Remove        Supabase
from Sheet      ↓
                ↓
          Public Portal


---

# 14. Google Sheets Staging

Google Sheets digunakan sebagai **staging layer**, bukan database utama.

Google Sheets digunakan untuk:

* menampung hasil Gemini Spark;
* melakukan sinkronisasi data;
* menyimpan status draft;
* menyimpan data sebelum publish;
* menjadi tempat intermediate workflow.

Database utama website tetap **Supabase**.

---

# 15. Content Status

Minimal status artikel:

text
draft
published


### Draft

Artikel telah dihasilkan Gemini Spark tetapi belum disetujui admin.

Artikel draft:

* tidak tampil di public portal;
* tidak dapat diakses sebagai artikel publik;
* masih dapat direview;
* masih dapat diedit;
* dapat dihapus.

### Published

Artikel telah disetujui admin.

Artikel:

* masuk ke Supabase;
* tampil di portal publik;
* dapat ditemukan melalui kategori;
* dapat muncul pada homepage;
* dapat di-index search engine sesuai aturan SEO.

---

# 16. Admin Content Review Workflow

### Step 1

Gemini Spark menghasilkan konten.

### Step 2

Konten masuk Google Sheets dengan status:

text
draft


### Step 3

Dashboard admin membaca data tersebut.

### Step 4

Admin membuka artikel.

### Step 5

Admin melakukan review manual.

Admin dapat:

* membaca draft;
* mengedit konten;
* mengubah judul;
* mengubah kategori;
* mengubah tags;
* mengubah metadata;
* menambahkan internal links;
* menambahkan affiliate link;
* menyimpan perubahan.

### Step 6 — Delete

Jika admin menekan **Delete**:

* artikel dihapus dari dashboard;
* data draft dihapus dari Google Sheets;
* artikel tidak masuk Supabase;
* artikel tidak muncul di portal publik.

### Step 7 — Publish

Jika admin menekan **Publish**:

* status artikel di dashboard berubah menjadi `published`;
* status Google Sheets diperbarui menjadi `published`;
* artikel disimpan ke Supabase;
* artikel mulai tersedia di portal publik.

---

# 17. Content Sync Rules

Sistem harus mencegah duplikasi artikel.

Setiap artikel hasil workflow harus memiliki unique identifier, misalnya:

text
source_id


atau identifier internal yang setara.

Sistem harus melakukan validasi sebelum memasukkan artikel ke Supabase.

Artikel yang sudah published tidak boleh dibuat menjadi duplicate hanya karena workflow Gemini Spark berjalan kembali.

---

# 18. Affiliate System

Affiliate merupakan sumber monetisasi tambahan.

Affiliate tidak sepenuhnya otomatis.

Gemini Spark hanya memberikan:

* produk yang mungkin relevan;
* nama produk;
* sumber URL;
* alasan rekomendasi;
* artikel yang relevan.

Admin tetap melakukan final selection.

---

# 19. Affiliate Workflow

text
Gemini Spark
      ↓
Rekomendasi Produk
      ↓
Google Sheets
      ↓
Admin Dashboard
      ↓
Admin memilih produk
      ↓
Admin membuka marketplace
      ↓
Admin membuat/mendapatkan Affiliate URL
      ↓
Admin memasukkan Affiliate URL
      ↓
Admin memilih artikel
      ↓
Affiliate Link disimpan
      ↓
Link tampil pada artikel


Affiliate dapat berasal dari marketplace atau platform affiliate yang digunakan Nexarin.

Contoh marketplace yang dapat digunakan:

* Shopee
* TikTok Shop
* Tokopedia
* platform affiliate lain di masa depan

URL affiliate harus dimasukkan oleh admin.

Sistem tidak boleh menganggap URL biasa sebagai affiliate URL secara otomatis.

---

# 20. Affiliate Management Dashboard

Admin dapat:

* membuat affiliate link;
* mengedit affiliate link;
* menghapus affiliate link;
* memilih artikel terkait;
* memilih posisi link;
* memberikan label rekomendasi;
* mengaktifkan/nonaktifkan link;
* melihat click count jika tracking tersedia.

---

# 21. Shop

Shop merupakan modul terpisah dari portal informasi.

Shop digunakan untuk menjual produk digital milik Nexarin.

Contoh produk:

* Dashboard Admin;
* Sistem Absensi Sekolah;
* Sistem Manajemen Guru;
* Sistem Manajemen Murid;
* Template Dashboard;
* Source Code;
* Starter Kit;
* Aplikasi desktop;
* Aplikasi mobile;
* Produk digital lain.

---

# 22. Product Page

Setiap produk harus memiliki halaman detail.

Minimal informasi:

* product name;
* tagline;
* description;
* screenshots;
* video/demo jika tersedia;
* features;
* requirements;
* supported platform;
* version;
* changelog;
* documentation;
* pricing;
* license type;
* trial information;
* FAQ;
* CTA.

CTA minimal:

text
Coba Demo Gratis
Beli Sekarang


---

# 23. Three-Day Trial

Produk tertentu dapat menyediakan trial selama **3 hari**.

Trial dimulai ketika user mengaktifkan demo.

Durasi:

text
3 x 24 jam


Setelah masa trial berakhir:

* akses trial dinonaktifkan;
* user dapat membeli produk;
* data trial dapat dipertahankan sesuai kebijakan produk;
* user tidak boleh mendapatkan akses premium tanpa pembelian.

Sistem harus mencatat:

* trial start;
* trial expiry;
* user;
* product;
* trial status.

---

# 24. Customer Account

Untuk membeli produk digital, user harus memiliki akun.

Customer account digunakan untuk:

* pembelian;
* lisensi;
* download;
* update;
* changelog;
* dokumentasi;
* riwayat transaksi;
* notifikasi.

---

# 25. Customer Dashboard

Route contoh:

text
/customer


Struktur dashboard:

text
Customer Dashboard
├── Overview
├── My Products
├── Downloads
├── Updates
├── Orders
├── Licenses
├── Documentation
├── Notifications
├── Profile
└── Support


---

# 26. My Products

Customer dapat melihat semua produk yang telah dibeli.

Contoh:

text
Customer A

Purchased Products:
- Product A
- Product B
- Product C


Setiap produk menampilkan:

* nama;
* versi terbaru;
* versi yang dimiliki;
* status lisensi;
* tanggal pembelian;
* tombol download;
* changelog;
* dokumentasi.

---

# 27. Product Update System

Setiap produk memiliki versioning.

Contoh:

text
Product A

v1.0.0
v1.1.0
v1.2.0
v2.0.0


Ketika admin mengupload versi baru:

1. Versi baru disimpan.
2. Produk publik menggunakan versi terbaru.
3. Customer yang memiliki produk tersebut melihat update.
4. Update muncul pada Customer Dashboard.
5. Customer dapat mengunduh versi terbaru.

---

# 28. Customer Update Example

Jika Customer A membeli:

text
Product A
Product B
Product C


Kemudian:

text
Product A → v2.0.0
Product B → v1.5.0
Product C → tidak ada update


Dashboard customer harus menampilkan:

text
Available Updates

Product A
Version 2.0.0
[Download Update]

Product B
Version 1.5.0
[Download Update]


Product C tidak perlu muncul pada daftar update.

---

# 29. Lifetime License

Produk tertentu dapat memiliki lisensi:

text
Lifetime


Lifetime berarti customer memperoleh:

* hak menggunakan produk sesuai ketentuan lisensi;
* akses ke versi yang termasuk dalam kebijakan lifetime;
* update produk selama produk tersebut masih didukung;
* akses download melalui customer dashboard.

Lifetime tidak boleh ditafsirkan sebagai jaminan dukungan tanpa batas waktu untuk seluruh produk/layanan di masa depan.

Detail lisensi final harus mengikuti License Agreement.

---

# 30. Digital Product Delivery

Setelah pembayaran berhasil:

1. Payment dikonfirmasi.
2. Order berubah menjadi paid.
3. License dibuat.
4. Product diberikan ke customer.
5. Produk muncul di Customer Dashboard.
6. Download tersedia.
7. Email konfirmasi dikirim jika email notification aktif.

File download harus menggunakan mekanisme aman.

Direct permanent public URL untuk file premium tidak diperbolehkan.

---

# 31. Payment

Payment gateway yang direncanakan:

**Mayar**

Integrasi payment gateway dibuat modular sehingga dapat diganti atau ditambah di masa depan.

Status payment minimal:

text
pending
paid
failed
expired
cancelled
refunded


Payment gateway tidak boleh dianggap sebagai source of truth tunggal.

Order di database harus memiliki status internal.

---

# 32. Order Workflow

text
Customer
   ↓
Product Page
   ↓
Buy
   ↓
Login/Register
   ↓
Checkout
   ↓
Payment Gateway
   ↓
Payment Confirmation
   ↓
Webhook / Verification
   ↓
Order = Paid
   ↓
License Creation
   ↓
Product Access
   ↓
Customer Dashboard


Payment success harus diverifikasi secara server-side.

Client tidak boleh menentukan sendiri bahwa transaksi berhasil.

---

# 33. License System

Setiap pembelian produk digital harus dapat memiliki license record.

Minimal informasi:

text
license_id
user_id
product_id
order_id
license_type
status
issued_at
expires_at
created_at
updated_at


License type dapat berupa:

text
trial
lifetime
subscription


Subscription dapat ditambahkan pada masa depan.

---

# 34. Refund

Sistem harus menyediakan struktur yang memungkinkan refund.

Status:

text
refund_requested
refund_review
refunded
refund_rejected


Aturan refund final dapat disesuaikan dengan:

* jenis produk;
* jenis lisensi;
* payment provider;
* hukum/peraturan yang berlaku;
* kebijakan Nexarin.

PRD tidak mengunci nominal atau periode refund tertentu sampai kebijakan final ditetapkan.

---

# 35. Free Resources

Nexarin Tech Hub menyediakan resource gratis untuk menarik pengguna.

Contoh:

* HTML templates;
* dashboard templates;
* UI components;
* source code;
* starter project;
* snippets;
* ebook;
* tutorial resources.

Free resources harus memiliki halaman download yang jelas.

Resource gratis dapat digunakan sebagai traffic acquisition dan lead generation.

---

# 36. Admin Dashboard

Admin Dashboard menjadi pusat pengelolaan platform.

Struktur konseptual:

text
Admin Dashboard
├── Overview
├── Content
│   ├── Articles
│   ├── Drafts
│   ├── Published
│   └── Categories
├── Gemini / Content Sync
├── Affiliate
├── Shop
│   ├── Products
│   ├── Versions
│   ├── Licenses
│   ├── Orders
│   └── Downloads
├── Customers
├── Analytics
├── Notifications
├── Settings
└── Audit Logs


---

# 37. Admin Content Dashboard

Admin harus dapat:

* melihat draft;
* melihat source;
* mengedit artikel;
* mengedit metadata;
* melihat status;
* publish;
* delete;
* filter;
* search;
* sort;
* melihat tanggal;
* melihat kategori.

---

# 38. Admin Shop Dashboard

Admin dapat:

* create product;
* edit product;
* archive product;
* publish product;
* mengatur harga;
* mengatur trial;
* mengatur license;
* mengupload product version;
* mengupload changelog;
* mengatur documentation;
* melihat customers;
* melihat orders;
* melihat downloads.

---

# 39. Product Version Workflow

text
Create Product
      ↓
Create Version
      ↓
Upload Build
      ↓
Add Changelog
      ↓
Validate
      ↓
Publish Version
      ↓
Current Version Updated
      ↓
Customer Updates Available


---

# 40. Analytics

Analytics harus mendukung pengukuran:

### Portal

* page views;
* article views;
* category views;
* search queries;
* traffic source;
* popular articles.

### Affiliate

* affiliate clicks;
* CTR;
* article conversion.

### Shop

* product views;
* demo starts;
* trial conversion;
* checkout starts;
* successful purchases;
* product downloads.

### Customer

* active customers;
* product ownership;
* update downloads.

Analytics implementation harus menjaga privasi pengguna dan tidak mengumpulkan data yang tidak diperlukan.

---

# 41. SEO

Portal informasi harus SEO-friendly.

Sistem harus mendukung:

* dynamic metadata;
* title;
* description;
* canonical URL;
* Open Graph;
* Twitter/X card;
* sitemap;
* robots.txt;
* structured data;
* article schema;
* breadcrumb schema;
* organization schema;
* product schema untuk produk yang sesuai;
* semantic HTML.

Setiap artikel harus memiliki:

* SEO title;
* meta description;
* slug;
* category;
* tags;
* featured image;
* canonical URL.

---

# 42. Search

Website harus memiliki pencarian internal.

Search dapat mencari:

* artikel;
* tutorial;
* review;
* tools;
* produk;
* resources.

Search harus menyediakan:

* keyword search;
* filter kategori;
* filter content type;
* pagination atau infinite loading yang terkontrol.

---

# 43. Technical Stack

Technology stack yang telah disepakati:

### Frontend

text
Next.js
TypeScript
React


Menggunakan:

text
Next.js App Router


### Styling

text
Tailwind CSS
shadcn/ui


### Animation

text
Framer Motion


### Icons

text
Lucide React


### Backend

Backend menggunakan ekosistem Next.js.

Tidak membuat frontend dan backend sebagai dua project terpisah pada MVP.

API dapat ditempatkan di:

text
app/api


dan business logic dipisahkan ke service layer.

### Database

text
Supabase PostgreSQL


### Authentication

text
Supabase Auth


### Staging Content

text
Google Sheets


### AI Workflow

text
Gemini Spark


### ORM / Database Access

Jika digunakan, ORM dapat menggunakan Prisma dengan Supabase PostgreSQL.

Namun repository layer harus dibuat modular agar akses database tidak tersebar di seluruh UI.

---

# 44. AI API Constraint

Untuk workflow editorial yang telah disepakati:

**Jangan membuat integrasi AI API tambahan sebagai pengganti Gemini Spark.**

Gemini Spark merupakan workflow AI eksternal yang menangani:

text
Scraping
Analysis
Content Generation
Recommendation
Google Sheets Output


Next.js hanya menangani:

text
Google Sheets
→ Admin Dashboard
→ Review
→ Supabase
→ Public Website


---

# 45. Application Architecture

Arsitektur high-level:

text
                     ┌──────────────────┐
                     │   Source Sites   │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   Gemini Spark   │
                     │ Editorial Engine │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   Google Sheets  │
                     │     Staging      │
                     └────────┬─────────┘
                              │
                              ▼
┌───────────────┐     ┌──────────────────┐
│ Admin Browser │────▶│ Next.js Backend  │
└───────────────┘     └────────┬─────────┘
                               │
                     Review / Edit / Publish
                               │
                               ▼
                       ┌──────────────┐
                       │   Supabase   │
                       │ PostgreSQL   │
                       └──────┬───────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │ Public Portal   │       │ Customer / Shop │
        └─────────────────┘       └─────────────────┘


---

# 46. Frontend Architecture

Next.js App Router digunakan sebagai routing utama.

Frontend tidak boleh memiliki business logic kompleks langsung di component.

Component harus bertanggung jawab terhadap:

* rendering;
* user interaction;
* presentation.

Business logic harus berada di:

text
services/
lib/
features/


sesuai kebutuhan.

---

# 47. Folder Structure

Struktur folder harus modular dan feature-based.

Contoh struktur yang menjadi acuan:

text
nexarin-tech-hub/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── news/
│   │   ├── ai/
│   │   ├── technology/
│   │   ├── digital/
│   │   ├── gadget/
│   │   ├── automotive/
│   │   ├── tutorials/
│   │   ├── reviews/
│   │   ├── tools/
│   │   ├── resources/
│   │   ├── shop/
│   │   └── search/
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── customer/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── downloads/
│   │   ├── updates/
│   │   ├── orders/
│   │   ├── licenses/
│   │   ├── notifications/
│   │   ├── profile/
│   │   └── support/
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── content/
│   │   ├── affiliate/
│   │   ├── shop/
│   │   ├── customers/
│   │   ├── analytics/
│   │   ├── notifications/
│   │   ├── settings/
│   │   └── audit-logs/
│   │
│   ├── api/
│   │   ├── content/
│   │   ├── sheets/
│   │   ├── affiliate/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── licenses/
│   │   ├── downloads/
│   │   ├── payments/
│   │   └── notifications/
│   │
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── globals.css
│
├── features/
│   ├── portal/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── content/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── affiliate/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── shop/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── customer/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── admin/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── auth/
│       ├── components/
│       ├── services/
│       └── types/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── feedback/
│   ├── forms/
│   └── common/
│
├── lib/
│   ├── supabase/
│   ├── google-sheets/
│   ├── auth/
│   ├── payments/
│   ├── storage/
│   ├── security/
│   ├── seo/
│   └── validation/
│
├── services/
│   ├── content.service.ts
│   ├── product.service.ts
│   ├── order.service.ts
│   ├── license.service.ts
│   ├── affiliate.service.ts
│   └── notification.service.ts
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-products.ts
│   ├── use-orders.ts
│   └── use-notifications.ts
│
├── types/
│   ├── content.ts
│   ├── product.ts
│   ├── order.ts
│   ├── license.ts
│   ├── affiliate.ts
│   └── user.ts
│
├── utils/
│   ├── format.ts
│   ├── slug.ts
│   └── constants.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── assets/
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── components.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md


Struktur tersebut merupakan **contoh arsitektur yang harus diikuti**, bukan alasan untuk membuat semua folder tersebut apabila belum diperlukan.

---

# 48. No Empty Folder Rule

Jangan membuat folder hanya karena folder tersebut tercantum pada contoh.

Jika sebuah folder belum memiliki kebutuhan nyata:

* jangan dibuat;
* atau buat ketika fitur mulai dikembangkan.

Tidak boleh terdapat:

text
folder kosong
file kosong
component placeholder tanpa fungsi
service kosong
utility kosong


Setiap file harus memiliki fungsi yang jelas.

---

# 49. Component Rules

Component harus:

* single responsibility;
* reusable jika memang diperlukan;
* tidak terlalu besar;
* tidak berisi business logic kompleks;
* memiliki naming yang jelas.

Contoh:

text
ArticleCard.tsx
ProductCard.tsx
AffiliateCard.tsx
DownloadButton.tsx
UpdateCard.tsx


Hindari membuat component:

text
Everything.tsx
MainComponent.tsx
HugeDashboard.tsx


yang menampung terlalu banyak tanggung jawab.

---

# 50. UI Design Philosophy

Nama design language:

**Nexarin Design Language**

Prinsip:

* modern;
* professional;
* clean;
* minimal;
* content-focused;
* brand-first;
* timeless;
* readable;
* responsive;
* accessible;
* subtle motion.

Desain tidak boleh terlihat seperti template AI generik.

---

# 51. Brand Identity

Logo utama:

**Nexarin by Rins**

Portal:

**Nexarin Tech Hub**

Palet warna harus mengikuti identitas visual logo Nexarin.

Warna brand utama yang digunakan sebagai baseline:

| Nama         | HEX       | Fungsi           |
| ------------ | --------- | ---------------- |
| Nexarin Cyan | `#2DD4F5` | Primary          |
| Nexarin Mint | `#7CF2C3` | Secondary Accent |
| Deep Navy    | `#0F172A` | Dark Background  |
| Slate        | `#334155` | Secondary Text   |
| Soft Slate   | `#64748B` | Muted Text       |
| Cloud        | `#F8FAFC` | Light Background |
| White        | `#FFFFFF` | Surface          |
| Border       | `#E2E8F0` | Border           |
| Dark Border  | `#1E293B` | Dark Border      |

Warna brand tidak boleh digunakan secara berlebihan.

---

# 52. Color Usage

### Primary

`#2DD4F5`

Digunakan untuk:

* primary CTA;
* active navigation;
* links;
* important interaction.

### Secondary

`#7CF2C3`

Digunakan untuk:

* accent;
* highlights;
* badges;
* success-related visual accent jika sesuai.

### Dark

`#0F172A`

Digunakan untuk:

* dark mode background;
* footer;
* dark surfaces.

### Neutral

Neutral colors digunakan untuk:

* body;
* card;
* borders;
* secondary text.

---

# 53. Light Mode

Light mode harus menjadi mode utama untuk portal informasi.

Karakter:

* clean white;
* soft gray;
* cyan/mint accent;
* high readability.

---

# 54. Dark Mode

Dark mode harus tersedia.

Karakter:

* deep navy;
* slate;
* cyan/mint accent;
* bukan pure black.

Dark mode tidak boleh menggunakan glow atau neon berlebihan.

---

# 55. Typography

Typography utama:

### Primary Sans

**Geist**

Digunakan untuk:

* heading;
* navigation;
* body;
* UI.

### Mono

**JetBrains Mono**

Digunakan untuk:

* code;
* technical data;
* version;
* SKU;
* license key;
* technical metadata.

Fallback:

text
ui-monospace, monospace


Serif hanya digunakan jika benar-benar diperlukan untuk editorial emphasis.

---

# 56. Typography Rules

Heading:

* jelas;
* tidak terlalu besar;
* tidak terlalu berat;
* memiliki hierarchy yang konsisten.

Body:

* nyaman dibaca;
* line-height memadai;
* tidak terlalu kecil.

Article content harus mengutamakan readability.

---

# 57. Border Radius

Gunakan radius yang modern tetapi tidak berlebihan.

Contoh:

text
sm  → 6px
md  → 8px
lg  → 12px
xl  → 16px
2xl → 20px


Card utama umumnya menggunakan:

text
12px - 16px


Hindari seluruh elemen menjadi terlalu rounded/pill.

---

# 58. Shadows

Shadow harus subtle.

Gunakan shadow untuk:

* card elevated;
* dropdown;
* modal;
* popover.

Jangan menggunakan:

* heavy glow;
* neon shadow;
* excessive blur.

---

# 59. Animation & Motion

Animasi diperbolehkan tetapi harus fungsional.

### Page Transition

Durasi:

text
150ms - 250ms


### Hover

Durasi:

text
150ms - 200ms


### Modal

Gunakan:

text
fade + slight scale


### Dropdown

Gunakan:

text
fade + translate


### Skeleton

Gunakan shimmer yang subtle.

### Card Hover

Dapat menggunakan:

text
translateY(-2px)


atau perubahan shadow ringan.

Tidak boleh menggunakan animasi yang mengganggu pembacaan.

---

# 60. Browser Native Popup Rule

Dilarang menggunakan browser native UI seperti:

javascript
alert()
confirm()
prompt()


untuk feedback aplikasi.

Sebagai gantinya gunakan custom UI Nexarin.

---

# 61. Feedback Components

Sistem harus memiliki:

### Success Toast

Contoh:

text
Artikel berhasil dipublikasikan.


### Error Toast

text
Terjadi kesalahan. Silakan coba kembali.


### Warning

text
Perubahan belum disimpan.


### Info

text
Versi baru tersedia.


### Confirmation Modal

Digunakan untuk tindakan penting:

* delete;
* publish;
* archive;
* refund;
* revoke access.

---

# 62. Loading States

Semua proses async harus memiliki state:

text
idle
loading
success
error


Gunakan:

* skeleton;
* spinner;
* disabled state;
* progress indicator.

Tidak boleh membuat user bertanya-tanya apakah sistem sedang bekerja.

---

# 63. Empty States

Setiap halaman data harus memiliki empty state.

Contoh:

text
Belum ada produk.


atau:

text
Belum ada update untuk produk Anda.


Empty state harus informatif dan memiliki CTA jika diperlukan.

---

# 64. Error Pages

Minimal:

text
404
500


Halaman error harus mengikuti Nexarin Design Language.

---

# 65. Responsive Design

Breakpoints harus mengikuti kebutuhan konten, bukan sekadar device.

Target:

* mobile;
* tablet;
* laptop;
* desktop;
* large desktop.

Navigation mobile harus memiliki menu yang jelas.

Dashboard harus tetap usable pada layar kecil.

---

# 66. Database Architecture

Supabase PostgreSQL merupakan database produksi utama.

Google Sheets bukan database produksi.

---

# 67. Core Database Entities

Minimal entity:

text
users
profiles
roles
articles
article_categories
article_tags
article_tag_relations
affiliate_links
affiliate_article_relations
products
product_versions
product_files
product_features
product_documents
product_trials
orders
order_items
payments
licenses
downloads
notifications
audit_logs


---

# 68. Articles Table

Contoh field:

text
id
source_id
title
slug
excerpt
content
category_id
featured_image
meta_title
meta_description
status
author_type
published_at
created_at
updated_at


Status:

text
draft
published


---

# 69. Products Table

Contoh:

text
id
name
slug
short_description
description
price
currency
license_type
trial_enabled
trial_duration
status
current_version_id
created_at
updated_at


---

# 70. Product Versions

Contoh:

text
id
product_id
version
release_notes
download_path
file_size
published_at
created_at


Version harus unik berdasarkan product.

---

# 71. Orders

Contoh:

text
id
user_id
order_number
status
subtotal
discount
total
currency
payment_provider
payment_reference
paid_at
created_at
updated_at


---

# 72. Licenses

Contoh:

text
id
user_id
product_id
order_id
license_key
license_type
status
issued_at
expires_at
created_at
updated_at


License key harus disimpan dengan aman.

---

# 73. Downloads

Contoh:

text
id
user_id
product_id
version_id
download_token
downloaded_at
expires_at
ip_hash
user_agent


Download URL premium sebaiknya memiliki expiration.

---

# 74. Notifications

Contoh:

text
id
user_id
type
title
message
read_at
created_at


Notification digunakan untuk:

* product update;
* order status;
* payment;
* system information.

---

# 75. Audit Logs

Admin action harus dapat dicatat.

Contoh:

text
id
admin_id
action
entity_type
entity_id
metadata
created_at


Action:

text
publish_article
delete_draft
create_product
update_product
publish_version
refund_order
update_affiliate


---

# 76. Security Requirements

Sistem wajib:

* menggunakan HTTPS pada production;
* menggunakan secure authentication;
* melakukan server-side authorization;
* melakukan validation;
* melakukan sanitization;
* mencegah unauthorized access;
* menggunakan protected admin routes;
* tidak mengekspos secret key ke client;
* tidak menyimpan password plaintext;
* menggunakan environment variables;
* membatasi akses file premium.

---

# 77. Admin Authorization

User tidak boleh mengakses:

text
/admin/*


tanpa role admin.

Authorization harus dilakukan di server.

Frontend hiding bukan merupakan security mechanism.

---

# 78. Environment Variables

Secret harus disimpan melalui environment variables.

Contoh:

text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

GOOGLE_SHEETS_ID
GOOGLE_SERVICE_ACCOUNT_KEY

PAYMENT_PROVIDER_SECRET

STORAGE_SECRET


Nama environment variable dapat disesuaikan dengan implementasi.

`.env` tidak boleh di-commit.

`.env.example` harus tersedia tanpa secret asli.

---

# 79. API Architecture

API route harus modular.

Contoh:

text
/api/content
/api/content/[id]
/api/content/publish
/api/content/delete

/api/products
/api/products/[id]
/api/products/[id]/versions

/api/orders
/api/payments
/api/licenses
/api/downloads

/api/affiliate
/api/affiliate/[id]

/api/sheets/sync
/api/sheets/articles


API response harus konsisten.

Contoh:

json
{
  "success": true,
  "data": {}
}


Error:

json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data tidak valid."
  }
}


---

# 80. Validation

Input harus divalidasi pada server.

Contoh:

* email;
* price;
* slug;
* product ID;
* article ID;
* affiliate URL;
* file upload;
* payment status.

Client-side validation hanya untuk UX.

Server-side validation tetap wajib.

---

# 81. File Upload

File aplikasi premium harus disimpan pada storage privat.

Tidak boleh:

text
/public/products/premium-app.zip


karena file dapat diakses tanpa authorization.

Gunakan private storage dan signed URL atau mekanisme aman setara.

---

# 82. Shop Product Delivery Security

Customer hanya dapat mengunduh produk jika:

text
authenticated
+
owns_product
+
license_active


Download harus divalidasi di server.

---

# 83. Performance

Target:

* fast initial load;
* optimized images;
* lazy loading;
* code splitting;
* caching jika sesuai;
* server rendering untuk konten yang sesuai;
* minimal JavaScript pada halaman publik.

Portal informasi harus mengutamakan performa dan SEO.

---

# 84. Image Optimization

Gunakan image optimization Next.js.

Gambar artikel harus:

* memiliki alt text;
* memiliki ukuran yang sesuai;
* dikompresi;
* tidak mengirim resolusi berlebihan.

---

# 85. Accessibility

Target minimum:

* semantic HTML;
* keyboard navigation;
* focus state;
* accessible labels;
* sufficient contrast;
* reduced motion support.

Jika user mengaktifkan `prefers-reduced-motion`, animasi harus dikurangi.

---

# 86. Content Copyright & Scraping Policy

Gemini Spark hanya boleh digunakan untuk workflow sumber yang secara teknis dan kebijakan dapat diakses.

Sistem harus:

* menyimpan source URL;
* menyimpan source name;
* mencatat waktu pengambilan;
* tidak melakukan copy-paste artikel sumber;
* tidak mempublikasikan ulang konten berhak cipta secara utuh;
* menghasilkan konten transformasi/orisinal;
* memberikan attribution jika diperlukan;
* menghormati terms, robots, lisensi, dan kebijakan sumber yang berlaku.

Nexarin Tech Hub harus memberikan nilai tambah melalui analisis, konteks, edukasi, dan editorial review.

---

# 87. Content Quality Control

Artikel tidak boleh otomatis langsung public.

Default workflow:

text
Generated
↓
Draft
↓
Manual Review
↓
Approved
↓
Published


Admin adalah final authority sebelum artikel dipublikasikan.

---

# 88. Admin Editorial Controls

Admin dapat:

* edit;
* regenerate jika workflow mendukung;
* change category;
* change tags;
* change SEO;
* add affiliate;
* add internal links;
* publish;
* delete.

---

# 89. Customer Email

Email dapat digunakan untuk:

* order confirmation;
* payment confirmation;
* product available;
* product update;
* password reset;
* security notification.

Customer Dashboard tetap menjadi sumber utama akses produk.

Email bukan satu-satunya tempat download.

---

# 90. Product Update Notification

Ketika versi baru dipublikasikan:

text
Admin uploads version
        ↓
Version published
        ↓
Product current_version updated
        ↓
Find customers owning product
        ↓
Create notifications
        ↓
Customer Dashboard shows update
        ↓
Optional email notification


---

# 91. Shop Public Update

Jika produk memiliki versi terbaru:

Halaman publik produk harus menampilkan:

text
Latest Version
Release Date
What's New


---

# 92. Customer Update

Customer yang memiliki produk tersebut harus mendapatkan akses ke versi terbaru sesuai license.

Customer yang tidak memiliki produk tidak mendapatkan akses download premium.

---

# 93. Navigation

Header publik minimal:

text
Nexarin
AI
Technology
Digital
Gadget
Automotive
Tutorials
Shop


Navigation tambahan dapat berada pada dropdown/mega menu jika diperlukan.

CTA:

text
Shop


dan:

text
Login


---

# 94. Footer

Footer minimal:

text
Nexarin by Rins

Explore
- AI
- Technology
- Digital
- Gadget
- Automotive
- Tutorials
- Shop

Resources
- Free Resources
- Tools

Company
- About
- Contact

Legal
- Privacy Policy
- Terms
- License
- Refund Policy


---

# 95. Search Engine Content Strategy

Strategi konten harus menggabungkan:

### Trending

Berita terbaru.

### Evergreen

Artikel yang selalu dicari.

### Educational

Tutorial dan explainer.

### Commercial

Review dan rekomendasi.

### Product-led

Artikel yang secara natural berhubungan dengan produk Nexarin.

Contoh:

text
Artikel:
Cara Mengelola Absensi Sekolah Secara Digital

↓
Tutorial

↓
Rekomendasi:
Sistem Absensi Sekolah Nexarin

↓
Demo 3 Hari

↓
Purchase


---

# 96. Conversion Funnel

Funnel utama:

text
Search Engine
      ↓
Article
      ↓
Educational Value
      ↓
Relevant Recommendation
      ↓
Affiliate / Nexarin Product
      ↓
Product Page
      ↓
Demo
      ↓
3-Day Trial
      ↓
Purchase
      ↓
Customer Account
      ↓
Product Updates
      ↓
Retention


---

# 97. Trust Strategy

Nexarin Tech Hub harus membangun trust melalui:

* konten berkualitas;
* transparansi;
* sumber informasi;
* review manual;
* demo;
* dokumentasi;
* product screenshots;
* changelog;
* customer dashboard;
* update produk;
* support.

---

# 98. Free-to-Paid Strategy

Free content:

* artikel;
* tutorial;
* template;
* source code tertentu;
* resources.

Kemudian diarahkan secara natural ke:

* affiliate;
* demo;
* produk Nexarin.

Tidak boleh menggunakan dark pattern.

---

# 99. UX Rules

Tidak boleh:

* memaksa popup;
* spam notification;
* redirect tidak jelas;
* hidden CTA;
* deceptive pricing;
* fake countdown;
* fake scarcity;
* misleading button.

Semua CTA harus jelas.

---

# 100. Admin UX

Admin dashboard harus mengutamakan productivity.

Fitur:

* table;
* filter;
* search;
* bulk action jika aman;
* quick actions;
* confirmation;
* toast;
* keyboard-friendly interaction.

---

# 101. Customer UX

Customer dashboard harus sederhana.

Prioritas:

text
My Products
↓
Available Updates
↓
Download
↓
Documentation


Customer tidak boleh dipaksa mencari-cari file update.

---

# 102. Error Handling

Error harus:

* readable;
* actionable;
* tidak menampilkan stack trace kepada user;
* tidak menampilkan secret;
* memiliki fallback.

Admin dapat melihat detail error yang lebih teknis melalui log.

---

# 103. Logging

System harus memiliki logging untuk error penting.

Log tidak boleh menyimpan:

* password;
* secret;
* full payment credentials;
* sensitive authentication tokens.

---

# 104. Backup

Database production harus memiliki backup strategy.

Backup harus mencakup data penting:

* users;
* articles;
* products;
* orders;
* licenses;
* product versions;
* configuration penting.

---

# 105. Testing

Testing minimum:

### Unit Testing

Untuk:

* utility;
* validation;
* business rules.

### Integration Testing

Untuk:

* database;
* authentication;
* payment;
* product delivery;
* content publishing.

### E2E Testing

Untuk flow penting:

text
Login
Register
Read Article
Admin Review
Publish Article
Delete Draft
Create Product
Trial
Purchase
Customer Download
Product Update


---

# 106. Critical Acceptance Criteria

## Portal

* Artikel draft tidak muncul public.
* Artikel published muncul public.
* Delete draft menghapus data staging.
* Publish mengubah status staging dan menyimpan artikel ke Supabase.
* Artikel tidak duplicate.

## Shop

* Product dapat dibuat admin.
* Product dapat dipublish.
* Product dapat memiliki version.
* Customer dapat membeli.
* Customer dapat melihat product.
* Customer dapat download.

## Trial

* Trial berlangsung 3 hari.
* Trial expiry bekerja.
* Trial tidak memberikan unlimited access setelah expiry.

## Update

* Admin dapat upload version baru.
* Version terbaru menjadi current version.
* Customer pemilik produk melihat update.
* Customer dapat download update.

## Affiliate

* Admin dapat membuat affiliate link.
* Admin dapat menghubungkan affiliate dengan artikel.
* Affiliate tampil di artikel.

---

# 107. MVP Scope

MVP harus fokus pada fondasi inti.

### MVP Portal

* Homepage;
* categories;
* article listing;
* article detail;
* search;
* SEO;
* Gemini Spark → Google Sheets;
* admin content review;
* publish;
* delete;
* Supabase storage.

### MVP Shop

* product listing;
* product detail;
* login;
* customer account;
* trial 3 hari;
* checkout;
* order;
* license;
* download;
* customer dashboard;
* product update.

### MVP Affiliate

* affiliate management;
* affiliate URL;
* article association;
* public affiliate link.

### MVP Admin

* dashboard;
* content;
* shop;
* affiliate;
* customers;
* orders;
* product versions.

---

# 108. Post-MVP

Fitur yang dapat dikembangkan kemudian:

* newsletter;
* advanced analytics;
* advanced affiliate tracking;
* subscription;
* mobile application;
* community;
* comments;
* recommendation engine;
* advanced search;
* personalization;
* SaaS products;
* multi-admin;
* team management;
* advanced CRM.

---

# 109. Future Scalability

Arsitektur harus memungkinkan penambahan:

text
Web
↓
Mobile
↓
Desktop
↓
SaaS
↓
API
↓
Marketplace


Namun MVP tidak boleh dibuat terlalu kompleks hanya untuk mengantisipasi semua kemungkinan tersebut.

---

# 110. Development Rules

Developer/AI coding agent wajib:

1. Membaca PRD sebelum membuat kode.
2. Mengikuti struktur folder.
3. Tidak membuat file tanpa fungsi.
4. Tidak menaruh seluruh logic dalam satu file.
5. Tidak membuat duplicate component.
6. Menggunakan TypeScript.
7. Menggunakan reusable components.
8. Memisahkan UI dan business logic.
9. Memvalidasi input.
10. Menjaga security boundary.
11. Menulis error handling.
12. Memastikan responsive design.
13. Memastikan accessibility dasar.
14. Mengikuti Nexarin Design Language.

---

# 111. Code Quality

Kode harus:

* readable;
* maintainable;
* typed;
* modular;
* consistent;
* documented jika diperlukan.

Hindari:

* `any` tanpa alasan;
* giant components;
* duplicate logic;
* hardcoded secret;
* hardcoded database credentials;
* business logic di UI component;
* unnecessary dependencies.

---

# 112. Naming Convention

Component:

text
PascalCase


Contoh:

text
ArticleCard.tsx
ProductCard.tsx
CustomerUpdateCard.tsx


Function:

text
camelCase


Contoh:

text
getArticle()
publishArticle()
createLicense()


Database:

text
snake_case


Contoh:

text
product_versions
article_categories


---

# 113. Single Source of Truth

Data production website harus menggunakan:

**Supabase**

Google Sheets hanya digunakan sebagai:

**staging content workflow**

Gemini Spark hanya digunakan sebagai:

**automated editorial workflow**

Admin Dashboard digunakan sebagai:

**manual control layer**

Public website digunakan sebagai:

**presentation layer**

Customer Dashboard digunakan sebagai:

**product ownership and delivery layer**

---

# 114. Final System Responsibility

text
Gemini Spark
    ↓
Collect + Analyze + Generate
    ↓
Google Sheets
    ↓
Staging
    ↓
Next.js Admin
    ↓
Manual Review
    ↓
Supabase
    ↓
Public Portal / Shop / Customer


Tidak boleh melewati manual editorial review untuk artikel portal.

---

# 115. Final User Flows

## 115.1 Visitor Reads Article

text
Visitor
↓
Homepage
↓
Category
↓
Article
↓
Read
↓
Related Article
↓
Affiliate / Product Recommendation


---

## 115.2 Visitor Uses Affiliate

text
Visitor
↓
Article
↓
Recommended Product
↓
Affiliate Link
↓
External Marketplace


Nexarin tidak mengontrol checkout marketplace eksternal.

---

## 115.3 Visitor Tries Product

text
Visitor
↓
Shop
↓
Product
↓
Login/Register
↓
Start Trial
↓
3-Day Trial
↓
Trial Expired
↓
Purchase


---

## 115.4 Customer Buys Product

text
Customer
↓
Product Page
↓
Buy
↓
Checkout
↓
Payment
↓
Payment Verified
↓
Order Paid
↓
License Created
↓
Product Added
↓
Customer Dashboard
↓
Download


---

## 115.5 Product Update

text
Admin
↓
Upload New Version
↓
Add Changelog
↓
Publish Version
↓
Current Version Updated
↓
Customer Notification
↓
Customer Dashboard
↓
Download Update


---

## 115.6 Article Publishing

text
Gemini Spark
↓
Google Sheets
↓
Draft
↓
Admin Dashboard
↓
Manual Review
├── Delete → Remove from Sheets
│
└── Publish
       ↓
    Supabase
       ↓
    Public Portal


---

# 116. Admin Permissions

MVP dapat menggunakan single admin.

Admin memiliki full access:

text
Content
Shop
Affiliate
Customers
Orders
Licenses
Versions
Analytics
Settings
Audit Logs


Multi-admin dapat ditambahkan kemudian.

---

# 117. Legal Pages

Minimal public legal pages:

text
/privacy
/terms
/refund
/license
/copyright


Isi final harus disesuaikan dengan kebijakan Nexarin dan kebutuhan hukum yang berlaku.

---

# 118. Support

Customer harus memiliki jalur support.

Minimal:

text
Customer Dashboard
→ Support


Support dapat diarahkan ke:

* email;
* contact form;
* ticket system pada tahap berikutnya.

---

# 119. Notifications

Notification system minimal mendukung:

text
success
info
warning
error
product_update
order
payment
system


Notifikasi internal menggunakan UI Nexarin.

Email notification bersifat tambahan.

---

# 120. Design Component Inventory

Design system minimal menyediakan:

text
Button
IconButton
Input
Textarea
Select
Checkbox
Radio
Switch
Dropdown
Tabs
Modal
Dialog
Drawer
Toast
Alert
Badge
Tooltip
Card
Table
Pagination
Skeleton
Spinner
Avatar
Breadcrumb
Navbar
Sidebar
Footer
Search
ArticleCard
ProductCard
AffiliateCard
DownloadCard
UpdateCard
PricingCard


Komponen hanya dibuat ketika benar-benar digunakan.

---

# 121. Design Consistency

Portal, Shop, Customer Dashboard dan Admin Dashboard harus tetap menggunakan Nexarin Design Language.

Perbedaan utama:

### Public

Editorial dan content-focused.

### Shop

Conversion-focused.

### Customer

Utility-focused.

### Admin

Productivity-focused.

Namun semuanya harus terasa berasal dari brand yang sama.

---

# 122. Anti-AI-Slop Design Checklist

Sebelum sebuah halaman dianggap selesai, pastikan:

* tidak terlalu banyak gradient;
* tidak terlalu banyak glow;
* tidak menggunakan neon secara berlebihan;
* tidak memiliki animasi yang tidak diperlukan;
* typography readable;
* whitespace cukup;
* layout memiliki hierarchy;
* CTA jelas;
* warna brand digunakan secara terukur;
* tidak terasa seperti template AI generik.

---

# 123. SEO Content Quality Checklist

Sebelum publish artikel:

* [ ] Judul jelas.
* [ ] Artikel memiliki nilai informasi.
* [ ] Tidak copy-paste.
* [ ] Source tersedia jika diperlukan.
* [ ] Slug benar.
* [ ] Meta title tersedia.
* [ ] Meta description tersedia.
* [ ] Category benar.
* [ ] Tags benar.
* [ ] Featured image tersedia.
* [ ] Internal link relevan.
* [ ] Affiliate link jika memang relevan.
* [ ] Artikel telah direview manual.

---

# 124. Product Publishing Checklist

Sebelum produk dipublish:

* [ ] Nama produk.
* [ ] Deskripsi.
* [ ] Screenshot.
* [ ] Feature list.
* [ ] Requirements.
* [ ] Harga.
* [ ] License type.
* [ ] Trial setting.
* [ ] Documentation.
* [ ] Version.
* [ ] Build file.
* [ ] Changelog.
* [ ] Download configuration.
* [ ] Product status.

---

# 125. Product Update Checklist

Sebelum update dipublish:

* [ ] Version number.
* [ ] Build file.
* [ ] File validation.
* [ ] Changelog.
* [ ] Release notes.
* [ ] Compatibility.
* [ ] Download access.
* [ ] Customer notification.
* [ ] Current version updated.

---

# 126. Definition of Done

Sebuah fitur dianggap selesai apabila:

1. UI selesai.
2. Responsive.
3. Loading state tersedia.
4. Error state tersedia.
5. Empty state tersedia.
6. Validation tersedia.
7. Authorization tersedia jika diperlukan.
8. Database integration selesai.
9. Security diperiksa.
10. Tidak ada console error yang tidak ditangani.
11. Tidak ada dead code.
12. Tidak ada file kosong.
13. Tidak ada duplicate logic.
14. Flow utama berhasil diuji.
15. Sesuai Design Language Nexarin.

---

# 127. MVP Completion Criteria

MVP dianggap berhasil apabila:

### Portal

Pengunjung dapat:

text
Open Website
→ Browse
→ Search
→ Read Article


### Editorial

Admin dapat:

text
Receive Draft
→ Review
→ Edit
→ Delete
atau
→ Publish


### Affiliate

Admin dapat:

text
Create Affiliate
→ Assign to Article
→ Display Publicly


### Shop

Customer dapat:

text
Browse Product
→ Register/Login
→ Trial
→ Buy
→ Access Product
→ Download


### Update

Customer dapat:

text
See Update
→ Read Changelog
→ Download Latest Version


---

# 128. Important Architectural Rules

Aturan berikut bersifat wajib:

1. Supabase adalah production database.
2. Google Sheets adalah staging layer.
3. Gemini Spark adalah editorial automation workflow.
4. Artikel tidak boleh langsung publish tanpa review admin.
5. Admin Dashboard menjadi control center.
6. Customer Dashboard menjadi product access center.
7. Premium files tidak boleh public.
8. Browser native alert/confirm tidak boleh digunakan.
9. UI harus mengikuti Nexarin Design Language.
10. Tidak boleh ada empty/dead files.
11. Tidak boleh ada giant component.
12. Business logic harus dipisahkan dari presentation.
13. Secret tidak boleh berada di client.
14. Payment harus diverifikasi server-side.
15. License harus diverifikasi server-side.
16. Semua critical action harus memiliki feedback.
17. Semua critical destructive action harus memiliki confirmation.
18. Semua public content harus memperhatikan SEO.
19. Content hasil scraping harus melalui editorial transformation dan review.
20. Semua implementasi harus mengikuti PRD ini sebagai sumber acuan utama.

---

# 129. Future Expansion Principles

Ketika fitur baru ditambahkan, fitur tersebut harus:

* tidak merusak modul existing;
* menggunakan architecture yang sama;
* mengikuti Design Language;
* memiliki feature folder sendiri jika kompleks;
* memiliki database model yang jelas;
* memiliki authorization yang sesuai;
* memiliki loading/error/empty state;
* memiliki testing;
* memiliki dokumentasi jika diperlukan.

---

# 130. Final Product Architecture

Nexarin Tech Hub pada akhirnya terdiri dari empat ekosistem utama:

text
┌──────────────────────────────────────────────┐
│              NEXARIN TECH HUB                │
│              Nexarin by Rins                 │
├──────────────────────────────────────────────┤
│                                              │
│  1. INFORMATION                              │
│     ├── AI                                   │
│     ├── Technology                           │
│     ├── Digital                              │
│     ├── Gadget                               │
│     ├── Automotive                           │
│     ├── Tutorials                            │
│     └── Reviews                              │
│                                              │
│  2. AFFILIATE                                │
│     ├── Product Recommendations              │
│     ├── Affiliate Links                      │
│     └── Article Integration                  │
│                                              │
│  3. NEXARIN SHOP                             │
│     ├── Applications                         │
│     ├── Templates                            │
│     ├── Source Code                          │
│     ├── Trial                                │
│     └── Lifetime Products                    │
│                                              │
│  4. CUSTOMER ECOSYSTEM                       │
│     ├── Account                              │
│     ├── Licenses                             │
│     ├── Downloads                            │
│     ├── Updates                              │
│     ├── Documentation                        │
│     └── Notifications                        │
│                                              │
└──────────────────────────────────────────────┘


---

# 131. Final Technology Architecture

text
Next.js
│
├── Public Portal
├── Shop
├── Customer Dashboard
├── Admin Dashboard
│
├── API Routes
├── Server Logic
└── Services
       │
       ├── Supabase
       │     ├── PostgreSQL
       │     ├── Auth
       │     └── Storage
       │
       └── Google Sheets
             ↑
             │
       Gemini Spark
             │
       Scraping
       Analysis
       Drafting
       Recommendation


---

# 132. Final Editorial Architecture

text
SOURCE
  ↓
Gemini Spark
  ↓
SCRAPING
  ↓
ANALYSIS
  ↓
SUMMARY
  ↓
ARTICLE
  ↓
OPINION
  ↓
SEO
  ↓
TAGS
  ↓
CATEGORY
  ↓
PRODUCT RECOMMENDATION
  ↓
GOOGLE SHEETS
  ↓
ADMIN DASHBOARD
  ↓
MANUAL REVIEW
  ↓
PUBLISH
  ↓
SUPABASE
  ↓
NEXARIN TECH HUB


---

# 133. Final Business Architecture

text
Traffic
  ↓
Information
  ↓
Education
  ↓
Trust
  ↓
Recommendation
  ├──────────────→ Affiliate Revenue
  │
  └──────────────→ Nexarin Product
                         ↓
                       Demo
                         ↓
                    3-Day Trial
                         ↓
                      Purchase
                         ↓
                     Lifetime
                         ↓
                   Product Updates
                         ↓
                      Retention


---

# 134. Final Notes for Development Agent

AI coding agent/developer harus memahami bahwa Nexarin Tech Hub bukan sekadar blog.

Platform ini terdiri dari:

text
CONTENT PLATFORM
+
AFFILIATE PLATFORM
+
DIGITAL PRODUCT SHOP
+
CUSTOMER PRODUCT DELIVERY SYSTEM


Prioritas pengembangan:

1. Fondasi project.
2. Design system.
3. Authentication.
4. Public portal.
5. Supabase schema.
6. Google Sheets integration.
7. Admin content workflow.
8. Publishing workflow.
9. Shop.
10. Customer dashboard.
11. Trial.
12. Payment.
13. License.
14. Download.
15. Product update.
16. Affiliate.
17. Analytics.
18. Optimization.

Jangan membangun semua fitur secara sekaligus jika dependensinya belum tersedia.

Setiap tahap harus menghasilkan sistem yang dapat dijalankan dan diuji.

---

# 135. Final Acceptance Statement

Nexarin Tech Hub harus menghasilkan pengalaman yang:

> **Profesional, cepat, informatif, mudah digunakan, memiliki identitas brand yang kuat, tidak terlihat seperti website yang dibuat secara otomatis oleh AI, serta mampu menghubungkan konten dengan produk digital Nexarin secara natural.**

AI digunakan untuk mempercepat workflow.

Manusia tetap memegang kontrol editorial dan bisnis.

Supabase menjadi sumber data produksi.

Google Sheets menjadi staging editorial.

Gemini Spark menjadi workflow otomatisasi editorial.

Next.js menjadi platform aplikasi utama.

Nexarin Design Language menjadi standar visual.

Customer Dashboard menjadi pusat kepemilikan dan update produk.

Admin Dashboard menjadi pusat kontrol seluruh ekosistem.

Dokumen PRD ini menjadi **single source of truth** untuk pengembangan Nexarin Tech Hub.
