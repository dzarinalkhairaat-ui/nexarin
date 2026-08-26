import { TutorialCategory, TutorialCourse } from "@/types/tutorial";

export const TUTORIAL_CATEGORIES: TutorialCategory[] = [
  {
    id: "ai",
    name: "AI & Artificial Intelligence",
    slug: "ai",
    description: "Pelajari tool AI praktis, prompt engineering, otomasi alur kerja, dan pengembangan agen AI otonom.",
    iconName: "Sparkles",
    color: "from-cyan-500 to-blue-600",
    subcategories: [
      { id: "gen-ai", name: "Generative AI", slug: "generative-ai", classCount: 6 },
      { id: "ai-tools", name: "AI Tools", slug: "ai-tools", classCount: 5 },
      { id: "ai-automation", name: "AI Automation", slug: "ai-automation", classCount: 4 },
      { id: "ai-productivity", name: "AI Productivity", slug: "ai-productivity", classCount: 3 },
      { id: "prompt-eng", name: "Prompt Engineering", slug: "prompt-engineering", classCount: 4 },
      { id: "ai-business", name: "AI for Business", slug: "ai-for-business", classCount: 3 },
      { id: "ai-creators", name: "AI for Creators", slug: "ai-for-creators", classCount: 2 },
      { id: "ai-dev", name: "AI Development", slug: "ai-development", classCount: 3 },
      { id: "ai-agents", name: "AI Agents", slug: "ai-agents", classCount: 4 },
      { id: "ml", name: "Machine Learning", slug: "machine-learning", classCount: 2 },
      { id: "cv", name: "Computer Vision", slug: "computer-vision", classCount: 2 },
      { id: "nlp", name: "Natural Language Processing", slug: "nlp", classCount: 2 },
      { id: "ai-research", name: "AI Research", slug: "ai-research", classCount: 1 },
      { id: "ai-workflow", name: "AI Workflow", slug: "ai-workflow", classCount: 3 },
      { id: "ai-ethics", name: "AI Ethics & Safety", slug: "ai-ethics-safety", classCount: 1 }
    ]
  },
  {
    id: "digital",
    name: "Digital",
    slug: "digital",
    description: "Transformasi produktivitas digital, creator economy, strategi bisnis online, dan ekosistem cloud.",
    iconName: "Globe",
    color: "from-emerald-500 to-teal-600",
    subcategories: [
      { id: "dig-prod", name: "Digital Productivity", slug: "digital-productivity", classCount: 4 },
      { id: "dig-biz", name: "Digital Business", slug: "digital-business", classCount: 3 },
      { id: "dig-mkt", name: "Digital Marketing", slug: "digital-marketing", classCount: 3 },
      { id: "content-cre", name: "Content Creation", slug: "content-creation", classCount: 4 },
      { id: "soc-med", name: "Social Media", slug: "social-media", classCount: 2 },
      { id: "creator-econ", name: "Creator Economy", slug: "creator-economy", classCount: 2 },
      { id: "online-biz", name: "Online Business", slug: "online-business", classCount: 3 },
      { id: "dig-tools", name: "Digital Tools", slug: "digital-tools", classCount: 3 },
      { id: "cloud-serv", name: "Cloud Services", slug: "cloud-services", classCount: 2 },
      { id: "internet", name: "Internet", slug: "internet", classCount: 1 },
      { id: "dig-cyber", name: "Cybersecurity", slug: "cybersecurity", classCount: 2 },
      { id: "privacy", name: "Privacy", slug: "privacy", classCount: 2 },
      { id: "dig-workflow", name: "Digital Workflow", slug: "digital-workflow", classCount: 2 }
    ]
  },
  {
    id: "software-dev",
    name: "Software & Development",
    slug: "software-development",
    description: "Panduan coding modern, Next.js 16, React 19, TypeScript, arsitektur backend, database, dan CI/CD.",
    iconName: "Code2",
    color: "from-blue-500 to-indigo-600",
    subcategories: [
      { id: "web-dev", name: "Web Development", slug: "web-development", classCount: 5 },
      { id: "frontend", name: "Frontend", slug: "frontend", classCount: 4 },
      { id: "backend", name: "Backend", slug: "backend", classCount: 4 },
      { id: "fullstack", name: "Full Stack", slug: "full-stack", classCount: 4 },
      { id: "javascript", name: "JavaScript", slug: "javascript", classCount: 3 },
      { id: "typescript", name: "TypeScript", slug: "typescript", classCount: 4 },
      { id: "react", name: "React", slug: "react", classCount: 4 },
      { id: "nextjs", name: "Next.js", slug: "nextjs", classCount: 5 },
      { id: "nodejs", name: "Node.js", slug: "nodejs", classCount: 3 },
      { id: "api", name: "API", slug: "api", classCount: 3 },
      { id: "database", name: "Database", slug: "database", classCount: 3 },
      { id: "git-github", name: "Git & GitHub", slug: "git-github", classCount: 2 },
      { id: "devops", name: "DevOps", slug: "devops", classCount: 3 },
      { id: "testing", name: "Testing", slug: "testing", classCount: 2 },
      { id: "software-arch", name: "Software Architecture", slug: "software-architecture", classCount: 3 },
      { id: "ui-dev", name: "UI Development", slug: "ui-development", classCount: 3 },
      { id: "dev-automation", name: "Automation", slug: "automation", classCount: 2 },
      { id: "nocode-lowcode", name: "No-Code / Low-Code", slug: "nocode-lowcode", classCount: 2 }
    ]
  },
  {
    id: "design-uiux",
    name: "Design & UI/UX",
    slug: "design-ui-ux",
    description: "Kuasai Figma, design token, tata letak responsif, micro-interaction, dan aksesibilitas standar industri.",
    iconName: "Palette",
    color: "from-pink-500 to-rose-600",
    subcategories: [
      { id: "ui-design", name: "UI Design", slug: "ui-design", classCount: 4 },
      { id: "ux-design", name: "UX Design", slug: "ux-design", classCount: 3 },
      { id: "web-design", name: "Web Design", slug: "web-design", classCount: 3 },
      { id: "design-systems", name: "Design Systems", slug: "design-systems", classCount: 4 },
      { id: "typography", name: "Typography", slug: "typography", classCount: 2 },
      { id: "color", name: "Color", slug: "color", classCount: 2 },
      { id: "layout", name: "Layout", slug: "layout", classCount: 2 },
      { id: "prototyping", name: "Prototyping", slug: "prototyping", classCount: 3 },
      { id: "figma", name: "Figma", slug: "figma", classCount: 4 },
      { id: "branding", name: "Branding", slug: "branding", classCount: 2 },
      { id: "motion-design", name: "Motion Design", slug: "motion-design", classCount: 2 },
      { id: "accessibility", name: "Accessibility", slug: "accessibility", classCount: 2 }
    ]
  },
  {
    id: "gadget-hardware",
    name: "Gadget & Hardware",
    slug: "gadget-hardware",
    description: "Panduan setup workstation, perakitan PC, periferal produktivitas, keyboard mekanikal, dan smart home.",
    iconName: "Smartphone",
    color: "from-amber-500 to-orange-600",
    subcategories: [
      { id: "smartphone", name: "Smartphone", slug: "smartphone", classCount: 3 },
      { id: "tablet", name: "Tablet", slug: "tablet", classCount: 2 },
      { id: "laptop", name: "Laptop", slug: "laptop", classCount: 3 },
      { id: "desktop-pc", name: "Desktop PC", slug: "desktop-pc", classCount: 3 },
      { id: "smartwatch", name: "Smartwatch", slug: "smartwatch", classCount: 2 },
      { id: "wearables", name: "Wearables", slug: "wearables", classCount: 2 },
      { id: "camera", name: "Camera", slug: "camera", classCount: 2 },
      { id: "audio", name: "Audio", slug: "audio", classCount: 2 },
      { id: "headphones", name: "Headphones", slug: "headphones", classCount: 2 },
      { id: "monitor", name: "Monitor", slug: "monitor", classCount: 2 },
      { id: "keyboard", name: "Keyboard", slug: "keyboard", classCount: 3 },
      { id: "mouse", name: "Mouse", slug: "mouse", classCount: 2 },
      { id: "accessories", name: "Accessories", slug: "accessories", classCount: 2 },
      { id: "home-tech", name: "Home Technology", slug: "home-technology", classCount: 2 },
      { id: "smart-home", name: "Smart Home", slug: "smart-home", classCount: 2 }
    ]
  },
  {
    id: "automotive",
    name: "Automotive",
    slug: "automotive",
    description: "Kupas tuntas teknologi kendaraan listrik (EV), sistem kemudi ADAS, perawatan mobil, dan modifikasi.",
    iconName: "Car",
    color: "from-red-500 to-rose-600",
    subcategories: [
      { id: "car", name: "Car", slug: "car", classCount: 4 },
      { id: "motorcycle", name: "Motorcycle", slug: "motorcycle", classCount: 3 },
      { id: "ev", name: "Electric Vehicle", slug: "electric-vehicle", classCount: 4 },
      { id: "hybrid", name: "Hybrid Vehicle", slug: "hybrid-vehicle", classCount: 2 },
      { id: "auto-tech", name: "Automotive Technology", slug: "automotive-technology", classCount: 3 },
      { id: "adas", name: "ADAS", slug: "adas", classCount: 2 },
      { id: "autonomous", name: "Autonomous Driving", slug: "autonomous-driving", classCount: 2 },
      { id: "infotainment", name: "Infotainment", slug: "infotainment", classCount: 2 },
      { id: "car-maint", name: "Car Maintenance", slug: "car-maintenance", classCount: 3 },
      { id: "moto-maint", name: "Motorcycle Maintenance", slug: "motorcycle-maintenance", classCount: 2 },
      { id: "auto-acc", name: "Automotive Accessories", slug: "automotive-accessories", classCount: 2 },
      { id: "car-audio", name: "Car Audio", slug: "car-audio", classCount: 2 },
      { id: "dashcam", name: "Dashcam", slug: "dashcam", classCount: 2 },
      { id: "battery", name: "Battery", slug: "battery", classCount: 2 },
      { id: "charging", name: "Charging", slug: "charging", classCount: 2 },
      { id: "tire", name: "Tire", slug: "tire", classCount: 2 },
      { id: "engine", name: "Engine", slug: "engine", classCount: 2 },
      { id: "performance", name: "Performance", slug: "performance", classCount: 2 },
      { id: "modification", name: "Modification", slug: "modification", classCount: 2 },
      { id: "detailing", name: "Detailing", slug: "detailing", classCount: 2 },
      { id: "auto-elec", name: "Automotive Electronics", slug: "automotive-electronics", classCount: 2 },
      { id: "auto-safety", name: "Automotive Safety", slug: "automotive-safety", classCount: 2 },
      { id: "driving-tech", name: "Driving Technology", slug: "driving-technology", classCount: 2 }
    ]
  },
  {
    id: "business-entrepreneurship",
    name: "Business & Entrepreneurship",
    slug: "business-entrepreneurship",
    description: "Panduan membangun produk SaaS, e-commerce, strategi penetapan harga, dan otomasi bisnis digital.",
    iconName: "Briefcase",
    color: "from-emerald-500 to-green-600",
    subcategories: [
      { id: "entrepreneurship", name: "Entrepreneurship", slug: "entrepreneurship", classCount: 3 },
      { id: "biz-strat", name: "Business Strategy", slug: "business-strategy", classCount: 3 },
      { id: "online-biz-sub", name: "Online Business", slug: "online-business", classCount: 3 },
      { id: "ecommerce", name: "E-Commerce", slug: "e-commerce", classCount: 3 },
      { id: "affiliate-mkt", name: "Affiliate Marketing", slug: "affiliate-marketing", classCount: 2 },
      { id: "dig-prod-sub", name: "Digital Products", slug: "digital-products", classCount: 3 },
      { id: "saas", name: "SaaS", slug: "saas", classCount: 3 },
      { id: "freelancing", name: "Freelancing", slug: "freelancing", classCount: 2 },
      { id: "personal-branding", name: "Personal Branding", slug: "personal-branding", classCount: 2 },
      { id: "sales", name: "Sales", slug: "sales", classCount: 2 },
      { id: "marketing", name: "Marketing", slug: "marketing", classCount: 2 },
      { id: "biz-prod", name: "Productivity", slug: "productivity", classCount: 2 },
      { id: "biz-auto", name: "Business Automation", slug: "business-automation", classCount: 2 }
    ]
  },
  {
    id: "creator-content",
    name: "Creator & Content",
    slug: "creator-content",
    description: "Workflow produksi konten YouTube, video editing, storytelling visual, podcasting, dan audience building.",
    iconName: "Video",
    color: "from-purple-500 to-pink-600",
    subcategories: [
      { id: "youtube", name: "YouTube", slug: "youtube", classCount: 3 },
      { id: "tiktok", name: "TikTok", slug: "tiktok", classCount: 2 },
      { id: "instagram", name: "Instagram", slug: "instagram", classCount: 2 },
      { id: "video-edit", name: "Video Editing", slug: "video-editing", classCount: 3 },
      { id: "photo-edit", name: "Photo Editing", slug: "photo-editing", classCount: 2 },
      { id: "graphic-design", name: "Graphic Design", slug: "graphic-design", classCount: 2 },
      { id: "content-strat", name: "Content Strategy", slug: "content-strategy", classCount: 2 },
      { id: "copywriting", name: "Copywriting", slug: "copywriting", classCount: 2 },
      { id: "script-writing", name: "Script Writing", slug: "script-writing", classCount: 2 },
      { id: "podcast", name: "Podcast", slug: "podcast", classCount: 2 },
      { id: "streaming", name: "Streaming", slug: "streaming", classCount: 2 }
    ]
  },
  {
    id: "productivity",
    name: "Productivity",
    slug: "productivity",
    description: "Sistem manajemen waktu, Second Brain, knowledge management, dan otomasi alur kerja harian.",
    iconName: "Zap",
    color: "from-yellow-500 to-amber-600",
    subcategories: [
      { id: "pers-prod", name: "Personal Productivity", slug: "personal-productivity", classCount: 3 },
      { id: "time-mgmt", name: "Time Management", slug: "time-management", classCount: 2 },
      { id: "note-taking", name: "Note Taking", slug: "note-taking", classCount: 3 },
      { id: "knowledge-mgmt", name: "Knowledge Management", slug: "knowledge-management", classCount: 2 },
      { id: "proj-mgmt", name: "Project Management", slug: "project-management", classCount: 2 },
      { id: "prod-auto", name: "Automation", slug: "automation", classCount: 2 },
      { id: "prod-workflow", name: "Workflow", slug: "workflow", classCount: 2 },
      { id: "dig-org", name: "Digital Organization", slug: "digital-organization", classCount: 2 },
      { id: "prod-apps", name: "Productivity Apps", slug: "productivity-apps", classCount: 2 }
    ]
  },
  {
    id: "cybersecurity-privacy",
    name: "Cybersecurity & Privacy",
    slug: "cybersecurity-privacy",
    description: "Keamanan akun, manajemen password terenkripsi, audit celah web, dan proteksi privasi online.",
    iconName: "Shield",
    color: "from-emerald-500 to-cyan-600",
    subcategories: [
      { id: "acc-sec", name: "Account Security", slug: "account-security", classCount: 2 },
      { id: "pass-sec", name: "Password Security", slug: "password-security", classCount: 2 },
      { id: "sec-priv", name: "Privacy", slug: "privacy", classCount: 2 },
      { id: "data-prot", name: "Data Protection", slug: "data-protection", classCount: 2 },
      { id: "net-sec", name: "Network Security", slug: "network-security", classCount: 2 },
      { id: "web-sec", name: "Web Security", slug: "web-security", classCount: 2 },
      { id: "dev-sec", name: "Device Security", slug: "device-security", classCount: 2 },
      { id: "phishing", name: "Phishing Awareness", slug: "phishing-awareness", classCount: 2 },
      { id: "online-safe", name: "Online Safety", slug: "online-safety", classCount: 2 }
    ]
  },
  {
    id: "cloud-infrastructure",
    name: "Cloud & Infrastructure",
    slug: "cloud-infrastructure",
    description: "Deploy aplikasi ke VPS, Docker containerization, CDN caching, database scaling, dan monitoring server.",
    iconName: "Cloud",
    color: "from-blue-500 to-cyan-600",
    subcategories: [
      { id: "cloud-comp", name: "Cloud Computing", slug: "cloud-computing", classCount: 2 },
      { id: "server", name: "Server", slug: "server", classCount: 2 },
      { id: "hosting", name: "Hosting", slug: "hosting", classCount: 2 },
      { id: "deployment", name: "Deployment", slug: "deployment", classCount: 2 },
      { id: "cdn", name: "CDN", slug: "cdn", classCount: 2 },
      { id: "storage", name: "Storage", slug: "storage", classCount: 2 },
      { id: "db-infra", name: "Database Infrastructure", slug: "database-infrastructure", classCount: 2 },
      { id: "cloud-devops", name: "DevOps", slug: "devops", classCount: 2 },
      { id: "monitoring", name: "Monitoring", slug: "monitoring", classCount: 2 },
      { id: "networking", name: "Networking", slug: "networking", classCount: 2 }
    ]
  },
  {
    id: "operating-system",
    name: "Operating System",
    slug: "operating-system",
    description: "Tips efisiensi dan kustomisasi lingkungan komputasi Windows 11, macOS Sequoia, Linux Ubuntu, dan Android.",
    iconName: "Terminal",
    color: "from-indigo-500 to-purple-600",
    subcategories: [
      { id: "windows", name: "Windows", slug: "windows", classCount: 2 },
      { id: "macos", name: "macOS", slug: "macos", classCount: 2 },
      { id: "linux", name: "Linux", slug: "linux", classCount: 3 },
      { id: "android", name: "Android", slug: "android", classCount: 2 },
      { id: "ios", name: "iOS", slug: "ios", classCount: 2 },
      { id: "chromeos", name: "ChromeOS", slug: "chromeos", classCount: 1 }
    ]
  }
];

