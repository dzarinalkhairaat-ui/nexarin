export const SITE_CONFIG = {
  name: "Nexarin Tech Hub",
  brand: "Nexarin by Rins",
  description: "Ekosistem Informasi Teknologi, AI, Edukasi, Gadget, Otomotif & Toko Produk Digital Siap Pakai.",
  url: "https://nexarin.tech",
  author: "Rins / Nexarin Team",
  links: {
    github: "https://github.com/nexarin",
    twitter: "https://twitter.com/nexarintech",
    youtube: "https://youtube.com/@nexarintech",
  }
};

export const CATEGORIES = [
  { id: "ai", name: "AI", slug: "ai", description: "Perkembangan Artificial Intelligence, LLM, Machine Learning, dan Tool AI terbaru.", icon: "Sparkles", color: "from-cyan-500 to-blue-600" },
  { id: "technology", name: "Technology", slug: "technology", description: "Inovasi software engineering, cloud architecture, dev tools, dan ekosistem open-source.", icon: "Cpu", color: "from-blue-500 to-indigo-600" },
  { id: "digital", name: "Digital", slug: "digital", description: "Transformasi bisnis digital, ekosistem SaaS, startup, dan produktivitas era modern.", icon: "Globe", color: "from-emerald-500 to-teal-600" },
  { id: "gadget", name: "Gadget", slug: "gadget", description: "Ulasan smartphone, laptop workstation, hardware peripherals, dan teknologi komputasi.", icon: "Smartphone", color: "from-amber-500 to-orange-600" },
  { id: "automotive", name: "Automotive", slug: "automotive", description: "Teknologi kendaraan listrik (EV), mobilitas cerdas, dan sistem kemudi otonom.", icon: "Car", color: "from-rose-500 to-red-600" },
  { id: "tutorials", name: "Tutorials", slug: "tutorials", description: "Panduan teknis langkah demi langkah yang terstruktur dan mudah dipahami.", icon: "BookOpen", color: "from-purple-500 to-indigo-600" },
  { id: "reviews", name: "Reviews", slug: "reviews", description: "Evaluasi objektif mendalam tentang software, platform digital, dan perangkat keras.", icon: "Star", color: "from-yellow-500 to-amber-600" },
  { id: "tools", name: "Tools", slug: "tools", description: "Koleksi tools, utilities, dan extension terbaik pilihan kurasi editor.", icon: "Wrench", color: "from-cyan-500 to-emerald-600" },
  { id: "free-resources", name: "Free Resources", slug: "free-resources", description: "Starter kit, template website, source code, dan assets gratis siap pakai.", icon: "Download", color: "from-teal-500 to-cyan-600" },
  { id: "news", name: "News", slug: "news", description: "Kabar terhangat dan dinamika industri teknologi global secara real-time.", icon: "Newspaper", color: "from-slate-500 to-zinc-600" },
];

// Main 5-Pillar Global Navigation
export const NAV_LINKS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Tech Info", href: "/tech-info", icon: "Newspaper" },
  { label: "Tutorials", href: "/tutorials", icon: "BookOpen" },
  { label: "Shop", href: "/shop", icon: "ShoppingBag" },
  { label: "Free Resources", href: "/free-resources", icon: "Download" },
];

// Contextual Tech Info Navigation Links
export const TECH_INFO_NAV_LINKS = [
  { label: "Semua Berita", href: "/tech-info", category: "all", icon: "Newspaper" },
  { label: "AI", href: "/tech-info/ai", category: "ai", icon: "Sparkles" },
  { label: "Technology", href: "/tech-info/technology", category: "technology", icon: "Cpu" },
  { label: "Digital", href: "/tech-info/digital", category: "digital", icon: "Globe" },
  { label: "Gadget", href: "/tech-info/gadget", category: "gadget", icon: "Smartphone" },
  { label: "Automotive", href: "/tech-info/automotive", category: "automotive", icon: "Car" },
];
