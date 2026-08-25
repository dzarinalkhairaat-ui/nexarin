import { GeminiSparkDraft } from "@/types/content";

export const INITIAL_DRAFTS: GeminiSparkDraft[] = [
  {
    id: "draft-spark-01",
    sourceId: "src-techcrunch-881",
    sourceName: "TechCrunch AI Insider",
    sourceUrl: "https://techcrunch.com/2026/08/24/deep-reasoning-models-benchmark",
    scrapedAt: "2026-08-25T04:15:00Z",
    title: "Era Model Penalaran Mendalam: Benchmark Baru Menunjukkan Akurasi Kode Meningkat 40%",
    suggestedSlug: "era-model-penalaran-mendalam-benchmark-akurasi-kode-meningkat-40",
    summary: "Riset terbaru merilis benchmark model AI penalaran mendalam yang mampu memverifikasi sintaks dan logika komputasi sebelum menghasilkan output kode akhir.",
    draftContent: `Model penalaran berbasis chain-of-thought internal kini menunjukkan lompatan efisiensi signifikan. Berdasarkan pengujian standar HumanEval+, akurasi solusi kode tanpa bug mengalami kenaikan dari 54% menjadi 76%.

Para peneliti mencatat bahwa mekanisme *test-time compute* memungkinkan model untuk mengevaluasi beberapa jalur eksekusi sebelum menyajikan jawaban akhir ke pengguna. Hal ini secara drastis mengurangi fenomena halusinasi dalam penulisan logika backend dan queries database kompleks.

Transformasi ini diprediksi akan mempercepat adopsi AI coding agent di lingkungan enterprise yang memiliki standar keamanan kode ketat.`,
    opinionAnalysis: "Peningkatan pada fase penalaran (reasoning) membuktikan bahwa masa depan software engineering bukan tentang menghafal boilerplate sintaks, melainkan kemampuan merancang arsitektur sistem dan validasi edge case.",
    category: "AI",
    tags: ["AI Reasoning", "Coding Assistant", "LLM", "Benchmark"],
    suggestedSeoTitle: "Model Penalaran AI Generasi Baru Tingkatkan Akurasi Kode | Nexarin",
    suggestedMetaDescription: "Benchmark terbaru membuktikan model penalaran mendalam mampu memangkas bug kode hingga 40% secara mandiri.",
    recommendedAffiliateProduct: {
      name: "Mechanical Keyboard Keychron K2 V2 Wireless",
      reason: "Cocok untuk developer yang membutuhkan kenyamanan mengetik berjam-jam saat coding bersama AI assistant.",
      targetMarketplace: "Shopee"
    },
    recommendedNexarinProductSlug: "nexarin-nextjs-saas-starter-kit",
    status: "draft",
    syncDate: "2026-08-25T04:30:00Z"
  },
  {
    id: "draft-spark-02",
    sourceId: "src-theverge-902",
    sourceName: "The Verge Digital Trends",
    sourceUrl: "https://theverge.com/2026/08/23/next-gen-smart-glass-display",
    scrapedAt: "2026-08-24T18:20:00Z",
    title: "Kacamata Pintar dengan Micro-LED Transparan Mulai Menjadi Alternatif Layar Smartphone",
    suggestedSlug: "kacamata-pintar-micro-led-transparan-alternatif-layar-smartphone",
    summary: "Generasi baru kacamata pintar berbobot hanya 45 gram dengan tampilan micro-LED cerah siap mengubah cara interaksi notifikasi dan navigasi harian.",
    draftContent: `Integrasi panel display Micro-LED dengan transmisi optik tinggi memungkinkan tampilan antarmuka digital menyatu mulus dengan pandangan mata manusia di luar ruangan.

Dengan konsumsi daya di bawah 0.5 Watt dan daya tahan baterai hingga 14 jam penggunaan aktif, kacamata pintar ini menyajikan navigasi turn-by-turn dan ringkasan notifikasi tanpa perlu mengeluarkan smartphone dari saku.`,
    opinionAnalysis: "Evolusi hardware wearable kian mendekati titik kenyamanan alami. Kunci keberhasilan adopsi massal terletak pada bobot yang ringan dan privasi kamera yang transparan.",
    category: "Gadget",
    tags: ["Smart Glasses", "Micro-LED", "Wearables", "Gadget 2026"],
    suggestedSeoTitle: "Kacamata Pintar Micro-LED Transparan 2026 | Nexarin Gadget",
    suggestedMetaDescription: "Ulasan inovasi smart glasses berbobot 45 gram dengan display micro-LED yang jernih di bawah sinar matahari.",
    recommendedAffiliateProduct: {
      name: "TWS Earphone ANC Low-Latency",
      reason: "Aksesoris audio ideal pendamping smart wearable harian.",
      targetMarketplace: "Tokopedia"
    },
    status: "draft",
    syncDate: "2026-08-25T04:30:00Z"
  }
];
