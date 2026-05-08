export default function ErrorFallback({
  title = "Terjadi kendala",
  description = "Halaman masih bisa dibuka, tapi ada bagian yang belum berhasil dimuat.",
}) {
  return (
    <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-red-100">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-red-100/80">{description}</p>
    </div>
  );
}
