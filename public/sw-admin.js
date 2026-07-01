self.addEventListener('install', (event) => {
  // Jangan panggil self.skipWaiting() di sini agar In-App Update flow (waiting state) berfungsi.
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Biarkan browser menangani request secara bawaan (native).
  // Kami hanya mendeklarasikan event 'fetch' agar memenuhi kriteria instalasi PWA Chrome,
  // tanpa benar-benar mencegat request yang bisa menyebabkan macet/freeze pada Next.js.
  return;
});
