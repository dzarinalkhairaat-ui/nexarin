# Detail Rancangan Fitur Manajemen API Key Gemini/Groq untuk Project Nexarin

Dokumen ini dibuat khusus berdasarkan struktur project Nexarin yang dibaca dari file ZIP project. Fokus dokumen ini adalah menjelaskan rancangan fitur manajemen API Key Gemini/Groq yang sebelumnya sudah didiskusikan, lalu disesuaikan dengan stack, folder, database, admin dashboard, SMTP, dan modul scraping yang sudah ada di project.

> Dokumen ini bukan file kode final. Ini adalah spesifikasi teknis dan alur implementasi agar nanti proses coding tidak merusak fitur yang sudah berjalan.

---

## 1. Kondisi Project Saat Ini

Berdasarkan isi project ZIP, project Nexarin saat ini memakai stack berikut:

| Bagian | Kondisi Saat Ini |
|---|---|
| Framework | Next.js `^15.0.0` dengan App Router |
| React | React `^19.0.0` |
| Database ORM | Prisma `^7.8.0` |
| Database | Supabase PostgreSQL |
| Prisma Client Output | `app/generated/prisma` |
| Prisma Adapter | `@prisma/adapter-pg` |
| SMTP | Sudah ada, dipakai untuk OTP login admin |
| Email Library | `nodemailer` sudah terpasang |
| Admin Auth | Supabase Auth + OTP 8 digit via SMTP + signed admin session cookie |
| Admin Guard | Server Action memakai `requireAdminSession()` |
| Modul Scraping | Sudah ada di `features/admin/scraping-news` |
| Cron Scraper | Sudah ada di `app/api/cron/scraper/route.js` |

File penting yang sudah ada:

```txt
prisma/schema.prisma
lib/prisma.js
lib/email/sendAdminOtpEmail.js
lib/admin/adminOtp.js
features/admin/admin.helpers.js
features/admin/components/AdminSidebar.jsx
features/admin/components/AdminTopbar.jsx
features/admin/scraping-news/AdminScrapingNewsPage.jsx
features/admin/scraping-news/scraping.actions.js
features/admin/scraping-news/scraper.js
app/admin/scraping-news/page.jsx
app/api/cron/scraper/route.js
```

Kesimpulan penting: fondasi backend untuk fitur ini sudah cocok karena project sudah punya Prisma, Supabase PostgreSQL, SMTP Nodemailer, admin session, dan modul scraping.

---

## 2. Tujuan Fitur yang Akan Dibangun

Fitur ini dibuat agar API Key Gemini/Groq tidak lagi disimpan manual di `.env`, tetapi dikelola lewat dashboard admin.

Tujuan akhirnya:

1. Admin bisa input API Key lewat HP.
2. Input bisa lewat upload file `.txt` atau paste/manual.
3. Setiap key terikat ke email pemilik akun.
4. Sistem otomatis membedakan Gemini dan Groq.
5. Sistem mengecek duplikat sebelum menyimpan key.
6. Key valid disimpan ke Supabase lewat Prisma.
7. Key yang duplikat atau formatnya tidak dikenali tidak disimpan.
8. Saat AI dipakai, sistem melakukan rotasi key otomatis.
9. Jika key off/nonaktif, key tersebut dihapus otomatis dari DB.
10. SMTP mengirim notifikasi bahwa API Key dari email tertentu sudah off.
11. Jika satu email sudah tidak punya key Gemini/Groq sama sekali, data email tersebut ikut dihapus dari DB.
12. Sistem tetap mencoba key berikutnya tanpa menghentikan proses admin.

---

## 3. Prinsip Penting yang Harus Dipertahankan

Karena project Nexarin sudah punya aturan sendiri, fitur baru ini harus mengikuti prinsip berikut:

1. Jangan mengubah alur admin login yang sudah berjalan.
2. Jangan merusak modul scraping yang sudah berjalan.
3. Jangan membuat halaman admin kosong.
4. Semua action admin harus tetap memakai `requireAdminSession()`.
5. Jangan menyimpan key mentah di log server.
6. Jangan mengirim key penuh lewat email SMTP.
7. Jangan menghapus key hanya karena terkena rate limit sementara.
8. Jangan memanggil provider AI saat input key jika tidak perlu, supaya input key tidak menghabiskan kuota.
9. Tetap mobile-first karena dashboard admin sering dipakai dari HP.
10. Secret penting seperti database URL, SMTP password, dan secret enkripsi tetap harus di `.env`.

Catatan penting: yang dipindahkan dari `.env` ke database hanyalah API Key Gemini/Groq. Secret internal sistem tetap berada di `.env`.

---

## 4. Lokasi Fitur di Project

Fitur ini sebaiknya dibuat sebagai modul admin baru bernama **AI Keys** atau **API Keys**.

Route baru yang disarankan:

```txt
/admin/ai-keys
```

File dan folder baru yang disarankan:

```txt
app/admin/ai-keys/page.jsx
features/admin/ai-keys/AdminAiKeysPage.jsx
features/admin/ai-keys/aiKeys.actions.js
features/admin/ai-keys/aiKeyParser.js
features/admin/ai-keys/aiKey.helpers.js
lib/ai/aiKeyCrypto.js
lib/ai/aiKeyRuntime.js
lib/ai/geminiClient.js
lib/ai/groqClient.js
lib/email/sendAiKeyOffEmail.js
```

