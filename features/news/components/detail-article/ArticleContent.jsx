"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const ARTICLE_IMAGES = {
  "news-nexarin-akan-mengadaptasi-pondasi-rinsnews":
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1100&q=80",
  "struktur-artikel-kategori-dan-search-disiapkan":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=80",
  "konten-awal-masih-memakai-fallback-data":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1100&q=80",
  "nexarin-products-menjadi-bagian-ekosistem-digital":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=80",
  "portfolio-nexarin-disiapkan-sebagai-showcase-project":
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=80",
  "contact-menjadi-jalur-komunikasi-awal-nexarin":
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1100&q=80",
};

const DEFAULT_FALLBACK_ARTICLE_IMAGE =
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1100&q=80";

const NEXARIN_LOGO = "/images/logo/nexarin-logo.png";
const SITE_URL = "https://nexarin.my.id";

const SHARE_ICONS = {
  whatsapp: "https://cdn.simpleicons.org/whatsapp/25D366",
  facebook: "https://cdn.simpleicons.org/facebook/1877F2",
  link: "https://api.iconify.design/lucide:link-2.svg?color=%2367e8f9",
};

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function isDatabaseArticle(article) {
  return article?.source === "database";
}

function getDirectArticleImage(article) {
  return String(
    article?.image ||
      article?.coverImageUrl ||
      article?.cover_image_url ||
      article?.thumbnail ||
      ""
  ).trim();
}

function getArticleImage(article, options = {}) {
  const { allowFallback = true } = options;
  const safeArticle = article || {};
  const directImage = getDirectArticleImage(safeArticle);

  if (directImage) {
    return directImage;
  }

  if (!allowFallback || isDatabaseArticle(safeArticle)) {
    return "";
  }

  return ARTICLE_IMAGES[safeArticle.slug] || DEFAULT_FALLBACK_ARTICLE_IMAGE;
}

function getPublishedDateLabel(article) {
  const rawDate = article?.publishedDate || article?.date || "2026-05-04";
  const [year, month, day] = String(rawDate).slice(0, 10).split("-");

  if (!year || !month || !day) {
    return rawDate;
  }

  const monthName = MONTH_NAMES[Number(month) - 1] || month;

  return `${Number(day)} ${monthName} ${year}`;
}

function getArticleYoutubeUrl(article) {
  return (
    article?.youtubeUrl ||
    article?.youtube_url ||
    article?.videoUrl ||
    article?.video_url ||
    ""
  );
}

function getSafeSourceName(value) {
  const sourceName = String(value || "").trim();

  if (
    !sourceName ||
    sourceName === "database" ||
    sourceName === "fallback" ||
    sourceName === "preview"
  ) {
    return "Nexarin by-rins";
  }

  return sourceName;
}

function getArticleSources(article) {
  const articleSourceName = getSafeSourceName(
    article?.articleSourceName ||
      article?.sourceArticleName ||
      article?.sourceName ||
      article?.source_name ||
      article?.source
  );

  const articleSourceUrl =
    article?.articleSourceUrl ||
    article?.sourceArticleUrl ||
    article?.sourceUrl ||
    article?.source_url ||
    "";

  const videoSourceName =
    article?.videoSourceName ||
    article?.youtubeChannelName ||
    article?.channelName ||
    article?.channel ||
    (getArticleYoutubeUrl(article) ? "Video terkait" : "");

  const videoSourceUrl =
    article?.videoSourceUrl ||
    article?.youtubeChannelUrl ||
    getArticleYoutubeUrl(article) ||
    "";

  return {
    article: {
      name: articleSourceName,
      url: articleSourceUrl,
    },
    video: {
      name: videoSourceName,
      url: videoSourceUrl,
    },
  };
}

