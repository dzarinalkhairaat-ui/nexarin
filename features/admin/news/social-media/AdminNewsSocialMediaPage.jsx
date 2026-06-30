import AdminTopbar from "@/features/admin/components/AdminTopbar";
import AdminNewsNav from "@/features/admin/news/components/AdminNewsNav";
import AdminNewsSocialMediaClient from "./AdminNewsSocialMediaClient";

export default function AdminNewsSocialMediaPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />
      <AdminNewsNav />

      <section className="relative flex min-h-[calc(100vh-140px)] items-start pt-8 sm:pt-12 overflow-hidden bg-slate-950 px-4 pb-10 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl" />
        
        <AdminNewsSocialMediaClient />
      </section>
    </main>
  );
}