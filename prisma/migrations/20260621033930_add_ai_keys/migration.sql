-- CreateEnum
CREATE TYPE "AiProvider" AS ENUM ('GEMINI', 'GROQ');

-- AlterTable
ALTER TABLE "scraped_news_articles" ADD COLUMN     "aiContent" TEXT,
ADD COLUMN     "aiError" TEXT,
ADD COLUMN     "aiProcessedAt" TIMESTAMP(3),
ADD COLUMN     "aiProvider" "AiProvider",
ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "aiTitle" TEXT;

-- CreateTable
CREATE TABLE "ai_api_accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_api_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_api_keys" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "provider" "AiProvider" NOT NULL,
    "keyCipher" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPreview" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "lastErrorAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_api_accounts_email_key" ON "ai_api_accounts"("email");

-- CreateIndex
CREATE INDEX "ai_api_accounts_createdAt_idx" ON "ai_api_accounts"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_api_keys_keyHash_key" ON "ai_api_keys"("keyHash");

-- CreateIndex
CREATE INDEX "ai_api_keys_accountId_idx" ON "ai_api_keys"("accountId");

-- CreateIndex
CREATE INDEX "ai_api_keys_provider_idx" ON "ai_api_keys"("provider");

-- CreateIndex
CREATE INDEX "ai_api_keys_createdAt_idx" ON "ai_api_keys"("createdAt");

-- CreateIndex
CREATE INDEX "scraped_news_articles_aiProcessedAt_idx" ON "scraped_news_articles"("aiProcessedAt");

-- AddForeignKey
ALTER TABLE "ai_api_keys" ADD CONSTRAINT "ai_api_keys_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ai_api_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
