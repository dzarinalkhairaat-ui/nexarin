import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.newsArticle.findMany({
    select: { title: true, coverImageUrl: true }
  });
  console.log(JSON.stringify(articles, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
