export const portfolioNavigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
  },
  {
    label: "News",
    href: "/news",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const portfolioHeroData = {
  eyebrow: "Portfolio",
  title: "Showcase project digital by-rins.",
  description:
    "Halaman ini akan menjadi tempat menampilkan project, studi kasus, teknologi yang dipakai, dan hasil pengembangan dalam ekosistem Nexarin.",
  primaryCta: {
    label: "Lihat Project",
    href: "#portfolio-projects",
  },
  secondaryCta: {
    label: "Hubungi Nexarin",
    href: "/contact",
  },
};

export const featuredProjectData = {
  slug: "rinsnews-portal",
  title: "RinsNews Portal",
  category: "Featured Project",
  status: "Reference Project",
  description:
    "Project portal berita custom yang menjadi referensi penting untuk pengembangan modul News di Nexarin.",
  problem:
    "Membutuhkan portal berita yang rapi, ringan, mudah dikelola, dan tetap aman di tampilan mobile.",
  solution:
    "Dibangun dengan struktur file terpisah, tampilan responsif, fallback data, serta alur deploy manual yang aman.",
  tags: ["HTML", "CSS", "JavaScript", "Supabase", "Cloudflare"],
};

export const portfolioProjects = [
  {
    slug: "rinsnews-portal",
    title: "RinsNews Portal",
    category: "News Platform",
    status: "Reference Project",
    description:
      "Portal berita custom dengan frontend public, kategori, artikel, media, SEO dasar, dan admin dashboard.",
    summary:
      "RinsNews menjadi project referensi untuk membangun sistem berita Nexarin yang ringan, rapi, dan mudah dikembangkan.",
    problem:
      "Dibutuhkan portal berita custom yang tidak bergantung pada CMS berat, tetap cepat di mobile, dan mudah dipoles bertahap.",
    solution:
      "Dibangun dengan struktur file terpisah, UI responsif, integrasi Supabase, fallback data, serta workflow deploy manual ke Cloudflare Pages.",
    result:
      "Fondasi portal berita berhasil dibuat dengan halaman publik, kategori, artikel, search, media, SEO dasar, dan admin dashboard.",
    year: "2026",
    role: "Frontend, UI polish, struktur project, dan integrasi Supabase",
    image: "/images/logo/nexarin-logo.png",
    tags: ["HTML", "CSS", "JavaScript", "Supabase", "Cloudflare"],
    features: [
      "Homepage berita responsif",
      "Halaman artikel dan kategori",
      "Search page",
      "Admin dashboard",
      "Upload media",
      "Integrasi Supabase",
      "Deploy manual Cloudflare Pages",
    ],
  },
  {
    slug: "nexarin-products",
    title: "Nexarin Products",
    category: "Digital Store",
    status: "Foundation",
    description:
      "Fondasi katalog produk digital dengan kategori, semua produk, checkout manual, dan struktur siap dikembangkan.",
    summary:
      "Nexarin Products adalah fondasi marketplace digital by-rins yang disiapkan untuk produk digital, PPOB, ebook, template, dan layanan custom.",
    problem:
      "Diperlukan fondasi produk yang mobile-first, aman dari blank putih, dan mudah dikembangkan sebelum masuk backend/payment.",
    solution:
      "Dibangun memakai Next.js dan Tailwind dengan data statis sementara, fallback image, halaman kategori, detail produk, dan checkout manual.",
    result:
      "Halaman products, semua produk, kategori, detail produk, dan checkout manual sudah tersedia sebagai fondasi awal.",
    year: "2026",
    role: "Frontend foundation, UI polish, routing produk, dan checkout manual",
    image: "/images/logo/nexarin-logo.png",
    tags: ["Next.js", "Tailwind", "Static-first"],
    features: [
      "Products main page",
      "Semua produk",
      "Kategori produk",
      "Detail produk",
      "Checkout manual",
      "Fallback image",
      "Struktur siap backend",
    ],
  },
  {
    slug: "nexarin-coming-soon",
    title: "Nexarin Coming Soon",
    category: "Landing Page",
    status: "Online",
    description:
      "Halaman awal premium mobile-first dengan animasi smooth, header, footer, dan deploy Cloudflare Pages.",
    summary:
      "Coming Soon Nexarin menjadi halaman awal sebelum semua modul utama dibangun, dengan fokus pada tampilan premium dan mobile-first.",
    problem:
      "Diperlukan halaman awal yang cepat online, ringan, aman untuk Cloudflare Pages, dan tetap terlihat premium di HP.",
    solution:
      "Dibuat menggunakan Next.js dan Tailwind, dengan layout clean, animasi ringan, fallback visual, dan deployment static-first.",
    result:
      "Coming Soon berhasil online sebagai landing awal Nexarin sebelum diganti menjadi homepage utama.",
    year: "2026",
    role: "UI design, frontend, mobile polish, dan deploy preparation",
    image: "/images/logo/nexarin-logo.png",
    tags: ["Next.js", "Mobile-first", "Cloudflare"],
    features: [
      "Coming Soon page",
      "Mobile-first layout",
      "Premium dark UI",
      "Animasi ringan",
      "Cloudflare Pages ready",
    ],
  },
];

export const portfolioFooterData = {
  title: "Punya project yang ingin ditampilkan?",
  description:
    "Portfolio Nexarin akan terus dikembangkan untuk menampilkan project digital, produk, dan karya by-rins.",
  cta: {
    label: "Hubungi Nexarin",
    href: "/contact",
  },
};

export function getPortfolioProjects() {
  return Array.isArray(portfolioProjects) ? portfolioProjects : [];
}

export function getPortfolioProjectBySlug(slug) {
  const projects = getPortfolioProjects();
  return projects.find((project) => project?.slug === slug) || null;
}