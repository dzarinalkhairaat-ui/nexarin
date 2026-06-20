import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import AdminNewsNav from "@/features/admin/news/components/AdminNewsNav";
import { prisma } from "@/lib/prisma";
import AdminArticlesToolbarClient from "@/features/admin/news/articles/AdminArticlesToolbarClient";
import AdminArticlesTableClient from "@/features/admin/news/articles/AdminArticlesTableClient";

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
    categoryId: article?.categoryId,
    category: article?.category?.name || "Tanpa Kategori",
    status: formatArticleStatus(article?.status),
    rawStatus: article?.status,
    headline: Boolean(article?.isHeadline),
    featured: Boolean(article?.isFeatured),
    views: article?.views ?? 0,
    date: formatArticleDate(displayDate),
  };
}

async function getAdminNewsArticles(q, status, categoryId) {
  try {
    const where = {};
    
    if (q) {
      where.title = { contains: q, mode: "insensitive" };
    }
    
    if (status && status !== "semua") {
      where.status = status;
    }
    
    if (categoryId && categoryId !== "semua") {
      where.categoryId = categoryId;
    }

    const articles = await prisma.newsArticle.findMany({
      where,
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



// Komponen statik dihapus karena sudah diganti dengan AdminArticlesTableClient

export default async function AdminNewsArticlesPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || "";
  const status = params?.status || "semua";
  const categoryId = params?.category || "semua";

  const { articles, errorMessage } = await getAdminNewsArticles(q, status, categoryId);
  const isSearchActive = Boolean(q || (status && status !== "semua") || (categoryId && categoryId !== "semua"));

  const categories = await prisma.newsCategory.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

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
          <AdminArticlesToolbarClient categories={categories} />
          <AdminArticlesTableClient articles={articles} errorMessage={errorMessage} isSearchActive={isSearchActive} categories={categories} />
        </div>
      </section>
    </main>
  );
}