File yang kemungkinan perlu diubah:

```txt
prisma/schema.prisma
features/admin/components/AdminSidebar.jsx
features/admin/components/AdminTopbar.jsx
features/admin/AdminPage.jsx
features/admin/scraping-news/scraping.actions.js
features/admin/scraping-news/AdminScrapingNewsPage.jsx
```

Penjelasan:

| File | Peran |
|---|---|
| `app/admin/ai-keys/page.jsx` | Route admin untuk halaman manajemen key |
| `AdminAiKeysPage.jsx` | UI client untuk upload `.txt`, input manual, statistik, dan tabel key |
| `aiKeys.actions.js` | Server Action untuk simpan, hapus, statistik, dan validasi key |
| `aiKeyParser.js` | Parser file `.txt` dan input manual |
| `aiKey.helpers.js` | Helper masking, provider detection, validasi email, format response |
| `lib/ai/aiKeyCrypto.js` | Hash dan enkripsi/dekripsi API key |
| `lib/ai/aiKeyRuntime.js` | Ambil key aktif, rotasi, handle error, auto-delete |
| `geminiClient.js` | Request ke Gemini |
| `groqClient.js` | Request ke Groq |
| `sendAiKeyOffEmail.js` | SMTP notifikasi key off |

---

## 5. Struktur Database yang Disarankan

Karena satu email bisa memiliki key Gemini dan Groq, struktur terbaik adalah dua tabel relasional:

1. `AiApiAccount`
2. `AiApiKey`

### 5.1 Model `AiApiAccount`

Tabel ini menyimpan email pemilik key.

```prisma
model AiApiAccount {
  id        String     @id @default(cuid())
  email     String     @unique
  keys      AiApiKey[]

  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([createdAt])
  @@map("ai_api_accounts")
}
```

### 5.2 Enum `AiProvider`

```prisma
enum AiProvider {
  GEMINI
  GROQ
}
```

### 5.3 Model `AiApiKey`

Tabel ini menyimpan key yang terhubung ke email.

```prisma
model AiApiKey {
  id         String       @id @default(cuid())
  accountId String
  account   AiApiAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)

  provider   AiProvider
  keyCipher  String
  keyHash    String      @unique
  keyPreview String

  lastUsedAt  DateTime?
  lastErrorAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([accountId])
  @@index([provider])
  @@index([createdAt])
  @@map("ai_api_keys")
}
```

### 5.4 Kenapa Tidak Cukup Satu Tabel?

Satu tabel memang bisa, tetapi dua tabel lebih cocok untuk alur yang Anda inginkan:

- Email menjadi data induk.
- Key Gemini/Groq menjadi data anak.
- Saat semua key milik satu email sudah habis, akun/email bisa dihapus bersih.
- Tabel lebih mudah ditampilkan di dashboard sebagai daftar email dengan jumlah Gemini/Groq.

---

## 6. Penyimpanan Key: Jangan Plaintext Kalau Bisa

Walaupun key disimpan di DB, sebaiknya key tidak disimpan plaintext.

Struktur aman:

| Field | Isi |
|---|---|
| `keyCipher` | API key terenkripsi |
| `keyHash` | HMAC/SHA hash untuk cek duplikat |
| `keyPreview` | Versi mask untuk UI, contoh `AIzaSy...9xQp` |

Kenapa perlu `keyHash`?

Karena kalau key terenkripsi dengan IV berbeda, hasil enkripsinya bisa berbeda walaupun key aslinya sama. Jadi untuk cek duplikat, gunakan hash stabil dari key asli.

Secret yang tetap perlu di `.env`:

```env
AI_KEY_ENCRYPTION_SECRET="isi_secret_panjang_random"
```

Secret ini bukan API key Gemini/Groq. Ini secret internal sistem untuk mengamankan API key yang disimpan di Supabase.

---

## 7. Format Input File `.txt`

Format final yang Anda inginkan:

```txt
- namaemail1@gmail.com
AIzaSyGeminiKeyDiSini
gsk_GroqKeyDiSini

- namaemail2@gmail.com
AIzaSyGeminiKeyDiSini
gsk_GroqKeyDiSini
```

Aturan parser:

1. Baris kosong diabaikan.
2. Baris yang diawali `-` dianggap sebagai email.
3. Tanda `-` dihapus saat disimpan.
4. Email dinormalisasi ke lowercase.
5. Baris setelah email dianggap API key milik email tersebut.
6. Jika ditemukan email baru, key berikutnya menjadi milik email baru tersebut.
7. Key dengan awalan `AIza` dianggap Gemini.
8. Key dengan awalan `gsk_` dianggap Groq.
9. Key yang tidak cocok pola Gemini/Groq ditolak sebagai invalid.
10. Key sebelum email pertama dianggap invalid karena tidak punya pemilik.

Contoh hasil parsing:

```txt
- akun1@gmail.com
AIzaSyAAA
gsk_BBB

- akun2@gmail.com
AIzaSyCCC
```

Menjadi:

| Email | Provider | Key |
|---|---|---|
| akun1@gmail.com | GEMINI | `AIzaSyAAA` |
| akun1@gmail.com | GROQ | `gsk_BBB` |
| akun2@gmail.com | GEMINI | `AIzaSyCCC` |

