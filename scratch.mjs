import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('./app/generated/prisma/index.js');

const prisma = new PrismaClient();

async function test() {
  const now = new Date();
  const articles = await prisma.newsArticle.findMany({
    include: {
      category: true
    }
  });
  console.log("ALL articles:", articles.map(a => ({ title: a.title, status: a.status, publishedAt: a.publishedAt, catIsActive: a.category?.isActive })));

  const filtered = await prisma.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: now } }
      ],
      category: {
        is: {
          isActive: true,
        },
      },
    },
    include: {
      category: true
    }
  });
  console.log("Filtered articles:", filtered.map(a => ({ title: a.title })));
}

test().catch(console.error).finally(() => prisma.$disconnect());
