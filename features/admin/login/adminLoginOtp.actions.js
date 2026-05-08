"use server";

import { createHmac } from "node:crypto";
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/lib/prisma";
import {
  createAdminOtpChallenge,
  isAllowedAdminEmail,
  verifyAdminOtpChallenge,
} from "@/lib/admin/adminOtp";
import { sendAdminOtpEmail } from "@/lib/email/sendAdminOtpEmail";

const ADMIN_SESSION_COOKIE = "nexarin_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 2;

const ADMIN_OTP_TOKEN_COOKIE = "nexarin_admin_otp_token";
const ADMIN_OTP_EMAIL_COOKIE = "nexarin_admin_otp_email";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeOtp(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 8);
}

function base64UrlEncode(value) {
  return Buffer.from(String(value), "utf8").toString("base64url");
}

function signValue(value, secret) {
  return createHmac("sha256", secret).update(String(value)).digest("base64url");
}

function getAdminSessionSecret() {
  return normalizeText(
    process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_OTP_SECRET
  );
}

function createSignedAdminSessionValue({ email, userId }) {
  const secret = getAdminSessionSecret();

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET atau ADMIN_OTP_SECRET belum diatur.");
  }

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    v: 1,
    email: normalizeEmail(email),
    userId: normalizeText(userId),
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
}

function getCookieSecureFlag() {
  return process.env.NODE_ENV === "production";
}

function getRequestIp(headerStore) {
  const forwardedFor = headerStore.get("x-forwarded-for") || "";
  const realIp = headerStore.get("x-real-ip") || "";

  return normalizeText(forwardedFor.split(",")[0] || realIp);
}

function getRequestUserAgent(headerStore) {
  return normalizeText(headerStore.get("user-agent"));
}

function getOtpCookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: getCookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: getCookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

function getClearCookieOptions() {
  return {
    httpOnly: true,
    secure: getCookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}

function clearAdminSessionCookie(cookieStore) {
  cookieStore.set(ADMIN_SESSION_COOKIE, "", getClearCookieOptions());
}

function clearPendingOtpCookies(cookieStore) {
  cookieStore.set(ADMIN_OTP_TOKEN_COOKIE, "", getClearCookieOptions());
  cookieStore.set(ADMIN_OTP_EMAIL_COOKIE, "", getClearCookieOptions());
}

function clearPendingAdminCookies(cookieStore) {
  clearAdminSessionCookie(cookieStore);
  clearPendingOtpCookies(cookieStore);
}

function setPendingOtpCookies({
  cookieStore,
  email,
  challengeToken,
  expiresMinutes,
}) {
  const maxAge = Math.max(60, Number(expiresMinutes || 5) * 60);

  cookieStore.set(
    ADMIN_OTP_TOKEN_COOKIE,
    challengeToken,
    getOtpCookieOptions(maxAge)
  );

  cookieStore.set(
    ADMIN_OTP_EMAIL_COOKIE,
    normalizeEmail(email),
    getOtpCookieOptions(maxAge)
  );
}

function setAdminSessionCookie(cookieStore, user) {
  const signedSessionValue = createSignedAdminSessionValue({
    email: user?.email,
    userId: user?.id,
  });

  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    signedSessionValue,
    getAdminSessionCookieOptions()
  );
}

async function createSupabaseServerClient(cookieStore) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false,
      message:
        "Konfigurasi Supabase belum lengkap. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      supabase: null,
    };
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Aman diabaikan kalau context tidak bisa set cookie.
        }
      },
    },
  });

  return {
    ok: true,
    message: "",
    supabase,
  };
}

async function getVerifiedSupabaseAdminUser(cookieStore) {
  const supabaseClientResult = await createSupabaseServerClient(cookieStore);

  if (!supabaseClientResult.ok) {
    return {
      ok: false,
      message: supabaseClientResult.message,
      user: null,
    };
  }

  const {
    data: { user },
    error,
  } = await supabaseClientResult.supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      message: "Session Supabase tidak ditemukan. Login ulang dulu.",
      user: null,
    };
  }

  const sessionEmail = normalizeEmail(user?.email);

  if (!isAllowedAdminEmail(sessionEmail)) {
    return {
      ok: false,
      message: "Akun ini tidak punya akses admin Nexarin.",
      user: null,
    };
  }

  return {
    ok: true,
    message: "",
    user: {
      ...user,
      email: sessionEmail,
    },
  };
}