---

## 8. Format Input Manual di Dashboard

Untuk input manual, UI sebaiknya punya dua bagian:

### 8.1 Field Email

```txt
namaemail@gmail.com
```

### 8.2 Textarea API Key

```txt
AIzaSyGeminiKeyDiSini
gsk_GroqKeyDiSini
```

Aturan manual:

1. Admin wajib isi email.
2. Admin bisa paste satu atau banyak key.
3. Semua key di textarea dianggap milik email tersebut.
4. Provider tetap dideteksi otomatis dari prefix key.
5. Duplikat tetap dicek ke DB.
6. Key yang valid dan unik langsung masuk DB.
7. Key duplikat/invalid ditolak dan muncul di popup.

---

## 9. Alur Upload `.txt`

Alur upload file `.txt` tidak perlu memasukkan isi file ke textarea.

Alur final:

1. Admin buka `/admin/ai-keys` dari HP atau desktop.
2. Admin upload file `.txt`.
3. Browser membaca isi file.
4. Isi file langsung dikirim ke Server Action.
5. Server Action menjalankan parser.
6. Sistem cek email, provider, dan duplikat.
7. Key valid disimpan.
8. Key invalid/duplikat di-skip.
9. Popup menampilkan hasil proses.

Contoh popup:

```txt
Selesai memproses file.

Total baris key terbaca: 10
Berhasil disimpan: 7
Duplikat: 2
Format tidak valid: 1
```

Textarea tetap kosong karena upload file langsung diproses.

---

## 10. Alur Input Manual

Alur manual:

1. Admin isi email.
2. Admin paste key ke textarea.
3. Admin klik tombol `Simpan Key Manual`.
4. Server Action menerima email dan raw text key.
5. Sistem membuat pasangan email + key.
6. Sistem mendeteksi provider.
7. Sistem cek duplikat.
8. Sistem simpan key valid.
9. Popup menampilkan hasil.

Contoh popup:

```txt
Berhasil menyimpan 2 key baru untuk akun namaemail@gmail.com.

Gemini: 1
Groq: 1
Duplikat: 0
Invalid: 0
```

---

## 11. Deteksi Provider Gemini/Groq

Aturan dasar:

| Provider | Prefix Umum |
|---|---|
| Gemini | `AIza` |
| Groq | `gsk_` |

Logika:

```txt
Jika key diawali AIza  => GEMINI
Jika key diawali gsk_  => GROQ
Selain itu             => INVALID
```

Catatan: validasi ini hanya validasi format awal. Validasi benar-benar hidup/mati dilakukan saat key dipakai request ke provider.

Alasan tidak langsung mengetes key saat input:

1. Tidak boros kuota.
2. Tidak memperlambat upload banyak key.
3. Tidak menyebabkan key baru terkena rate usage hanya untuk validasi.
4. Lebih simpel dan cepat untuk admin HP.

---

## 12. Aturan Duplikat

Ada dua level duplikat:

### 12.1 Duplikat Dalam Input yang Sama

Contoh:

```txt
- akun@gmail.com
AIzaSyAAA
AIzaSyAAA
```

Yang disimpan hanya satu.

### 12.2 Duplikat dengan Database

Jika `keyHash` sudah ada di tabel `ai_api_keys`, key baru tidak disimpan.

Response Server Action harus mengembalikan detail:

| Field | Isi |
|---|---|
| `insertedCount` | jumlah key berhasil masuk |
| `duplicateCount` | jumlah key duplikat |
| `invalidCount` | jumlah key invalid |
| `accountCreatedCount` | jumlah email baru yang dibuat |
| `details` | ringkasan per email/provider |

---

## 13. Aturan Jumlah Input: Tidak Ada Batas Maksimal dari UI

Sesuai keinginan Anda, UI tidak perlu memberi batas maksimal jumlah key.

Namun backend tetap harus aman. Cara terbaik:

1. UI tidak membatasi jumlah key.
2. Backend memproses data dalam batch.
3. Setiap batch bisa berisi 100 sampai 250 key.
4. Jika file sangat besar, tetap diproses bertahap.
5. Response tetap mengembalikan ringkasan total.

Dengan cara ini, admin merasa bisa input sebanyak apa pun, tetapi server tetap aman dari timeout atau request terlalu berat.

---

## 14. Alur Rotasi API Key Saat AI Dipakai

Sistem AI runtime harus mengambil key dari DB, bukan `.env`.

Alur:

1. Fitur AI dipanggil dari admin.
2. Sistem mengambil daftar key berdasarkan provider.
3. Key diurutkan dari yang paling lama atau paling jarang dipakai.
4. Sistem mencoba key pertama.
5. Jika berhasil, hasil AI dikembalikan.
6. Jika error `429`, sistem tidak menghapus key dan lanjut ke key berikutnya.
7. Jika error `401` atau `403`, sistem menganggap key off/nonaktif.
8. Sistem mengambil email pemilik key.
9. Sistem mengirim notifikasi SMTP.
10. Sistem menghapus key dari DB.
11. Sistem cek apakah email tersebut masih punya key lain.
12. Jika tidak punya key lain, sistem hapus akun/email dari `ai_api_accounts`.
13. Sistem lanjut mencoba key berikutnya.
14. Jika semua key gagal, sistem mengembalikan error ke admin.

