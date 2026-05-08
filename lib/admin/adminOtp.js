import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import { prisma } from "@/lib/prisma";

const DEFAULT_OTP_EXPIRES_MINUTES = 5;
const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_RESEND_COOLDOWN_SECONDS = 60;
const ADMIN_OTP_PURPOSE = "ADMIN_LOGIN";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeOtp(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 8);
}

function getNumberEnv(name, fallbackValue) {
  const value = Number(process.env[name]);

  if (!Number.isFinite(value) || value <= 0) {
    return fallbackValue;
  }

  return value;
}

function getAdminOtpSecret() {
  return normalizeText(process.env.ADMIN_OTP_SECRET);
}

export function getAdminOtpSettings() {
  return {
    expiresMinutes: getNumberEnv(
      "ADMIN_OTP_EXPIRES_MINUTES",
      DEFAULT_OTP_EXPIRES_MINUTES
    ),
    maxAttempts: getNumberEnv("ADMIN_OTP_MAX_ATTEMPTS", DEFAULT_MAX_ATTEMPTS),
    resendCooldownSeconds: getNumberEnv(
      "ADMIN_OTP_RESEND_COOLDOWN_SECONDS",
      DEFAULT_RESEND_COOLDOWN_SECONDS
    ),
  };
}

export function getAllowedAdminEmails() {
  return String(
    process.env.NEXARIN_ADMIN_EMAILS ||
      process.env.NEXARIN_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      ""
  )
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

export function isAllowedAdminEmail(email) {
  const safeEmail = normalizeEmail(email);
  const allowedEmails = getAllowedAdminEmails();

  if (!safeEmail || allowedEmails.length === 0) {
    return false;
  }

  return allowedEmails.includes(safeEmail);
}

function createSecureHash(value) {
  const secret = getAdminOtpSecret();

  if (!secret) {
    throw new Error("ADMIN_OTP_SECRET belum diatur.");
  }

  return createHmac("sha256", secret).update(String(value)).digest("hex");
}

function hashOtp(email, otp) {
  return createSecureHash(`admin-otp:${normalizeEmail(email)}:${otp}`);
}

function hashChallengeToken(challengeToken) {
  return createSecureHash(`admin-otp-token:${challengeToken}`);
}

function safeCompareHash(leftValue, rightValue) {
  const left = Buffer.from(String(leftValue || ""), "hex");
  const right = Buffer.from(String(rightValue || ""), "hex");

  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return false;
  }

  try {
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export function generateAdminOtpCode() {
  return String(randomInt(10_000_000, 100_000_000));
}

export function generateAdminOtpChallengeToken() {
  return randomBytes(32).toString("hex");
}

export async function cleanupExpiredAdminOtpChallenges() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    await prisma.adminOtpChallenge.deleteMany({
      where: {
        createdAt: {
          lt: oneDayAgo,
        },
      },
    });
  } catch (error) {
    console.error("Gagal cleanup OTP lama:", error);
  }
}