async function lockChallengeById(challengeId) {
  const safeChallengeId = normalizeText(challengeId);

  if (!safeChallengeId) {
    return;
  }

  try {
    await prisma.adminOtpChallenge.update({
      where: {
        id: safeChallengeId,
      },
      data: {
        lockedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Gagal mengunci challenge OTP setelah email gagal:", error);
  }
}

export async function requestAdminLoginOtpAction(payload) {
  const email = normalizeEmail(payload?.email);
  const userId = normalizeText(payload?.userId);

  const cookieStore = await cookies();
  const headerStore = await headers();

  clearPendingAdminCookies(cookieStore);

  if (!email || !userId) {
    return {
      ok: false,
      message: "Data login admin tidak valid.",
    };
  }

  if (!isAllowedAdminEmail(email)) {
    return {
      ok: false,
      message: "Email ini tidak punya akses admin Nexarin.",
    };
  }

  try {
    const adminUserResult = await getVerifiedSupabaseAdminUser(cookieStore);

    if (!adminUserResult.ok) {
      return {
        ok: false,
        message: adminUserResult.message,
      };
    }

    const user = adminUserResult.user;
    const sessionEmail = normalizeEmail(user?.email);

    if (sessionEmail !== email || user.id !== userId) {
      return {
        ok: false,
        message: "Session admin tidak cocok. Login ulang dulu.",
      };
    }

    const otpChallenge = await createAdminOtpChallenge({
      email: sessionEmail,
      userId: user.id,
      ipAddress: getRequestIp(headerStore),
      userAgent: getRequestUserAgent(headerStore),
    });

    if (!otpChallenge.ok) {
      return otpChallenge;
    }

    const emailResult = await sendAdminOtpEmail({
      to: sessionEmail,
      otp: otpChallenge.otp,
      expiresMinutes: otpChallenge.expiresMinutes,
    });

    if (!emailResult.ok) {
      await lockChallengeById(otpChallenge?.challenge?.id);

      return {
        ok: false,
        message: emailResult.message,
      };
    }

    setPendingOtpCookies({
      cookieStore,
      email: sessionEmail,
      challengeToken: otpChallenge.challengeToken,
      expiresMinutes: otpChallenge.expiresMinutes,
    });

    return {
      ok: true,
      message: `Kode OTP sudah dikirim ke ${sessionEmail}.`,
      email: sessionEmail,
      expiresMinutes: otpChallenge.expiresMinutes,
    };
  } catch (error) {
    console.error("Gagal request OTP login admin:", error);

    return {
      ok: false,
      message: "OTP login admin gagal diproses. Coba lagi.",
    };
  }
}

export async function verifyAdminLoginOtpAction(payload) {
  const otp = normalizeOtp(payload?.otp);

  const cookieStore = await cookies();

  const challengeToken = normalizeText(
    cookieStore.get(ADMIN_OTP_TOKEN_COOKIE)?.value
  );
  const pendingEmail = normalizeEmail(
    cookieStore.get(ADMIN_OTP_EMAIL_COOKIE)?.value
  );

  clearAdminSessionCookie(cookieStore);

  if (!pendingEmail || !challengeToken) {
    clearPendingOtpCookies(cookieStore);

    return {
      ok: false,
      message: "Session OTP tidak ditemukan. Login ulang dulu.",
    };
  }

  if (otp.length !== 8) {
    return {
      ok: false,
      message: "Masukkan kode OTP 8 digit.",
    };
  }

  try {
    const adminUserResult = await getVerifiedSupabaseAdminUser(cookieStore);

    if (!adminUserResult.ok) {
      clearPendingOtpCookies(cookieStore);

      return {
        ok: false,
        message: adminUserResult.message,
      };
    }

    const adminUser = adminUserResult.user;
    const sessionEmail = normalizeEmail(adminUser?.email);

    if (sessionEmail !== pendingEmail) {
      clearPendingOtpCookies(cookieStore);

      return {
        ok: false,
        message: "Session email tidak cocok. Login ulang dulu.",
      };
    }

    const verifyResult = await verifyAdminOtpChallenge({
      email: pendingEmail,
      challengeToken,
      otp,
    });

    if (!verifyResult.ok) {
      return verifyResult;
    }

    setAdminSessionCookie(cookieStore, adminUser);
    clearPendingOtpCookies(cookieStore);

    return {
      ok: true,
      message: "OTP benar. Mengalihkan ke dashboard...",
      email: pendingEmail,
    };
  } catch (error) {
    console.error("Gagal verify OTP login admin:", error);

    return {
      ok: false,
      message:
        error?.message ||
        "OTP gagal diverifikasi. Coba lagi.",
    };
  }
}

export async function resendAdminLoginOtpAction() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const pendingEmail = normalizeEmail(
    cookieStore.get(ADMIN_OTP_EMAIL_COOKIE)?.value
  );

  clearAdminSessionCookie(cookieStore);

  if (!pendingEmail) {
    clearPendingOtpCookies(cookieStore);

    return {
      ok: false,
      message: "Session OTP tidak ditemukan. Login ulang dulu.",
    };
  }

  try {
    const adminUserResult = await getVerifiedSupabaseAdminUser(cookieStore);

    if (!adminUserResult.ok) {
      clearPendingOtpCookies(cookieStore);

      return {
        ok: false,
        message: adminUserResult.message,
      };
    }

    const user = adminUserResult.user;
    const sessionEmail = normalizeEmail(user?.email);

    if (sessionEmail !== pendingEmail) {
      clearPendingOtpCookies(cookieStore);

      return {
        ok: false,
        message: "Session email tidak cocok. Login ulang dulu.",
      };
    }

    const otpChallenge = await createAdminOtpChallenge({
      email: sessionEmail,
      userId: user.id,
      ipAddress: getRequestIp(headerStore),
      userAgent: getRequestUserAgent(headerStore),
    });

    if (!otpChallenge.ok) {
      return otpChallenge;
    }

    const emailResult = await sendAdminOtpEmail({
      to: sessionEmail,
      otp: otpChallenge.otp,
      expiresMinutes: otpChallenge.expiresMinutes,
    });

    if (!emailResult.ok) {
      await lockChallengeById(otpChallenge?.challenge?.id);

      return {
        ok: false,
        message: emailResult.message,
      };
    }

    setPendingOtpCookies({
      cookieStore,
      email: sessionEmail,
      challengeToken: otpChallenge.challengeToken,
      expiresMinutes: otpChallenge.expiresMinutes,
    });

    return {
      ok: true,
      message: `Kode OTP baru sudah dikirim ke ${sessionEmail}.`,
      email: sessionEmail,
      expiresMinutes: otpChallenge.expiresMinutes,
    };
  } catch (error) {
    console.error("Gagal resend OTP login admin:", error);

    return {
      ok: false,
      message: "OTP baru gagal dikirim. Coba lagi.",
    };
  }
}