function getYouTubeEmbedUrl(url) {
  if (!url || typeof url !== "string") {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || "";
      } else if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      } else {
        videoId = parsedUrl.searchParams.get("v") || "";
      }
    }

    if (!videoId) {
      return "";
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

function getArticleParagraphs(article) {
  if (Array.isArray(article?.content) && article.content.length > 0) {
    return article.content.filter(Boolean);
  }

  if (typeof article?.body === "string" && article.body.trim()) {
    return article.body
      .split("\n")
      .map((text) => text.trim())
      .filter(Boolean);
  }

  return [
    article?.excerpt ||
      "Artikel ini memakai fallback data agar halaman detail tetap aman sebelum database dan admin dashboard dihubungkan.",
    "Fondasi News Nexarin dibuat bertahap dengan pendekatan mobile-first, struktur file terpisah, dan fallback data. Tujuannya supaya halaman tetap stabil, tidak blank putih, dan mudah dikembangkan ke sistem berita penuh.",
    "Nantinya modul News dapat dikembangkan menjadi portal informasi yang memiliki headline, artikel terbaru, artikel populer, kategori, pencarian, detail artikel, share button, dan integrasi data dari backend.",
    "Desain awal ini mengambil arah dari pengalaman RinsNews, namun tetap disesuaikan dengan identitas Nexarin by-rins yang gelap, premium, ringan, dan rapi di tampilan mobile.",
  ];
}

function getArticleShareUrl(article) {
  const slug = String(article?.slug || "preview").trim();

  return `${SITE_URL}/news/artikel/${slug}`;
}

async function copyTextToClipboard(text) {
  const value = String(text || "").trim();

  if (!value || typeof window === "undefined") {
    return false;
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fallback manual di bawah.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    return success;
  } catch {
    return false;
  }
}

function ArticleCoverPlaceholder({ article }) {
  const category = article?.category || "News";

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(6,182,212,0.22),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.35),rgba(2,6,23,0.95))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:28px_28px]" />

      <img
        src={NEXARIN_LOGO}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rotate-12 object-contain opacity-[0.08]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border border-cyan-300/25 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
          <img
            src={NEXARIN_LOGO}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className="mt-4 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200">
          {category}
        </p>

        <p className="mt-2 max-w-[240px] text-xs font-semibold leading-5 text-slate-400">
          Visual artikel belum ditambahkan
        </p>
      </div>
    </div>
  );
}

function ArticleCover({ article }) {
  const safeArticle = article || {};
  const imageUrl = getArticleImage(safeArticle);

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-cyan-300/15 bg-slate-950 shadow-2xl shadow-black/25">
      <div className="relative aspect-[16/9] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={safeArticle.title || "Artikel Nexarin News"}
            className="h-full w-full object-cover opacity-85"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <ArticleCoverPlaceholder article={safeArticle} />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/28 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(16,185,129,0.2),transparent_34%),radial-gradient(circle_at_82%_70%,rgba(6,182,212,0.16),transparent_36%)]" />
      </div>
    </div>
  );
}

function ArticleInfo({ article }) {
  return (
    <div className="mt-3 flex justify-center">
      <div className="inline-flex max-w-full items-center justify-center gap-2 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] px-3.5 py-2.5 shadow-lg shadow-black/10 backdrop-blur-xl">
        <span className="min-w-0 max-w-[132px] truncate text-xs font-black text-white">
          {article?.author || "Nexarin by-rins"}
        </span>

        <span className="h-4 w-px shrink-0 bg-white/10" />

        <span className="shrink-0 text-xs font-black text-cyan-100">
          {getPublishedDateLabel(article)}
        </span>
      </div>
    </div>
  );
}

function ShareLinks({ article }) {
  const [copyStatus, setCopyStatus] = useState("");

  const title = article?.title || "Artikel Nexarin News";
  const articleUrl = useMemo(() => getArticleShareUrl(article), [article]);
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  async function handleCopyFallback() {
    const copied = await copyTextToClipboard(articleUrl);

    setCopyStatus(
      copied ? "Link artikel berhasil disalin." : "Link belum bisa disalin otomatis."
    );

    window.setTimeout(() => {
      setCopyStatus("");
    }, 2400);
  }

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url: articleUrl,
        });

        return;
      } catch {
        // User bisa membatalkan native share; tidak perlu dianggap error.
        return;
      }
    }

    await handleCopyFallback();
  }

  return (
    <div className="mt-3 flex flex-col items-center justify-center">
      <div className="inline-flex max-w-full items-center justify-center gap-2.5 rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-2.5 shadow-lg shadow-black/10 backdrop-blur-xl">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Bagikan ke WhatsApp"
          title="Bagikan ke WhatsApp"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/15 bg-slate-950/60 p-2.5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-400/10"
        >
          <img
            src={SHARE_ICONS.whatsapp}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </a>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Bagikan ke Facebook"
          title="Bagikan ke Facebook"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/15 bg-slate-950/60 p-2.5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-400/10"
        >
          <img
            src={SHARE_ICONS.facebook}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </a>

        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Bagikan link artikel"
          title="Bagikan link artikel"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/15 bg-slate-950/60 p-2.5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-400/10"
        >
          <img
            src={SHARE_ICONS.link}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </button>
      </div>

      {copyStatus ? (
        <p className="mt-2 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1.5 text-center text-[11px] font-bold text-emerald-300">
          {copyStatus}
        </p>
      ) : null}
    </div>
  );
}

