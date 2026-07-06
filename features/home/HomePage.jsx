import ScrollReveal from "@/components/shared/ScrollReveal";
import Header from "@/components/shared/Header";
import HomeHero from "@/features/home/components/HomeHero";
import HomeProgressChart from "@/features/home/components/HomeProgressChart";
import HomePortfolioPreview from "@/features/home/components/HomePortfolioPreview";
import HomeNewsPreview from "@/features/home/components/HomeNewsPreview";
import HomeAboutPreview from "@/features/home/components/HomeAboutPreview";
import HomeSlendroAi from "@/features/home/components/HomeSlendroAi";
import HomeFooter from "@/features/home/components/HomeFooter";
import { prisma } from "@/lib/prisma";

// Helpers for formatting news articles (similar to NewsPage)
const DEFAULT_CATEGORY_NAME = "Nexarin News";
const DEFAULT_CATEGORY_SLUG = "news";

function getPlainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_`>[\\\](){}~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSafeExcerpt(article) {
  const summary = getPlainText(article?.summary || article?.excerpt);
  if (summary) return summary;
  const contentPreview = getPlainText(article?.content);
  if (!contentPreview) return "";
  return contentPreview.length > 160 ? `${contentPreview.slice(0, 157)}...` : contentPreview;
}

function formatPublicArticleDate(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

async function getHomeNewsArticles() {
  try {
    const now = new Date();
    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
        category: { is: { isActive: true } },
      },
      include: {
        category: { select: { name: true, slug: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 4, // 1 for featured, 3 for latest
    });

    return articles.map((article, index) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      category: article.category?.name || DEFAULT_CATEGORY_NAME,
      excerpt: getSafeExcerpt(article),
      date: formatPublicArticleDate(article.publishedAt || article.createdAt),
      image: article.coverImageUrl || "",
    })).filter(a => a.slug && a.title);
  } catch (error) {
    console.error("Gagal mengambil artikel Home News dari database:", error);
    return [];
  }
}

export default async function HomePage() {
  const newsArticles = await getHomeNewsArticles();

  return (
    <main className="relative min-h-screen overflow-hidden text-white selection:bg-emerald-400/30" style={{ backgroundColor: '#030711' }}>
      <Header />

      <ScrollReveal delay={0}>
        <HomeHero />
      </ScrollReveal>

      <ScrollReveal delay={30}>
        <HomeProgressChart />
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <HomeSlendroAi />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <HomePortfolioPreview />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <HomeNewsPreview articles={newsArticles} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <HomeFooter />
      </ScrollReveal>

      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(26,43,71,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(26,43,71,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </main>
  );
}