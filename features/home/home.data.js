export const homeData = {
  eyebrow: "Nexarin by-rins",
  title: "Digital ecosystem untuk karya, portfolio, dan news.",
  description:
    "Nexarin adalah rumah utama untuk ekosistem digital by-rins: tempat showcase project, portal informasi, dan identitas brand dibangun dalam satu platform yang rapi, stabil, dan mobile-first.",
  primaryCta: {
    label: "Lihat Portfolio",
    href: "/portfolio",
  },
  secondaryCta: {
    label: "Baca Berita",
    href: "/news",
  },
  highlights: [
    {
      icon: "💼",
      label: "Portfolio Showcase",
    },
    {
      icon: "📰",
      label: "News Portal",
    },
    {
      icon: "⚡",
      label: "Creative Tech",
    },
  ],
  ecosystemCards: [
    {
      icon: "💼",
      title: "Portfolio Showcase",
      description:
        "Ruang untuk menampilkan project digital, studi kasus, dan karya by-rins.",
    },
    {
      icon: "📰",
      title: "News Portal",
      description:
        "Portal informasi yang nanti dikembangkan mengikuti pondasi RinsNews.",
    },
  ],
};

export const homePortfolioPreview = {
  eyebrow: "Portfolio",
  title:
    "Showcase project yang dibangun dengan fokus fungsi, tampilan, dan stabilitas.",
  description:
    "Portfolio Nexarin akan menampilkan project digital by-rins dalam format showcase yang rapi, lengkap dengan konteks masalah, solusi, dan teknologi yang dipakai.",
  cta: {
    label: "Buka Portfolio",
    href: "/portfolio",
  },
  featured: {
    title: "RinsNews Portal",
    type: "News Platform",
    status: "Reference Project",
    description:
      "Portal berita custom dengan frontend public, admin dashboard, kategori, artikel, media, SEO dasar, dan integrasi data.",
    problem:
      "Membutuhkan portal berita yang rapi, ringan, mudah dikelola, dan tetap aman di tampilan mobile.",
    solution:
      "Dibangun dengan struktur file terpisah, tampilan responsif, fallback data, serta alur deploy manual yang aman.",
    stacks: ["HTML", "CSS", "JavaScript", "Supabase", "Cloudflare"],
  },
  items: [
    {
      title: "Nexarin Coming Soon",
      type: "Landing Page",
      description:
        "Halaman awal Nexarin dengan tampilan premium, gear animation, dan static deploy ke Cloudflare Pages.",
      stacks: ["Next.js", "Tailwind", "Cloudflare"],
    },
  ],
};

export const homeNewsPreview = {
  eyebrow: "News",
  title: "Ruang informasi yang nanti berkembang menjadi portal berita Nexarin.",
  description:
    "News di Nexarin akan menjadi portal informasi yang rapi, ringan, dan mobile-first. Untuk implementasi penuh, desain dan alurnya nanti akan diadaptasi dari RinsNews.",
  cta: {
    label: "Buka News",
    href: "/news",
  },
  topics: ["Teknologi", "Digital", "Produk", "Update", "Insight"],
  featured: {
    title: "Nexarin News sedang disiapkan sebagai portal informasi by-rins.",
    category: "Update",
    date: "Coming Soon",
    excerpt:
      "Halaman News akan dibuat bertahap dengan headline, latest news, popular news, kategori, artikel detail, search, dan share button.",
  },
  items: [
    {
      title: "News Nexarin akan mengadaptasi pondasi desain dari RinsNews.",
      category: "Project",
      date: "Preview",
    },
    {
      title:
        "Struktur artikel, kategori, dan search disiapkan sebagai mini-system.",
      category: "System",
      date: "Planned",
    },
    {
      title: "Konten awal masih memakai fallback sampai database siap.",
      category: "Data",
      date: "Static-first",
    },
  ],
};
