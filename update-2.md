Saya ingin menambahkan fitur 'In-App Update' pada PWA saya dengan alur UX yang mulus.

Skenario dan Fitur yang saya inginkan:

Deteksi & Popup: Saat ada pembaruan kode/aset, munculkan popup modal di tengah layar yang rapi bahwa ada versi baru.

Opsi Pengguna: Di dalam popup, berikan dua tombol: 'Update Sekarang' dan 'Skip'. Jika 'Skip' ditekan, tutup popup agar user bisa lanjut memakai web tanpa terganggu.

Proses Update (Progress Bar): Jika 'Update Sekarang' ditekan, ubah tampilan popup menjadi Progress Bar yang bergerak mulus sembari mengirimkan perintah skipWaiting ke Service Worker yang sedang waiting.

Reload & Toast Sukses: Setelah Service Worker baru mengambil alih (controllerchange), lakukan reload halaman secara otomatis. Setelah halaman termuat ulang, munculkan Toast kecil di pojok berbunyi 'Update Berhasil!'.

Tolong buatkan:

Kode komponen UI (Popup, Buttons, Progress Bar, Toast).

Logika pendeteksian updatefound dan integrasi Service Worker-nya.

Catatan singkat mengenai konfigurasi server Cache-Control: no-cache untuk file sw.js agar deteksi update tidak gagal."