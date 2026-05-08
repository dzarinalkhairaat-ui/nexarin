-- CreateEnum
CREATE TYPE "NewsArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NewsImageProvider" AS ENUM ('SUPABASE', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "NewsSourceType" AS ENUM ('ARTICLE_WEBSITE', 'YOUTUBE', 'SOCIAL_MEDIA', 'DOCUMENT_RELEASE', 'OTHER');

-- CreateTable
CREATE TABLE "news_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "status" "NewsArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "isHeadline" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "coverImageUrl" TEXT,
    "coverImagePath" TEXT,
    "coverImageProvider" "NewsImageProvider",
    "coverImageAlt" TEXT,
    "sourceType" "NewsSourceType",
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "sourceNote" TEXT,
    "videoSourceName" TEXT,
    "videoSourceUrl" TEXT,
    "categoryId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_categories_slug_key" ON "news_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_slug_key" ON "news_articles"("slug");

-- CreateIndex
CREATE INDEX "news_articles_categoryId_idx" ON "news_articles"("categoryId");

-- CreateIndex
CREATE INDEX "news_articles_status_idx" ON "news_articles"("status");

-- CreateIndex
CREATE INDEX "news_articles_isHeadline_idx" ON "news_articles"("isHeadline");

-- CreateIndex
CREATE INDEX "news_articles_isFeatured_idx" ON "news_articles"("isFeatured");

-- CreateIndex
CREATE INDEX "news_articles_createdAt_idx" ON "news_articles"("createdAt");

-- AddForeignKey
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "news_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
