-- CreateTable
CREATE TABLE "admin_otp_challenges" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "purpose" TEXT NOT NULL DEFAULT 'ADMIN_LOGIN',
    "otpHash" TEXT NOT NULL,
    "challengeTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "resendCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_otp_challenges_challengeTokenHash_key" ON "admin_otp_challenges"("challengeTokenHash");

-- CreateIndex
CREATE INDEX "admin_otp_challenges_email_idx" ON "admin_otp_challenges"("email");

-- CreateIndex
CREATE INDEX "admin_otp_challenges_email_usedAt_idx" ON "admin_otp_challenges"("email", "usedAt");

-- CreateIndex
CREATE INDEX "admin_otp_challenges_expiresAt_idx" ON "admin_otp_challenges"("expiresAt");

-- CreateIndex
CREATE INDEX "admin_otp_challenges_createdAt_idx" ON "admin_otp_challenges"("createdAt");
