"use client";

import { useEffect, useState } from "react";

export default function AdminPwaRegistry() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // 1. Cek apakah baru saja berhasil update
    if (sessionStorage.getItem("pwa-updated") === "true") {
      sessionStorage.removeItem("pwa-updated");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }

    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;

    // 2. Daftarkan Service Worker
    navigator.serviceWorker
      .register("/sw-admin.js", { scope: "/admin/" })
      .then((registration) => {
        console.log("Admin SW registered:", registration.scope);

        // Jika ada worker yang sudah menunggu saat dimuat
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setIsUpdateAvailable(true);
        }

        // Listener jika ada update baru yang ditemukan
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // Ada update baru yang siap di-install (waiting)
              setWaitingWorker(newWorker);
              setIsUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => console.error("Admin SW registration failed:", err));

    // 3. Listener saat worker baru mengambil alih
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        sessionStorage.setItem("pwa-updated", "true");
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (!waitingWorker) return;
    setIsUpdating(true);
    // Kirim pesan ke waiting worker untuk skip waiting
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  const handleSkip = () => {
    setIsUpdateAvailable(false);
  };

  return (
    <>
      {/* Toast Success Update */}
      <div
        className={`fixed bottom-6 right-6 z-[999] transition-all duration-500 ease-out flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 shadow-xl shadow-emerald-400/5 backdrop-blur-md ${
          showSuccessToast
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white tracking-tight">Update Berhasil!</span>
          <span className="text-xs text-emerald-200/70 font-medium">Versi terbaru berhasil dipasang.</span>
        </div>
      </div>

      {/* Modal In-App Update */}
      {isUpdateAvailable && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] border border-white/10 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Dekorasi Background */}
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
            
            <div className="relative p-6">
              {!isUpdating ? (
                <>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 text-emerald-400 border border-emerald-400/20">
                    <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight mb-2">Pembaruan Tersedia</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                    Versi terbaru sistem sudah siap. Perbarui sekarang untuk mendapatkan fitur dan performa terbaik.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSkip}
                      className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                    >
                      Nanti Saja
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 transition-all hover:bg-emerald-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-400/20"
                    >
                      Update Sekarang
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <h3 className="text-lg font-bold text-white mb-4">Memasang Pembaruan...</h3>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
                    <div className="bg-emerald-400 h-2 rounded-full animate-progress w-full origin-left" style={{ animation: "progress 2s ease-in-out infinite" }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 animate-pulse">Mohon tunggu sebentar, halaman akan dimuat ulang.</p>
                  <style jsx>{`
                    @keyframes progress {
                      0% { transform: scaleX(0); opacity: 1; }
                      50% { transform: scaleX(0.7); opacity: 0.8; }
                      100% { transform: scaleX(1); opacity: 0; }
                    }
                  `}</style>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