export async function createAdminOtpChallenge({
  email,
  userId = "",
  ipAddress = "",
  userAgent = "",
} = {}) {
  const safeEmail = normalizeEmail(email);

  if (!safeEmail) {
    return {
      ok: false,
      message: "Email admin tidak valid.",
    };
  }

  if (!isAllowedAdminEmail(safeEmail)) {
    return {
      ok: false,
      message: "Email ini tidak punya akses admin Nexarin.",
    };
  }

  const secret = getAdminOtpSecret();

  if (!secret) {
    return {
      ok: false,
      message: "ADMIN_OTP_SECRET belum diatur di environment.",
    };
  }

  const settings = getAdminOtpSettings();
  const now = new Date();
  const cooldownStart = new Date(
    now.getTime() - settings.resendCooldownSeconds * 1000
  );

  try {
    await cleanupExpiredAdminOtpChallenges();

    const recentChallenge = await prisma.adminOtpChallenge.findFirst({
      where: {
        email: safeEmail,
        purpose: ADMIN_OTP_PURPOSE,
        usedAt: null,
        lockedAt: null,
        lastSentAt: {
          gt: cooldownStart,
        },
      },
      orderBy: {
        lastSentAt: "desc",
      },
      select: {
        id: true,
        lastSentAt: true,
      },
    });

    if (recentChallenge?.lastSentAt) {
      const retryAfterSeconds = Math.max(
        1,
        settings.resendCooldownSeconds -
          Math.floor((now.getTime() - recentChallenge.lastSentAt.getTime()) / 1000)
      );

      return {
        ok: false,
        message: `Tunggu ${retryAfterSeconds} detik sebelum meminta OTP baru.`,
        retryAfterSeconds,
      };
    }

    await prisma.adminOtpChallenge.updateMany({
      where: {
        email: safeEmail,
        purpose: ADMIN_OTP_PURPOSE,
        usedAt: null,
        lockedAt: null,
      },
      data: {
        lockedAt: now,
      },
    });

    const otp = generateAdminOtpCode();
    const challengeToken = generateAdminOtpChallengeToken();
    const expiresAt = new Date(
      now.getTime() + settings.expiresMinutes * 60 * 1000
    );

    const challenge = await prisma.adminOtpChallenge.create({
      data: {
        email: safeEmail,
        userId: normalizeText(userId) || null,
        purpose: ADMIN_OTP_PURPOSE,
        otpHash: hashOtp(safeEmail, otp),
        challengeTokenHash: hashChallengeToken(challengeToken),
        expiresAt,
        attempts: 0,
        maxAttempts: settings.maxAttempts,
        resendCount: 0,
        lastSentAt: now,
        ipAddress: normalizeText(ipAddress) || null,
        userAgent: normalizeText(userAgent) || null,
      },
      select: {
        id: true,
        email: true,
        expiresAt: true,
        maxAttempts: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      message: "OTP admin berhasil dibuat.",
      otp,
      challengeToken,
      challenge,
      expiresMinutes: settings.expiresMinutes,
    };
  } catch (error) {
    console.error("Gagal membuat OTP admin:", error);

    return {
      ok: false,
      message: "OTP admin gagal dibuat. Cek database dan environment.",
    };
  }
}

export async function verifyAdminOtpChallenge({
  email,
  challengeToken,
  otp,
} = {}) {
  const safeEmail = normalizeEmail(email);
  const safeChallengeToken = normalizeText(challengeToken);
  const safeOtp = normalizeOtp(otp);

  if (!safeEmail || !safeChallengeToken || safeOtp.length !== 8) {
    return {
      ok: false,
      message: "Data OTP tidak valid.",
    };
  }

  if (!isAllowedAdminEmail(safeEmail)) {
    return {
      ok: false,
      message: "Email ini tidak punya akses admin Nexarin.",
    };
  }

  const secret = getAdminOtpSecret();

  if (!secret) {
    return {
      ok: false,
      message: "ADMIN_OTP_SECRET belum diatur di environment.",
    };
  }

  try {
    const challengeTokenHash = hashChallengeToken(safeChallengeToken);

    const challenge = await prisma.adminOtpChallenge.findUnique({
      where: {
        challengeTokenHash,
      },
    });

    if (!challenge || challenge.email !== safeEmail) {
      return {
        ok: false,
        message: "OTP tidak valid atau sudah tidak tersedia.",
      };
    }

    if (challenge.usedAt) {
      return {
        ok: false,
        message: "OTP ini sudah pernah digunakan. Login ulang dulu.",
      };
    }

    if (challenge.lockedAt) {
      return {
        ok: false,
        message: "OTP ini sudah dikunci. Login ulang dulu.",
      };
    }

    if (challenge.expiresAt.getTime() < Date.now()) {
      await prisma.adminOtpChallenge.update({
        where: {
          id: challenge.id,
        },
        data: {
          lockedAt: new Date(),
        },
      });

      return {
        ok: false,
        message: "OTP sudah expired. Login ulang untuk meminta OTP baru.",
      };
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      await prisma.adminOtpChallenge.update({
        where: {
          id: challenge.id,
        },
        data: {
          lockedAt: new Date(),
        },
      });

      return {
        ok: false,
        message: "Percobaan OTP sudah terlalu banyak. Login ulang dulu.",
      };
    }

    const inputOtpHash = hashOtp(safeEmail, safeOtp);
    const isOtpValid = safeCompareHash(inputOtpHash, challenge.otpHash);

    if (!isOtpValid) {
      const nextAttempts = challenge.attempts + 1;
      const shouldLock = nextAttempts >= challenge.maxAttempts;

      await prisma.adminOtpChallenge.update({
        where: {
          id: challenge.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
          ...(shouldLock
            ? {
                lockedAt: new Date(),
              }
            : {}),
        },
      });

      return {
        ok: false,
        message: shouldLock
          ? "OTP salah terlalu banyak. Login ulang dulu."
          : `OTP salah. Sisa percobaan: ${Math.max(
              0,
              challenge.maxAttempts - nextAttempts
            )}.`,
      };
    }

    const updatedChallenge = await prisma.adminOtpChallenge.update({
      where: {
        id: challenge.id,
      },
      data: {
        usedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        userId: true,
        usedAt: true,
      },
    });

    return {
      ok: true,
      message: "OTP berhasil diverifikasi.",
      challenge: updatedChallenge,
    };
  } catch (error) {
    console.error("Gagal verifikasi OTP admin:", error);

    return {
      ok: false,
      message: "OTP gagal diverifikasi. Coba lagi.",
    };
  }
}