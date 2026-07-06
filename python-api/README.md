---
title: Nexarin Backend Python
emoji: 🚀
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# Nexarin PDF API (Python Microservice) 🚀

Ini adalah *server backend* murni berbasis Python (FastAPI) yang diciptakan khusus untuk menangani proses berat pengubahan PDF ke Word (`pdf2docx`). Karena dipisahkan dari Vercel, *backend* ini akan menyelamatkan aplikasi Anda dari masalah 504 Timeout Vercel.

## Cara Men-Deploy ke Hugging Face Spaces (Gratis & Tanpa Kartu Kredit)
1. Kunjungi [huggingface.co](https://huggingface.co/) dan buat akun baru (hanya butuh email).
2. Setelah login, klik ikon profil Anda di pojok kanan atas, lalu pilih **"New Space"**.
3. Isi kolom pengaturan Space seperti ini:
   - **Space name**: `nexarin-pdf-api` (atau bebas)
   - **License**: Biarkan kosong
   - **Select the Space SDK**: Pilih opsi **`Docker`** (pilih tulisan **Blank**)
   - **Space hardware**: Pilih yang `Free`
   - **Visibility**: `Public`
4. Klik tombol **"Create Space"**.
5. Anda akan diarahkan ke halaman repositori kosong. Klik tab **"Files"**.
6. Klik tombol **"Add file"** -> **"Upload files"**.
7. Seret/Upload keempat file dari folder ini (`main.py`, `requirements.txt`, `Dockerfile`, dan `README.md`) ke halaman tersebut.
8. Klik tombol **"Commit changes"** di bagian bawah.
9. Mesin akan mulai merakit secara otomatis (Building). Anda bisa memantau log-nya. Tunggu sekitar 2-5 menit hingga status di atas berubah menjadi **"Running"**.

Setelah berjalan, URL API Anda akan terlihat seperti ini (berdasarkan username dan nama space Anda):
`https://username-nexarin-pdf-api.hf.space`

## Menghubungkan ke Next.js
Setelah Anda mendapatkan URL dari Render, Anda harus mengubah URL `fetch` yang ada di dalam file `features/pdf-tools/core/pdf-processing.js` (di aplikasi Next.js Anda):

Ubah ini:
```javascript
const response = await fetch('/api/pdf-to-word', { ... })
```

Menjadi ini:
```javascript
// Ganti dengan URL Render Anda yang sebenarnya
const response = await fetch('https://nexarin-python-api.onrender.com/convert/pdf-to-word', { ... })
```

Selesai! Sekarang semua proses PDF to Word yang berat akan ditangani oleh server Python Anda sendiri, sementara UI/Tampilannya tetap berada di Vercel. Keduanya gratis, sempurna, dan anti-timeout!
