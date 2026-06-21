const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanHtml() {
  const articles = await prisma.newsArticle.findMany();
  for (const article of articles) {
    if (article.content && (article.content.includes('<p>') || article.content.includes('<strong>') || article.content.includes('<ul>') || article.content.includes('<li>'))) {
      const cleanContent = article.content
        .replace(/<[^>]*>?/gm, '') // Remove all HTML tags
        .replace(/&nbsp;/g, ' ')
        .trim();
      
      await prisma.newsArticle.update({
        where: { id: article.id },
        data: { content: cleanContent }
      });
      console.log(`Cleaned HTML for: ${article.title}`);
    }
  }

  const scraped = await prisma.scrapedNewsArticle.findMany();
  for (const article of scraped) {
    let updated = false;
    let dataToUpdate = {};
    if (article.aiContent && (article.aiContent.includes('<p>') || article.aiContent.includes('<strong>'))) {
      dataToUpdate.aiContent = article.aiContent.replace(/<[^>]*>?/gm, '').trim();
      updated = true;
    }
    if (article.content && (article.content.includes('<p>') || article.content.includes('<strong>'))) {
      dataToUpdate.content = article.content.replace(/<[^>]*>?/gm, '').trim();
      updated = true;
    }
    if (updated) {
      await prisma.scrapedNewsArticle.update({
        where: { id: article.id },
        data: dataToUpdate
      });
      console.log(`Cleaned HTML for Scraped: ${article.title}`);
    }
  }
}

cleanHtml()
  .then(() => {
    console.log("HTML cleanup complete!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
