-- CreateTable
CREATE TABLE "scraped_news_articles" (
    "id" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "sourcePublishedAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraped_news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scraped_news_articles_sourceUrl_key" ON "scraped_news_articles"("sourceUrl");

-- CreateIndex
CREATE INDEX "scraped_news_articles_scrapedAt_idx" ON "scraped_news_articles"("scrapedAt");
