export default function PpobPulsaPhoneNumberBox() {
  return (
    <section className="px-5 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/15">
          <label
            htmlFor="phone-number"
            className="text-xs font-black uppercase tracking-[0.16em] text-slate-500"
          >
            Nomor Tujuan
          </label>

          <div className="mt-3 flex min-h-14 items-center gap-3 rounded-[20px] border border-white/10 bg-slate-950/70 px-4">
            <span className="shrink-0 text-sm font-black text-slate-400">
              +62
            </span>

            <span className="h-7 w-px bg-white/10" />

            <input
              id="phone-number"
              type="tel"
              inputMode="numeric"
              placeholder="8xx-xxxx-xxxx"
              className="min-w-0 flex-1 bg-transparent text-base font-black tracking-[0.02em] text-white outline-none placeholder:text-slate-600"
            />

            <span className="text-lg" aria-hidden="true">
              👤
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}