function ArticleVideo({ article }) {
  const youtubeUrl = getArticleYoutubeUrl(article);
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="my-7 overflow-hidden rounded-[28px] border border-cyan-400/15 bg-white/[0.04] p-3 shadow-xl shadow-black/10 backdrop-blur-xl">
      <p className="mb-3 px-1 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">
        Video Terkait Artikel Ini
      </p>

      <div className="relative aspect-video overflow-hidden rounded-[22px] border border-white/10 bg-slate-950 shadow-lg shadow-black/20">
        <iframe
          src={embedUrl}
          title={article?.title || "Video artikel Nexarin News"}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function BacaJugaThumbnail({ article }) {
  const imageUrl = getArticleImage(article);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={article?.title || "Baca juga Nexarin News"}
        className="h-full w-full object-cover opacity-85"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.28),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.22),transparent_36%)]">
      <img
        src={NEXARIN_LOGO}
        alt=""
        aria-hidden="true"
        className="h-10 w-10 object-contain opacity-80"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function BacaJugaBox({ article }) {
  if (!article) {
    return null;
  }

  const articleHref = `/news/artikel/${article.slug || "preview"}`;

  return (
    <Link
      href={articleHref}
      className="my-6 flex items-center gap-3 overflow-hidden rounded-[24px] border border-cyan-400/15 bg-cyan-400/[0.07] p-3 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-400/10"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-slate-950">
        <BacaJugaThumbnail article={article} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-black uppercase tracking-[0.18em] text-cyan-300">
          Baca Juga
        </p>

        <h3 className="mt-1.5 line-clamp-2 text-sm font-black leading-tight tracking-[-0.035em] text-white">
          {article.title || "Artikel terkait Nexarin"}
        </h3>

        <p className="mt-1.5 line-clamp-1 text-xs font-medium leading-5 text-slate-400">
          {article.excerpt ||
            "Ringkasan artikel terkait akan ditampilkan di sini."}
        </p>
      </div>
    </Link>
  );
}

function SourceLink({ source }) {
  if (!source?.name) {
    return <span className="font-black text-cyan-200">-</span>;
  }

  if (source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="break-words font-black text-cyan-200 underline decoration-cyan-300/30 underline-offset-4 transition hover:text-white"
      >
        {source.name}
      </a>
    );
  }

  return (
    <span className="break-words font-black text-cyan-200">
      {source.name}
    </span>
  );
}

function SourceArticleBox({ article }) {
  const sources = getArticleSources(article);

  return (
    <div className="mt-5 flex">
      <div className="w-fit max-w-full rounded-[20px] border border-cyan-400/15 bg-cyan-400/[0.065] px-3.5 py-2.5 shadow-lg shadow-black/10">
        <div className="space-y-1.5 text-xs font-medium leading-5 text-slate-300">
          <p>
            <span className="font-black text-slate-400">Sumber Artikel :</span>{" "}
            <SourceLink source={sources.article} />
          </p>

          {sources.video?.name ? (
            <p>
              <span className="font-black text-slate-400">Sumber Video :</span>{" "}
              <SourceLink source={sources.video} />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ArticleContent({ article, relatedArticles }) {
  const paragraphs = getArticleParagraphs(article);
  const bacaJugaArticle = Array.isArray(relatedArticles)
    ? relatedArticles[0]
    : null;

  return (
    <section className="relative px-5 pb-8 pt-2 text-white sm:px-6 sm:pb-10 sm:pt-3 lg:px-8">
      <article className="relative z-10 mx-auto w-full max-w-3xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(16,185,129,0.13),transparent_34%),radial-gradient(circle_at_88%_42%,rgba(6,182,212,0.1),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <div className="relative z-10">
          <ArticleCover article={article} />

          <ArticleInfo article={article} />

          <ShareLinks article={article} />

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="space-y-5 text-sm font-medium leading-8 text-slate-300 sm:text-base sm:leading-8">
              {paragraphs.map((paragraph, index) => (
                <div key={`${paragraph.slice(0, 18)}-${index}`}>
                  <p>{paragraph}</p>

                  {index === 1 ? (
                    <>
                      <ArticleVideo article={article} />
                      <BacaJugaBox article={bacaJugaArticle} />
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <SourceArticleBox article={article} />
        </div>
      </article>
    </section>
  );
}