export default function EmptyState({
  title = "Data belum tersedia",
  description = "Konten untuk bagian ini belum ditambahkan.",
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