---

## 15. Error yang Harus Dibedakan

| Status/Error | Arti | Tindakan |
|---|---|---|
| `200` | Berhasil | Pakai hasil AI |
| `401` | Key tidak valid/off | Hapus key, kirim SMTP |
| `403` | Key/project diblokir/forbidden | Hapus key, kirim SMTP |
| `429` | Rate limit sementara | Jangan hapus, coba key lain |
| `500` | Server provider error | Jangan hapus, coba key lain |
| `502/503/504` | Provider down/gateway timeout | Jangan hapus, coba key lain |
| Network error | Koneksi gagal | Jangan hapus langsung |
| JSON parse error | Response provider aneh | Jangan hapus langsung |

Prinsip utama: key hanya dihapus otomatis pada `401` dan `403`.

---

## 16. Aturan Auto-Delete Key dan Account

### 16.1 Jika Key Gemini Off

Contoh data awal:

| Email | Provider | Kondisi |
|---|---|---|
| akun@gmail.com | GEMINI | Off |
| akun@gmail.com | GROQ | Masih ada |

Tindakan:

1. Hapus key Gemini.
2. Kirim SMTP: `Api Key Gemini dari email akun@gmail.com sudah Off.`
3. Cek sisa key milik `akun@gmail.com`.
4. Karena Groq masih ada, akun tidak dihapus.

### 16.2 Jika Key Groq Off

Tindakan sama, hanya provider-nya Groq.

### 16.3 Jika Semua Key dari Email Sudah Habis

Contoh setelah penghapusan:

| Email | Gemini | Groq |
|---|---|---|
| akun@gmail.com | tidak ada | tidak ada |

Tindakan:

1. Hapus key yang off.
2. Cek sisa key untuk email tersebut.
3. Jika jumlah sisa key = 0, hapus `AiApiAccount`.
4. Kirim notifikasi tambahan atau gabungkan dalam satu email.

Contoh pesan:

```txt
Api Key Groq dari email akun@gmail.com sudah Off.
Karena email ini sudah tidak memiliki API Key aktif, data akun tersebut telah dihapus dari sistem Nexarin.
```

---

## 17. Format SMTP Notifikasi Key Off

Project sudah punya SMTP OTP di:

```txt
lib/email/sendAdminOtpEmail.js
```

Untuk fitur baru, sebaiknya buat file baru agar tidak mencampur OTP login dengan alert API key:

```txt
lib/email/sendAiKeyOffEmail.js
```

SMTP config bisa memakai environment yang sudah ada:

```env
ADMIN_OTP_SMTP_HOST
ADMIN_OTP_SMTP_PORT
ADMIN_OTP_SMTP_USER
ADMIN_OTP_SMTP_PASS
ADMIN_OTP_EMAIL_FROM
```

Atau kalau ingin lebih rapi, bisa tambahkan env alias baru:

```env
AI_ALERT_EMAIL_TO="emailadmin@gmail.com"
```

Jika `AI_ALERT_EMAIL_TO` kosong, fallback ke email admin pertama dari `NEXARIN_ADMIN_EMAILS`.

### 17.1 Pesan Sederhana

```txt
Api Key Gemini dari email namaemail@gmail.com sudah Off.
```

### 17.2 Pesan Jika Account Ikut Dihapus

```txt
Api Key Groq dari email namaemail@gmail.com sudah Off.
Karena email ini sudah tidak memiliki API Key aktif, data akun tersebut telah dihapus dari sistem Nexarin.
```

### 17.3 Yang Tidak Boleh Dikirim

Jangan kirim API key penuh di email.

Tidak perlu seperti ini:

```txt
Key: AIzaSyxxxxxxxxxxxxxxxxxxxx
```

Cukup email pemilik dan provider. Itu sudah cukup agar admin tahu harus login ke akun mana.

---

## 18. Integrasi dengan Modul Scraping News Saat Ini

Modul scraping saat ini bekerja seperti ini:

1. `features/admin/scraping-news/scraper.js` mengambil RSS.
2. Data masuk ke tabel `scraped_news_articles`.
3. Admin review di `/admin/scraping-news`.
4. Admin klik `Pilih`.
5. Server Action `pickScrapedNews()` memindahkan data ke `news_articles` sebagai `DRAFT`.

Fitur AI bisa masuk di dua titik.

### 18.1 Opsi A: AI Dipakai Saat Admin Klik Tombol Khusus

Tambahkan tombol di setiap kandidat berita:

```txt
Poles AI
```

Alur:

1. Admin klik `Poles AI`.
2. Sistem membaca `title`, `excerpt`, dan `content` dari `scraped_news_articles`.
3. Sistem panggil Gemini/Groq via key rotation.
4. Hasil AI disimpan kembali ke `scraped_news_articles` sebagai cache.
5. Admin bisa cek hasilnya sebelum klik `Pilih`.

Ini opsi paling aman karena admin punya kontrol.

### 18.2 Opsi B: AI Dipakai Saat Admin Klik `Pilih`

Alur:

1. Admin klik `Pilih`.
2. Sistem sebelum membuat `news_articles` menjalankan AI.
3. Hasil AI langsung masuk ke `summary` dan `content` di `news_articles`.
4. Artikel tetap dibuat sebagai `DRAFT`.

Ini lebih otomatis, tetapi lebih berat karena setiap `Pilih` langsung memanggil AI.

### 18.3 Rekomendasi untuk Project Nexarin

Rekomendasi terbaik: mulai dari **Opsi A**.

Alasannya:

1. Modul scraping sudah punya tabel kandidat.
2. Admin sudah melakukan review manual.
3. Hasil AI bisa disimpan dulu sebagai cache.
4. Kalau tombol diklik ulang, sistem tidak perlu panggil AI lagi.
5. Lebih hemat API key.
6. Lebih kecil risiko error saat `Pilih` berita.

---

## 19. Penyesuaian Schema untuk Cache AI di Scraped News

Agar tidak memanggil AI berulang pada artikel yang sama, tambahkan field opsional ke `ScrapedNewsArticle`.

```prisma
model ScrapedNewsArticle {
  id                String    @id @default(cuid())
  sourceName        String
  sourceUrl         String    @unique
  title             String
  excerpt           String?
  content           String?
  imageUrl          String?
  sourcePublishedAt DateTime?

  aiTitle       String?
  aiSummary     String?
  aiContent     String?
  aiProvider    AiProvider?
  aiProcessedAt DateTime?
  aiError        String?

  scrapedAt DateTime @default(now())

  @@index([scrapedAt])
  @@index([aiProcessedAt])
  @@map("scraped_news_articles")
}
```

Saat admin klik `Pilih`, prioritas data:

| Field NewsArticle | Ambil dari |
|---|---|
| `title` | `aiTitle` jika ada, kalau tidak `title` asli |
| `summary` | `aiSummary` jika ada, kalau tidak `excerpt` |
| `content` | `aiContent` jika ada, kalau tidak `content` asli |
| `sourceUrl` | tetap dari sumber asli |
| `sourceName` | tetap dari sumber asli |
| `coverImageUrl` | tetap dari `imageUrl` |

---

## 20. Provider Fallback Gemini ke Groq

Urutan fallback yang disarankan:

1. Coba Gemini dulu.
2. Kalau Gemini semua gagal karena `429`, coba Groq.
3. Kalau Gemini key off `401/403`, hapus key tersebut dan lanjut key Gemini lain.
4. Kalau semua Gemini gagal, lanjut Groq.
5. Kalau Groq key off, hapus key tersebut dan lanjut Groq lain.
6. Kalau semua provider gagal, kembalikan error ke admin.

Alur ini cocok untuk portal Nexarin karena Gemini dan Groq bisa menjadi cadangan satu sama lain.

---

## 21. Integrasi UI Dashboard Admin

### 21.1 Tambah Menu Sidebar

Di file:

```txt
features/admin/components/AdminSidebar.jsx
```

Tambahkan menu baru:

```txt
AI Keys
href: /admin/ai-keys
status: Config
```

Letakkan dekat `Scraping` atau `Settings`.

### 21.2 Tambah Link di Topbar

Di file:

```txt
features/admin/components/AdminTopbar.jsx
```

Tambahkan shortcut jika topbar memiliki menu admin cepat.

### 21.3 Tambah Card di Dashboard Admin

Di file:

```txt
features/admin/AdminPage.jsx
```

Tambahkan card modul:

```txt
Kelola AI Keys
```

Deskripsi:

```txt
Kelola API Key Gemini/Groq, upload key via TXT, input manual, cek duplikat, dan monitoring key aktif.
```

---

## 22. Tampilan Halaman `/admin/ai-keys`

Halaman ini sebaiknya mengikuti gaya visual project saat ini:

- background `bg-slate-950`
- card `bg-white/[0.025]`
- border `border-white/10`
- highlight emerald/cyan
- rounded besar `rounded-[24px]` atau `rounded-[28px]`
- mobile-first
- tombol minimum tinggi 44px agar enak di HP

### 22.1 Bagian Statistik

Contoh card statistik:

| Statistik | Isi |
|---|---|
| Total Email | jumlah data `ai_api_accounts` |
| Gemini Key | jumlah key provider GEMINI |
| Groq Key | jumlah key provider GROQ |
| Total Key | semua key aktif |

### 22.2 Bagian Upload `.txt`

UI:

```txt
Upload File .txt
[ Pilih File ]
```

Begitu file dipilih, langsung proses.

### 22.3 Bagian Input Manual

UI:

```txt
Email Pemilik Key
[ namaemail@gmail.com ]

API Key
[ textarea satu key per baris ]

[ Simpan Key Manual ]
```

### 22.4 Bagian Tabel Akun

Tabel yang disarankan:

| Email | Gemini | Groq | Total Key | Terakhir Dipakai | Aksi |
|---|---:|---:|---:|---|---|
| akun1@gmail.com | 1 | 1 | 2 | 21/06/2026 | Detail/Hapus |
| akun2@gmail.com | 1 | 0 | 1 | - | Detail/Hapus |

Jangan tampilkan API key penuh.

Jika perlu tampilkan detail, gunakan preview:

```txt
AIzaSy...9xQp
```

---

## 23. Server Action yang Diperlukan

File:

