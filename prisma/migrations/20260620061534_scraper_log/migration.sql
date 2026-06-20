-- CreateTable
CREATE TABLE "scraper_logs" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraper_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scraper_logs_createdAt_idx" ON "scraper_logs"("createdAt");
