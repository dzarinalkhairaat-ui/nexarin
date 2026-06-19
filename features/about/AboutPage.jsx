import ScrollReveal from "@/components/shared/ScrollReveal";
import Header from "@/components/shared/Header";
import AboutFooter from "@/features/about/components/AboutFooter";
import { aboutStoryData, aboutValues } from "@/features/about/about.data";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Header />

      {/* Hero Section */}
      <ScrollReveal>
        <section className="relative px-5 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[100px]" />
          
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300 shadow-lg shadow-emerald-400/5">
              Tentang Nexarin
            </p>
            <h1 className="mt-8 text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl md:text-6xl lg:text-[4rem] text-white">
              Rumah digital utama untuk ekosistem <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">by-rins</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-slate-400 sm:text-lg">
              Nexarin dirancang sebagai pusat ekosistem digital yang menggabungkan karya, produk, portfolio, informasi, dan identitas brand dalam satu platform yang rapi dan mudah dikembangkan.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Story / Mission Section */}
      <ScrollReveal delay={100}>
        <section className="relative px-5 py-12 sm:px-6 lg:px-8 mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  {aboutStoryData.eyebrow}
                </p>
                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  {aboutStoryData.title}
                </h2>
                <p className="mt-5 text-sm font-medium leading-relaxed text-slate-300 sm:text-base">
                  {aboutStoryData.description}
                </p>
              </div>
              
              <div className="hidden md:flex w-full md:w-1/3 justify-center">
                <div className="relative h-40 w-40 flex items-center justify-center rounded-[2rem] border border-white/10 bg-slate-950/50 shadow-2xl">
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-400/20 to-cyan-400/5 blur-md" />
                  <img src="/images/logo/nexarin-logo.png" alt="Logo" className="relative z-10 h-24 w-24 object-contain opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Principles Section */}
      <ScrollReveal delay={200}>
        <section className="relative px-5 py-16 sm:px-6 lg:px-8 mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-white">
              Prinsip Pengembangan
            </h2>
            <p className="mt-3 text-sm font-medium text-slate-400">
              Fondasi utama kerja Nexarin by-rins
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutValues.map((val) => (
              <article key={val.title} className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-6 shadow-xl transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-white/[0.05]">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl transition group-hover:bg-emerald-400/20" />
                
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-black text-emerald-300 shadow-lg shadow-emerald-400/10 mb-5">
                    {val.number}
                  </div>
                  <h3 className="text-xl font-black leading-tight tracking-[-0.04em] text-white">
                    {val.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-400">
                    {val.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Footer Section */}
      <ScrollReveal delay={300}>
        <AboutFooter />
      </ScrollReveal>
    </main>
  );
}