```txt
features/admin/ai-keys/aiKeys.actions.js
```

Action yang disarankan:

| Action | Fungsi |
|---|---|
| `getAiKeyDashboardData()` | Ambil statistik dan daftar akun/key |
| `saveAiKeysFromManualInput(email, rawKeys)` | Simpan key dari input manual |
| `saveAiKeysFromTxt(rawText)` | Simpan key dari file `.txt` |
| `deleteAiKey(id)` | Hapus satu key manual dari admin |
| `deleteAiAccount(id)` | Hapus satu email/account beserta semua key |
| `getAiKeyStats()` | Statistik ringan jika ingin refresh terpisah |

Semua action wajib diawali:

```txt
const adminSession = await requireAdminSession();
if (!adminSession.ok) return { ok: false, message: "Akses ditolak." };
```

Ini penting karena middleware project mengizinkan Server Action lewat, lalu validasi dilakukan di dalam action.

---

## 24. Runtime AI yang Diperlukan

File yang disarankan:

```txt
lib/ai/aiKeyRuntime.js
```

Fungsi utama:

```txt
runAiWithKeyRotation({ task, preferredProvider, input })
```

Tugas fungsi ini:

1. Mengambil key dari DB.
2. Mendekripsi key sebelum dipakai.
3. Mencoba request ke Gemini/Groq.
4. Menangani error.
5. Menghapus key off.
6. Mengirim SMTP.
7. Menghapus account jika tidak punya key lagi.
8. Mengembalikan hasil AI.

Fungsi helper yang disarankan:

| Helper | Fungsi |
|---|---|
| `getProviderKeys(provider)` | Ambil key provider tertentu dari DB |
| `markKeyUsed(keyId)` | Update `lastUsedAt` |
| `handleDeadKey(keyDoc, provider, status)` | Hapus key + SMTP + cleanup account |
| `cleanupAccountIfEmpty(accountId)` | Hapus email jika tidak punya key |
| `isDeadKeyStatus(status)` | true untuk `401/403` |
| `isTemporaryProviderError(status)` | true untuk `429/5xx` |

---

## 25. Integrasi dengan `pickScrapedNews()`

File saat ini:

```txt
features/admin/scraping-news/scraping.actions.js
```

Saat ini `pickScrapedNews()` membuat `newsArticle` dengan:

```txt
title   = scrapedArticle.title
summary = scrapedArticle.excerpt || "Ringkasan belum tersedia"
content = scrapedArticle.content || ""
```

Jika AI cache sudah ditambahkan, ubah logika konsepnya menjadi:

```txt
title   = scrapedArticle.aiTitle || scrapedArticle.title
summary = scrapedArticle.aiSummary || scrapedArticle.excerpt || "Ringkasan belum tersedia"
content = scrapedArticle.aiContent || scrapedArticle.content || ""
```

Dengan begitu fitur lama tetap aman. Kalau AI belum dipakai, data lama tetap masuk seperti biasa.

---

## 26. Integrasi Tombol AI di Halaman Scraping

File:

```txt
features/admin/scraping-news/AdminScrapingNewsPage.jsx
```

Tambahkan tombol pada setiap row kandidat:

```txt
Poles AI
```

Posisi disarankan di area aksi bersama tombol:

```txt
Hapus | Poles AI | Pilih
```

Alur tombol:

1. Admin klik `Poles AI`.
2. Frontend set `loadingId` ke id artikel.
3. Panggil Server Action `processScrapedNewsWithAi(id)`.
4. Jika sukses, alert `Berhasil dipoles AI`.
5. Router refresh.
6. UI menampilkan hasil AI jika sudah ada.

Server Action baru bisa ditaruh di:

```txt
features/admin/scraping-news/scraping.actions.js
```

Nama action:

```txt
processScrapedNewsWithAi(id)
```

---

## 27. Cache AI agar Tidak Boros Key

Sebelum memanggil AI, action harus cek dulu:

```txt
Jika aiSummary dan aiContent sudah ada, jangan panggil AI lagi.
```

Pilihan UX:

1. Jika sudah ada hasil AI, tampilkan pesan: `Artikel ini sudah diproses AI.`
2. Tambahkan tombol `Proses Ulang AI` jika admin ingin rewrite ulang.

Untuk awal, cukup jangan proses ulang otomatis.

---

## 28. Prompt AI yang Disarankan

Tujuan AI bukan membuat berita palsu, tetapi merapikan hasil scraping menjadi draft editorial.

Instruksi prompt:

```txt
Anda adalah editor berita Nexarin.
Tugas Anda merapikan berita hasil scraping menjadi draft artikel bahasa Indonesia yang netral, informatif, dan tidak menambahkan fakta baru di luar teks sumber.

Kembalikan JSON valid dengan struktur:
{
  "title": "judul artikel yang lebih rapi",
  "summary": "ringkasan 1-2 kalimat",
  "content": "isi artikel final dalam beberapa paragraf"
}

Jangan menambah data yang tidak ada di sumber.
Jangan membuat klaim baru.
Jangan menghapus konteks sumber utama.
```

Input ke AI:

```txt
Judul sumber: ...
Ringkasan sumber: ...
Konten sumber: ...
URL sumber: ...
```

Kenapa minta JSON?

