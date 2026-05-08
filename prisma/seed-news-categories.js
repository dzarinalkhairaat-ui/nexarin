require("dotenv").config();

const crypto = require("crypto");
const { Pool } = require("pg");

const newsCategories = [
  {
    name: "Teknologi",
    slug: "teknologi",
    description: "Berita dan insight seputar teknologi terbaru.",
  },
  {
    name: "Digital",
    slug: "digital",
    description: "Update dunia digital, internet, platform, dan transformasi digital.",
  },
  {
    name: "Produk",
    slug: "produk",
    description: "Informasi produk, fitur, layanan, dan pengembangan Nexarin.",
  },
  {
    name: "Update",
    slug: "update",
    description: "Kabar terbaru, pengumuman, dan pembaruan penting.",
  },
  {
    name: "Insight",
    slug: "insight",
    description: "Analisis, opini, dan pandangan seputar industri digital.",
  },
];

function createId() {
  return `news_category_${crypto.randomUUID()}`;
}

async function seedNewsCategories() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum tersedia di environment.");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const category of newsCategories) {
      await client.query(
        `
          INSERT INTO news_categories (
            id,
            name,
            slug,
            description,
            "isActive",
            "createdAt",
            "updatedAt"
          )
          VALUES ($1, $2, $3, $4, true, NOW(), NOW())
          ON CONFLICT (slug)
          DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            "isActive" = true,
            "updatedAt" = NOW();
        `,
        [createId(), category.name, category.slug, category.description],
      );
    }

    await client.query("COMMIT");

    console.log("Seed kategori News berhasil:");
    newsCategories.forEach((category) => {
      console.log(`- ${category.name} (${category.slug})`);
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seed kategori News gagal:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedNewsCategories();