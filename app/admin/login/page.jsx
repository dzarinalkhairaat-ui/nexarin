import { Suspense } from "react";
import AdminLoginPage from "@/features/admin/login/AdminLoginPage";

export const metadata = {
  title: "Admin Login",
  description:
    "Halaman login admin Nexarin by-rins untuk akses dashboard pengelolaan konten.",
  robots: {
    index: false,
    follow: false,
  },
};

function AdminLoginLoading() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-md rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-center">
        <p className="text-sm font-black text-emerald-300">
          Loading Admin Login...
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginRoute() {
  return (
    <Suspense fallback={<AdminLoginLoading />}>
      <AdminLoginPage />
    </Suspense>
  );
}