export const TUTORIAL_COURSES: TutorialCourse[] = [
  {
    id: "course-ai-auto-01",
    title: "AI Automation & Autonomous Agents Masterclass 2026",
    slug: "ai-automation-autonomous-agents-masterclass",
    tagline: "Bangun sistem otomasi alur kerja dan agen AI otonom dari nol hingga produksi.",
    description: "Pelajari cara mengintegrasikan Large Language Model (LLM) seperti Claude 3.7 dan GPT-4o dengan sistem database, webhook, dan tool otomatisasi untuk mengeksekusi tugas rekayasa perangkat lunak secara independen.",
    categoryId: "ai",
    categoryName: "AI & Artificial Intelligence",
    subcategoryId: "ai-automation",
    subcategoryName: "AI Automation",
    level: "Beginner",
    duration: "2h 45m",
    lessonCount: 6,
    rating: 4.9,
    reviewCount: 312,
    enrolledCount: 1840,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1600&auto=format&fit=crop",
    instructor: {
      name: "Rins",
      role: "Lead AI Engineer & Nexarin Creator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      bio: "Praktisi arsitektur AI dan full-stack engineer dengan fokus otomasi workflow enterprise."
    },
    whatYouWillLearn: [
      "Prinsip dasar arsitektur Multi-Agent vs Prompting Tunggal",
      "Cara menghubungkan API LLM dengan webhook dan Supabase DB",
      "Membangun Planner Agent dan Executor Agent yang handal",
      "Penanganan error runtime dan verifikasi hasil tanpa halusinasi",
      "Deploy bot otomatisasi ke cloud server 24/7"
    ],
    requirements: [
      "Pemahaman dasar JavaScript atau TypeScript",
      "Koneksi internet dan akun Supabase gratis",
      "Editor kode (VS Code / Antigravity)"
    ],
    contentType: "course",
    isFeatured: true,
    isPopular: true,
    isBeginnerFriendly: true,
    tags: ["AI", "Automation", "Agents", "TypeScript", "LLM"],
    publishedAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-25T12:00:00Z",
    seoTitle: "AI Automation & Autonomous Agents Masterclass — Nexari Tutorials",
    seoDescription: "Pelajari cara membangun agen AI otomatis dan workflow cerdas 2026.",
    modules: [
      {
        id: "mod-01",
        courseId: "course-ai-auto-01",
        title: "Modul 01: Pengantar & Fondasi Autonomous Agents",
        description: "Memahami pergeseran paradigma dari chatbot interaktif ke agen otonom yang dapat mengambil tindakan nyata.",
        order: 1,
        lessons: [
          {
            id: "les-01-01",
            courseId: "course-ai-auto-01",
            moduleId: "mod-01",
            title: "Pengenalan Arsitektur Agen AI & Tool Use",
            slug: "pengenalan-arsitektur-agen-ai-tool-use",
            duration: "18 min",
            order: 1,
            contentType: "course",
            isPreviewAvailable: true,
            keyTakeaways: [
              "Perbedaan mendasar antara prompt biasa dan loop eksekusi otonom",
              "Komponen inti: Memory, Planning, Tools, dan Feedback Loop",
              "Mengapa arsitektur hybrid reasoning menjadi standar baru"
            ],
            exercises: [
              "Identifikasi 3 proses manual di pekerjaan Anda yang dapat diotomasi agen AI",
              "Petakan input, tools, dan output yang dibutuhkan untuk salah satu proses tersebut"
            ],
            contentMarkdown: `# Pengenalan Arsitektur Agen AI & Tool Use

Selamat datang di kelas **AI Automation & Autonomous Agents Masterclass**! Di era komputasi modern 2026, AI bukan lagi sekadar asisten tanya-jawab pasif, melainkan **entitas komputasi aktif (Autonomous Agent)** yang mampu merencanakan, memanggil tool, dan menyelesaikan workflow multi-tahap secara mandiri.

---

## 1. Apa Itu Autonomous Agent?

Sebuah agen AI adalah sistem software yang memanfaatkan *Large Language Model (LLM)* sebagai otak penalar (*reasoning engine*) untuk:
1. **Perceive (Memahami)**: Menerima input dari pengguna, webhook, atau log sistem.
2. **Plan (Merencanakan)**: Memecah target besar menjadi langkah-langkah mikro yang dapat dieksekusi.
3. **Act (Bertindak)**: Memanggil API (*Tool Calling*), query database, atau menjalankan script.
4. **Evaluate (Evaluasi)**: Memeriksa apakah output sudah sesuai dengan kriteria yang diminta sebelum melaporkan hasil akhir.

\`\`\`mermaid
graph LR
    A[User Request] --> B[Planner Agent]
    B --> C[Tool Execution]
    C --> D[Result Verification]
    D -->|Success| E[Final Output]
    D -->|Retry / Fix| B
\`\`\`

---

## 2. Arsitektur Tool Calling

Ketika model membutuhkan data real-time, model tidak akan mengarang jawaban (*halusinasi*), melainkan mengeluarkan spesifikasi pemanggilan fungsi dalam format JSON:

\`\`\`json
{
  "tool": "query_database",
  "parameters": {
    "table": "orders",
    "filter": { "status": "pending" }
  }
}
\`\`\`

Sistem aplikasi kita akan mengeksekusi fungsi database tersebut dan mengembalikan data asli ke model untuk diolah lebih lanjut.

---

## 3. Langkah Selanjutnya

Di pelajaran berikutnya, kita akan mendesain sistem **State Management & Memory** agar agen dapat mengingat konteks interaksi multi-step tanpa kehilangan arah.`
          },
          {
            id: "les-01-02",
            courseId: "course-ai-auto-01",
            moduleId: "mod-01",
            title: "Desain Sistem Memory & Context Window",
            slug: "desain-sistem-memory-context-window",
            duration: "24 min",
            order: 2,
            contentType: "course",
            isPreviewAvailable: true,
            keyTakeaways: [
              "Strategi short-term vs long-term memory pada agen AI",
              "Pemanfaatan Vector Database dan Supabase pgvector",
              "Mengurangi konsumsi token dengan ringkasan progres dinamis"
            ],
            exercises: [
              "Buat skema ringkasan state JSON untuk melacak task yang sedang berjalan"
            ],
            contentMarkdown: `# Desain Sistem Memory & Context Window

Memory adalah fondasi yang memungkinkan agen AI menjalankan tugas yang memakan waktu lama (*long-running workflows*) tanpa melupakan instruksi awal atau mengalami *context overflow*.

---

## 1. Jenis-Jenis Memory pada Agen

- **Short-term Memory**: Riwayat pesan dalam sesi aktif (*messages array*).
- **Working Memory**: Variabel state sementara (seperti item yang sedang diproses dalam loop).
- **Long-term Memory**: Penyimpanan persisten (database PostgreSQL / vector store) untuk pengetahuan permanen.

\`\`\`typescript
interface AgentState {
  currentStep: number;
  totalSteps: number;
  completedTasks: string[];
  pendingTasks: string[];
  intermediateResults: Record<string, any>;
}
\`\`\`

---

## 2. Praktik Terbaik Manajemen Token

Selalu lakukan *summarization* secara berkala ketika riwayat percakapan mendekati 80% dari batas token budget Anda agar agen tetap fokus pada tujuan utama.`
          },
          {
            id: "les-01-03",
            courseId: "course-ai-auto-01",
            moduleId: "mod-01",
            title: "Menyiapkan Environment & Supabase Database",
            slug: "menyiapkan-environment-supabase-database",
            duration: "20 min",
            order: 3,
            contentType: "course",
            isPreviewAvailable: false,
            keyTakeaways: [
              "Setup project Supabase dan API keys",
              "Membuat tabel agent_runs dan audit_logs",
              "Mengonfigurasi environment variable secara aman"
            ],
            exercises: [
              "Jalankan migrasi tabel logging ke project Supabase Anda"
            ],
            contentMarkdown: `# Menyiapkan Environment & Supabase Database

Dalam pelajaran ini kita akan menyiapkan fondasi backend menggunakan **Supabase PostgreSQL** sebagai penyimpanan state dan log aktivitas agen.

---

## 1. Skema Tabel Audit Log

\`\`\`sql
CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  steps_completed INT DEFAULT 0,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

Dengan tabel ini, setiap tindakan yang diambil oleh agen akan tercatat secara transparan.`
          }
        ]
      },
      {
        id: "mod-02",
        courseId: "course-ai-auto-01",
        title: "Modul 02: Membangun Multi-Agent Workflow",
        description: "Mengimplementasikan kolaborasi antar agen: Planner, Coder, dan Reviewer.",
        order: 2,
        lessons: [
          {
            id: "les-02-01",
            courseId: "course-ai-auto-01",
            moduleId: "mod-02",
            title: "Membangun Planner Agent & Task Decomposition",
            slug: "membangun-planner-agent-task-decomposition",
            duration: "30 min",
            order: 4,
            contentType: "course",
            isPreviewAvailable: false,
            keyTakeaways: [
              "Teknik prompt dekomposisi masalah rumit",
              "Validasi schema JSON output menggunakan Zod",
              "Menghindari loop tak terbatas pada planner"
            ],
            exercises: [
              "Implementasikan endpoint Planner yang mengembalikan list task JSON terstruktur"
            ],
            contentMarkdown: `# Membangun Planner Agent & Task Decomposition

Planner Agent bertugas menerima query umum pengguna dan mengonversinya menjadi rencana aksi yang terstruktur secara matematis.`
          },
          {
            id: "les-02-02",
            courseId: "course-ai-auto-01",
            moduleId: "mod-02",
            title: "Menghubungkan Executor Agent dengan Webhook",
            slug: "menghubungkan-executor-agent-dengan-webhook",
            duration: "35 min",
            order: 5,
            contentType: "course",
            isPreviewAvailable: false,
            keyTakeaways: [
              "Eksekusi perintah HTTP dan manipulasi file",
              "Error handling otomatis dan self-healing retry logic",
              "Rate limiting dan concurrency control"
            ],
            exercises: [
              "Uji coba pemanggilan tool webhook dengan parameter dinamis"
            ],
            contentMarkdown: `# Menghubungkan Executor Agent dengan Webhook

Pelajari cara membuat executor yang tangguh dan mampu memulihkan diri secara mandiri ketika menemui error koneksi jaringan.`
          },
          {
            id: "les-02-03",
            courseId: "course-ai-auto-01",
            moduleId: "mod-02",
            title: "Reviewer Agent & Production Deployment",
            slug: "reviewer-agent-production-deployment",
            duration: "28 min",
            order: 6,
            contentType: "course",
            isPreviewAvailable: false,
            keyTakeaways: [
              "Audit kualitas hasil kerja sebelum commit final",
              "Deployment 24/7 menggunakan PM2 / Docker",
              "Monitoring metriks keberhasilan task di dashboard"
            ],
            exercises: [
              "Deploy bot agen Anda ke cloud VPS dan pantau log aktivitasnya"
            ],
            contentMarkdown: `# Reviewer Agent & Production Deployment

Langkah terakhir adalah menerapkan Reviewer Agent yang memastikan seluruh hasil eksekusi 100% akurat sebelum dikirimkan ke pengguna.`
          }
        ]
      }
    ]
  },
  {
    id: "course-nextjs-fullstack-02",
    title: "Next.js 16 & React 19 Fullstack Architecture Masterclass",
    slug: "nextjs-16-react-19-fullstack-architecture",
    tagline: "Kuasai Server Actions v2, React Compiler, dan arsitektur database Supabase modern.",
    description: "Panduan komprehensif membangun platform web kelas produksi dengan performa maksimal, Dark Mode elegan, keamanan autentikasi zero-trust, dan optimasi SEO dinamis.",
    categoryId: "software-dev",
    categoryName: "Software & Development",
    subcategoryId: "fullstack",
    subcategoryName: "Full Stack",
    level: "Intermediate",
    duration: "3h 20m",
    lessonCount: 8,
    rating: 5.0,
    reviewCount: 420,
    enrolledCount: 2450,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop",
    instructor: {
      name: "Dzarin Alkhairaat",
      role: "Lead Software Architect",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      bio: "Senior engineer spesialis ekosistem React, Next.js App Router, dan scalable web applications."
    },
    whatYouWillLearn: [
      "Arsitektur App Router Next.js 16 mendalam",
      "Cara kerja React 19 Compiler tanpa useMemo & useCallback",
      "Server Actions v2 dengan optimis UI & form validation",
      "Integrasi Supabase Auth & Row Level Security (RLS)",
      "Caching granular, ISR, dan Streaming SSR"
    ],
    requirements: [
      "Pemahaman menengah JavaScript/TypeScript",
      "Familiaritas dengan dasar-dasar React dan HTML/CSS"
    ],
    contentType: "course",
    isFeatured: true,
    isPopular: true,
    isBeginnerFriendly: false,
    tags: ["Next.js", "React 19", "TypeScript", "TailwindCSS", "Supabase"],
    publishedAt: "2026-08-15T08:00:00Z",
    updatedAt: "2026-08-24T15:00:00Z",
    seoTitle: "Next.js 16 & React 19 Fullstack Architecture Masterclass — Nexari",
    seoDescription: "Pelajari arsitektur web modern Next.js 16 dan React 19.",
    modules: [
      {
        id: "mod-next-01",
        courseId: "course-nextjs-fullstack-02",
        title: "Modul 01: Next.js 16 Core & React Compiler",
        description: "Menghilangkan overhead optimasi manual dan memanfaatkan kapabilitas compile-time React 19.",
        order: 1,
        lessons: [
          {
            id: "les-next-01",
            courseId: "course-nextjs-fullstack-02",
            moduleId: "mod-next-01",
            title: "Pengenalan React Compiler di Next.js 16",
            slug: "pengenalan-react-compiler-nextjs-16",
            duration: "22 min",
            order: 1,
            contentType: "course",
            isPreviewAvailable: true,
            keyTakeaways: [
              "Prinsip auto-memoization tingkat ekspresi AST",
              "Mengapa useMemo dan useCallback tidak lagi diperlukan",
              "Benchmark peningkatan FPS dan render timing"
            ],
            exercises: [
              "Refactor komponen berat dengan menghapus useMemo dan verifikasi performa"
            ],
            contentMarkdown: `# Pengenalan React Compiler di Next.js 16

React 19 Compiler merevolusi cara kita menulis kode frontend dengan melakukan optimasi memoization otomatis saat build-time.`
          },
          {
            id: "les-next-02",
            courseId: "course-nextjs-fullstack-02",
            moduleId: "mod-next-01",
            title: "Server Components vs Client Boundaries",
            slug: "server-components-vs-client-boundaries",
            duration: "25 min",
            order: 2,
            contentType: "course",
            isPreviewAvailable: true,
            keyTakeaways: [
              "Strategi memisahkan server logic dan client interactivity",
              "Mengurangi bundle size JavaScript hingga 60%",
              "Streaming data dengan Suspense boundaries"
            ],
            exercises: [
              "Ubah halaman statis menjadi streaming server component"
            ],
            contentMarkdown: `# Server Components vs Client Boundaries

Pelajari cara memetakan batasan server dan client secara arsitektural untuk performa web terbaik.`
          }
        ]
      }
    ]
  },
  {
    id: "course-ev-tech-03",
    title: "Panduan Lengkap Teknologi & Perawatan Mobil Listrik (EV) 2026",
    slug: "panduan-lengkap-teknologi-perawatan-mobil-listrik-ev",
    tagline: "Kupas tuntas battery health management, ekosistem charging, dan teknologi ADAS.",
    description: "Pelajari cara kerja sistem powertrain mobil listrik, tips memperpanjang usia baterai lithium ferro phosphate (LFP) vs NMC, protokol charging cepat (DC Fast Charging), dan fitur keselamatan aktif.",
    categoryId: "automotive",
    categoryName: "Automotive",
    subcategoryId: "ev",
    subcategoryName: "Electric Vehicle",
    level: "Beginner",
    duration: "2h 15m",
    lessonCount: 5,
    rating: 4.8,
    reviewCount: 188,
    enrolledCount: 1120,
    thumbnail: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1600&auto=format&fit=crop",
    instructor: {
      name: "Tim Redaksi Otomotif Nexarin",
      role: "EV Technical Specialist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      bio: "Spesialis teknologi otomotif dan pengujian kendaraan listrik."
    },
    whatYouWillLearn: [
      "Arsitektur baterai LFP vs NMC dan manajemen termal",
      "Strategi charging 20-80% untuk memperpanjang usia baterai",
      "Cara kerja regenerative braking dan single-pedal driving",
      "Perawatan rutin fluida pendingin dan ban khusus EV"
    ],
    requirements: [
      "Ketertarikan pada teknologi kendaraan ramah lingkungan",
      "Tidak memerlukan pengetahuan mekanik mendalam"
    ],
    contentType: "guide",
    isFeatured: false,
    isPopular: true,
    isBeginnerFriendly: true,
    tags: ["Automotive", "Electric Vehicle", "Battery", "Charging", "Maintenance"],
    publishedAt: "2026-08-18T11:00:00Z",
    updatedAt: "2026-08-22T09:00:00Z",
    seoTitle: "Panduan Lengkap Teknologi & Perawatan Mobil Listrik (EV) — Nexari",
    seoDescription: "Pelajari cara kerja dan perawatan mobil listrik modern.",
    modules: [
      {
        id: "mod-ev-01",
        courseId: "course-ev-tech-03",
        title: "Modul 01: Fondasi Baterai & Powertrain EV",
        description: "Memahami komponen utama penggerak mobil listrik.",
        order: 1,
        lessons: [
          {
            id: "les-ev-01",
            courseId: "course-ev-tech-03",
            moduleId: "mod-ev-01",
            title: "Mengenal Jenis Baterai: LFP vs NMC",
            slug: "mengenal-jenis-baterai-lfp-vs-nmc",
            duration: "20 min",
            order: 1,
            contentType: "guide",
            isPreviewAvailable: true,
            keyTakeaways: [
              "Karakteristik kimia baterai LFP (tahan panas, aman, siklus panjang)",
              "Karakteristik NMC (densitas energi tinggi, performa akselerasi)",
              "Kapan waktu yang tepat mengisi daya hingga 100%"
            ],
            exercises: [
              "Cek tipe baterai kendaraan Anda dan buat jadwal pengisian optimal"
            ],
            contentMarkdown: `# Mengenal Jenis Baterai: LFP vs NMC

Baterai adalah jantung dari setiap kendaraan listrik modern.`
          }
        ]
      }
    ]
  },
  {
    id: "course-design-systems-04",
    title: "Design Systems & Figma to Code Workflow untuk Developer",
    slug: "design-systems-figma-to-code-workflow",
    tagline: "Jembatani desain Figma dan implementasi CSS/Tailwind dengan token yang konsisten.",
    description: "Kuasai cara membangun sistem desain terstruktur: typography scale, semantic color palette, auto-layout komponen, dan export otomatis ke Tailwind CSS tokens.",
    categoryId: "design-uiux",
    categoryName: "Design & UI/UX",
    subcategoryId: "design-systems",
    subcategoryName: "Design Systems",
    level: "Intermediate",
    duration: "2h 50m",
    lessonCount: 6,
    rating: 4.9,
    reviewCount: 245,
    enrolledCount: 1680,
    thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?q=80&w=1600&auto=format&fit=crop",
    instructor: {
      name: "Rins",
      role: "Lead Designer & UI Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      bio: "Desainer sistem antarmuka Nexari Tech Hub."
    },
    whatYouWillLearn: [
      "Membangun semantic design tokens di Figma",
      "Struktur komponen modular (Button, Modal, Input, Card)",
      "Sinkronisasi otomatis Figma Variables ke Tailwind config",
      "Prinsip kontras WCAG AAA dan dark mode tailoring"
    ],
    requirements: [
      "Aplikasi Figma gratis",
      "Pengetahuan dasar HTML & Tailwind CSS"
    ],
    contentType: "workshop",
    isFeatured: true,
    isPopular: false,
    isBeginnerFriendly: false,
    tags: ["Design System", "Figma", "UI/UX", "TailwindCSS", "Tokens"],
    publishedAt: "2026-08-10T14:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
    seoTitle: "Design Systems & Figma to Code Workflow — Nexari Tutorials",
    seoDescription: "Pelajari cara membangun sistem desain profesional dari Figma ke kode.",
    modules: [
      {
        id: "mod-ds-01",
        courseId: "course-design-systems-04",
        title: "Modul 01: Token Arsitektur & Palet Warna",
        description: "Menetapkan hierarki token warna dan font global.",
        order: 1,
        lessons: [
          {
            id: "les-ds-01",
            courseId: "course-design-systems-04",
            moduleId: "mod-ds-01",
            title: "Desain Semantic Tokens: Dark Theme Palette",
            slug: "desain-semantic-tokens-dark-theme-palette",
            duration: "25 min",
            order: 1,
            contentType: "workshop",
            isPreviewAvailable: true,
            keyTakeaways: [
              "Hierarki token: Global -> Semantic -> Component",
              "Dark Cyan accent color contrast ratios",
              "Dark neutral background layering"
            ],
            exercises: [
              "Buat set variable warna dark mode di project Figma Anda"
            ],
            contentMarkdown: `# Desain Semantic Tokens: Dark Theme Palette

Sistem desain yang baik berakar dari definisi token yang konsisten dan bermakna secara semantik.`
          }
        ]
      }
    ]
  },
  {
    id: "course-cybersec-zero-trust-05",
    title: "Cybersecurity Zero-Trust & Perlindungan Identitas Digital",
    slug: "cybersecurity-zero-trust-perlindungan-identitas-digital",
    tagline: "Lindungi data pribadi, akun developer, dan server dari serangan siber modern.",
    description: "Pelajari konsep Zero-Trust Architecture, autentikasi berbasis Passkey FIDO2, enkripsi end-to-end, proteksi data sensitif, dan pencegahan teknik social engineering.",
    categoryId: "cybersecurity-privacy",
    categoryName: "Cybersecurity & Privacy",
    subcategoryId: "privacy",
    subcategoryName: "Privacy",
    level: "Advanced",
    duration: "2h 10m",
    lessonCount: 5,
    rating: 4.9,
    reviewCount: 160,
    enrolledCount: 940,
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
    instructor: {
      name: "Security Redaksi Nexarin",
      role: "Information Security Consultant",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      bio: "Praktisi keamanan informasi dan audit sistem."
    },
    whatYouWillLearn: [
      "Prinsip 'Never Trust, Always Verify' di era cloud",
      "Setup Passkeys FIDO2 dan Hardware Security Keys (YubiKey)",
      "Audit celah keamanan pada aplikasi web dan server Linux",
      "Enkripsi komunikasi data dan proteksi metadata"
    ],
    requirements: [
      "Pemahaman dasar jaringan internet dan sistem operasi"
    ],
    contentType: "course",
    isFeatured: false,
    isPopular: false,
    isBeginnerFriendly: false,
    tags: ["Cybersecurity", "Zero-Trust", "Privacy", "Passkeys", "Linux"],
    publishedAt: "2026-08-05T09:00:00Z",
    updatedAt: "2026-08-19T14:00:00Z",
    seoTitle: "Cybersecurity Zero-Trust & Perlindungan Identitas Digital — Nexari",
    seoDescription: "Pelajari arsitektur zero-trust dan keamanan identitas digital.",
    modules: [
      {
        id: "mod-sec-01",
        courseId: "course-cybersec-zero-trust-05",
        title: "Modul 01: Fondasi Zero-Trust Security",
        description: "Mengapa perimeter keamanan lama sudah tidak relevan.",
        order: 1,
        lessons: [
          {
            id: "les-sec-01",
            courseId: "course-cybersec-zero-trust-05",
            moduleId: "mod-sec-01",
            title: "Prinsip Utama Zero-Trust Architecture",
            slug: "prinsip-utama-zero-trust-architecture",
            duration: "24 min",
            order: 1,
            contentType: "course",
            isPreviewAvailable: true,
            keyTakeaways: [
              "3 pilar: Verify explicitly, Least privilege access, Assume breach",
              "Perlindungan endpoint dan token session",
              "Mitigasi man-in-the-middle attacks"
            ],
            exercises: [
              "Lakukan audit 2FA pada seluruh akun email dan GitHub Anda"
            ],
            contentMarkdown: `# Prinsip Utama Zero-Trust Architecture

Dalam arsitektur Zero-Trust, kita tidak pernah mempercayai koneksi apapun secara default, baik dari dalam maupun luar jaringan.`
          }
        ]
      }
    ]
  },
  {
    id: "course-prompt-reasoning-06",
    title: "Prompt Engineering & Extended Reasoning untuk Software Engineer",
    slug: "prompt-engineering-extended-reasoning-software-engineer",
    tagline: "Tingkatkan akurasi coding AI hingga 95% dengan structured reasoning prompts.",
    description: "Pelajari teknik Chain-of-Thought, Tree-of-Thoughts, dynamic thinking budget control pada Claude 3.7 & GPT-4o, dan otomatisasi pembuatan automated test suites.",
    categoryId: "ai",
    categoryName: "AI & Artificial Intelligence",
    subcategoryId: "prompt-eng",
    subcategoryName: "Prompt Engineering",
    level: "Beginner",
    duration: "1h 45m",
    lessonCount: 4,
    rating: 4.9,
    reviewCount: 380,
    enrolledCount: 2100,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    instructor: {
      name: "Rins",
      role: "Lead AI Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      bio: "Creator Nexari Tech Hub."
    },
    whatYouWillLearn: [
      "Teknik Chain-of-Thought prompting untuk algoritma kompleks",
      "Dynamic thinking budget control parameter",
      "Prompt audit keamanan kode dan refactoring otomatis",
      "Menghasilkan dokumentasi OpenAPI & TypeScript types otomatis"
    ],
    requirements: [
      "Akses ke LLM web interface atau API"
    ],
    contentType: "tutorial",
    isFeatured: true,
    isPopular: true,
    isBeginnerFriendly: true,
    tags: ["Prompt Engineering", "AI", "Claude 3.7", "Coding", "Reasoning"],
    publishedAt: "2026-08-12T16:00:00Z",
    updatedAt: "2026-08-25T11:00:00Z",
    seoTitle: "Prompt Engineering & Extended Reasoning — Nexari Tutorials",
    seoDescription: "Kuasai teknik prompt reasoning terstruktur untuk developer.",
    modules: [
      {
        id: "mod-pe-01",
        courseId: "course-prompt-reasoning-06",
        title: "Modul 01: Prinsip Penalaran Berstruktur",
        description: "Mengoptimalkan output logika model LLM generasi terbaru.",
        order: 1,
        lessons: [
          {
            id: "les-pe-01",
            courseId: "course-prompt-reasoning-06",
            moduleId: "mod-pe-01",
            title: "Teknik Chain-of-Thought & Reasoning Traces",
            slug: "teknik-chain-of-thought-reasoning-traces",
            duration: "20 min",
            order: 1,
            contentType: "tutorial",
            isPreviewAvailable: true,
            keyTakeaways: [
              "Mengapa instruksi 'Think step-by-step' memangkas error logika",
              "Memberikan contoh few-shot yang representatif",
              "Evaluasi hasil reasoning sebelum eksekusi"
            ],
            exercises: [
              "Buat prompt Chain-of-Thought untuk merancang skema database e-commerce"
            ],
            contentMarkdown: `# Teknik Chain-of-Thought & Reasoning Traces

Pelajari cara memaksimalkan penalaran mendalam model AI dengan struktur prompt yang sistematis.`
          }
        ]
      }
    ]
  }
];
