import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import AdminNewsNav from "@/features/admin/news/components/AdminNewsNav";
import { prisma } from "@/lib/prisma";
import { deleteNewsArticleAction } from "@/features/admin/news/articles/adminNewsArticle.actions";

export const dynamic = "force-dynamic";

const adminArticleStatusLabels = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

function formatBoolean(value) {
  return value ? "Ya" : "Tidak";
}

function formatArticleStatus(status) {
  return adminArticleStatusLabels?.[status] || "Draft";
}

function formatArticleDate(date) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function mapNewsArticleToAdminTable(article) {
  const displayDate = article?.publishedAt || article?.createdAt;

  return {
    id: article?.id,
    title: article?.title,
    slug: article?.slug,
    category: article?.category?.name || "Tanpa Kategori",
    status: formatArticleStatus(article?.status),
    headline: Boolean(article?.isHeadline),
    featured: Boolean(article?.isFeatured),
    views: article?.views ?? 0,
    date: formatArticleDate(displayDate),
  };
}

async function getAdminNewsArticles() {
  try {
    const articles = await prisma.newsArticle.findMany({
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      articles: articles.map(mapNewsArticleToAdminTable),
      errorMessage: "",
    };
  } catch (error) {
    console.error("Gagal mengambil artikel News:", error);

    return {
      articles: [],
      errorMessage:
        "Database artikel belum bisa dibaca. Cek koneksi Prisma, DATABASE_URL, dan tabel news_articles.",
    };
  }
}

function AdminArticlesHeader() {
  return (
    <section className="relative px-5 pb-4 pt-6 text-white sm:px-6 sm:pb-6 sm:pt-8 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl text-center lg:text-left">
        <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
          Artikel News
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl text-[2.1rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
          Semua artikel News.
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
          Pantau artikel, status publish, headline, featured, jumlah dilihat,
          tanggal, dan aksi.
        </p>
      </div>
    </section>
  );
}

function AdminArticlesToolbar() {
  return (
    <section className="relative px-5 pb-5 text-white sm:px-6 sm:pb-7 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px_170px_auto] lg:items-end">
            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                Cari Artikel
              </span>

              <input
                type="search"
                placeholder="Cari judul artikel..."
                className="min-h-11 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                Status
              </span>

              <select className="min-h-11 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400/50">
                <option>Semua Status</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                Kategori
              </span>

              <select className="min-h-11 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400/50">
                <option>Semua Kategori</option>
                <option>Teknologi</option>
                <option>Digital</option>
                <option>Produk</option>
                <option>Update</option>
                <option>Insight</option>
              </select>
            </label>

            <Link
              href="/admin/news/tulis-artikel"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              Tulis Artikel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeleteArticleForm({ articleId }) {
  return (
    <form action={deleteNewsArticleAction} className="w-full">
      <input type="hidden" name="articleId" value={articleId || ""} />

      <button
        type="submit"
        className="inline-flex min-h-10 w-full items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-3 py-2 text-xs font-black text-red-200 transition hover:bg-red-400/15 lg:rounded-xl"
      >
        Hapus
      </button>
    </form>
  );
}

function EditArticleLink({ articleSlug, className = "" }) {
  return (
    <Link
      href={`/admin/news/edit-artikel/${articleSlug || ""}`}
      className={className}
    >
      Edit
    </Link>
  );
}

function ArticleMobileCard({ article }) {
  return (
    <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/15 backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
            {article?.category || "Kategori"}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300">
            {article?.status || "Draft"}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-black leading-tight tracking-[-0.04em] text-white">
          {article?.title || "Judul artikel"}
        </h3>

        <p className="mt-2 truncate text-xs font-semibold text-slate-500">
          /{article?.slug || "slug-artikel"}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Headline
            </p>
            <p className="mt-1 text-sm font-black text-white">
              {formatBoolean(article?.headline)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Featured
            </p>
            <p className="mt-1 text-sm font-black text-white">
              {formatBoolean(article?.featured)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Dilihat
            </p>
            <p className="mt-1 text-sm font-black text-emerald-300">
              {article?.views ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Tanggal
            </p>
            <p className="mt-1 text-sm font-black text-slate-300">
              {article?.date || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-slate-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-200"
          >
            Lihat
          </button>

          <EditArticleLink
            articleSlug={article?.slug}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
          />

          <DeleteArticleForm articleId={article?.id} />
        </div>
      </div>
    </article>
  );
}

function AdminArticlesEmptyState({ errorMessage }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
          Belum Ada Artikel
        </p>

        <h3 className="mt-3 text-2xl font-black tracking-[-0.045em] text-white">
          Database artikel masih kosong.
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-400">
          Setelah artikel pertama dibuat dari halaman Tulis Artikel, data akan
          tampil otomatis di tabel ini.
        </p>

        {errorMessage ? (
          <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-xs font-bold leading-6 text-red-200">
            {errorMessage}
          </p>
        ) : null}

        <Link
          href="/admin/news/tulis-artikel"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
        >
          Tulis Artikel
        </Link>
      </div>
    </div>
  );
}

function AdminArticlesTable({ articles, errorMessage }) {
  const safeArticles = Array.isArray(articles) ? articles : [];
  const hasArticles = safeArticles.length > 0;

  return (
    <section className="relative px-5 pb-10 pt-3 text-white sm:px-6 sm:pb-12 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400" />

          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Tabel Artikel
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Data artikel dari database News.
            </p>
          </div>
        </div>

        {!hasArticles ? (
          <AdminArticlesEmptyState errorMessage={errorMessage} />
        ) : (
          <>
            <div className="grid gap-3 lg:hidden">
              {safeArticles.map((article) => (
                <ArticleMobileCard
                  key={article?.id || article?.slug}
                  article={article}
                />
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left">
                  <thead className="border-b border-white/10 bg-slate-950/55">
                    <tr>
                      {[
                        "Judul",
                        "Kategori",
                        "Status",
                        "Headline",
                        "Featured",
                        "Dilihat",
                        "Tanggal",
                        "Aksi",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {safeArticles.map((article) => (
                      <tr
                        key={article?.id || article?.slug}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <td className="max-w-[320px] px-4 py-4">
                          <p className="line-clamp-2 text-sm font-black leading-5 text-white">
                            {article?.title || "Judul artikel"}
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                            /{article?.slug || "slug-artikel"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                            {article?.category || "Kategori"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300">
                            {article?.status || "Draft"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm font-black text-slate-300">
                          {formatBoolean(article?.headline)}
                        </td>

                        <td className="px-4 py-4 text-sm font-black text-slate-300">
                          {formatBoolean(article?.featured)}
                        </td>

                        <td className="px-4 py-4 text-sm font-black text-emerald-300">
                          {article?.views ?? 0}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-slate-400">
                          {article?.date || "-"}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-slate-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-200"
                            >
                              Lihat
                            </button>

                            <EditArticleLink
                              articleSlug={article?.slug}
                              className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
                            />

                            <DeleteArticleForm articleId={article?.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default async function AdminNewsArticlesPage() {
  const { articles, errorMessage } = await getAdminNewsArticles();

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />
      <AdminNewsNav />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-10">
          <AdminArticlesHeader />
          <AdminArticlesToolbar />
          <AdminArticlesTable articles={articles} errorMessage={errorMessage} />
        </div>
      </section>
    </main>
  );
}