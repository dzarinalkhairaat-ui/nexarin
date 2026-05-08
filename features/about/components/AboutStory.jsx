import { aboutStoryData, aboutTimeline } from "@/features/about/about.data";

function TimelineCard({ item, index }) {
  const safeItem = item || {};

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-black text-emerald-300 shadow-lg shadow-emerald-400/5">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="min-w-0">
            <h3 className="text-xl font-black leading-tight tracking-[-0.04em] text-white">
              {safeItem.title || "Timeline Nexarin"}
            </h3>

            <p className="mt-2 text-sm font-medium leading-7 text-slate-400">
              {safeItem.description ||
                "Detail pengembangan Nexarin akan ditambahkan bertahap."}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function StoryIdentityCard() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/55 p-4 shadow-2xl shadow-black/20">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-14 bottom-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-2 shadow-xl shadow-emerald-400/10">
            <img
              src="/images/logo/nexarin-logo.png"
              alt="Nexarin logo"
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-[-0.035em] text-white">
              Nexarin by-rins
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
              <p className="truncate text-xs font-semibold text-slate-400">
                Built step by step
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Fokus
            </p>
            <p className="mt-1 text-sm font-black text-emerald-300">
              Stabil
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Prioritas
            </p>
            <p className="mt-1 text-sm font-black text-emerald-300">
              Mobile
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
          Nexarin disusun pelan-pelan agar setiap halaman tetap rapi, aman,
          dan siap dikembangkan ke backend, database, serta dashboard admin.
        </p>
      </div>
    </div>
  );
}

export default function AboutStory() {
  const story = aboutStoryData || {};
  const timeline = Array.isArray(aboutTimeline) ? aboutTimeline : [];

  return (
    <section className="relative overflow-hidden px-5 py-7 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <article className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25 lg:p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.62fr)] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
                {story.eyebrow || "Cerita Singkat"}
              </p>

              <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em] text-white sm:text-5xl">
                {story.title ||
                  "Nexarin bukan sekadar halaman, tapi fondasi ekosistem."}
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                {story.description ||
                  "Nexarin dibuat bertahap dengan fokus pada stabilitas, mobile-first, struktur rapi, dan pondasi yang siap dikembangkan."}
              </p>
            </div>

            <StoryIdentityCard />
          </div>
        </article>

        <div className="mt-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-emerald-400" />

            <div>
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Arah Pengembangan
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Roadmap awal ekosistem Nexarin
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {timeline.length > 0 ? (
              timeline.map((item, index) => (
                <TimelineCard
                  key={`${item?.title || "timeline"}-${index}`}
                  item={item}
                  index={index}
                />
              ))
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
                Timeline belum tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}