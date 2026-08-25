import { Article } from "@/types/content";

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-1",
    sourceId: "src-ai-001",
    title: "Revolusi Autonomous AI Agents di 2026: Mengapa Workflow Berbasis Agent Menggantikan Chatbot Konvensional",
    slug: "revolusi-autonomous-ai-agents-2026-workflow-menggantikan-chatbot",
    excerpt: "Eksplorasi mendalam bagaimana arsitektur AI agentik mengubah automasi industri, memadukan planning, execution, dan tool use tanpa intervensi manual berulang.",
    content: `Perkembangan Artificial Intelligence telah melompat dari sekadar percakapan interaktif (*conversational AI*) menuju era sistem swatantra (*Autonomous AI Agents*). Jika pada tahun-tahun sebelumnya kita terbiasa dengan prompting statis, kini agen cerdas mampu merencanakan tugas multi-langkah (*planning*), menggunakan tools eksternal (*tool calling*), serta melakukan refleksi dan evaluasi diri (*self-correction*).

### Dari Chatbot ke Sistem Agentik

Perbedaan mendasar antara chatbot konvensional dan agen modern terletak pada kemampuan eksekusi. Chatbot hanya merespons input teks, sedangkan agen AI memiliki loop kognitif yang terdiri dari:

1. **Perception**: Memahami konteks instruksi dan state lingkungan.
2. **Planning**: Memecah instruksi kompleks menjadi sub-task yang terukur.
3. **Action / Tool Use**: Mengakses API, database, shell command, atau browsing web secara mandiri.
4. **Reflection**: Memeriksa apakah output aksi telah memenuhi kriteria kesuksesan.

\`\`\`typescript
// Contoh implementasi loop reasoning agen
interface AgentTask {
  goal: string;
  steps: Array<{ action: string; tool: string; result?: any }>;
  isComplete: boolean;
}
\`\`\`

### Dampak Nyata pada Pengembangan Software

Dalam ranah rekayasa perangkat lunak, paradigma ini memungkinkan coding agent untuk tidak hanya menulis satu fungsi, melainkan melakukan refactoring seluruh arsitektur repositori, menjalankan pengujian otomatis, dan menyelesaikan bug regression secara komprehensif.

Bagi tim engineering dan bisnis digital, adopsi workflow agentik bukan lagi sekadar opsi efisiensi, melainkan keunggulan kompetitif inti. Platform seperti **Nexarin Tech Hub** dibangun dengan mengintegrasikan pipeline asisten editorial Gemini Spark untuk menopang kurasi informasi berkualitas tinggi.`,
    contentType: "analysis",
    category: {
      id: "ai",
      name: "AI",
      slug: "ai",
      description: "Perkembangan Artificial Intelligence, LLM, Machine Learning, dan Tool AI terbaru.",
      icon: "Sparkles",
      color: "from-cyan-500 to-blue-600"
    },
    tags: ["AI Agents", "LLM", "Automation", "Software Engineering"],
    featuredImage: "/assets/article-ai.svg",
    metaTitle: "Revolusi Autonomous AI Agents di 2026 | Nexarin Tech Hub",
    metaDescription: "Analisis mendalam mengenai lompatan teknologi Autonomous AI Agents dan dampaknya terhadap produktivitas rekayasa digital modern.",
    status: "published",
    author: {
      name: "Rins",
      role: "Lead Tech Architect",
      avatar: "/assets/avatar-default.svg"
    },
    readingTimeMinutes: 5,
    views: 3420,
    publishedAt: "2026-08-20T09:00:00Z",
    createdAt: "2026-08-20T08:30:00Z",
    updatedAt: "2026-08-20T09:00:00Z",
    featured: true,
    breaking: true,
    relatedProductId: "prod-admin-pro",
    affiliateId: "aff-1",
  },
  {
    id: "art-2",
    sourceId: "src-tech-002",
    title: "Arsitektur Full-Stack Modern: Mengapa Next.js App Router & Supabase Jadi Standar Baru SaaS",
    slug: "arsitektur-full-stack-modern-nextjs-app-router-supabase-standar-saas",
    excerpt: "Panduan komprehensif merancang arsitektur aplikasi web modern yang aman, scalable, dan hemat resource menggunakan Next.js dan Supabase PostgreSQL.",
    content: `Membangun produk digital berskala produksi membutuhkan arsitektur yang seimbang antara kecepatan iterasi dan stabilitas jangka panjang. Kombinasi Next.js App Router dan Supabase kini menjadi pondasi terfavorit bagi ribuan tim pengembang dan solo founder di seluruh dunia.

### Keunggulan Server Components (RSC)

Dengan React Server Components di Next.js:
- Data fetching berlangsung langsung di server dekat dengan database.
- Ukuran bundle JavaScript di browser klien terpangkas drastis.
- Keamanan token dan secret API tetap terisolasi di sisi server.

### Supabase sebagai Single Source of Truth

Supabase menyediakan PostgreSQL tingkat enterprise dengan fitur bawaan:
- **Row Level Security (RLS)** untuk otorisasi data granular.
- **Supabase Auth** dengan session JWT aman.
- **Storage Privat** untuk proteksi file build aplikasi premium.

Arsitektur ini pula yang diterapkan secara murni pada ekosistem **Nexarin Tech Hub** guna memastikan integritas lisensi dan pengiriman file pembaruan produk kepada customer berjalan tanpa celah keamanan.`,
    contentType: "explainer",
    category: {
      id: "technology",
      name: "Technology",
      slug: "technology",
      description: "Inovasi software engineering, cloud architecture, dev tools, dan ekosistem open-source.",
      icon: "Cpu",
      color: "from-blue-500 to-indigo-600"
    },
    tags: ["Next.js", "Supabase", "React", "Architecture", "SaaS"],
    featuredImage: "/assets/article-tech.svg",
    metaTitle: "Arsitektur Next.js & Supabase untuk SaaS Modern | Nexarin",
    metaDescription: "Kupas tuntas arsitektur Next.js App Router dan Supabase untuk membangun aplikasi web performan tinggi dan terjamin keamanannya.",
    status: "published",
    author: {
      name: "Abi Dzarin",
      role: "Full-Stack Engineer",
      avatar: "/assets/avatar-default.svg"
    },
    readingTimeMinutes: 8,
    views: 2890,
    publishedAt: "2026-08-22T14:15:00Z",
    createdAt: "2026-08-22T13:00:00Z",
    updatedAt: "2026-08-22T14:15:00Z",
    featured: false,
    breaking: false,
    relatedProductId: "prod-saas-starter",
  },
  {
    id: "art-3",
    sourceId: "src-auto-003",
    title: "Perkembangan Solid-State Battery: Titik Balik Jarak Tempuh dan Keamanan Kendaraan Listrik (EV)",
    slug: "perkembangan-solid-state-battery-titik-balik-ev",
    excerpt: "Teknologi baterai solid-state siap memasuki jalur produksi massal, menawarkan densitas energi dua kali lipat dan pengisian daya 80% dalam 10 menit.",
    content: `Kekhawatiran jarak tempuh (*range anxiety*) dan waktu pengisian daya yang lama pada kendaraan listrik (EV) kini mendekati garis akhir. Generasi terbaru baterai solid-state dengan elektrolit padat berhasil membuktikan keunggulan stabilitas termal ekstrem dan kapasitas energi superior.

### Mengapa Elektrolit Padat Mengubah Segalanya?

Pada baterai lithium-ion konvensional, elektrolit cair mudah terbakar saat terjadi kebocoran atau *thermal runaway*. Elektrolit padat menggantikan cairan tersebut dengan material keramik atau polimer padat yang:
- Tahan panas hingga suhu di atas 150?C.
- Memungkinkan penggunaan anoda logam lithium murni.
- Menghasilkan densitas energi mencapai 500 Wh/kg (naik 100% dari baterai standar).

### Implementasi Industri Otomotif

Pabrikan otomotif global menargetkan implementasi komersial bertahap mulai akhir 2026 hingga 2027. Dampaknya tidak hanya terasa pada mobil penumpang, melainkan juga elektrifikasi armada transportasi umum dan truk logistik antarkota.`,
    contentType: "news",
    category: {
      id: "automotive",
      name: "Automotive",
      slug: "automotive",
      description: "Teknologi otomotif masa depan, kendaraan listrik (EV), otonom, dan inovasi transportasi.",
      icon: "Car",
      color: "from-emerald-500 to-teal-600"
    },
    tags: ["EV", "Solid-State Battery", "Automotive", "Clean Tech"],
    featuredImage: "/assets/article-ev.svg",
    metaTitle: "Masa Depan Solid-State Battery Kendaraan Listrik | Nexarin",
    metaDescription: "Ulasan komprehensif teknologi baterai solid-state dan dampaknya bagi industri kendaraan listrik masa depan.",
    status: "published",
    author: {
      name: "Rins",
      role: "Lead Tech Architect",
      avatar: "/assets/avatar-default.svg"
    },
    readingTimeMinutes: 4,
    views: 1950,
    publishedAt: "2026-08-23T11:00:00Z",
    createdAt: "2026-08-23T10:00:00Z",
    updatedAt: "2026-08-23T11:00:00Z",
    featured: false,
    breaking: false,
  },
  {
    id: "art-4",
    sourceId: "src-gdt-004",
    title: "Review Laptop Workstation AI 2026: NPU 50+ TOPS dan Performa Menjalankan Model LLM Lokal",
    slug: "review-laptop-workstation-ai-2026-npu-50-tops-llm-lokal",
    excerpt: "Uji performa menjalankan LLM 7B-14B parameter secara offline pada laptop workstation generasi terbaru dengan akselerator Neural Processing Unit terdedikasi.",
    content: `Kebutuhan privasi data dan efisiensi latensi mendorong tren komputasi kecerdasan buatan langsung di perangkat lokal (*on-device AI*). Kami menguji laptop workstation berbekal NPU dengan kecepatan komputasi lebih dari 50 TOPS.

### Hasil Pengujian Benchmark Lokal

Dengan arsitektur NPU modern, model bahasa seperti Llama 3 8B dan Mistral NeMo dapat dijalankan pada kecepatan inferensi di atas 35 token per detik dengan konsumsi daya di bawah 25 Watt:

- **Inferensi Model 7B Q4**: 42 token/detik (Sangat responsif untuk coding assistant).
- **Audio Transcription Whisper Large V3**: 8x real-time speed.
- **Konsumsi Daya**: Hemat baterai hingga 4x lipat dibandingkan penggunaan GPU diskrit secara terus-menerus.

Bagi developer dan analis data, perangkat keras ini membuka era baru produktivitas tanpa ketergantungan pada konektivitas internet konstan.`,
    contentType: "review",
    category: {
      id: "gadget",
      name: "Gadget",
      slug: "gadget",
      description: "Review smartphone, laptop workstation, hardware periferal, dan perangkat pintar terbaru.",
      icon: "Smartphone",
      color: "from-purple-500 to-pink-600"
    },
    tags: ["Workstation", "NPU", "On-Device AI", "Hardware Review", "Laptop"],
    featuredImage: "/assets/article-gadget.svg",
    metaTitle: "Review Laptop Workstation AI 2026 | Nexarin Tech Hub",
    metaDescription: "Ulasan mendalam laptop workstation AI generasi 2026 untuk inferensi LLM offline dan produktivitas engineering.",
    status: "published",
    author: {
      name: "Abi Dzarin",
      role: "Full-Stack Engineer",
      avatar: "/assets/avatar-default.svg"
    },
    readingTimeMinutes: 6,
    views: 2110,
    publishedAt: "2026-08-24T08:00:00Z",
    createdAt: "2026-08-24T07:00:00Z",
    updatedAt: "2026-08-24T08:00:00Z",
    featured: false,
    breaking: false,
    affiliateId: "aff-1",
  },
  {
    id: "art-5",
    sourceId: "src-tut-005",
    title: "Tutorial: Mengintegrasikan Sistem Absensi Digital Geolocation & QR Code ke Sekolah Anda",
    slug: "tutorial-integrasi-sistem-absensi-digital-geolocation-qr-sekolah",
    excerpt: "Panduan praktis implementasi sistem absensi digital anti-titip absen dengan verifikasi radius GPS dan token QR code dinamis.",
    content: `Transformasi digital di lingkungan pendidikan membutuhkan sistem absensi yang tidak hanya praktis bagi siswa dan guru, namun juga akurat dan bebas manipulasi.

### Langkah-langkah Penerapan

1. **Setup Radius Geofencing**: Tentukan koordinat titik tengah gerbang sekolah dan batasi radius absensi (contoh: 50 meter).
2. **Generate Token QR Dinamis**: Sistem secara otomatis me-refresh QR code setiap 30 detik guna mencegah screenshot titip absen.
3. **Sinkronisasi Data Real-Time**: Laporan kehadiran terkirim otomatis ke dashboard wali kelas dan WhatsApp notifikasi orang tua.

Aplikasi resmi **Nexarin Sistem Absensi Sekolah Digital** telah menyediakan seluruh arsitektur ini secara siap pakai lengkap dengan lisensi seumur hidup.`,
    contentType: "tutorial",
    category: {
      id: "tutorials",
      name: "Tutorials",
      slug: "tutorials",
      description: "Panduan teknis langkah demi langkah, arsitektur software, dan praktik terbaik implementasi digital.",
      icon: "BookOpen",
      color: "from-amber-500 to-orange-600"
    },
    tags: ["Tutorial", "Sistem Absensi", "Digitalisasi Sekolah", "Geolocation", "QR Code"],
    featuredImage: "/assets/article-tutorial.svg",
    metaTitle: "Tutorial Integrasi Sistem Absensi Sekolah Digital | Nexarin",
    metaDescription: "Panduan langkah demi langkah implementasi absensi QR Code dan Geolocation untuk instansi pendidikan.",
    status: "published",
    author: {
      name: "Rins",
      role: "Lead Tech Architect",
      avatar: "/assets/avatar-default.svg"
    },
    readingTimeMinutes: 7,
    views: 4120,
    publishedAt: "2026-08-24T16:00:00Z",
    createdAt: "2026-08-24T15:00:00Z",
    updatedAt: "2026-08-24T16:00:00Z",
    featured: false,
    breaking: false,
    relatedProductId: "prod-absensi-sekolah",
  },
];
