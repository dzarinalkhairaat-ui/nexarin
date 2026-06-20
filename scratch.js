const { PrismaClient } = require('./app/generated/prisma/index.js');

const prisma = new PrismaClient();

async function test() {
  const now = new Date();
  const articles = await prisma.newsArticle.findMany({
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
  console.log("Found articles with filter:", articles.length);
  console.log(articles.map(a => ({ title: a.title, status: a.status, catIsActive: a.category?.isActive })));

  const all = await prisma.newsArticle.findMany({ include: { category: true } });
  console.log("Found ALL articles:", all.length);
  console.log(all.map(a => ({ title: a.title, status: a.status, catIsActive: a.category?.isActive })));
}

test().catch(console.error).finally(() => prisma.$disconnect());
