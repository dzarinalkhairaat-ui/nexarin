import Link from "next/link";
import PortfolioHeader from "@/features/portfolio/components/PortfolioHeader";
import PortfolioFooter from "@/features/portfolio/components/PortfolioFooter";
import { getPortfolioProjectBySlug } from "@/features/portfolio/portfolio.data";

function DetailNotFound() {
    return (
        <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <PortfolioHeader />

            <section className="relative px-5 py-10 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-2xl shadow-black/20">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 text-2xl">
                        🧩
                    </div>

                    <h1 className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">
                        Project tidak ditemukan
                    </h1>

                    <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
                        Slug project tidak cocok atau data portfolio belum tersedia.
                        Halaman tetap aman dan tidak blank putih.
                    </p>

                    <Link
                        href="/portfolio"
                        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                    >
                        Kembali ke Portfolio
                    </Link>
                </div>
            </section>

            <PortfolioFooter />
        </main>
    );
}

function ProjectImageCard({ project }) {
    const imageUrl = project?.image || "/images/logo/nexarin-logo.png";

    return (
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/25">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative z-10 aspect-square overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70">
                <img
                    src={imageUrl}
                    alt={project?.title || "Project Nexarin"}
                    className="h-full w-full object-contain p-10 opacity-95"
                    loading="lazy"
                    decoding="async"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                        Tahun
                    </p>
                    <p className="mt-1 text-sm font-black text-emerald-300">
                        {project?.year || "2026"}
                    </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                        Status
                    </p>
                    <p className="mt-1 text-sm font-black text-emerald-300">
                        {project?.status || "Preview"}
                    </p>
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ title, text, icon }) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/15">
            <div className="flex items-start gap-3">
                <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-lg"
                >
                    {icon}
                </span>

                <div className="min-w-0">
                    <p className="text-sm font-black text-white">{title}</p>
                    <p className="mt-2 text-sm font-medium leading-7 text-slate-400">
                        {text || "Informasi project akan dilengkapi bertahap."}
                    </p>
                </div>
            </div>
        </div>
    );
}

function TagList({ tags }) {
    const safeTags = Array.isArray(tags) ? tags : [];

    if (safeTags.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 flex flex-wrap gap-2">
            {safeTags.map((tag) => (
                <span
                    key={tag}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

function FeatureList({ features }) {
    const safeFeatures = Array.isArray(features) ? features : [];

    if (safeFeatures.length === 0) {
        return null;
    }

    return (
        <section className="rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
                Fitur Project
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {safeFeatures.map((feature) => (
                    <div
                        key={feature}
                        className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-slate-950/55 p-4"
                    >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">
                            ✓
                        </span>

                        <p className="text-sm font-semibold leading-6 text-slate-300">
                            {feature}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function PortfolioDetailPage({ slug }) {
    const project = getPortfolioProjectBySlug(slug);

    if (!project) {
        return <DetailNotFound />;
    }

    return (
        <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <PortfolioHeader />

            <section className="relative overflow-hidden px-5 py-7 sm:px-6 sm:py-10 lg:px-8">
                <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

                <img
                    src="/images/logo/nexarin-logo.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
                    loading="lazy"
                    decoding="async"
                />

                <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:items-start">
                    <div>

                        <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
                            {project.category || "Project"}
                        </p>

                        <h1 className="mt-4 text-[2.35rem] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl">
                            {project.title || "Project Nexarin"}
                        </h1>

                        <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                            {project.summary ||
                                project.description ||
                                "Detail project akan dilengkapi bertahap."}
                        </p>

                        <TagList tags={project.tags} />

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <InfoBlock
                                icon="⚠️"
                                title="Masalah"
                                text={project.problem}
                            />

                            <InfoBlock
                                icon="✅"
                                title="Solusi"
                                text={project.solution}
                            />

                            <InfoBlock
                                icon="📌"
                                title="Hasil"
                                text={project.result}
                            />

                            <InfoBlock
                                icon="🧑‍💻"
                                title="Peran"
                                text={project.role}
                            />
                        </div>
                    </div>

                    <ProjectImageCard project={project} />
                </div>

                <div className="relative z-10 mx-auto mt-6 w-full max-w-7xl">
                    <FeatureList features={project.features} />
                </div>
            </section>

            <PortfolioFooter />
        </main>
    );
}