Agar backend mudah menyimpan hasil ke `aiTitle`, `aiSummary`, dan `aiContent`.

---

## 29. Fallback Jika Output AI Bukan JSON Valid

AI kadang mengembalikan teks tidak sesuai format. Maka sistem harus aman.

Aturan:

1. Coba parse JSON.
2. Jika gagal, simpan hasil AI mentah ke `aiContent`.
3. `aiTitle` tetap memakai title asli.
4. `aiSummary` tetap memakai excerpt asli.
5. Simpan `aiError` berisi pesan singkat: `AI output bukan JSON valid`.
6. Jangan membuat halaman blank/error.

---

## 30. Logging yang Disarankan

Project sudah punya `ScraperLog`.

Untuk AI, ada dua pilihan:

### Opsi Ringan

Gunakan `ScraperLog` juga untuk log AI.

Contoh status:

```txt
AI_SUCCESS
AI_ERROR
AI_KEY_OFF
```

### Opsi Rapi

Buat tabel baru:

```prisma
model AiUsageLog {
  id        String     @id @default(cuid())
  provider  AiProvider?
  status    String
  message   String
  articleId String?
  accountEmail String?
  createdAt DateTime   @default(now())

  @@index([createdAt])
  @@index([provider])
  @@map("ai_usage_logs")
}
```

Rekomendasi awal: gunakan `ScraperLog` dulu agar tidak terlalu banyak tabel. Kalau fitur AI makin besar, baru pisahkan ke `AiUsageLog`.

---

## 31. Migration dan Generate Prisma

Karena project memakai Prisma 7 dengan config:

```txt
prisma.config.ts
```

Dan script:

```json
"prisma:migrate": "prisma migrate dev",
"prisma:generate": "prisma generate"
```

Setelah mengubah schema, jalankan:

```bash
npm run prisma:migrate
npm run prisma:generate
```

Catatan penting:

- Prisma client project ini output-nya ke `app/generated/prisma`.
- Import Prisma Client saat ini sudah benar lewat `lib/prisma.js`.
- Jangan import langsung dari `@prisma/client` karena project sudah memakai generated client khusus.

---

## 32. Environment Variable Tambahan

Tambahan env yang disarankan:

```env
AI_KEY_ENCRYPTION_SECRET="secret panjang untuk enkripsi key"
AI_ALERT_EMAIL_TO="email tujuan alert key off"
```

Opsional jika ingin mengatur urutan provider:

```env
AI_PROVIDER_PRIORITY="GEMINI,GROQ"
```

Yang tidak perlu ditaruh di `.env`:

```env
GEMINI_API_KEYS
GROQ_API_KEYS
```

Karena key tersebut nantinya masuk DB lewat dashboard admin.

---

## 33. Keamanan Tambahan

Fitur ini memegang credential sensitif, jadi perlu aturan keamanan:

1. Jangan log API key asli.
2. Jangan tampilkan API key asli di dashboard.
3. Jangan kirim API key asli lewat SMTP.
4. Jangan simpan API key plaintext jika memungkinkan.
5. Gunakan `keyHash` untuk duplikat.
6. Gunakan `keyPreview` untuk UI.
7. Semua server action wajib admin-only.
8. File upload hanya `.txt`.
9. Batasi ukuran file secara wajar di browser/backend, walaupun jumlah key tidak dibatasi secara UI.
10. Jangan auto-delete pada error sementara.

---

## 34. Skenario Lengkap dari Awal Sampai Akhir

### 34.1 Input Awal

Admin punya file:

```txt
- akun1@gmail.com
AIzaSyAAA
gsk_BBB

- akun2@gmail.com
AIzaSyCCC
gsk_DDD
```

Admin upload ke `/admin/ai-keys`.

Hasil:

| Email | Gemini | Groq |
|---|---:|---:|
| akun1@gmail.com | 1 | 1 |
| akun2@gmail.com | 1 | 1 |

### 34.2 AI Dipakai

Admin membuka `/admin/scraping-news`, lalu klik `Poles AI` pada kandidat berita.

Sistem mencoba Gemini key pertama.

Jika sukses:

1. `lastUsedAt` key diupdate.
2. Hasil AI disimpan di `scraped_news_articles`.
3. Admin melihat hasil AI.

### 34.3 Gemini Key Off

Provider mengembalikan `401/403`.

Sistem:

1. Ambil email pemilik key.
2. Kirim SMTP: `Api Key Gemini dari email akun1@gmail.com sudah Off.`
3. Hapus key Gemini tersebut dari `ai_api_keys`.
4. Cek apakah `akun1@gmail.com` masih punya key lain.
5. Jika Groq masih ada, account tetap disimpan.
6. Lanjut coba key berikutnya.

### 34.4 Semua Key Email Habis

Jika Groq milik `akun1@gmail.com` juga off:

1. Hapus key Groq.
2. Cek sisa key akun1.
3. Karena tidak ada sisa key, hapus `ai_api_accounts` akun1.
4. Kirim SMTP bahwa key Groq off dan account dibersihkan.

### 34.5 Admin Restock Key

Admin menerima email alert, lalu:

1. Login ke email yang disebut di SMTP.
2. Buka Google AI Studio/Groq Dashboard.
3. Hapus/generate key baru.
4. Buka `/admin/ai-keys` dari HP.
5. Paste email dan key baru, atau upload `.txt` baru.
6. Key baru masuk DB.

