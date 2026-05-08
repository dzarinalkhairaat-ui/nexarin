export default function AdminNewsStats({ stats }) {
  const safeStats = Array.isArray(stats) ? stats : [];

  if (safeStats.length === 0) {
    return null;
  }

  return (
    <section className="relative px-5 pb-5 text-white sm:px-6 sm:pb-7 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid gap-3 sm:grid-cols-3">
          {safeStats.map((item) => (
            <div
              key={item?.label || item?.value}
              className="rounded-[26px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                {item?.label || "Stat"}
              </p>

              <p className="mt-1 text-xl font-black tracking-[-0.045em] text-emerald-300">
                {item?.value || "-"}
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                {item?.note || "Belum ada catatan"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}