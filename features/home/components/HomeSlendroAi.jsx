import Link from "next/link";

export default function HomeSlendroAi() {
  return (
    <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.03] blur-[100px]" />
      
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8">
        <div className="group relative">
          <div className="relative z-10 flex flex-col items-center gap-8 py-8 sm:flex-row sm:gap-12 sm:py-12">
            {/* Image — 1:1 ratio */}
            <div className="relative w-full max-w-[220px] shrink-0 sm:max-w-[260px]">
              <div className="relative aspect-square">
                <img
                  src="/images/slendro-ai.png"
                  alt="Slendro AI — Unlimited AI Video, Music, Image"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
              <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300 shadow-lg shadow-cyan-400/5">
                Partner
              </span>

              <h2 className="mt-5 text-2xl font-black leading-tight tracking-[-0.04em] text-white sm:text-3xl lg:text-4xl">
                Slendro-Ai
              </h2>

              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-400 sm:text-base sm:leading-relaxed">
                <span className="text-white">Unlimited Ai Video, Music, Image</span>{" "}
                — Platform AI generatif serba bisa untuk membuat video, musik, dan gambar tanpa batas.
              </p>

              <Link
                href="https://slendro-ai.com/register-user.php?ref=RINSAI.PRO3734"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-7 py-3 text-sm font-black text-slate-950 shadow-xl shadow-cyan-400/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110"
              >
                Akses Slendro-Ai Disini!
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