---

## 35. Apakah Harus Ganti Akun Google Baru?

Tidak harus.

Jika hanya API key yang off, admin cukup:

1. Login ke email yang disebutkan di SMTP.
2. Buka Google AI Studio atau Groq Dashboard.
3. Hapus key lama jika masih ada.
4. Generate key baru.
5. Input lagi lewat dashboard Nexarin.

Akun baru hanya diperlukan jika akun/project benar-benar diblokir oleh provider sehingga key baru tetap error.

---

## 36. Urutan Implementasi yang Paling Aman

Agar tidak merusak project, kerjakan bertahap seperti ini:

### Tahap 1: Database

1. Tambah enum `AiProvider`.
2. Tambah model `AiApiAccount`.
3. Tambah model `AiApiKey`.
4. Opsional tambah field AI cache di `ScrapedNewsArticle`.
5. Jalankan migration dan generate Prisma.

### Tahap 2: Helper Core

1. Buat helper deteksi provider.
2. Buat helper parser `.txt`.
3. Buat helper masking key.
4. Buat helper hash/enkripsi key.

### Tahap 3: Server Action Admin Key

1. Buat `aiKeys.actions.js`.
2. Tambah action simpan dari `.txt`.
3. Tambah action simpan manual.
4. Tambah action get statistik.
5. Tambah action hapus key/account manual.

### Tahap 4: UI `/admin/ai-keys`

1. Buat route page.
2. Buat komponen dashboard.
3. Tambah upload `.txt` langsung proses.
4. Tambah input manual email + textarea.
5. Tambah statistik.
6. Tambah tabel akun/key.
7. Tambah popup hasil proses.

### Tahap 5: Integrasi Menu Admin

1. Tambah menu di sidebar.
2. Tambah menu/topbar jika diperlukan.
3. Tambah card di dashboard admin.

### Tahap 6: Runtime AI

1. Buat runtime rotasi key.
2. Buat Gemini client.
3. Buat Groq client.
4. Buat SMTP key off.
5. Buat auto-delete key/account.

### Tahap 7: Integrasi Scraping

1. Tambah action `processScrapedNewsWithAi(id)`.
2. Tambah tombol `Poles AI` di tabel scraping.
3. Simpan hasil AI ke field cache.
4. Ubah `pickScrapedNews()` agar memakai hasil AI jika ada.

### Tahap 8: Testing

1. Test upload `.txt` valid.
2. Test upload `.txt` dengan duplikat.
3. Test upload `.txt` dengan email invalid.
4. Test manual input.
5. Test key Gemini valid.
6. Test key Groq valid.
7. Test response `429` tidak menghapus key.
8. Test response `401/403` menghapus key.
9. Test SMTP terkirim.
10. Test account dihapus jika tidak punya key.
11. Test halaman admin tetap tidak blank.

---

## 37. Checklist Final

Sebelum fitur dianggap selesai:

- [ ] Route `/admin/ai-keys` hanya bisa dibuka admin.
- [ ] Upload `.txt` langsung diproses tanpa masuk textarea.
- [ ] Manual input punya field email dan textarea key.
- [ ] Gemini/Groq otomatis terdeteksi.
- [ ] Key duplikat tidak disimpan.
- [ ] Key invalid tidak disimpan.
- [ ] Key disimpan aman dengan hash/enkripsi.
- [ ] Dashboard menampilkan statistik key.
- [ ] Key penuh tidak pernah tampil di UI.
- [ ] Key penuh tidak pernah terkirim lewat SMTP.
- [ ] Rotasi key berjalan.
- [ ] Error `401/403` menghapus key.
- [ ] Error `429` tidak menghapus key.
- [ ] Email/account dihapus saat sudah tidak punya key.
- [ ] SMTP alert menyebut provider dan email pemilik key.
- [ ] Modul scraping tetap berjalan walau semua key AI habis.
- [ ] Jika semua key habis, fitur AI memberi pesan error yang jelas ke admin.
- [ ] Tidak ada halaman blank putih.

---

## 38. Kesimpulan Rancangan

Untuk project Nexarin saat ini, fitur manajemen API Key Gemini/Groq paling ideal dibuat sebagai modul admin baru di `/admin/ai-keys`. Data key masuk ke Supabase PostgreSQL lewat Prisma, dengan struktur dua tabel: email/account sebagai parent dan API key sebagai child. Input bisa melalui upload `.txt` atau manual paste, provider Gemini/Groq dideteksi otomatis, duplikat ditolak, dan key valid disimpan.

Saat fitur AI dipakai di modul scraping/news, sistem mengambil key dari DB dan mencoba satu per satu. Jika key terkena `401/403`, sistem mengirim SMTP yang menyebut provider dan email pemilik key, lalu menghapus key tersebut. Jika email itu sudah tidak punya key Gemini/Groq sama sekali, data email ikut dihapus agar database tetap bersih.

Dengan desain ini, admin Nexarin bisa mengelola key langsung dari HP, tidak perlu membuka Vercel Environment Variables, tetap aman, database bersih, dan fitur AI tetap punya fallback ketika salah satu key mati atau terkena limit sementara.
